import fs from "node:fs/promises";
import { readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, execFileSync } from "node:child_process";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const root       = path.resolve(__dirname, "..");
const resultsDir = path.join(root, "test-results", "lighthouse");
const port       = Number(process.env.REVIEW_PORT || 4173);
const baseUrl    = process.env.REVIEW_BASE_URL || `http://127.0.0.1:${port}`;

const routes = ["/", "/proof-snapshot", "/dashboard", "/proof", "/proof/PP-10231"];

const thresholds = {
  performance:      Number(process.env.LIGHTHOUSE_MIN_PERFORMANCE    || 0.5),
  accessibility:    Number(process.env.LIGHTHOUSE_MIN_ACCESSIBILITY  || 0.9),
  "best-practices": Number(process.env.LIGHTHOUSE_MIN_BEST_PRACTICES || 0.8),
  seo:              Number(process.env.LIGHTHOUSE_MIN_SEO            || 0.8),
};

// ── helpers ──────────────────────────────────────────────────────────────────

function routeName(r) {
  return r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "-");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Locate Chrome synchronously. No block-comment wildcards; no await.
function findChrome() {
  if (process.env.LIGHTHOUSE_CHROME_PATH) {
    console.log("Chrome: using LIGHTHOUSE_CHROME_PATH");
    return process.env.LIGHTHOUSE_CHROME_PATH;
  }

  const home      = process.env.HOME || "/root";
  const cacheDirs = [
    path.join(home, ".cache", "ms-playwright"),
    "/root/.cache/ms-playwright",
    "/home/runner/.cache/ms-playwright",
  ];

  for (const dir of cacheDirs) {
    if (!existsSync(dir)) continue;
    try {
      const entry = readdirSync(dir).find(
        (e) => e.startsWith("chromium-") && !e.includes("headless_shell")
      );
      if (entry) {
        const bin = path.join(dir, entry, "chrome-linux", "chrome");
        if (existsSync(bin)) { console.log(`Chrome: Playwright at ${bin}`); return bin; }
      }
    } catch { /* keep scanning */ }
  }

  for (const name of ["google-chrome-stable", "google-chrome", "chromium-browser", "chromium"]) {
    try {
      const found = execFileSync("which", [name], {
        encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (found) { console.log(`Chrome: system binary at ${found}`); return found; }
    } catch { /* keep scanning */ }
  }

  console.warn("Chrome: no binary found");
  return null;
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(baseUrl)).ok) return; } catch { /* keep polling */ }
    await wait(500);
  }
  throw new Error(`Server did not respond at ${baseUrl}`);
}

// ── main ─────────────────────────────────────────────────────────────────────

await fs.mkdir(resultsDir, { recursive: true });

// lighthouse 13 is pure ESM — import() yields { default: fn }
// chrome-launcher is CJS but import() works fine for it too
const { default: lighthouse }  = await import("lighthouse");
const { launch }               = await import("chrome-launcher");

const chromePath = findChrome();

const server = spawn(
  process.execPath,
  [path.join(root, "scripts", "serve-build.mjs")],
  { cwd: root, env: { ...process.env, REVIEW_PORT: String(port) }, stdio: "inherit" }
);

try {
  await waitForServer();

  const summary = [];

  for (const route of routes) {
    const name       = routeName(route);
    const outputPath = path.join(resultsDir, `${name}.json`);
    const url        = `${baseUrl}${route}`;

    // chrome-launcher launches Chrome then hands us the DevTools port
    const chrome = await launch({
      ...(chromePath ? { chromePath } : {}),
      chromeFlags: [
        "--headless=new",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    let lhr;
    try {
      const runnerResult = await lighthouse(url, {
        port:           chrome.port,
        output:         "json",
        logLevel:       "error",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      });
      await fs.writeFile(outputPath, runnerResult.report);
      lhr = runnerResult.lhr;
    } finally {
      await chrome.kill();
    }

    const scores = Object.fromEntries(
      Object.entries(lhr.categories).map(([k, v]) => [k, v.score])
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
      .filter(([k, t]) => scores[k] < t)
      .map(([k, t]) => `${route} ${k}: ${scores[k]} < ${t}`)
  );

  if (failures.length) {
    console.error("Lighthouse threshold failures:");
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }

  console.log(`Lighthouse review complete. Results in ${resultsDir}`);
} finally {
  server.kill();
}
