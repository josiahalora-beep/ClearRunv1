# ClearRun Records Visual Audit v1

Date: 2026-07-02
Scope: PR01 only
Baseline: PR00B branch `codex/pr00b-ci-rotation-checklist`
Local preview used: `http://127.0.0.1:5175/`

## Scope Guard

This PR is an audit and design upgrade plan only. It does not redesign the site,
add features, add PDF generation, add Resend, add upload storage, change backend
logic, or start PR02.

The goal is to evaluate the current ClearRun Records MVP against a premium B2B
vertical SaaS standard and define the safest next sequence of work.

## Executive Verdict

ClearRun has a strong functional MVP foundation. The category is clear, the
compliance posture is careful, and the product areas are broad enough to show a
real business. It is not yet visually premium enough for a buyer to immediately
feel "this is the serious system my team should trust."

The current experience reads as a complete prototype with good copy, not yet a
top-tier commercial product. The biggest issues are repetitive page structure,
too many similar white cards, long pages, generic dashboard hierarchy, mobile
overflow on key conversion routes, and route navigation that can preserve the
old scroll position instead of starting the next page at the top.

The fastest path to a premium feel is not to add more pages. It is to tighten the
design system, reduce repetition, make the first viewport more specific and
memorable, and turn the product pages into a calmer operating console.

## Evidence From PR01 Review

- Repo route inventory confirmed the requested routes exist except the `:id`
  variants for customer, restaurant, and disposal pages.
- Local frontend build completed successfully before this audit.
- Browser diagnostics on the running local build found no console errors, no
  network loading failures, and no runtime exceptions on the homepage.
- Mobile route sweep found horizontal overflow on `/try-free`, `/proof-mockup`,
  `/pilot`, and `/trial`.
- Link navigation from the bottom of the homepage to `/pricing` landed at
  `window.scrollY` around 948 instead of `0`, confirming route transitions need a
  scroll-to-top fix.
- The homepage mobile page height was about 7,692 px, which makes scroll
  retention bugs feel especially disruptive.

## Visual Quality Rating

Current rating: 6.5/10.

Target after PR02 and PR03: 8/10.

Target after PDF/proof packet polish and product console polish: 9/10.

ClearRun is credible now. It becomes premium when the product artifact, proof
packet, dashboards, forms, and trust surfaces look less like assembled sections
and more like one highly controlled system.

## Global Design System Findings

### Strengths

- Clear navy/off-white foundation feels serious and appropriate for regulated
  field-service records.
- Typography choices are clean and professional.
- Status colors are controlled and avoid a consumer-app feel.
- Shared components exist for page headers, CTAs, cards, disclaimers, empty
  states, status badges, and stat cards.
- Legal and compliance language is honest and avoids over-claiming.

### Weaknesses

- Too many pages use the same page header, white card grid, CTA band, and footer
  rhythm. The repetition makes the product feel flatter than it is.
- Cards are overused as the default layout unit. This creates "card soup" across
  marketing and product pages.
- Headings are often large and similarly weighted, so page hierarchy is less
  refined than premium SaaS sites.
- CTAs repeat heavily, especially "Get a Free Proof Packet Mockup" and "Start
  Free Records Trial." Repetition weakens confidence instead of increasing it.
- Product pages do not yet have enough dense operator hierarchy. A manager
  should instantly see what needs action, what is at risk, and what is already
  covered.
- The top navigation exposes too many product/feature destinations. Several
  links should be condensed into one or two clearer menu groups so the header
  feels calm and buyer-friendly.
- Tables and reports are not yet mobile-native enough for field and reviewer use.
- The visual language is safe, but not yet distinctive. It needs one or two
  memorable product artifacts: a proof packet preview, reviewer view, audit
  trail, or city export that feels report-grade.

### Mobile Findings

- `/try-free`, `/proof-mockup`, `/pilot`, and `/trial` overflow horizontally at a
  390 px viewport.
