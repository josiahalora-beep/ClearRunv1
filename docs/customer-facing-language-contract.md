# ClearRun Customer-Facing Language Contract

## Purpose

ClearRun may use technical architecture language in code, data models, tests, and internal planning documents. The visible product must use the language spoken by FOG, septic, liquid-waste, dispatch, route-desk, billing, and customer-service teams.

## Core rule

Do not expose internal strategy labels in the product UI when a clearer operator term exists.

## Approved operator language

Use terms such as:

- Route Review
- Route Issues
- Ticket Issue
- Route Issue Follow-Up
- Queue State
- Open Issues
- Completed Issues
- Completed Outcomes
- Reopened Work
- Needs Dispatch
- Needs Office Review
- Ready to Close
- Not Ready to Close
- Missing Ticket Backup
- Missing Signature
- Missing Stop Photo
- Gallons Need Review
- Disposal Receipt Missing
- Receipt Needs Matching
- Driver Follow-Up
- Customer Follow-Up
- Contact Progress
- Dispatch Contact
- Customer Contact
- Assigned To
- Open For
- Next Step
- Before This Can Close
- Ticket Backup
- Evidence Source
- Confirmed At
- Follow-Up Prepared
- Response Recorded
- Resolution Reason
- Final Ticket Status
- Complete Issue
- Reopen Issue
- Billing Review Needed
- Work History
- Repeat Issue
- What Needs Attention First
- How Completed Issues Ended

## Internal terms that should not appear in visible product copy

Unless required for a legal, technical, or administrative reason, do not show:

- Route Exception Intelligence
- Active Route Exceptions
- Closeout Exceptions
- Economic Impact Layer
- Operational Consequence
- Closeout Consequence
- Primary Office Action
- Resolution Gate
- Commercial Interpretation
- Disposal Backup Matrix
- Recurring Exception Pattern
- Claim-Safe Language
- Observed Demo Route Data
- Both Lanes
- Exception Resolution Workspace
- Workflow Engine
- State Machine
- Evidence Object
- Contact-State Mapping
- Resolution-State Transition
- Projection Layer
- Queue Projection
- Derived Record State
- Reconciliation Engine
- Computed Queue Object

## Translation examples

| Internal term | Visible product term |
|---|---|
| Route Exception Intelligence | Route Review |
| Active Route Exceptions | Needs Dispatch |
| Closeout Exceptions | Needs Office Review |
| Economic impact | Why this needs attention |
| Operational consequence | What this is holding up |
| Closeout consequence | Ticket status |
| Primary office action | What needs attention first |
| Resolution gate | Ready to close? |
| Disposal backup matrix | Disposal receipt status |
| Recurring exception pattern | Repeat issue |
| Evidence summary | Ticket backup |
| Evidence object | Supporting evidence |
| Evidence provenance | Evidence source |
| Contact state | Contact progress |
| Owner | Assigned to |
| Release condition | Before this can close |
| Resolution state | Final ticket status |
| Reopen transition | Reopen issue |
| Queue projection | Route Review |
| Computed issue state | Queue state |
| Resolved records | Completed outcomes |
| Reopened transition set | Reopened work |
| Reconciled totals | Route counts |

## Copy hierarchy

Visible screens should answer, in this order:

1. What is wrong?
2. Which ticket, stop, route, truck, driver, or customer is affected?
3. Is the issue open, completed, or reopened?
4. Who is assigned?
5. How long has it been open?
6. Who has been contacted?
7. What ticket backup exists or is missing?
8. What response was received?
9. What needs to happen next?
10. Why was the issue completed?
11. What is the final ticket status?
12. Is the ticket actually ready to close?

## Follow-up workflow language

Use these visible contact states:

- Not Needed
- Needed
- Attempted
- Reached

Use these visible final ticket statuses:

- Ready to Close
- Follow-Up Complete
- Rescheduled
- Closed Without Service
- Needs Billing Review

Do not label a prepared follow-up as sent. Do not label selected or described evidence as uploaded unless a real upload exists. Do not label an office status as a final billing decision.

## Queue-state language

Use these visible queue states:

- Open
- Completed
- Reopened
- All

### Open

Open means the issue still requires work. Reopened issues are also unresolved and must be included in open-work totals while retaining a distinct Reopened label.

### Completed

Completed means the issue has a recorded resolution reason, final ticket status, and completion time. It does not automatically mean:

- service was completed;
- the ticket supports billing;
- disposal was verified;
- the invoice was released;
- the customer was contacted;
- the ticket is ready to close.

### Reopened

Reopened means the same issue record returned to active work after completion. Do not create or imply a duplicate issue. Preserve the prior work history, evidence, reopen count, and prior outcome in the issue record.

## Issue completion versus ticket readiness

Always distinguish the completion of office work from the readiness of the ticket.

### Final statuses that can count as ready to close

- Ready to Close
- Closed Without Service

“Closed Without Service” may be administratively closeable while remaining non-billable. Do not present it as billable service.

### Final statuses that remain not ready to close

- Follow-Up Complete
- Rescheduled
- Needs Billing Review

A completed issue with one of these statuses must leave the open issue queue but remain in the route’s not-ready closeout total.

## Route-count language

Route counts must reconcile from the same visible issue records.

- Needs Dispatch counts unresolved active-lane issues.
- Needs Office Review counts unresolved closeout-lane issues.
- Completed Issues counts issues with recorded completion.
- Reopened counts unresolved issues that were previously completed.
- Open Issues includes fresh open issues and reopened issues.
- Tickets Not Ready uses final ticket status, not issue completion alone.
- Completed Cleanly excludes stops that have an issue history.
- A browser-reported issue should replace a clean sample stop when possible rather than silently inflating scheduled stops.

Do not show totals that require the user to infer why the queue and route summary disagree.

## Market-language guardrails

- Prefer “ticket,” “route,” “stop,” “driver,” “dispatch,” “billing,” “receipt,” “signature,” “photo,” “gallons,” “follow-up,” “response,” “assigned,” “open,” “completed,” “reopened,” and “ready to close.”
- Avoid abstract product-category language on working screens.
- Do not use vague health scores.
- Do not describe an employee, driver, or technician with a score.
- Do not present disposal-document status as disposal verification.
- Do not present a billing-review flag as a final billing decision.
- Do not present prepared follow-up text as a delivered message.
- Do not present browser-only evidence records as cloud uploads.
- Do not treat issue completion as invoice release.
- Do not remove reopened work from unresolved totals.
- Use “sample” or “example” when showing fictional or modeled data.

## Automated enforcement

The Playwright visual-review suite must scan the visible text on the dashboard, route review, route issue, and ticket issue screens and fail when banned internal phrases appear.

Route-issue and route-review tests must also verify that visible behavior distinguishes:

- prepared follow-up from sent communication;
- ticket backup from disposal verification;
- completed issue from final billing approval;
- completed issue from ready-to-close ticket;
- reopened issue from a new issue record;
- fresh open work from reopened work;
- issue totals from route closeout totals.

This contract applies to future PRs unless a later source-of-truth document explicitly replaces it.
