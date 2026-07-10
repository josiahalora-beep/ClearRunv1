const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

test("route issue report renders with operator language and passes blocking axe checks", async ({ page }, testInfo) => {
  await page.goto("/report-issue/warner-robins-route-b", { waitUntil: "networkidle" });

  await expect(page.getByTestId("route-issue-capture-page")).toBeVisible();
  await expect(page.locator("h1").first()).toHaveText("What happened at this stop?");
  await expect(page.getByTestId("capture-route-context")).toBeVisible();
  await expect(page.getByTestId("capture-issue-choice")).toBeVisible();
  await expect(page.getByTestId("capture-service-result")).toBeVisible();
  await expect(page.getByTestId("capture-evidence")).toBeVisible();
  await expect(page.getByTestId("capture-review-card")).toBeVisible();

  const visibleCopy = (await page.locator("body").innerText()).toLowerCase();
  for (const phrase of [
    "route exception intelligence",
    "active route exceptions",
    "closeout exceptions",
    "resolution gate",
    "economic impact",
    "operational consequence",
    "claim-safe",
  ]) {
    expect(visibleCopy).not.toContain(phrase);
  }

  const screenshotDir = path.join("test-results", "screenshots", testInfo.project.name);
  ensureDir(screenshotDir);
  await page.screenshot({ path: path.join(screenshotDir, "report-route-issue.png"), fullPage: true });

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const blocking = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
  expect(blocking).toEqual([]);
});

test("route, truck, and driver are prefilled and required work gates submission", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/report-issue/warner-robins-route-b", { waitUntil: "networkidle" });

  await expect(page.getByTestId("capture-route-select")).toHaveValue("warner-robins-route-b");
  await expect(page.getByTestId("capture-truck")).toHaveValue("Truck 07");
  await expect(page.getByTestId("capture-driver")).toHaveValue("M. Chen");
  await expect(page.getByTestId("capture-submit")).toBeDisabled();

  await page.getByTestId("capture-customer").fill("Sample Restaurant");
  await page.getByTestId("capture-group-access").click();
  await page.getByTestId("capture-issue-locked-gate").click();
  await page.getByTestId("capture-result-not-completed").click();
  await expect(page.getByTestId("capture-submit")).toBeDisabled();

  await page.getByTestId("capture-note").fill("Gate was locked and the site contact did not answer.");
  await expect(page.getByTestId("capture-submit")).toBeEnabled();
});

test("reported route issue appears in Route Review and opens for follow-up", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/report-issue/warner-robins-route-b", { waitUntil: "networkidle" });

  await page.getByTestId("capture-customer").fill("Sample Restaurant");
  await page.getByTestId("capture-group-access").click();
  await page.getByTestId("capture-issue-locked-gate").click();
  await page.getByTestId("capture-result-not-completed").click();
  await page.getByTestId("capture-note").fill("Gate was locked and the site contact did not answer.");
  await page.getByTestId("capture-submit").click();

  await expect(page).toHaveURL(/route-review\/warner-robins-route-b\?reported=CAP-/);
  await expect(page.getByTestId("route-reported-success")).toContainText("Route issue reported and added below");
  await expect(page.getByTestId("route-active-lane")).toContainText("Sample Restaurant");
  await expect(page.getByTestId("route-active-lane")).toContainText("Cannot access service area");
  await expect(page.getByTestId("route-active-lane")).toContainText("Just reported");

  await page.getByTestId("route-reported-success").getByRole("link", { name: "Open reported issue" }).click();
  await expect(page).toHaveURL(/issues\/CAP-/);
  await expect(page.getByTestId("route-exception-detail")).toBeVisible();
  await expect(page.locator("h1").first()).toContainText("Cannot access service area");
  await expect(page.getByTestId("route-exception-context")).toContainText("Sample Restaurant");
});

test("a photo can satisfy the first-report evidence requirement without a note", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/report-issue/macon-route-a", { waitUntil: "networkidle" });

  await page.getByTestId("capture-customer").fill("Sample Cafe");
  await page.getByTestId("capture-group-ticket-backup").click();
  await page.getByTestId("capture-issue-missing-photo").click();
  await page.getByTestId("capture-result-completed-with-missing-backup").click();
  await page.getByTestId("capture-photos").setInputFiles({
    name: "stop-photo.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from("sample-image"),
  });

  await expect(page.getByTestId("capture-note")).toHaveValue("");
  await expect(page.getByTestId("capture-submit")).toBeEnabled();
  await expect(page.getByTestId("capture-evidence")).toContainText("1 photo selected");
});

test("report screen avoids page-level horizontal overflow", async ({ page }) => {
  await page.goto("/report-issue/warner-robins-route-b", { waitUntil: "networkidle" });
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewport + 1);
});
