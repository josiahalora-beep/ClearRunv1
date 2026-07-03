const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const pages = [
  { name: "home", path: "/" },
  { name: "proof-snapshot", path: "/proof-snapshot" },
  { name: "dashboard", path: "/dashboard" },
  { name: "proof-list", path: "/proof" },
  { name: "proof-detail", path: "/proof/PP-10231" },
];

const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 1000 },
];

const screenshotRoot = path.join(process.cwd(), "test-results", "visual-review");
const axeRoot = path.join(process.cwd(), "test-results", "axe");

test.beforeAll(() => {
  fs.mkdirSync(screenshotRoot, { recursive: true });
  fs.mkdirSync(axeRoot, { recursive: true });
});

for (const viewport of viewports) {
  test.describe(`visual review at ${viewport.name}`, () => {
    test.use({ viewport });

    for (const pageDef of pages) {
      test(`${pageDef.name} renders, screenshots, and passes core accessibility`, async ({ page }) => {
        await page.goto(pageDef.path, { waitUntil: "networkidle" });

        await expect(page.locator("body")).toBeVisible();
        await expect(page.locator("body")).not.toContainText("Page not found");

        const horizontalOverflow = await page.evaluate(() => (
          document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        ));
        expect(horizontalOverflow, `${pageDef.path} should not overflow horizontally at ${viewport.name}`).toBe(false);

        await page.screenshot({
          path: path.join(screenshotRoot, `${pageDef.name}-${viewport.name}.png`),
          fullPage: true,
        });

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();

        fs.writeFileSync(
          path.join(axeRoot, `${pageDef.name}-${viewport.name}.json`),
          JSON.stringify(accessibilityScanResults.violations, null, 2)
        );

        const blockingViolations = accessibilityScanResults.violations.filter((violation) =>
          violation.impact === "critical"
        );
        expect(blockingViolations, JSON.stringify(blockingViolations, null, 2)).toEqual([]);

        await page.keyboard.press("Tab");
        const activeElementTag = await page.evaluate(() => document.activeElement?.tagName || "");
        expect(activeElementTag).not.toBe("BODY");
      });
    }
  });
}
