# ClearRun Records

Field proof. Clear records.

ClearRun Records turns messy field service records into branded proof packets, missing-record
reports, billing-ready exports, and customer-ready proof links — starting with grease-trap / FOG
and liquid-waste service records.

## Stack
- Frontend: React 18 (CRA + craco), Tailwind CSS, react-router-dom
- Backend: FastAPI + Motor (async MongoDB)
- Database: MongoDB
- Email: Resend (transactional lead-confirmation + internal notification emails)

## Environment Variables

### Backend (`/app/backend/.env`)
| Variable | Required | Notes |
|---|---|---|
| `MONGO_URL` | Yes | MongoDB connection string |
| `DB_NAME` | Yes | Database name |
| `CORS_ORIGINS` | Yes | Comma-separated allowed origins, or `*` |
| `EMAIL_ENABLED` | No (default `false`) | Master safety switch. Must be `true` **and** `RESEND_API_KEY` set for any email to send. |
| `RESEND_API_KEY` | No | From resend.com → Dashboard → API Keys. Leave empty to keep email fully disabled. |
| `RESEND_FROM_EMAIL` | No | Sender shown to recipients, e.g. `ClearRun Records <hello@updates.yourdomain.com>`. Defaults to Resend's sandbox sender `onboarding@resend.dev`. |
| `CLEAR_RUN_OWNER_EMAIL` | No | Where internal "new lead" notification emails are sent. |

### Frontend (`/app/frontend/.env`)
| Variable | Notes |
|---|---|
| `REACT_APP_BACKEND_URL` | External URL the frontend uses to call the backend API. |

**Never hardcode secrets in source files** — all of the above must come from `.env`. Copy
`backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env` to get
started; both `.env` files are git-ignored and must never be committed.

## Email Setup Notes (Resend)

Email sending is **off by default** (`EMAIL_ENABLED=false`) until you provide a real Resend API key.
This is intentional — no sending domain is verified yet, so production email is not claimed as ready.

To turn it on:
1. Create a Resend account at https://resend.com and generate an API key (starts with `re_...`).
2. Set `RESEND_API_KEY` in `/app/backend/.env`.
3. **Sandbox mode (no domain yet):** leave `RESEND_FROM_EMAIL` as the default
   `ClearRun Records <onboarding@resend.dev>`. In this mode Resend will only deliver to the email
   address you signed up with on Resend — good for testing, not for real customer-facing use.
4. **Production:** verify a sending domain/subdomain in the Resend dashboard (e.g.
   `updates.yourdomain.com`), then set `RESEND_FROM_EMAIL=ClearRun Records <hello@updates.yourdomain.com>`.
5. Set `EMAIL_ENABLED=true`.
6. Restart the backend: `sudo supervisorctl restart backend`.

If `EMAIL_ENABLED` is `false`, or `RESEND_API_KEY` is missing, or a Resend send call fails for any
reason — lead form submissions **always still save to MongoDB and return success**. Email is
strictly best-effort and never blocks or breaks lead capture.

## Lead-Capture Forms & Email

Forms that trigger both a lead-confirmation email and an internal notification email (only for
brand-new submissions, not duplicates within a rolling 24-hour window per email+form):
- Try Free (`/try-free`, `lead_type=trial`)
- Free Proof Packet Mockup (`/proof-mockup`, `lead_type=mockup`)
- Pilot / Trial (`/pilot`, `lead_type=pilot`)
- Partners (`/partners`, `lead_type=partner`)

## Running Tests

```bash
cd /app/backend
REACT_APP_BACKEND_URL=<preview-url> python -m pytest tests/ -v
```
