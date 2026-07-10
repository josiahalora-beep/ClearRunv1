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

## V30.1 economic context

PR14 includes the fleet-economics ideas that strengthen exception resolution without turning ClearRun into route optimization, fleet maintenance, disposal-facility management, biodiesel software, or accounting software.

### Economic impact labels

Each exception can explain why the office should care through claim-safe operational labels:

- invoice support at risk
- customer response delayed
- driver or technician follow-up required
- disposal backup unclear
- route closeout blocked
- repeat paperwork effort
- record aging

The product does not invent dollar savings. Time and cost claims should use measured or user-entered inputs before being presented as ROI.

### Route context

The resolution workspace now associates the exception with fictional demo context for:

- route
- truck
- technician
- service date
- disposal load
- customer / record

This is context for resolving the exception. Fleet-wide route grouping belongs in the next Route-Level Exception Intelligence layer.

### Disposal backup status

The workspace can distinguish:

- disposal backup missing
- receipt present but unmatched
- attached at route/load level
- attached at job level
- office review required

ClearRun records whether backup is attached, missing, or ambiguous. It does not verify disposal and does not expose facility pricing or margins.

### Recurring proof gap

The workspace shows neutral observed counts such as:

`Observed in 4 of the last 9 fictional sample records.`

This is an operational pattern signal, not a compliance, technician, quality, or risk score.

## Why this is higher value than a spreadsheet

A spreadsheet can list a missing item. ClearRun becomes harder to replace when it combines:

- blocker context
- economic impact
- route, truck, and technician context
- disposal backup status
- recurring proof-gap observations
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
- economic impact labels
- route context
- disposal backup status
- recurring proof-gap signal
- owner assignment
- release condition
- required-proof checklist
- editable follow-up message
- browser-only follow-up preparation
- release gate
- manually labeled office-time estimate
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
- `exception-economic-impact`
- `exception-route-context`
- `exception-disposal-status`
- `exception-repeat-signal`
- `exception-followup-panel`
- `exception-release-button`
- `exception-activity-timeline`

Automated claim-safety checks confirm:

- economic impact is labeled as operational, not estimated dollars
- ClearRun says it does not verify disposal
- facility pricing is not exposed
- recurring proof language is not a compliance score

The release-gate interaction test confirms:

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
- No facility pricing or margin exposure
- No billing authorization
- No legal, compliance, certification, inspection, technician-quality, or risk-score claims
- Modeled time savings are illustrative, not guaranteed
