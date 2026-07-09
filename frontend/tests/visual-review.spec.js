const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const routes = [
  { name: "home", path: "/" },
  { name: "closeout-check", path: "/closeout-check" },
  { name: "proof-snapshot", path: "/proof-snapshot" },
  { name: "dashboard", path: "/dashboard" },
  { name: "proof-list", path: "/proof" },
  { name: "proof-detail", path: "/proof/PP-10231" },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function formatAxeViolations(violations) {
  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .slice(0, 4)
        .map((node) => `    - ${node.target.join(" ")}: ${node.failureSummary || "No failure summary"}`)
        .join("\n");
      return `  ${violation.id} [${violation.impact}] ${violation.help}\n${nodes}`;
    })
    .join("\n\n");
}

for (const route of routes) {
  test(`${route.name} renders, screenshots, and passes blocking axe checks`, async ({ page }, testInfo) => {
    await page.goto(route.path, { waitUntil: "networkidle" });
    await expect(page.locator("body")).toBeVisible();

    const projectName = testInfo.project.name;
    const screenshotDir = path.join("test-results", "screenshots", projectName);
    ensureDir(screenshotDir);
    await page.screenshot({
      path: path.join(screenshotDir, `${route.name}.png`),
      fullPage: true,
    });

    const axeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const axeDir = path.join("test-results", "axe", projectName);
    ensureDir(axeDir);
    fs.writeFileSync(
      path.join(axeDir, `${route.name}.json`),
      JSON.stringify(axeResults, null, 2)
    );

    const blockingViolations = axeResults.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact)
    );

    expect(
      blockingViolations,
      `Blocking accessibility issues on ${route.path}:\n${formatAxeViolations(blockingViolations)}`
    ).toEqual([]);
  });
}
