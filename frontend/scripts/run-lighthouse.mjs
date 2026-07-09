import fs from "node:fs/promises";
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
 * Find a usable Chrome/Chromium binary.
 * Priority:
 *   1. LIGHTHOUSE_CHROME_PATH env var (set by CI when system Chrome is installed)
 *   2. Playwright's own chromium download (works in any env where Playwright ran)
 *   3. Common Linux system paths
 */
function findChrome() {
  // 1. Explicit override
  if (process.env.LIGHTHOUSE_CHROME_PATH) {
    return process.env.LIGHTHOUSE_CHROME_PATH;
  }

  // 2. Playwright's chromium — installed by `npx playwright install chromium`
  //    The path is exposed via playwright's own API.
  try {
    const { execSync } = await import("node:child_process");
  } catch {
    // handled below
  }
  try {
    // Works in Playwright >= 1.18
    const { chromium } = await import("@playwright/test");
    const channel = chromium.executablePath();
    if (channel) return channel;
  } catch {
    // Not available in this context — fall through
  }

  // 3. Try common system paths
  const candidates = [
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/snap/bin/chromium",
  ];
  for (const c of candidates) {
    try {
      fs.access(c); // sync-ish; we check via try/catch
      return c;
    } catch {
      // keep trying
    }
  }

  return null; // will let Lighthouse try its own bundled finder
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    let output = "";
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"], shell: false, ...options });
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
  for (let i = 0; i < 60; i += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Keep waiting until the local static server is ready.
    }
    await wait(500);
  }
  throw new Error(`Review server did not respond at ${baseUrl}`);
}

await fs.mkdir(resultsDir, { recursive: true });
await fs.mkdir(tmpDir, { recursive: true });

// Resolve Chrome path before starting the server
const chromePath = findChrome();
const chromeFlags = [
  "--headless=new",
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
];
if (chromePath) {
  console.log(`Using Chrome at: ${chromePath}`);
}

const server = spawn(process.execPath, [path.join(root, "scripts", "serve-build.mjs")], {
  cwd: root,
  env: { ...process.env, REVIEW_PORT: String(port) },
  stdio: "inherit",
});

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
      `--chrome-flags=${chromeFlags.join(" ")}`,
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
        console.warn(`Lighthouse exited non-zero after writing ${name}.json. Continuing with the generated report.`);
      } catch {
        if (error.output) console.error(error.output);
        throw error;
      }
    }

    const json = JSON.parse(await fs.readFile(outputPath, "utf8"));
    const scores = Object.fromEntries(
      Object.entries(json.categories).map(([key, category]) => [key, category.score])
    );
    summary.push({ route, scores });
    console.log(`${route}: perf=${scores.performance} a11y=${scores.accessibility} bp=${scores["best-practices"]} seo=${scores.seo}`);
  }

  await fs.writeFile(path.join(resultsDir, "summary.json"), JSON.stringify(summary, null, 2));

  const failures = summary.flatMap(({ route, scores }) =>
    Object.entries(thresholds)
      .filter(([key, threshold]) => scores[key] < threshold)
      .map(([key, threshold]) => `${route} ${key}: ${scores[key]} < ${threshold}`)
  );

  if (failures.length > 0) {
    console.error("Lighthouse score thresholds failed:");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log(`Lighthouse review complete. Results written to ${resultsDir}`);
} finally {
  server.kill();
}
