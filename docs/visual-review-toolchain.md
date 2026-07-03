# ClearRun Visual Review Toolchain

This project now has a trusted browser-based review path for the real React/Tailwind app. It is meant to stop visual review from being based only on code inspection.

## What It Checks

Playwright reviews these routes:

- `/`
- `/proof-snapshot`
- `/dashboard`
- `/proof`
- `/proof/PP-10231`

Each route is checked at:

- Mobile: `390 x 844`
- Tablet: `768 x 1024`
- Desktop: `1440 x 1000`

The Playwright review captures full-page screenshots, checks for horizontal overflow, verifies the page is not falling into the missing-page route, runs axe accessibility checks for serious/critical WCAG issues, and performs a basic keyboard focus check.

The CI gate fails on critical axe issues and saves all axe findings, including contrast findings, as JSON artifacts for review. This lets the team see current contrast debt without blocking every PR before the visual cleanup work lands.

Lighthouse reviews the same routes for:

- Performance
- Accessibility
- Best practices
- SEO basics

## Local Commands

Run from `frontend/`:

```bash
npm install
npx playwright install chromium
npm run build
npm run review:visual
npm run review:lighthouse
```

Or run the combined review:

```bash
npm run review
```

Artifacts are written to:

- `frontend/test-results/visual-review/*.png`
- `frontend/test-results/axe/*.json`
- `frontend/test-results/lighthouse/*.json`
- `frontend/playwright-report/`

## GitHub Actions

The workflow `.github/workflows/frontend-visual-review.yml` runs on frontend PRs and uploads the screenshot/Lighthouse/Playwright artifacts as `frontend-visual-review`.

The workflows use `npm install` because this repo did not previously carry a frontend lockfile. The added review-tool dependencies are pinned exactly in `frontend/package.json`.

## Vercel Preview

`vercel.json` is included for a real React app preview deploy. It builds the actual frontend app and rewrites all routes to `index.html` so deep links such as `/proof/PP-10231` work.

To create a real shareable Vercel URL:

1. In Vercel, import `josiahalora-beep/ClearRunv1`.
2. Use the repository root as the project root.
3. Let Vercel read `vercel.json`.
4. Set `REACT_APP_BACKEND_URL` in Vercel project environment variables.
5. Open or update a pull request.
6. Vercel will attach a shareable preview URL to the PR checks/comments.

Do not commit Vercel tokens, backend URLs with credentials, API keys, or production secrets.

## Guardrails

This toolchain does not add:

- Fake upload/storage behavior
- Payment flows
- PDF automation
- Public proof library claims
- City/EPA approval claims
- Compliance guarantees
- Competitor screenshots
- Copyrighted images

The review exists to inspect the actual product surfaces, not to replace founder judgment.
