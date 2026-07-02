# Secret Rotation Checklist

Use this checklist before ClearRun Records is used with real customers, real lead
data, or any production deployment.

## Required Before Real Use

- Rotate the previously exposed admin access key outside the repo.
- Do not reuse any admin key that appeared in tracked files, screenshots, chat,
  issue text, pull request text, logs, or test reports.
- Treat historical GitHub commit history as potentially containing the old key,
  even after current files are cleaned.
- Store the new `ADMIN_ACCESS_KEY` only in the deployment environment or secret
  manager.
- Do not commit the old key, new key, Resend keys, MongoDB URIs, or real `.env`
  files.

## Admin Key Rotation

1. Generate a new random admin key in a password manager or secure shell.
2. Set the new value as `ADMIN_ACCESS_KEY` in the live backend environment.
3. Keep `ADMIN_ACCESS_ENABLED=true` for protected admin endpoints.
4. Restart or redeploy the backend so the new environment value is loaded.
5. Open `/admin/leads` and verify the old key no longer works.
6. Verify the new key works for the admin gate and `/api/admin/*` endpoints.
7. Share the new key only through the approved internal password manager.
8. Update any operator runbooks to say the key lives in the secret manager, not
   in GitHub.

## Repository History

- Current tracked files should not contain the exposed key after PR00.
- GitHub history may still contain the old key in prior commits.
- Rotation is mandatory because history cleanup alone is not enough protection.
- If this repository later needs public release or outside collaborators, review
  whether history rewrite or GitHub secret-scanning remediation is appropriate.

## Other Secrets

- Keep `backend/.env` and `frontend/.env` local-only.
- Keep `backend/.env.example` and `frontend/.env.example` placeholder-only.
- Add real Resend keys only in the deployment environment.
- Add real MongoDB connection strings only in the deployment environment.
- Rotate immediately if any secret appears in an issue, pull request, test report,
  browser screenshot, app log, or committed file.

## Verification

- Run a secret scan before every production release.
- Confirm `.env` files are ignored.
- Confirm `.env.example` files contain placeholders only.
- Confirm admin API responses never echo the provided or configured admin key.
- Confirm CI uses only dummy/test environment variables.
