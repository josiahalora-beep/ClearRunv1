import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const buildDir = path.join(root, "build");
const port = Number(process.env.PORT || process.env.REVIEW_PORT || 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

if (!fs.existsSync(path.join(buildDir, "index.html"))) {
  console.error("Missing frontend/build/index.html. Run npm run build before serve:review.");
  process.exit(1);
}

function safeFilePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const requested = path.join(buildDir, normalized);
  return requested.startsWith(buildDir) ? requested : path.join(buildDir, "index.html");
}

const server = http.createServer((req, res) => {
  const requestedPath = safeFilePath(req.url || "/");
  const filePath = fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()
    ? requestedPath
    : path.join(buildDir, "index.html");
  const ext = path.extname(filePath);

  res.setHeader("Content-Type", contentTypes[ext] || "application/octet-stream");
  res.setHeader("Cache-Control", "no-store");
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`ClearRun review server listening at http://127.0.0.1:${port}`);
});
