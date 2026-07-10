const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const routes = [
  { name: "home", path: "/" },
  { name: "closeout-check", path: "/closeout-check" },
  { name: "proof-snapshot", path: "/proof-snapshot" },
  {
    name: "dashboard",
    path: "/dashboard",
    requiredTestIds: [
      "dashboard-priority-exception",
      "dashboard-exception-table",
      "dashboard-value-math",
      "dashboard-route-intelligence-link",
    ],
  },
  {
    name: "recovery",
    path: "/recovery",
    requiredTestIds: ["recovery-item-EX-1048", "recovery-resolve-btn-EX-1048"],
  },
  {
    name: "exception-detail",
    path: "/exceptions/EX-1048",
    requiredTestIds: [
      "exception-detail-workflow",
      "exception-owner-select",
      "exception-economic-impact",
      "exception-route-context",
      "exception-disposal-status",
      "exception-repeat-signal",
      "exception-followup-panel",
      "exception-release-button",
      "exception-activity-timeline",
    ],
  },
  {
    name: "route-intelligence",
    path: "/route-intelligence/warner-robins-route-b",
    requiredTestIds: [
      "route-intelligence-page",
      "route-intelligence-header",
      "route-consequence-strip",
      "route-primary-action",
      "route-active-lane",
      "route-closeout-lane",
      "route-pattern-panel",
      "route-disposal-matrix",
      "route-closeout-summary",
    ],
  },
  {
    name: "route-exception-detail",
    path: "/exceptions/EX-2101",
    requiredTestIds: [
      "route-exception-detail",
      "route-exception-owner",
      "route-exception-context",
      "route-exception-followup",
      "route-exception-release-button",
      "route-exception-activity",
    ],
  },
  { name: "proof-list", path: "/proof" },
  { name: "proof-detail", path: "/proof/PP-10234" },
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

async function expectBusinessVisualAnchors(page, route) {
  const requiredTestIds = route.requiredTestIds || [];

  for (const testId of requiredTestIds) {
    await expect(
      page.getByTestId(testId),
      `${route.path} is missing business-critical visual anchor: ${testId}`
    ).toBeVisible();
  }
}

for (const route of routes) {
  test(`${route.name} renders, screenshots, passes business anchors, and passes blocking axe checks`, async ({ page }, testInfo) => {
    await page.goto(route.path, { waitUntil: "networkidle" });
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("h1").first(), `${route.path} must keep a clear designer-visible H1`).toBeVisible();
    await expectBusinessVisualAnchors(page, route);

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

test("exception economic context stays operational and claim-safe", async ({ page }) => {
  await page.goto("/exceptions/EX-1048", { waitUntil: "networkidle" });

  await expect(page.getByTestId("exception-economic-impact")).toContainText("Operational labels, not estimated dollars");
  await expect(page.getByTestId("exception-disposal-status")).toContainText("does not verify disposal");
  await expect(page.getByTestId("exception-disposal-status")).toContainText("does not expose facility pricing");
  await expect(page.getByTestId("exception-repeat-signal")).toContainText("not a compliance score");
});

test("exception release remains gated until required proof is confirmed", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/exceptions/EX-1048", { waitUntil: "networkidle" });

  const releaseButton = page.getByTestId("exception-release-button");
  await expect(releaseButton).toBeDisabled();

  const proofChecks = page.locator('input[type="checkbox"]');
  await expect(proofChecks).toHaveCount(2);
  await proofChecks.nth(0).check();
  await expect(releaseButton).toBeDisabled();
  await proofChecks.nth(1).check();

  await expect(releaseButton).toBeEnabled();
  await releaseButton.click();
  await expect(releaseButton).toHaveText("Released");
  await expect(page.getByTestId("exception-activity-timeline")).toContainText("Ticket released");
});

test("route review shows reconciling operator-facing counts", async ({ page }) => {
  await page.goto("/route-intelligence/warner-robins-route-b", { waitUntil: "networkidle" });

  const header = page.getByTestId("route-intelligence-header");
  await expect(header).toContainText("Scheduled stops");
  await expect(header).toContainText("14");
  await expect(header).toContainText("Completed without issue");
  await expect(header).toContainText("10");
  await expect(header).toContainText("Needs attention now");
  await expect(header).toContainText("2");
  await expect(header).toContainText("Needs office follow-up");
  await expect(page.getByTestId("route-pattern-panel")).toContainText("3 of 11");
  await expect(page.getByTestId("route-pattern-panel")).toContainText("not an employee score");
  await expect(page.getByTestId("route-disposal-matrix")).toContainText("Disposal receipt status");
  await expect(page.getByTestId("route-closeout-summary")).toContainText("What is ready and what still needs work");
});

test("route selector, work filters, disposal filter, and issue click-through work", async ({ page }) => {
  await page.goto("/route-intelligence/warner-robins-route-b", { waitUntil: "networkidle" });

  await page.getByTestId("route-lane-filter-active").click();
  await expect(page.getByTestId("route-active-lane")).toBeVisible();
  await expect(page.getByTestId("route-closeout-lane")).toHaveCount(0);

  await page.getByTestId("route-lane-filter-all").click();
  await page.getByRole("button", { name: "Receipt present but unmatched 1" }).click();
  await expect(page.getByTestId("route-exception-EX-2104")).toBeVisible();
  await expect(page.getByTestId("route-exception-EX-2103")).toHaveCount(0);

  await page.getByTestId("route-selector").selectOption("macon-route-a");
  await expect(page).toHaveURL(/route-intelligence\/macon-route-a/);
  await expect(page.locator("h1").first()).toContainText("Macon Route A");

  await page.goto("/route-intelligence/warner-robins-route-b", { waitUntil: "networkidle" });
  await page.getByTestId("route-primary-action-link").click();
  await expect(page).toHaveURL(/exceptions\/EX-2101/);
  await expect(page.getByTestId("route-exception-detail")).toBeVisible();
});

test("dashboard and route workflow keep internal architecture language out of visible copy", async ({ page }) => {
  const productRoutes = [
    "/dashboard",
    "/route-intelligence/warner-robins-route-b",
    "/exceptions/EX-2101",
  ];
  const bannedVisiblePhrases = [
    "route exception intelligence",
    "active route exceptions",
    "closeout exceptions",
    "both lanes",
    "resolution gate",
    "commercial interpretation",
    "closeout consequence",
    "observed demo route data",
    "primary office action",
    "exception resolution workspace",
    "operational labels, not estimated dollars",
    "claim-safe",
  ];

  for (const productRoute of productRoutes) {
    await page.goto(productRoute, { waitUntil: "networkidle" });
    const visibleCopy = (await page.locator("body").innerText()).toLowerCase();

    for (const phrase of bannedVisiblePhrases) {
      expect(visibleCopy, `${productRoute} exposes internal phrase: ${phrase}`).not.toContain(phrase);
    }
  }
});

test("route review avoids page-level horizontal overflow", async ({ page }) => {
  await page.goto("/route-intelligence/warner-robins-route-b", { waitUntil: "networkidle" });
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewport + 1);
});

test("route issue remains blocked until required work is completed", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/exceptions/EX-2101", { waitUntil: "networkidle" });

  const releaseButton = page.getByTestId("route-exception-release-button");
  await expect(releaseButton).toBeDisabled();

  const checks = page.locator('input[type="checkbox"]');
  await expect(checks).toHaveCount(2);
  await checks.nth(0).check();
  await expect(releaseButton).toBeDisabled();
  await checks.nth(1).check();
  await expect(releaseButton).toBeEnabled();

  await releaseButton.click();
  await expect(releaseButton).toHaveText("Resolved");
  await expect(page.getByTestId("route-exception-activity")).toContainText("Issue marked resolved");
});
