import fs from "node:fs/promises";
import { readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const resultsDir = path.join(root, "test-results", "lighthouse");
const tmpDir = path.join(resultsDir, "tmp");
const port = Number(process.env.REVIEW_PORT || 4173);
const baseUrl = process.env.REVIEW_BASE_URL || `http://127.0.0.1:${port}`;
const routes = ["/", "/proof-snapshot", "/dashboard", "/proof", "/proof/PP-10231"];
const thresholds = {
  performance: Number(process.env.LIGHTHOUSE_MIN_PERFORMANCE || 0.5),
  accessibility: Number(process.env.LIGHTHOUSE_MIN_ACCESSIBILITY || 0.9),
  "best-practices": Number(process.env.LIGHTHOUSE_MIN_BEST_PRACTICES || 0.8),
  seo: Number(process.env.LIGHTHOUSE_MIN_SEO || 0.8),
};

function routeName(route) {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Find a usable Chrome/Chromium binary (fully synchronous).
 * Priority:
 *   1. LIGHTHOUSE_CHROME_PATH env var (explicit CI override)
 *   2. Playwright chromium cache (~/.cache/ms-playwright/chromium-*/chrome-linux/chrome)
 *   3. System binaries via `which`
 */
function findChrome() {
  // 1. Explicit env-var override
  if (process.env.LIGHTHOUSE_CHROME_PATH) {
    console.log(`Chrome: using LIGHTHOUSE_CHROME_PATH=${process.env.LIGHTHOUSE_CHROME_PATH}`);
    return process.env.LIGHTHOUSE_CHROME_PATH;
  }

  // 2. Playwright chromium cache
  const home = process.env.HOME || "/root";
  const playwrightCacheDirs = [
    path.join(home, ".cache", "ms-playwright"),
    "/root/.cache/ms-playwright",
    "/home/runner/.cache/ms-playwright",
  ];

  for (const cacheDir of playwrightCacheDirs) {
    if (!existsSync(cacheDir)) continue;
    try {
      const entries = readdirSync(cacheDir);
      // prefer the full chromium over the headless-shell — headless-shell lacks DevTools support
      const chromiumEntry = entries.find(
        (e) => e.startsWith("chromium-") && !e.includes("headless_shell")
      );
      if (chromiumEntry) {
        const chromeBin = path.join(cacheDir, chromiumEntry, "chrome-linux", "chrome");
        if (existsSync(chromeBin)) {
          console.log(`Chrome: Playwright chromium found at ${chromeBin}`);
          return chromeBin;
        }
      }
    } catch {
      continue;
    }
  }

  // 3. System binaries
  const systemBinaries = [
    "google-chrome-stable",
    "google-chrome",
    "chromium-browser",
    "chromium",
  ];
  for (const bin of systemBinaries) {
    try {
      const result = execFileSync("which", [bin], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (result) {
        console.log(`Chrome: system binary at ${result}`);
        return result;
      }
    } catch {
      continue;
    }
  }

  console.warn("Chrome: no binary found — Lighthouse will try its own discovery");
  return null;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    let output = "";
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
      ...options,
    });
    child.stdout.on("data", (chunk) => { output += chunk.toString(); });
    child.stderr.on("data", (chunk) => { output += chunk.toString(); });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else {
        const error = new Error(`${command} exited with ${code}`);
        error.output = output;
        reject(error);
      }
    });
    child.on("error", reject);
  });
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch { /* keep polling */ }
    await wait(500);
  }
  throw new Error(`Review server did not respond at ${baseUrl}`);
}

await fs.mkdir(resultsDir, { recursive: true });
await fs.mkdir(tmpDir, { recursive: true });

const chromePath = findChrome();
const chromeFlags = "--headless=new --no-sandbox --disable-dev-shm-usage --disable-gpu";

const server = spawn(
  process.execPath,
  [path.join(root, "scripts", "serve-build.mjs")],
  {
    cwd: root,
    env: { ...process.env, REVIEW_PORT: String(port) },
    stdio: "inherit",
  }
);

try {
  await waitForServer();

  const lighthouseCli = path.join(root, "node_modules", "lighthouse", "cli", "index.js");
  const summary = [];

  for (const route of routes) {
    const name = routeName(route);
    const outputPath = path.join(resultsDir, `${name}.json`);

    const lighthouseArgs = [
      lighthouseCli,
      `${baseUrl}${route}`,
      "--quiet",
      "--output=json",
      `--output-path=${outputPath}`,
      `--chrome-flags=${chromeFlags}`,
      "--only-categories=performance,accessibility,best-practices,seo",
    ];
    if (chromePath) {
      lighthouseArgs.push(`--chrome-path=${chromePath}`);
    }

    try {
      await run(process.execPath, lighthouseArgs, {
        cwd: root,
        env: { ...process.env, TMP: tmpDir, TEMP: tmpDir, TMPDIR: tmpDir },
      });
    } catch (error) {
      try {
        await fs.access(outputPath);
        console.warn(
          `Lighthouse exited non-zero after writing ${name}.json — continuing with the saved report.`
        );
      } catch {
        if (error.output) console.error(error.output);
        throw error;
      }
    }

    const reportJson = JSON.parse(await fs.readFile(outputPath, "utf8"));
    const scores = Object.fromEntries(
      Object.entries(reportJson.categories).map(([key, cat]) => [key, cat.score])
    );
    summary.push({ route, scores });
    console.log(
      `${route}: perf=${scores.performance} a11y=${scores.accessibility}` +
      ` bp=${scores["best-practices"]} seo=${scores.seo}`
    );
  }

  await fs.writeFile(
    path.join(resultsDir, "summary.json"),
    JSON.stringify(summary, null, 2)
  );

  const failures = summary.flatMap(({ route, scores }) =>
    Object.entries(thresholds)
      .filter(([key, threshold]) => scores[key] < threshold)
      .map(([key, threshold]) => `${route} ${key}: ${scores[key]} < ${threshold}`)
  );

  if (failures.length > 0) {
    console.error("Lighthouse threshold failures:");
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }

  console.log(`Lighthouse review complete. Results in ${resultsDir}`);
} finally {
  server.kill();
}
