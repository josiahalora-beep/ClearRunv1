import fs from "node:fs";
import path from "node:path";

const resultsDir = path.resolve("test-results");
const axeDir = path.join(resultsDir, "axe");
const lighthouseSummary = path.join(resultsDir, "lighthouse", "summary.md");
const visualSummary = path.join(resultsDir, "visual-review-summary.md");

function exists(targetPath) {
  return fs.existsSync(targetPath);
}

function listFilesRecursive(dir, matcher) {
  if (!exists(dir)) return [];
  const output = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      output.push(...listFilesRecursive(fullPath, matcher));
    } else if (!matcher || matcher(fullPath)) {
      output.push(fullPath);
    }
  }
  return output;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return { violations: [], parseError: error instanceof Error ? error.message : String(error) };
  }
}

const axeFiles = listFilesRecursive(axeDir, (filePath) => filePath.endsWith(".json"));
let blockingAxeViolations = 0;
let axeParseErrors = 0;

for (const filePath of axeFiles) {
  const json = readJson(filePath);
  if (json.parseError) {
    axeParseErrors += 1;
    console.error(`Could not parse axe report ${path.relative(resultsDir, filePath)}: ${json.parseError}`);
  }

  const violations = Array.isArray(json.violations) ? json.violations : [];
  const blocking = violations.filter((item) => ["serious", "critical"].includes(item.impact));
  if (blocking.length > 0) {
    blockingAxeViolations += blocking.length;
    console.error(`${path.relative(resultsDir, filePath)} has ${blocking.length} blocking axe violation(s).`);
  }
}

const failures = [];

if (!axeFiles.length) {
  failures.push("No axe JSON reports were generated.");
}

if (axeParseErrors > 0) {
  failures.push(`${axeParseErrors} axe report(s) could not be parsed.`);
}

if (blockingAxeViolations > 0) {
  failures.push(`${blockingAxeViolations} serious/critical axe violation(s) remain.`);
}

if (!exists(lighthouseSummary)) {
  failures.push("Lighthouse summary was not generated at test-results/lighthouse/summary.md.");
}

if (!exists(visualSummary)) {
  failures.push("Visual review summary was not generated at test-results/visual-review-summary.md.");
}

console.log("Visual review artifact gate");
console.log(`Axe reports: ${axeFiles.length}`);
console.log(`Blocking axe violations: ${blockingAxeViolations}`);
console.log(`Lighthouse summary: ${exists(lighthouseSummary) ? "present" : "missing"}`);
console.log(`Visual summary: ${exists(visualSummary) ? "present" : "missing"}`);

if (failures.length) {
  console.error("\nVisual review failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Visual review passed: axe reports are clean and required summaries exist.");
