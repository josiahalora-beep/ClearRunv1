"""
Unit tests for email_service.py - the Resend email dispatch used by lead-capture forms.
These test the module's internal logic directly (with monkeypatched config + a mocked
Resend client) rather than over HTTP, since email config is loaded once at backend
process startup and can't be flipped per-request in a black-box HTTP test.
"""
import types
from datetime import datetime, UTC
from unittest.mock import patch, MagicMock

import pytest

import email_service
from models import LeadSubmission


def make_lead(lead_type="trial", **overrides):
    data = dict(
        id="507f1f77bcf86cd799439011",
        lead_type=lead_type,
        name="Jordan Reyes",
        business_name="Peach State Grease Services",
        email="jordan@example.com",
        phone="555-0100",
        service_type="Grease trap / FOG",
        current_workflow="Spreadsheet",
        number_of_trucks="3",
        active_customer_accounts="25",
        notes="Looking to organize our records",
        created_at=datetime.now(UTC),
    )
    data.update(overrides)
    return LeadSubmission(**data)


@pytest.mark.asyncio
async def test_email_skipped_when_disabled(monkeypatch):
    monkeypatch.setattr(email_service, "EMAIL_ENABLED", False)
    monkeypatch.setattr(email_service, "RESEND_API_KEY", "")
    with patch("email_service.resend.Emails.send") as mock_send:
        await email_service.send_lead_emails(make_lead(), is_duplicate=False)
        mock_send.assert_not_called()


@pytest.mark.asyncio
async def test_email_skipped_when_api_key_missing(monkeypatch):
    monkeypatch.setattr(email_service, "EMAIL_ENABLED", True)
    monkeypatch.setattr(email_service, "RESEND_API_KEY", "")
    with patch("email_service.resend.Emails.send") as mock_send:
        await email_service.send_lead_emails(make_lead(), is_duplicate=False)
        mock_send.assert_not_called()


@pytest.mark.asyncio
async def test_email_attempted_when_enabled_and_new(monkeypatch):
    monkeypatch.setattr(email_service, "EMAIL_ENABLED", True)
    monkeypatch.setattr(email_service, "RESEND_API_KEY", "re_test_key")
    monkeypatch.setattr(email_service, "CLEAR_RUN_OWNER_EMAIL", "owner@example.com")
    with patch("email_service.resend.Emails.send") as mock_send:
        mock_send.return_value = {"id": "email_123"}
        await email_service.send_lead_emails(make_lead(), is_duplicate=False)
        # One call for the lead confirmation, one for the internal notification.
        assert mock_send.call_count == 2
        recipients = [call.args[0]["to"][0] for call in mock_send.call_args_list]
        assert "jordan@example.com" in recipients
        assert "owner@example.com" in recipients


@pytest.mark.asyncio
async def test_email_not_sent_for_duplicate_submission(monkeypatch):
    monkeypatch.setattr(email_service, "EMAIL_ENABLED", True)
    monkeypatch.setattr(email_service, "RESEND_API_KEY", "re_test_key")
    monkeypatch.setattr(email_service, "CLEAR_RUN_OWNER_EMAIL", "owner@example.com")
    with patch("email_service.resend.Emails.send") as mock_send:
        await email_service.send_lead_emails(make_lead(), is_duplicate=True)
        mock_send.assert_not_called()


@pytest.mark.asyncio
async def test_email_failure_does_not_raise(monkeypatch):
    monkeypatch.setattr(email_service, "EMAIL_ENABLED", True)
    monkeypatch.setattr(email_service, "RESEND_API_KEY", "re_test_key")
    monkeypatch.setattr(email_service, "CLEAR_RUN_OWNER_EMAIL", "owner@example.com")
    with patch("email_service.resend.Emails.send", side_effect=Exception("Resend is down")):
        # Should complete without raising, even though both sends fail internally.
        await email_service.send_lead_emails(make_lead(), is_duplicate=False)