- `/reviewer` keeps the page from overflowing, but the internal table is wider
  than a phone viewport and should become a mobile card/table hybrid.
- Long mobile pages need tighter section density and fewer repeated CTA blocks.
- Route changes should reset scroll to the top. This is a high-priority polish
  fix because it affects every page.

### Trust And Compliance Findings

- Current disclaimers are careful and appropriate.
- Do not add fake certifications, fake government seals, or unverifiable security
  badges.
- Use plain trust language: audit trail, read-only reviewer view, export history,
  environment-held secrets, and no secret exposure in UI.
- Any future trustmark must be tied to something actually implemented or a
  clearly labeled planned control.

## Page-By-Page Audit

| Page or group | Visual strength | Main weakness | Buyer clarity | CTA | Mobile | Trust posture | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Clear category and serious tone. The hero says what ClearRun does. | Too long, too many repeated sections, not enough premium product artifact above the fold. | Good, but could name the buyer faster: regulated field-service operators and municipal-facing teams. | Too many repeated CTAs. Needs one primary and one secondary path. | No overflow, but very long on mobile. | Good disclaimer posture. | Critical |
| `/try-free` | Strong direct offer and useful form context. | Mobile overflow; form page feels more like a web form than a premium conversion flow. | Good. Trial and proof mockup should be differentiated more sharply. | Clear, but should feel safer and more guided. | Horizontal overflow at 390 px. | Good. | Critical |
| `/proof-mockup` | Best conversion concept: proof packet from buyer data. | Mobile overflow; mockup preview should be visually richer and more report-grade. | Good. | Strong, but needs a better success-state story. | Horizontal overflow at 390 px. | Good disclaimer. | Critical |
| `/checklist` | Useful inspection-readiness hook. | Text-heavy and card-heavy. Needs a more visual diagnostic flow. | Good. | Good, but should lead into proof mockup more naturally. | Acceptable. | Good. | High |
| `/comparison` | Clear competitor/old-process positioning. | Table-like content needs sharper visual contrast and fewer generic blocks. | Good. | Good. | Acceptable. | Good. | High |
| `/pricing` | Pricing is transparent and credible. | Plan cards need more premium hierarchy, procurement confidence, and plan-fit cues. | Good. | Clear. | Acceptable. | Good. | High |
| `/compatibility` | Compatibility with existing workflows is important and well placed. | Could look more like an integration confidence page with import patterns and fallback paths. | Good. | Good. | Acceptable. | Good. | Medium |
| `/objections` | Strong sales enablement page. | Reads like FAQ text. Needs tighter accordions or objection cards with proof examples. | Good. | Secondary. | Acceptable. | Good. | Medium |
| `/resources` | Helpful to have. | Feels placeholder-like unless resources become real downloadable/checklist assets. | Medium. | Needs clearer resource downloads. | Acceptable. | Good. | Medium |
| `/partners` | Shows channel strategy. | Needs a more specific partner path for municipalities, haulers, consultants, and software partners. | Medium. | Good. | Acceptable. | Good. | Medium |
| `/dashboard` | Broad product scope is visible. | Does not yet feel like a premium operating console. Needs sharper top tasks, risk, and proof readiness. | Good. | Product CTAs should become actions, not marketing CTAs. | Acceptable. | Good. | Critical |
| `/proof` | Strong product concept and closest to core value. | Proof list should feel more like a records command center with filters, evidence state, and reviewer readiness. | Good. | Good. | Acceptable. | Good. | Critical |
| `/proof/:id` | Strongest proof artifact direction. | Needs more report-grade polish, evidence timeline, customer branding, and PDF-ready layout. | Good. | Good. | Acceptable. | Good. | Critical |
| `/recovery` | Missing-record recovery is high value. | Needs clearer "what to do next" flow and stronger loss/risk framing. | Good. | Should be task-first. | Acceptable. | Good. | High |
| `/import` | Important for adoption and existing workflows. | Needs calmer file/import state design and clearer supported formats. | Good. | Task-first. | Acceptable. | Good. | High |
| `/export` | Important compliance/business artifact. | Needs export preview, format choices, and confidence around what is included. | Good. | Task-first. | Acceptable. | Good. | High |
| `/pilot` and `/trial` | Good low-risk adoption path. | Mobile overflow; trial/pilot wording needs tighter positioning. | Good. | Good. | Horizontal overflow at 390 px. | Good. | High |
| `/requests` | Useful operational queue concept. | Needs stronger prioritization and status semantics. | Good. | Task-first. | Acceptable. | Good. | High |
| `/customer` and `/restaurant` | Helpful customer-level view. | Requested `/customer/:id` and `/restaurant/:id` deep links are not implemented. Static route only. | Good. | Task-first. | Acceptable. | Good. | High |
| `/field` | Good for field team story. | Needs a more realistic mobile field workflow view, not just cards. | Good. | Task-first. | Acceptable. | Good. | High |
| `/trust` | Strong honest trust page. | Needs more structured security, privacy, and operations sections without claiming certifications. | Good. | Secondary. | Acceptable. | Strong. | High |
| `/audit` | Good audit trail concept. | Needs denser timeline, actor/source metadata, and export/read-only framing. | Good. | Task-first. | Acceptable. | Strong. | High |
| `/disposal` | Useful regulated-service record concept. | Requested `/disposal/:id` deep link is not implemented. Needs richer confirmation artifact. | Good. | Task-first. | Acceptable. | Strong disclaimer. | High |
| `/reviewer` | Valuable for inspectors and external reviewers. | Table should be more mobile-native and visually more official without implying certification. | Good. | Task-first. | Internal table is wide on phone. | Strong. | High |
| `/city-export` | Strong municipal-facing idea. | Needs export preview and clearer official/non-official boundary. | Good. | Task-first. | Acceptable. | Strong disclaimer. | High |
| `/cityview` | Responsible roadmap framing. | Roadmap pages all share similar visual pattern and can distract from core MVP. | Medium. | Secondary. | Acceptable. | Good planned-feature language. | Medium |
| `/proofgraph` | Interesting future proof-network concept. | Feels abstract today. Needs a more restrained roadmap treatment until real data exists. | Medium. | Secondary. | Acceptable. | Good planned-feature language. | Medium |
| `/intelligence` | Clear future intelligence idea. | Must stay rule-based/real-data grounded. Avoid AI-sounding generic claims. | Medium. | Secondary. | Acceptable. | Good planned-feature language. | Medium |
| `/admin/leads` | Admin gate exists and avoids exposing the key. | Visual shell is basic. Needs operator-grade admin view later. | Internal only. | Good enough for now. | Acceptable. | Good. | Medium |

