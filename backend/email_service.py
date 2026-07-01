"""
Email notifications for ClearRun Records lead-capture forms (Try Free, Proof Packet
Mockup, Pilot, Partner). Uses Resend. Designed to fail safely: if email is disabled,
unconfigured, or the send itself errors, lead submission must never be affected -
callers should treat this module as fire-and-forget (invoked via FastAPI BackgroundTasks).
"""
import os
import logging
import asyncio
from pathlib import Path
import resend
from dotenv import load_dotenv

# Load env vars here too (not just in server.py) so this module's config is correct
# regardless of import order relative to server.py's own load_dotenv() call.
load_dotenv(Path(__file__).parent / ".env")

logger = logging.getLogger(__name__)

EMAIL_ENABLED = os.environ.get("EMAIL_ENABLED", "false").lower() == "true"
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
RESEND_FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "ClearRun Records <onboarding@resend.dev>")
CLEAR_RUN_OWNER_EMAIL = os.environ.get("CLEAR_RUN_OWNER_EMAIL", "")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

LEAD_TYPE_LABELS = {
    "trial": "Free Records Trial",
    "mockup": "Free Proof Packet Mockup",
    "pilot": "Pilot Program",
    "partner": "Partner Inquiry",
}

# Lead types that should trigger lead + internal notification emails.
EMAIL_TRIGGERING_LEAD_TYPES = {"trial", "mockup", "pilot", "partner"}

SOURCE_FORM_BY_LEAD_TYPE = {
    "trial": "/try-free",
    "mockup": "/proof-mockup",
    "pilot": "/pilot",
    "partner": "/partners",
}


def is_email_configured() -> bool:
    """True only when EMAIL_ENABLED=true AND a Resend API key + from-address are set."""
    return EMAIL_ENABLED and bool(RESEND_API_KEY) and bool(RESEND_FROM_EMAIL)


def _confirmation_html(lead) -> str:
    label = LEAD_TYPE_LABELS.get(lead.lead_type, lead.lead_type)
    first_name = (lead.name or "there").strip().split(" ")[0] or "there"
    return f"""
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0F172A;max-width:560px;margin:0 auto;line-height:1.6;">
      <p>Hi {first_name},</p>
      <p>Thanks for reaching out to ClearRun Records.</p>
      <p>We received your request for <strong>{label}</strong>.</p>
      <p>ClearRun Records helps turn service records, manifests, photos, signatures, and disposal receipts
      into clean proof packets, missing-record reports, billing-ready exports, and customer-ready proof links.</p>
      <p><strong>Next step:</strong><br/>
      We'll review your submission and follow up with the next step for your free records trial or proof packet mockup.</p>
      <p>If you uploaded or referenced a sample record, we'll use it only to prepare your ClearRun proof example.</p>
      <p style="font-size:12px;color:#64748B;">ClearRun helps organize service proof and record visibility.
      It does not certify legal compliance or guarantee inspection outcomes.</p>
      <p>— ClearRun Records<br/><em>Field proof. Clear records.</em></p>
    </div>
    """.strip()


def _internal_notification_html(lead, is_duplicate: bool, source_form: str) -> str:
    rows = [
        ("Lead type", LEAD_TYPE_LABELS.get(lead.lead_type, lead.lead_type)),
        ("Business name", lead.business_name or "Not provided"),
        ("Contact name", lead.name),
        ("Email", lead.email),
        ("Phone", lead.phone or "Not provided"),
        ("Service type", lead.service_type or "Not provided"),
        ("Current software/workflow", "Not captured in current form"),
        ("Number of trucks", "Not captured in current form"),
        ("Active customer accounts", "Not captured in current form"),
        ("Notes", lead.message or "Not provided"),
        ("Created", lead.created_at.isoformat() if lead.created_at else "Unknown"),
        ("Submission status", "Duplicate (within 24h window)" if is_duplicate else "New"),
        ("Source form/page", source_form),
    ]
    rows_html = "".join(
        f"<tr><td style='padding:4px 14px 4px 0;color:#64748B;font-weight:600;white-space:nowrap;'>{k}</td>"
        f"<td style='padding:4px 0;color:#0F172A;'>{v}</td></tr>"
        for k, v in rows
    )
    return f"""
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0F172A;">
      <p>New ClearRun Records lead submitted.</p>
      <table style="border-collapse:collapse;">{rows_html}</table>
    </div>
    """.strip()


def _send_sync(to_email: str, subject: str, html: str):
    resend.Emails.send({
        "from": RESEND_FROM_EMAIL,
        "to": [to_email],
        "subject": subject,
        "html": html,
    })


async def send_lead_emails(lead, is_duplicate: bool) -> None:
    """
    Send a confirmation email to the lead and an internal notification email to
    CLEAR_RUN_OWNER_EMAIL. Only runs for the 4 form types that should trigger email
    (trial/mockup/pilot/partner), skips duplicate submissions, and never raises -
    all failures are caught and logged (without secrets) so the caller (a
    BackgroundTask fired after the HTTP response) can't affect lead submission.
    """
    if lead.lead_type not in EMAIL_TRIGGERING_LEAD_TYPES:
        return

    if is_duplicate:
        logger.info("Skipping lead emails: duplicate submission within 24h window (lead_type=%s)", lead.lead_type)
        return

    if not is_email_configured():
        logger.info(
            "Skipping lead emails: EMAIL_ENABLED=%s, resend_api_key_set=%s",
            EMAIL_ENABLED, bool(RESEND_API_KEY),
        )
        return

    label = LEAD_TYPE_LABELS.get(lead.lead_type, lead.lead_type)
    business = lead.business_name or "Unknown business"
    source_form = SOURCE_FORM_BY_LEAD_TYPE.get(lead.lead_type, f"/{lead.lead_type}")

    try:
        await asyncio.to_thread(
            _send_sync,
            lead.email,
            "Your ClearRun Records request was received",
            _confirmation_html(lead),
        )
    except Exception:
        logger.error("Failed to send lead confirmation email (lead_type=%s)", lead.lead_type, exc_info=True)

    if not CLEAR_RUN_OWNER_EMAIL:
        logger.info("Skipping internal notification email: CLEAR_RUN_OWNER_EMAIL not set")
        return

    try:
        await asyncio.to_thread(
            _send_sync,
            CLEAR_RUN_OWNER_EMAIL,
            f"New ClearRun Records lead: {label} — {business}",
            _internal_notification_html(lead, is_duplicate, source_form),
        )
    except Exception:
        logger.error("Failed to send internal lead notification email (lead_type=%s)", lead.lead_type, exc_info=True)
