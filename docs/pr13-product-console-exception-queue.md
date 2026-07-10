# PR13: Product Console Exception Queue

## Strategic baseline

ClearRun Records is now the pre-billing exception queue for FOG and liquid-waste route-ticket backup.

The product value is not one proof packet. The value is making repeated route-ticket exceptions visible, assigned, aged, actionable, and tied to release conditions before billing support or customer proof use.

## Highest-value math

A $150/month add-on does not need to replace ServiceCore, FieldRoutes, QuickBooks, or dispatch software.

It needs to save enough office time and rework to justify the add-on price.

Example model:

- 60 monthly exceptions
- 8 minutes saved per exception
- $25/hour admin cost
- 60 × 8 = 480 minutes = 8 hours
- 8 × $25 = $200/month modeled value

Break-even for $150/month:

- $150 ÷ $25/hour = 6 hours
- 6 hours × 60 = 360 minutes
- 360 ÷ 8 minutes = 45 exceptions/month

This is illustrative math, not a guaranteed customer result. It guides product design: ClearRun must manage repeated exceptions, not just generate occasional packets.

## Product changes

### Dashboard

Converted the dashboard into a pre-billing exception console with:

- open exceptions
- held-from-billing count
- oldest blocker
- follow-ups ready
- priority exception card
- exception queue table
- release condition
- owner and age fields
- $150/month break-even model

### Recovery

Converted recovery into the work-queue screen with:

- ticket ID
- blocker
- owner
- age
- next follow-up
- release condition
- proof needed
- safe links to follow-up and proof detail

### Data

Added shared `routeExceptionQueue` demo data so the dashboard and recovery screen reflect the same product model.

## Visual QA upgrade

Updated automated visual review to include `/recovery` and business-critical visual anchors:

- `dashboard-priority-exception`
- `dashboard-exception-table`
- `dashboard-value-math`
- `recovery-item-EX-1048`
- `recovery-request-btn-EX-1048`

This makes visual QA catch product-value regressions, not only rendering/accessibility problems.

## Guardrails

- No compliance certification claims
- No legal verification claims
- No disposal verification claims
- No fake customer data
- No fake integrations or automation claims
- Demo math is labeled as illustrative
- ClearRun remains an add-on exception layer, not a field-service replacement
