# Test Credentials

No end-user login/auth is implemented in ClearRun Records. Marketing,
product-demo, and roadmap pages are public and require no login.

Public backend endpoints (no auth required):
- GET /api/health
- POST /api/leads (public lead-capture form submission)
- GET /api/leads/count (public counter)

## Admin access

`/admin/leads` and all `/api/admin/*` endpoints are protected by a shared-secret
`X-Admin-Key` header when admin access is enabled. There are no tracked user
accounts in this MVP.

Do not store the real `ADMIN_ACCESS_KEY` in this file, README, test reports,
issue comments, pull request descriptions, screenshots, or any tracked file.

Local/preview setup:
- Put `ADMIN_ACCESS_ENABLED=true` in `backend/.env`.
- Put `ADMIN_ACCESS_KEY=<generate-a-new-random-secret>` in `backend/.env`.
- Open `/admin/leads` and enter that key in the admin gate screen.
- The frontend stores the key only in `sessionStorage` for the current tab.
- Send `X-Admin-Key: <key>` for backend admin calls such as
  `GET /api/admin/leads` and `PATCH /api/admin/leads/{id}/status`.

Production note: rotate any admin key that was previously shared or committed
outside the repo before using this project with live customer data.