## Route Completeness Notes

The app implements:

- `/customer`
- `/restaurant`
- `/disposal`

The PR01 requested audit list included:

- `/customer/:id`
- `/restaurant/:id`
- `/disposal/:id`

Those `:id` variants currently route to "Page not found." PR02 or PR03 should
either add the dynamic routes or update navigation/docs to use only the existing
static routes.

## Highest-Impact Fixes

1. Add global route scroll restoration.
   - Every route transition should start at the top unless the user is using
     browser back/forward restoration.
   - This should be a tiny PR02 fix because it makes the app feel immediately
     cleaner.

2. Fix mobile overflow on conversion and pilot routes.
   - Confirm `/try-free`, `/proof-mockup`, `/pilot`, and `/trial` at 390 px.
   - Remove fixed/wide child containers inside page header sections.

3. Tighten the design system.
   - Reduce card overuse.
   - Standardize page headers.
   - Condense the header navigation into fewer, clearer groups.
   - Create smaller type scales for dense product surfaces.
   - Add a more refined section rhythm.
   - Limit repeated CTA blocks.

4. Rebuild the homepage first viewport.
   - Show a premium product artifact early: proof packet, reviewer view, or
     inspection-ready export.
   - Keep one strong primary CTA and one calmer secondary CTA.
   - Reduce the total page length.

