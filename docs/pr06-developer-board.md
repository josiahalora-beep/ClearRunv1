# PR06 Developer Board Review Framework

PR06 should be reviewed as if a small product team is improving the customer-facing Proof Packet Demo Dashboard. The final decision stays with the Master AI / Product Manager so the project does not drift away from ClearRun's core wedge.

## Master AI / Product Manager

**Main responsibility:** protect the ClearRun vision.

ClearRun should answer one simple buyer question:

> Can this route record be closed?

The product must stay narrow, premium, practical, and legally safe. The Proof Packet Demo Dashboard should show the customer exactly what ClearRun gives them after reviewing a messy record.

**Approval rules:**

- Customer-facing value must feel 10/10.
- Premium B2B visual quality must feel 10/10.
- No broad compliance-platform drift.
- No fake automation claims.
- No fake upload/storage claims.
- No fake customers, testimonials, logos, or approvals.
- No city, EPA, legal, certification, or inspection-proof claims.

## Agent 1 — Customer Value Strategist

**Question:** Would a first-time operator understand the value in under 10 seconds?

Review checklist:

- The page must clearly show three outcomes: Ready to Close, Needs Review, Missing Proof.
- The dashboard must make the next office action obvious.
- The customer must understand why ClearRun saves office time.
- The page must feel like a product demo, not a static marketing page.
- The proof examples should be few, curated, and easy to click.

Required recommendation:

- Keep only 1–3 examples.
- Make every card answer: status, gap, invoice support, next action.

## Agent 2 — Premium Visual Designer

**Question:** Does this look like a serious B2B SaaS dashboard?

Review checklist:

- Strong hero hierarchy.
- Premium navy/white/off-white palette.
- Clear card spacing.
- No childish icons or colors.
- No cluttered database-table feeling.
- Status cards feel intentional and executive-readable.
- Mobile version still feels premium.

Required recommendation:

- Use a dark dashboard hero.
- Use three large curated cards instead of many small plain cards.
- Add stats and summary panels so `/proof` feels like a dashboard.

## Agent 3 — Conversion Lead

**Question:** Does the page naturally move a buyer toward the Free Route Closeout Check?

Review checklist:

- Primary CTA must point to `/closeout-check`.
- Secondary CTA can point to the Missing Proof example.
- Homepage should link to the Proof Packet Demo Dashboard.
- `/closeout-check` should link back to `/proof` so customers can see what they receive.
- CTAs should be clear and not salesy.

Required recommendation:

- Do not bury the CTA below generic feature text.
- Make the proof dashboard feel like the preview of what the free check produces.

## Agent 4 — Frontend Engineer

**Question:** Is the implementation clean and low-risk?

Review checklist:

- Use existing React/Tailwind structure.
- Avoid adding dependencies.
- Preserve existing routes.
- Avoid breaking proof detail pages.
- Keep no horizontal overflow.
- Use existing `proofPackets` data cleanly.
- Keep code readable enough for future Codex work.

Required recommendation:

- Reuse `PP-10231`, `PP-10232`, and `PP-10234` as curated demo IDs.
- Keep `/proof/:id` route intact.
- Update test route to the Missing Proof example because it is the most important customer-facing scenario.

## Agent 5 — Trust, Legal, and Claims Guardrail

**Question:** Is every claim safe?

Review checklist:

- Avoid the words: compliant, certified, approved, legal, EPA-ready, city-approved, inspection-proof, guaranteed.
- Use safe phrases: ready to close, missing proof, weak backup, needs review, office action needed, invoice support, customer/reviewer response readiness.
- Make sure ClearRun is positioned as office review and proof organization, not regulatory approval.

Required recommendation:

- Keep disclaimers visible where needed.
- Do not imply ClearRun verifies legal sufficiency.

## Agent 6 — QA, Accessibility, and Performance Reviewer

**Question:** Will this survive PR04 gates?

Review checklist:

- Frontend build must pass.
- Playwright visual review must pass.
- Axe serious/critical issues must remain zero.
- Lighthouse must stay above thresholds.
- Vercel must deploy successfully.
- New dashboard must not cause mobile overflow.

Required recommendation:

- Keep `/proof` and `/proof/PP-10234` in visual/Lighthouse coverage.
- Use high-contrast muted text and status colors.

## Board Decision Standard

PR06 should not be considered done until all agents would approve this statement:

> A first-time customer can land on `/proof`, understand what ClearRun produces, click one of three examples, and immediately see why a Free Route Closeout Check is worth trying.

## Current PR06 Direction

- `/proof` becomes a premium demo dashboard.
- It shows exactly 3 curated proof outcomes.
- Each outcome opens a proof detail page.
- The customer journey becomes:

```text
Homepage → Closeout Check → Proof Demo Dashboard → Proof Detail Example → Free Route Closeout Check
```

This keeps ClearRun simple, visual, premium, and focused on the missing-proof closeout wedge.