@pytest.mark.asyncio
async def test_internal_notification_payload_includes_required_fields(monkeypatch):
    monkeypatch.setattr(email_service, "EMAIL_ENABLED", True)
    monkeypatch.setattr(email_service, "RESEND_API_KEY", "re_test_key")
    monkeypatch.setattr(email_service, "CLEAR_RUN_OWNER_EMAIL", "owner@example.com")
    lead = make_lead(
        lead_type="partner",
        business_name="Peach State Grease Services",
        partner_type="Hood cleaning company",
        service_area="Central Georgia",
        phone=None,
        service_type=None,
        current_workflow=None,
    )
    with patch("email_service.resend.Emails.send") as mock_send:
        await email_service.send_lead_emails(lead, is_duplicate=False)
        internal_call = next(c for c in mock_send.call_args_list if c.args[0]["to"] == ["owner@example.com"])
        subject = internal_call.args[0]["subject"]
        html = internal_call.args[0]["html"]
        assert "Partner Inquiry" in subject
        assert "Peach State Grease Services" in subject
        for expected in [
            "Jordan Reyes", "jordan@example.com",
            "Hood cleaning company", "Central Georgia",
            "Looking to organize our records", "New", "/partners",
        ]:
            assert expected in html
        # Fields irrelevant to a partner lead must show "Not applicable", not raw values.
        assert html.count("Not applicable") >= 3


@pytest.mark.asyncio
async def test_internal_notification_shows_not_provided_for_blank_relevant_fields(monkeypatch):
    monkeypatch.setattr(email_service, "EMAIL_ENABLED", True)
    monkeypatch.setattr(email_service, "RESEND_API_KEY", "re_test_key")
    monkeypatch.setattr(email_service, "CLEAR_RUN_OWNER_EMAIL", "owner@example.com")
    lead = make_lead(
        lead_type="trial",
        current_workflow=None,
        number_of_trucks=None,
        active_customer_accounts=None,
        phone=None,
    )
    with patch("email_service.resend.Emails.send") as mock_send:
        await email_service.send_lead_emails(lead, is_duplicate=False)
        internal_call = next(c for c in mock_send.call_args_list if c.args[0]["to"] == ["owner@example.com"])
        html = internal_call.args[0]["html"]
        # These are relevant to "trial" leads but left blank -> "Not provided", never
        # "Not captured in current form" and never "Not applicable".
        assert "Not captured in current form" not in html
        assert html.count("Not provided") >= 4


@pytest.mark.asyncio
async def test_proof_snapshot_email_includes_file_and_consent_fields(monkeypatch):
    monkeypatch.setattr(email_service, "EMAIL_ENABLED", True)
    monkeypatch.setattr(email_service, "RESEND_API_KEY", "re_test_key")
    monkeypatch.setattr(email_service, "CLEAR_RUN_OWNER_EMAIL", "owner@example.com")
    lead = make_lead(
        lead_type="proof_snapshot",
        source_page="/proof-snapshot",
        sample_file_name="ticket-photo.jpg",
        sample_file_type="image/jpeg",
        file_received=True,
        snapshot_status="Requested",
        consent_status="Review consent granted",
        deletion_requested=False,
    )
    with patch("email_service.resend.Emails.send") as mock_send:
        await email_service.send_lead_emails(lead, is_duplicate=False)
        internal_call = next(c for c in mock_send.call_args_list if c.args[0]["to"] == ["owner@example.com"])
        subject = internal_call.args[0]["subject"]
        html = internal_call.args[0]["html"]
        assert "Free Proof Snapshot" in subject
        for expected in [
            "ticket-photo.jpg", "image/jpeg", "Yes", "Requested",
            "Review consent granted", "/proof-snapshot",
        ]:
            assert expected in html


@pytest.mark.asyncio
async def test_non_form_lead_types_never_trigger_email(monkeypatch):
    monkeypatch.setattr(email_service, "EMAIL_ENABLED", True)
    monkeypatch.setattr(email_service, "RESEND_API_KEY", "re_test_key")
    with patch("email_service.resend.Emails.send") as mock_send:
        await email_service.send_lead_emails(make_lead(lead_type="checklist"), is_duplicate=False)
        mock_send.assert_not_called()