5. Upgrade the proof packet and reviewer surfaces.
   - These are the most valuable artifacts because they make ClearRun tangible.
   - They should feel report-grade, printable, and trustworthy.

6. Make the dashboard feel like an operating console.
   - Lead with active risk, missing records, proof readiness, and upcoming
     follow-ups.
   - Avoid marketing-style layout inside product pages.

7. Add dynamic record routes or remove the expectation.
   - `/customer/:id`, `/restaurant/:id`, and `/disposal/:id` should not land on
     NotFound if they are part of the product story.

## Suggested Reusable Components

- `ScrollToTop` route component.
- `PageShell` with controlled max width, section spacing, and mobile guards.
- `ProductHero` for product pages, separate from public marketing heroes.
- `ProofPacketPreview` for homepage, proof mockup, proof detail, pricing, and
  sales pages.
- `ReviewerTable` with desktop table and mobile card layout.
- `RiskSummaryBar` for dashboards and recovery pages.
- `ActionQueue` for dashboard, requests, recovery, and admin surfaces.
- `PlanComparisonGrid` for pricing.
- `TrustControlList` for trust, reviewer, and city export pages.
- `RouteNotFoundRecovery` with clear product links and no duplicated long footer
  feel.

## Visual Quality Rules For Future PRs

- No fake trustmarks, fake certifications, fake government approval, or implied
  compliance guarantee.
- No page should depend on a wall of identical cards to look complete.
- Mobile width must be tested at 390 px before merge.
- Product pages should prioritize tasks and status before marketing language.
- Marketing pages should have one main message per viewport.
- Repeated CTAs should be reduced, not multiplied.
- Tables need a mobile treatment.
- Proof artifacts should be printable and report-grade.
- Roadmap pages should be clearly labeled and visually quieter than live product
  pages.
- All route transitions should feel fresh and start at the top.

## Current PR Direction Update

As of PR #5 (`PR03: Proof Snapshot Conversion Surface`) on branch
`pr03-proof-snapshot`, the project direction has changed from broad site polish
first to proof-led validation first.

Current validated state:

- PR #5 is open and still draft, but it is mergeable.
- Latest known passing head commit: `0e7a857be24215ae4cb7fd3ac3302adc060a09ee`.
- `Frontend Build` passes.
- `Backend Tests` pass.
- `Frontend Visual Review` passes.
- The visual review workflow now checks the real React/Tailwind app with
  screenshots, axe JSON, Lighthouse output, a visual summary, and an
  artifact-based final gate.
- Serious/critical axe blockers were fixed across the tested routes and
  viewports.
- `/proof-snapshot` is now the core free validation surface, not a side feature.
- The simplified top navigation should stay simplified. Do not reintroduce the
  previous crowded mega-menu structure.

The next PRs should keep the V26 business thesis centered on this path:

`messy field record -> clean Proof Snapshot -> missing fields found -> Route Cleanup offer -> Managed Records later`

Do not restart the product, rebuild the site from scratch, or add broad roadmap
features before the proof-led conversion path is stronger.

## Recommended PR Sequence From Current Branch

### PR03 - Proof Snapshot Conversion Surface And Quality Gate

Status: functionally complete after the latest validation pass.

Completed or now included:

- Adds `/proof-snapshot` as the first-dollar validation route.
- Wires the route, navbar CTA, footer link, backend lead type, admin lead fields,
  and internal email context.
- Adds proof snapshot lead intake and email payload tests.
- Adds the frontend visual review toolchain.
- Adds screenshots, axe reports, Lighthouse review output, visual summary, and
  final artifact-based gate.
- Fixes contrast issues discovered by the actual artifacts rather than guessing.
- Keeps safety scope: no payments, no PDF automation, no live storage claim, no
  public proof library, no city/EPA/compliance approval claim.

