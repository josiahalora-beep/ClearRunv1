# PR14: Exception Detail and Resolution Workflow

## Product objective

PR13 proved that ClearRun can display a pre-billing exception queue.

PR14 proves that an office team can work one exception through a controlled resolution flow:

1. Open the exception.
2. Inspect the blocker and operational impact.
3. Confirm or change the assigned owner.
4. Prepare the exact follow-up request.
5. Confirm each required proof item.
6. Keep release blocked until the required conditions are satisfied.
7. Release the ticket.
8. Preserve an activity history.

## Why this is higher value than a spreadsheet

A spreadsheet can list a missing item. ClearRun becomes harder to replace when it combines:

- blocker context
- assigned owner
- exception age
- action-ready follow-up
- required-proof checklist
- release gating
- supporting proof link
- activity history

The product is not claiming that it sends real messages, authorizes billing, verifies disposal, or stores production records yet. PR14 demonstrates the workflow and interaction model using fictional browser-only demo state.

## Routes and screens

### `/exceptions/:id`

New exception-resolution workspace with:

- current blocker
- billing-support and customer-proof state
- owner assignment
- release condition
- required-proof checklist
- editable follow-up message
- browser-only follow-up preparation
- release gate
- modeled time value
- activity timeline
- supporting proof-record link

### `/dashboard`

Priority exception and queue ticket links now open the resolution workspace.

### `/recovery`

Each queue card now separates:

- View Proof
- Resolve Exception

### `/proof/:id`

Proof records with a related exception now link back to the resolution workspace.

## Automated review upgrade

Visual review now includes `/exceptions/EX-1048` and verifies these business-critical anchors:

- `exception-detail-workflow`
- `exception-owner-select`
- `exception-followup-panel`
- `exception-release-button`
- `exception-activity-timeline`

An additional Playwright test confirms:

- release starts disabled
- one completed proof item is insufficient
- all required proof items enable release
- clicking release changes the button to `Released`
- the activity timeline records `Ticket released`

## Guardrails

- Fictional demo data only
- Browser-only demo state
- No real message sending
- No real customer record storage
- No disposal verification
- No billing authorization
- No legal, compliance, certification, or inspection claims
- Modeled time savings are illustrative, not guaranteed
