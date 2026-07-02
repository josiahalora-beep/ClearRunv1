# AGENTS.md - ClearRun Records

## Project

ClearRun Records is a field-proof records platform for regulated service work,
starting with grease-trap / FOG and liquid-waste service records.

Customer-facing name: ClearRun Records
Tagline: Field proof. Clear records.

## Strategy

Big vision, small entry point, controlled build.

ClearRun Records turns messy field service records into branded proof packets,
missing-record reports, billing-ready exports, and customer-ready proof links.

Long-term vision: expand from grease-trap/liquid-waste records into septic,
portable sanitation, disposal confirmations, review-ready exports, municipal
visibility, ProofGraph, and infrastructure intelligence.

## Do Not Rebuild

This is an existing MVP. Preserve existing working routes, lead capture, admin
inbox, admin protection, email scaffold, and tests unless specifically asked to
change them.

## Customer-Facing Naming

Use:
- ClearRun
- ClearRun Records
- Field proof. Clear records.
- Proof Packet
- Proof Score
- Missing Records
- Missing-Record Recovery
- Billing-Ready Export
- Customer Proof Link
- Review-Ready Package

Avoid customer-facing:
- ProofOps

Never use:
- Convoura
- CleanClose
- roofing
- roofers
- homeowner
- quote room

## Legal-Safe Rules

Use:
"ClearRun helps organize service proof and record visibility. It does not
certify legal compliance or guarantee inspection outcomes."

Do not claim:
- certified compliance
- guaranteed compliance
- EPA approval
- city approval
- SOC 2 certification
- CROMERR certification
- official integrations
- marketplace behavior
- employee surveillance
- disposal pricing intelligence

Use "works beside," "import/export compatible," and "QuickBooks-compatible CSV"
only when accurate.

## Security Rules

Do not commit secrets.

Never commit:
- real `.env`
- admin keys
- API keys
- database URIs
- Resend keys
- production credentials

Only commit `.env.example` with placeholders.

Admin endpoints must require admin protection when enabled. Do not expose lead
data publicly.

Do not log or return admin keys.

## Commands

Backend tests:
```bash
cd backend
python -m pytest tests/ -v
```

Frontend build:
```bash
cd frontend
npm install
npm run build
```

Frontend tests:
```bash
cd frontend
npm test
```

## Visual Quality

The product should look like premium B2B vertical SaaS:
- deep navy/slate
- off-white backgrounds
- clean white cards
- muted status colors
- strong typography
- premium spacing
- mobile responsive
- report-grade proof packet design

Avoid:
- generic templates
- childish gradients
- neon colors
- fake testimonials
- fake certification badges
- random stock imagery

## Workflow

Work one PR/task at a time.

Before changes:
1. inspect relevant files
2. understand current behavior
3. run or identify relevant tests when practical

After changes:
1. run backend tests if backend changed
2. run frontend build if frontend changed
3. run lint/typecheck if available
4. check for forbidden language if copy changed
5. check for secret exposure if env/security changed

Do not start the next PR without approval.

## Final Response Format

PR Completed:
- PR number:
- PR name:

Summary:
-

Files changed:
-

Routes/screens changed:
-

Backend changes:
-

Frontend changes:
-

Security/trust review:
-

Visual/UX review:
-

Checks run:
- backend pytest:
- frontend build:
- lint/typecheck:
- manual route QA:
- forbidden language search:
- secret scan:

Known limitations:
-

Next recommended PR:
-

STOP MESSAGE:
PR [number] is complete and checked. I am stopping here. I will not start the
next PR until you approve it.