Final PR03 cleanup before marking ready:

- Confirm PR #5 stays green at the latest head.
- Review uploaded screenshots for obvious visual regressions.
- Confirm PR body reflects that GitHub Actions now passes instead of saying
  backend pytest was not run.
- Keep the PR draft until screenshots/artifacts have been manually reviewed.

### PR04 - V26 Homepage And Conversion Alignment

Goal: make the public site sell one clear action: send one messy/redacted record
and get a Proof Snapshot.

Scope:

- Rework the homepage around the Proof Snapshot -> Route Cleanup path.
- Replace broad trial/mockup language with proof-led language.
- Primary CTA: `Get a Free Proof Snapshot` linking to `/proof-snapshot`.
- Secondary CTA: `See Proof Example` linking to `/proof` or `/proof/PP-10231`.
- Add a simple transformation story: messy ticket/photo/receipt -> cleaned proof
  summary -> missing fields -> route cleanup recommendation.
- Simplify footer structure and remove future-heavy link density.
- Keep future concepts quieter: CityView, ProofGraph, Infrastructure
  Intelligence, city exports, reviewer views, and disposal certificates should
  not dominate the homepage yet.

Do not add:

- Fake integrations.
- Fake customers or testimonials.
- Payment flows.
- PDF automation claims.
- Secure live file storage claims.
- Compliance certification or city/EPA approval language.

### PR05 - Owner Command Center And Proof Library

Goal: make the logged-in/demo product feel like an owner/operator console instead
of a marketing demo.

Scope:

- Upgrade `/dashboard` around the question: "What needs attention today?"
- Add sharper hierarchy for Proof Snapshots requested, packets delivered, missing
  records, follow-up needs, and route cleanup opportunity.
- Upgrade `/proof` into a premium packet library with evidence state, customer,
  service date, service type, missing count, and status clarity.
- Keep views mobile-safe at 390 px.
- Keep action language practical and non-legal.

### PR06 - Proof Detail, Reviewer, And Disposal Artifact Polish

Goal: make ClearRun tangible through report-grade proof artifacts.

Scope:

- Upgrade `/proof/:id` into a more report-grade, printable proof packet.
- Improve evidence stack, service summary, record history, and missing-item
  presentation.
- Upgrade `/reviewer`, `/audit`, `/disposal`, and `/city-export` only as proof
  and review-support surfaces.
- Keep all official-sounding surfaces carefully scoped as record organization and
  review support, not compliance approval.

### PR07 - Route Completeness, Admin Shell, And Conversion Follow-Through

Goal: clean remaining product gaps after the proof-led public and product paths
are stronger.

Scope:

- Decide whether to support `/customer/:id`, `/restaurant/:id`, and
  `/disposal/:id`; either implement them or remove expectations from docs and UI.
- Upgrade `/admin/leads` into an operator-grade internal page without exposing
  credentials.
- Add clearer Proof Snapshot submission follow-up states if needed.
- Preserve the artifact-first visual review workflow for every visual/product PR.

## Safety Check For Future PRs

- Do not reintroduce the old `ProofOps` name.
- Do not add secrets, API keys, `.env` contents, real admin keys, Resend keys, or
  MongoDB URIs.
- Do not add fake compliance, licensing, security, government, city, or EPA
  claims.
- Do not add fake customer logos, testimonials, screenshots, integrations, or
  competitor assets.
- Do not claim file storage, PDF automation, or payment processing until those
  systems are actually implemented.
- Do not expose disposal-site pricing, margins, or proprietary facility revenue
  intelligence.
- Use pricing-safe facility language: `Volume Variance Flags`, `Scheduled
  Drop-Off Confirmation`, and `Disposal Confirmation Certificate`.
- Keep the quality gate: build, backend tests, screenshots, axe, Lighthouse, and
  artifact-based final review must pass before visual/product PRs are considered
  ready.
