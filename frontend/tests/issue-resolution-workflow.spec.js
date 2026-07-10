const { test, expect } = require("@playwright/test");

test("reached contact requires a recorded response before completion", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/issues/EX-2101", { waitUntil: "networkidle" });

  await page.getByTestId("route-dispatch-status").selectOption("Reached");
  await page.getByTestId("route-customer-status").selectOption("Attempted");

  const checks = page.locator('input[type="checkbox"]');
  await expect(checks).toHaveCount(2);
  await checks.nth(0).check();
  await checks.nth(1).check();

  await page.getByTestId("route-resolution-reason").selectOption("Access instructions confirmed");
  await page.getByTestId("route-final-status").selectOption("Rescheduled");

  await expect(page.getByTestId("route-exception-release-button")).toBeDisabled();
  await expect(page.getByTestId("route-resolution-panel")).toContainText("A reached contact requires a recorded response");

  await page.getByTestId("route-response-note").fill("Site manager provided a new gate code and confirmed a return window.");
  await page.getByTestId("route-record-response").click();

  await expect(page.getByTestId("route-record-response")).toHaveText("Response Recorded");
  await expect(page.getByTestId("route-exception-release-button")).toBeEnabled();
  await expect(page.getByTestId("route-exception-activity")).toContainText("Response recorded");
});

test("issue-specific follow-up template can be prepared without sending a message", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/issues/EX-2104", { waitUntil: "networkidle" });

  const followUpText = page.getByLabel("Route issue follow-up");
  await expect(page.getByTestId("route-followup-template")).toHaveValue("receipt-office");
  await expect(followUpText).toHaveValue(/route\/load receipt/);

  await page.getByTestId("route-followup-template").selectOption("receipt-driver");
  await expect(followUpText).toHaveValue(/which disposal receipt supports/);
  await page.getByTestId("route-exception-followup-button").click();

  await expect(page.getByTestId("route-exception-followup-button")).toHaveText("Follow-Up Prepared");
  await expect(page.getByTestId("route-exception-activity")).toContainText("Follow-up prepared");
  await expect(page.getByTestId("route-exception-followup")).toContainText("does not send a real message");
});

test("supporting evidence records source and appears in work history", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/issues/EX-2103", { waitUntil: "networkidle" });

  await page.getByTestId("route-new-evidence-label").fill("Signed service ticket");
  await page.getByTestId("route-new-evidence-source").selectOption("Customer");
  await page.getByPlaceholder("Optional evidence note").fill("Customer returned the signed copy to the office.");
  await page.getByTestId("route-add-evidence").click();

  await expect(page.getByTestId("route-evidence-work")).toContainText("Signed service ticket");
  await expect(page.getByTestId("route-evidence-work")).toContainText("Source: Customer");
  await expect(page.getByTestId("route-exception-activity")).toContainText("Evidence added");
});

test("route issue workflow avoids page-level horizontal overflow", async ({ page }) => {
  await page.goto("/issues/EX-2101", { waitUntil: "networkidle" });
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewport + 1);
});
