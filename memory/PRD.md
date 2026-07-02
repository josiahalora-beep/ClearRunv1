# ClearRun Records — Product & Build Documentation

## Original Problem Statement
Visual product designer / frontend polish agent task for "ClearRun Records" — a premium B2B SaaS
field-service records platform (starting with grease-trap/FOG and liquid-waste, expanding to septic,
portable sanitation, disposal confirmations, municipal visibility, and infrastructure intelligence).

**IMPORTANT: The repo was found EMPTY at task start** (only a README.md describing a separate, abandoned
Next.js automation attempt that was never executed). Per instructions ("Do not rebuild the app from
scratch unless the repo is empty or broken"), this was built from scratch as a new React + FastAPI + MongoDB
app, following the exact product strategy, copy, CTAs, and visual style rules given in the problem statement.

- Product name: ClearRun Records (kept, not renamed)
- Tagline: "Field proof. Clear records."
- Primary CTA: "Start Free Records Trial" | Secondary CTA: "Get a Free Proof Packet Mockup"
- No fake certifications, no fake testimonials, no lorem ipsum, no false integration claims — verified.
- No authentication in scope (not requested; all pages are public marketing/product-demo pages with
  realistic mock data, e.g. fictional "Riverside Bistro" in fictional "Millbrook, OH").

## User Choices (from initial clarification)
1. Logo: simple icon + wordmark (designed — ShieldCheck icon in navy rounded square + "ClearRun / RECORDS")
2. Typography: modern SaaS fonts — Manrope (display/headings) + Inter (body)
3. Rollout: one full pass across all ~28 pages in a single session
4. Roadmap placeholders (CityView, ProofGraph, Infrastructure Intelligence): "Coming soon" teaser cards

## Architecture
- Frontend: React 18 (CRA + craco for `@/` path alias), Tailwind CSS with custom navy/status color tokens,
  react-router-dom v6, lucide-react icons, custom shadcn-style UI primitives (button/card/input/textarea/label).
- Backend: FastAPI + Motor (async MongoDB), minimal lead-capture API (`POST /api/leads`, `GET /api/leads/count`,
  `GET /api/health`). Follows PyObjectId/BaseDocument MongoDB adherence pattern.
- Database: MongoDB, `DB_NAME=clearrun_records`, collection `leads`.
- No third-party integrations used (no LLM, no payment, no auth) — pure UI/UX + lead capture build.

## Design System
- Colors: navy-950/900/800 (deep navy/slate), offwhite background, white cards, status colors
  (muted green=complete, muted amber=attention, muted red=incomplete, muted blue=review-ready).
- Fonts: Manrope (headings), Inter (body), loaded via Google Fonts.
- Shared components: PageHeader, EmptyState, RoadmapCard, DisclaimerBanner, CTASection, StatCard, StatusBadge.
- All interactive elements have `data-testid` attributes.

## Pages Implemented (28 routes + NotFound)
Home (/), /try-free, /proof-mockup, /checklist, /comparison, /dashboard, /proof, /proof/:id, /recovery,
/import, /export, /pilot (+ /trial alias), /requests, /customer (+ /restaurant alias), /pricing,
/compatibility, /objections, /resources, /partners, /field, /trust, /audit, /disposal, /reviewer,
/city-export, /cityview, /proofgraph, /intelligence, and a NotFound catch-all.

## What's Been Implemented (as of Feb 2026)
- Full site built from scratch: navbar with 4 dropdown groups, mobile responsive hamburger nav, footer.
- All 28 pages built with realistic mock data (proof packets, requests, audit log, disposal certs,
  restaurants, pricing tiers, checklist, comparison table, compatibility list, objections/FAQ, resources).
- Lead capture forms (trial, mockup, pilot, partner) wired to real backend API, persisting to MongoDB.
- Report-grade Proof Packet detail page with copy-link, export link, photo evidence grid, audit history.
- 3 future-module roadmap pages (CityView, ProofGraph, Infrastructure Intelligence) as polished
  "coming soon" placeholders with explicit "not yet built" disclaimers.
- Legal-safe disclaimers throughout (no compliance/certification/city-approval claims).
- Testing pass (iteration 1) completed: 9/9 backend pytest cases passing, ~25 frontend routes tested.
  3 bugs found & fixed: (1) MongoDB `_id` leak in lead API response (added `response_model_by_alias=False`),
  (2) uncaught clipboard error crashing Proof Detail page (added try/catch + execCommand fallback),
  (3) roadmap card title contrast bug — dark text on dark background (added explicit `text-white`).

## QA & Strategy Alignment Pass (Feb 2026)
Full audit performed per explicit request — no new features added, feature development frozen.
- Replaced all demo data with one consistent fictional company: hauler "Peach State Grease Services"
  (+ secondary hauler "Southern Route Liquid Waste") serving 10 named facilities across Macon/Warner
  Robins/Perry, GA (Central Georgia). Removed old disconnected "Millbrook, OH" / "Riverside Bistro" set.
- Added buyer-clarity strip (Who it's for / What it solves / Why not spreadsheets) to Pricing page.
- Broadened Resources page copy to explicitly mention liquid-waste + future septic/portable sanitation.
- Added a bottom CTA band (Start Free Records Trial / Get a Free Proof Packet Mockup) to Dashboard,
  Proof Detail, and Partners pages for full CTA consistency across all 10 explicitly-audited pages.
- Backend hardening: fixed MongoDB `_id` leak (response_model_by_alias=False), added 24h idempotent
  duplicate-lead guard (same email+lead_type returns existing record instead of creating a duplicate),
  wrapped Mongo writes in try/except with a safe 500 response instead of an uncaught error.
- Verified: no "ProofOps" naming, no lorem ipsum, no fake certification/compliance/city-approval claims
  anywhere; all disclaimers use the approved legal-safe wording; all 28 routes return 200 with real content;
  mobile QA passed on homepage, try-free, proof-mockup, pricing, comparison, proof detail, dashboard,
  recovery, import/export, and trust pages.

## Feature: Resend Email Confirmation + Internal Notification (Feb 2026)
Added transactional email on the 4 lead-capture forms (Try Free, Proof Packet Mockup, Pilot, Partners):
- New `/app/backend/email_service.py` — sends a lead confirmation + internal owner notification via
  Resend, fired via FastAPI `BackgroundTasks` (never blocks the HTTP response).
- New env vars: `EMAIL_ENABLED` (default `false`), `RESEND_API_KEY` (empty by default — no account yet),
  `RESEND_FROM_EMAIL` (defaults to Resend sandbox sender `onboarding@resend.dev`),
  `CLEAR_RUN_OWNER_EMAIL` (set to the address provided by the user).
- Fixed a real bug found during implementation: `email_service` was being imported before
  `load_dotenv()` ran in `server.py`, so env vars silently failed to load — fixed by having
  `email_service.py` load its own `.env` at import time.
- Fully fails safe: disabled/unconfigured/failed sends never affect lead saving (17/17 backend tests
  passing, including 7 new email-specific unit tests with a mocked Resend client).
- No real Resend account configured yet — `EMAIL_ENABLED=false` by default. See README.md "Email Setup
  Notes" for activation steps once a Resend API key + (optionally) verified domain are available.

## Feature: Lead Capture Completion + Admin Lead Inbox (Feb 2026)
Expanded lead forms to capture real buyer-qualification data + built an internal admin inbox:
- New form components: `LeadQualificationForm.jsx` (Try Free + Pilot — business/contact/email/
  phone/service_type/current_workflow/trucks/accounts/optional file+notes), `MockupRequestForm.jsx`
  (Proof Mockup — reduced field set), `PartnerInquiryForm.jsx` (Partners — partner_type/service_area).
  Shared `useLeadSubmit` hook + `Select` UI primitive + `LeadFormSuccess`. Old generic
  `LeadCaptureForm.jsx` removed (fully replaced).
- Backend `LeadSubmission`/`LeadSubmissionCreate` models expanded with `current_workflow`,
  `number_of_trucks`, `active_customer_accounts`, `partner_type`, `service_area`, `notes`,
  `source_page`, `status` (default `"New"`). Legacy `message` field kept only for backward
  compatibility with pre-existing documents.
- New admin endpoints: `GET /api/admin/leads` (list, no auth yet) and
  `PATCH /api/admin/leads/{id}/status` (validated against the 6 lead statuses).
- New `/admin/leads` page — filterable/searchable lead table, inline status updates, CSV export,
  clearly labeled "Internal demo view — protect before production launch" (no auth exists yet).
  Discoverable via a small footer link, not the main nav.
- `email_service.py` internal notification now shows real values for newly-captured fields, with
  a per-lead-type relevance map producing "Not applicable" (field not collected by that form) vs
  "Not provided" (collected but left blank) — replacing the old "Not captured in current form".
- Env safety: added `.gitignore` (was missing) + `backend/.env.example` + `frontend/.env.example`;
  confirmed `.env` was never committed to git history.
- 26/26 backend tests passing (10 new tests added: 3 field-saving tests per lead type, admin list/
  status-update/invalid-status/404 tests, and a legacy-document backward-compatibility test).

## Feature: Admin Protection + Production Safety Lockdown (Feb 2026)
Secured the previously unauthenticated `/admin/leads` dashboard with a lightweight shared-secret key:
- Backend: `verify_admin_access()` FastAPI dependency (via `integration_playbook_expert_v2` playbook)
  using `APIKeyHeader("X-Admin-Key", auto_error=False)`. Returns 401 if header missing, 403 if wrong
  key or `ADMIN_ACCESS_ENABLED`/`ADMIN_ACCESS_KEY` not set. Applied via a dedicated
  `admin_router = APIRouter(prefix="/api/admin", dependencies=[Depends(verify_admin_access)])` so any
  future `/api/admin/*` route inherits protection automatically. `GET /leads` and
  `PATCH /leads/{id}/status` moved onto this router. Key is never logged or echoed in responses.
- New env vars: `ADMIN_ACCESS_ENABLED=true`, `ADMIN_ACCESS_KEY` (freshly generated, rotated from the
  one shared mid-session per security best practice), `ADMIN_SESSION_TTL_HOURS=4`.
- Frontend: `/admin/leads` now shows an `AdminAccessGate` screen first (no lead data fetched/rendered
  before a key is verified via a live API call). On success the key is stored only in `sessionStorage`
  (never localStorage, never a public env var) via new `lib/adminAuth.js` helper, with a soft
  client-side TTL (`REACT_APP_ADMIN_SESSION_TTL_HOURS`). Any later 401/403 from an admin call clears
  the stored key and re-shows the gate. Removed the public footer link ("Internal: Admin Lead Inbox")
  entirely — the admin page is no longer discoverable from any nav/footer.
- Honeypot: added a hidden `hp_website` field (`HoneypotField.jsx`, `data-testid=hp-website-field`) to
  the 3 public lead forms (`LeadQualificationForm`, `MockupRequestForm`, `PartnerInquiryForm`).
  Validated server-side only: if `POST /api/leads` receives a non-empty `hp_website`, the backend
  returns a fake 201 success (so bots get no signal) but never persists the lead or fires emails.
- Testing: 32/32 backend pytest tests passing (6 new admin-protection tests + 2 new honeypot tests
  added to `test_leads.py`), full Playwright pass on gate (correct/wrong key), footer, and honeypot
  invisibility — zero bugs found (see `/app/test_reports/iteration_2.json`).

## Prioritized Backlog
- P1: Real PDF/CSV generation for Import/Export flows (currently clearly-labeled UI-only demo flows).
- P1: Real photo upload/storage for Field Capture and Proof Packet photo evidence (currently icon placeholders).
- P2: Real Resend account/domain setup (currently `EMAIL_ENABLED=false`, sandbox sender only).
- P2: Deeper interaction testing of Field, Requests, Customer, Disposal, Audit pages (loaded fine, not
  deeply interaction-tested per iteration 1 report).
- P3: CityView/ProofGraph/Infrastructure Intelligence — full build-out when prioritized (currently roadmap
  placeholders per explicit instruction not to build these yet).
- P3: If the product moves from single shared admin key to multiple internal operators, migrate to
  proper per-user auth (OAuth2/JWT) — current key model is intentionally lightweight/internal-only.

## Test Credentials
No end-user login exists (all marketing pages are public). Admin dashboard is now key-gated —
see `/app/memory/test_credentials.md` for the current `ADMIN_ACCESS_KEY` and usage.
