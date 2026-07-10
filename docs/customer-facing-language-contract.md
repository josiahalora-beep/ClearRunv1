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

## Copy hierarchy

Visible screens should answer, in this order:

1. What is wrong?
2. Which ticket, stop, route, truck, driver, or customer is affected?
3. Who is assigned?
4. How long has it been open?
5. Who has been contacted?
6. What ticket backup exists or is missing?
7. What response was received?
8. What needs to happen next?
9. Why was the issue completed?
10. What is the final ticket status?

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

## Market-language guardrails

- Prefer “ticket,” “route,” “stop,” “driver,” “dispatch,” “billing,” “receipt,” “signature,” “photo,” “gallons,” “follow-up,” “response,” “assigned,” and “ready to close.”
- Avoid abstract product-category language on working screens.
- Do not use vague health scores.
- Do not describe an employee, driver, or technician with a score.
- Do not present disposal-document status as disposal verification.
- Do not present a billing-review flag as a final billing decision.
- Do not present prepared follow-up text as a delivered message.
- Do not present browser-only evidence records as cloud uploads.
- Use “sample” or “example” when showing fictional or modeled data.

## Automated enforcement

The Playwright visual-review suite must scan the visible text on the dashboard, route review, route issue, and ticket issue screens and fail when banned internal phrases appear.

Route-issue tests must also verify that visible copy distinguishes:

- prepared follow-up from sent communication;
- ticket backup from disposal verification;
- completed issue from final billing approval;
- reopened issue from a new issue record.

This contract applies to future PRs unless a later source-of-truth document explicitly replaces it.
