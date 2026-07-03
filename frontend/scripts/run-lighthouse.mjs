import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

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

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    let output = "";
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"], shell: false, ...options });
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      output += chunk.toString();
    });
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
    try {
      await run(process.execPath, [
        lighthouseCli,
        `${baseUrl}${route}`,
        "--quiet",
        "--output=json",
        `--output-path=${outputPath}`,
        "--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage",
        "--only-categories=performance,accessibility,best-practices,seo",
      ], { cwd: root, env: { ...process.env, TMP: tmpDir, TEMP: tmpDir, TMPDIR: tmpDir } });
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
