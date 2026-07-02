# Test Credentials

No user login/auth is implemented in ClearRun Records. All marketing, product-demo, and
roadmap pages are public and require no login.

Public backend endpoints (no auth required):
- GET  /api/health
- POST /api/leads          (public lead-capture form submission)
- GET  /api/leads/count    (public counter)

## Admin access (shared-secret key, since Feb 2026)

`/admin/leads` (Admin Lead Inbox) and all `/api/admin/*` endpoints are now protected by a
shared-secret `X-Admin-Key` header. There are no user accounts — just one key.

- Current key (local/preview env, in `/app/backend/.env` as `ADMIN_ACCESS_KEY`):
  `PLYC-QCCZJd8WGWb71QmeOV8TUWee8aK-iDwIA8u-ho`
- Frontend usage: open `/admin/leads`, enter this key in the "Admin access key" gate screen.
  The key is stored only in `sessionStorage` for the current tab and is cleared automatically
  if the backend ever returns 401/403 (e.g. after rotation).
- Backend usage: send header `X-Admin-Key: <key>` on `GET /api/admin/leads` and
  `PATCH /api/admin/leads/{id}/status`.
- Toggle via `ADMIN_ACCESS_ENABLED=true/false` in `/app/backend/.env`.

**Production note:** This key was shared in agent chat during development — rotate it
(generate a new `ADMIN_ACCESS_KEY`) before/at real production deployment.
