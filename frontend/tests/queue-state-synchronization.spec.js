const { test, expect } = require("@playwright/test");

async function completeCloseoutIssue(page) {
  await page.goto("/issues/EX-2103", { waitUntil: "networkidle" });
  const checks = page.locator('input[type="checkbox"]');
  await expect(checks).toHaveCount(1);
  await checks.first().check();
  await page.getByTestId("route-resolution-reason").selectOption("Missing ticket backup received");
  await page.getByTestId("route-final-status").selectOption("Ready to Close");
  await expect(page.getByTestId("route-exception-release-button")).toBeEnabled();
  await page.getByTestId("route-exception-release-button").click();
}

test("completed issue leaves open work, appears in outcomes, and returns when reopened", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await completeCloseoutIssue(page);

  await page.getByRole("link", { name: "Back to Warner Robins Route B" }).click();
  await expect(page).toHaveURL(/route-review\/warner-robins-route-b/);
  await expect(page.getByTestId("route-metric-office")).toContainText("1");
  await expect(page.getByTestId("route-metric-completed")).toContainText("1");
  await expect(page.getByTestId("route-metric-reopened")).toContainText("0");
  await expect(page.getByText("Tickets not ready").locator("..")).toContainText("3");
  await expect(page.getByTestId("route-closeout-summary")).toContainText("Ready to Close");
  await expect(page.getByTestId("route-closeout-summary")).toContainText("11");

  await page.getByTestId("route-state-filter-completed").click();
  await expect(page.getByTestId("route-completed-lane")).toBeVisible();
  await expect(page.getByTestId("route-exception-EX-2103")).toBeVisible();
  await expect(page.getByTestId("route-exception-EX-2103")).toContainText("Ready to Close");
  await expect(page.getByTestId("route-exception-EX-2103")).toContainText("Missing ticket backup received");

  await page.getByTestId("route-owner-filter").selectOption("Route desk");
  await page.getByTestId("route-contact-filter").selectOption("Not needed");
  await page.getByTestId("route-evidence-filter").selectOption("Ready");
  await page.getByTestId("route-outcome-filter").selectOption("Ready to Close");
  await expect(page.getByTestId("route-exception-EX-2103")).toBeVisible();
  await expect(page.getByTestId("route-queue-controls")).toContainText("Clear 4 filters");

  await page.getByTestId("route-exception-EX-2103").getByRole("button", { name: "Review Outcome" }).click();
  await expect(page).toHaveURL(/issues\/EX-2103/);
  await page.getByTestId("route-reopen-reason").fill("The recovered signature was unreadable.");
  await page.getByTestId("route-reopen-button").click();
  await expect(page.getByTestId("route-exception-activity")).toContainText("Issue reopened");

  await page.getByRole("link", { name: "Back to Warner Robins Route B" }).click();
  await expect(page.getByTestId("route-metric-office")).toContainText("2");
  await expect(page.getByTestId("route-metric-completed")).toContainText("0");
  await expect(page.getByTestId("route-metric-reopened")).toContainText("1");
  await expect(page.getByText("Tickets not ready").locator("..")).toContainText("4");

  await page.getByTestId("route-state-filter-reopened").click();
  await expect(page.getByTestId("route-reopened-lane")).toBeVisible();
  await expect(page.getByTestId("route-exception-EX-2103")).toContainText("Reopened");
  await expect(page.getByTestId("route-exception-EX-2103")).toContainText("Ready · 1 of 1 confirmed");
  await expect(page.getByTestId("route-exception-EX-2103")).toContainText("Continue Reopened Issue");
});

test("rescheduled issue leaves the open queue without becoming ready to close", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/issues/EX-2102", { waitUntil: "networkidle" });

  await page.getByTestId("route-dispatch-status").selectOption("Attempted");
  const checks = page.locator('input[type="checkbox"]');
  await expect(checks).toHaveCount(1);
  await checks.first().check();
  await page.getByTestId("route-resolution-reason").selectOption("Service rescheduled");
  await page.getByTestId("route-final-status").selectOption("Rescheduled");
  await page.getByTestId("route-exception-release-button").click();

  await page.getByRole("link", { name: "Back to Warner Robins Route B" }).click();
  await expect(page.getByTestId("route-metric-dispatch")).toContainText("1");
  await expect(page.getByTestId("route-metric-completed")).toContainText("1");
  await expect(page.getByText("Tickets not ready").locator("..")).toContainText("4");

  await page.getByTestId("route-state-filter-completed").click();
  await expect(page.getByTestId("route-exception-EX-2102")).toContainText("Rescheduled");
  await expect(page.getByTestId("route-exception-EX-2102")).toContainText("Service rescheduled");
  await expect(page.getByTestId("route-closeout-summary")).toContainText("Follow-Up Needed");
});

test("synchronized route queue avoids horizontal overflow in every queue state", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/route-review/warner-robins-route-b", { waitUntil: "networkidle" });

  for (const state of ["open", "completed", "reopened", "all"]) {
    await page.getByTestId(`route-state-filter-${state}`).click();
    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewport + 1);
  }
});
