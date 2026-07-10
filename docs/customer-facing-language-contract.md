# ClearRun Customer-Facing Language Contract

## Purpose

ClearRun may use technical architecture language in code, data models, tests, and internal planning documents. The visible product must use the language spoken by FOG, septic, liquid-waste, dispatch, route-desk, billing, and customer-service teams.

## Core rule

Do not expose internal strategy labels in the product UI when a clearer operator term exists.

## Approved operator language

Use terms such as:

- Route review
- Route issues
- Ticket issue
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
- Assigned To
- Open For
- Next Step
- Before This Can Close
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
| Owner | Assigned to |
| Release condition | Before this can close |

## Copy hierarchy

Visible screens should answer, in this order:

1. What is wrong?
2. Which ticket, stop, route, truck, driver, or customer is affected?
3. Who is assigned?
4. How long has it been open?
5. What ticket backup exists or is missing?
6. What needs to happen next?
7. Is the ticket ready to close?

## Market-language guardrails

- Prefer “ticket,” “route,” “stop,” “driver,” “dispatch,” “billing,” “receipt,” “signature,” “photo,” “gallons,” “follow-up,” and “ready to close.”
- Avoid abstract product-category language on working screens.
- Do not use vague health scores.
- Do not describe an employee, driver, or technician with a score.
- Do not present disposal-document status as disposal verification.
- Do not present a billing-review flag as a final billing decision.
- Use “sample” or “example” when showing fictional or modeled data.

## Automated enforcement

The Playwright visual-review suite must scan the visible text on the dashboard, route review, route issue, and ticket issue screens and fail when banned internal phrases appear.

This contract applies to future PRs unless a later source-of-truth document explicitly replaces it.
