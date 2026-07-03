# ClearRun Frontend Visual Review Toolchain

This project uses a lightweight visual-review toolchain so product/design changes are checked against the real React/Tailwind app instead of hand-built static mockups.

## What it covers

The review suite covers these public and demo routes:

- `/`
- `/proof-snapshot`
- `/dashboard`
- `/proof`
- `/proof/PP-10231`

The Playwright suite checks each route at:

- mobile: `390px`
- tablet: `768px`
- desktop: `1440px`

## Local commands

Run the real app locally:

```bash
cd frontend
npm install
npm start
```

Then run screenshot and axe checks against the local dev server:

```bash
cd frontend
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run visual:screenshots
```

Run a production-build preview locally:

```bash
cd frontend
npm install
npm run build
npm run serve:build
```

Then, in another terminal:

```bash
cd frontend
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173 npm run visual:screenshots
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4173 npm run lighthouse:review
```

## Generated local artifacts

Generated artifacts are intentionally ignored by git:

- `frontend/test-results/screenshots/`
- `frontend/test-results/axe/`
- `frontend/test-results/playwright-report/`
- `frontend/test-results/lighthouse/`

These should be reviewed locally or downloaded from GitHub Actions artifacts.

## GitHub Actions artifacts

The workflow `.github/workflows/frontend-visual-review.yml` uploads:

- `frontend-visual-review-screenshots-and-axe`
- `frontend-lighthouse-review`
- `frontend-visual-server-log`

Use these artifacts to inspect screenshots, axe results, and Lighthouse reports from CI.

## Vercel preview setup

`vercel.json` is included for the actual React/Tailwind app.

A real shareable preview URL still requires connecting this GitHub repository to a Vercel project/account. Once connected, Vercel can build the frontend with:

```bash
npm --prefix frontend install
npm --prefix frontend run build
```

Output directory:

```text
frontend/build
```

The rewrite rule sends React Router routes to `index.html` so paths such as `/proof-snapshot` and `/proof/PP-10231` work on refresh.

## Accessibility policy

The Playwright suite runs axe checks and fails on `serious` and `critical` WCAG violations. Full axe JSON is saved for all routes and viewports.

## Lighthouse policy

The Lighthouse runner writes JSON, HTML, and a markdown summary for:

- Performance
- Accessibility
- Best Practices
- SEO

By default, the Lighthouse script reports scores without failing the PR. To make non-performance scores below 80 fail CI, run with:

```bash
LIGHTHOUSE_STRICT=1 npm run lighthouse:review
```

## Product guardrails

This toolchain does not change the product model. It does not add payments, storage, PDF automation, public proof libraries, city/EPA approval claims, compliance guarantees, fake integrations, fake testimonials, or competitor assets.

It exists to make the real product easier to inspect before each visual/product PR.

Last reviewed: PR03 visual-review setup.
