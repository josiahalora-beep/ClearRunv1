# Test Credentials

No authentication is implemented in ClearRun Records. All pages (marketing, product-demo, and
roadmap pages) are public and require no login.

The only backend endpoints are:
- GET  /api/health
- POST /api/leads          (public lead-capture form submission — no auth required)
- GET  /api/leads/count    (public counter — no auth required)

No admin accounts, test users, or API keys were created for this build.

Note: `/admin/leads` (Admin Lead Inbox) also has no authentication yet — it is explicitly
labeled "Internal demo view — protect before production launch" on the page itself.
