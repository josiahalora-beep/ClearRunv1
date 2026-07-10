# PR15: Route-Level Exception Intelligence

## Objective

Build the route-level decision page that combines active operational exceptions and closeout exceptions without turning ClearRun into routing, telematics, fleet-maintenance, or disposal-facility software.

The page must answer:

1. Which route records cannot be closed?
2. Which active disruptions need office action now?
3. Which exception pattern keeps repeating?
4. Which office action should happen first?
5. Is disposal backup attached, missing, or ambiguous?
6. Which observed problems may delay service, closeout, invoice support, or customer response?

## Product boundary

ClearRun is the intelligence and resolution layer for route exceptions that prevent service records, routes, and invoices from being cleanly closed.

PR15 does not add:

- GPS tracking;
- map views;
- route optimization;
- automatic rerouting;
- telematics;
- driver capture;
- ROI forms;
- disposal verification;
- employee scores;
- final billing judgments.

## Two connected lanes

### Active Route Exceptions

Operational disruptions that may require same-day action while the route is operating:

- blocked or unsafe access;
- customer unavailable;
- insufficient truck capacity;
- partial or failed service;
- customer or dispatch action required.

### Closeout Exceptions

Evidence and review problems discovered after or near service completion:

- missing signature;
- weak or missing photo;
- missing gallons;
- unmatched disposal receipt;
- incomplete invoice support;
- office review required.

Both lanes feed the final closeout question: can the stop and route be cleanly closed?

## Route intelligence model

The model includes:

- route definition;
- scheduled stops;
- clean completed stops;
- active and closeout exceptions;
- service outcome;
- resolution status;
- priority label;
- owner;
- evidence summary;
- customer-notification status;
- recorded delay minutes;
- closeout consequence;
- potentially-unbillable operational flag;
- disposal documentation status;
- recurring-pattern sample;
- recommended intervention.

## Transparent priority order

1. Resolve Now
2. Same-Day Follow-Up
3. Closeout Blocked
4. Invoice Support Needed
5. Customer Response Needed
6. Proof Recovery
7. Internal Review
8. Resolved

No unexplained score is used.

## Recurring-pattern rule

A recurring pattern must have:

- at least 3 observations; and
- at least 20% of the relevant sample.

The interface displays numerator, denominator, percentage, sample window, affected entities, and recommended intervention.

The signal is not a compliance, risk, technician-quality, or employee-performance score.

## Route page

Routes:

- `/route-intelligence`
- `/route-intelligence/:routeId`

The page contains:

- route header;
- reconciled operational counts;
- recorded-consequence strip;
- one dominant primary office action;
- Active Route lane;
- Closeout lane;
- route selector;
- lane filters;
- disposal-status filtering;
- recurring-pattern module;
- disposal-backup matrix;
- route-closeout summary;
- direct links to exception resolution.

## Exception resolution integration

Route-intelligence exceptions use the existing `/exceptions/:id` URL through an exception router.

Existing PR14 proof exceptions continue using the original exception workspace.

Route exceptions use a matching resolution workspace with:

- owner assignment;
- evidence requirements;
- editable next action;
- release gate;
- activity history;
- browser-only demo state;
- route and commercial context;
- claim-safe disclosures.

## Automated QA

### Model tests

The Frontend Build workflow now runs Jest before compilation.

Tests enforce:

- scheduled-stop reconciliation;
- clean stops plus exception stops equals scheduled stops;
- closeout-state counts equal scheduled stops;
- disposal-matrix counts equal scheduled stops;
- records-not-ready calculation;
- priority ordering;
- recurring threshold;
- numerator, denominator, and percentage;
- disposal filtering.

### Playwright and visual QA

Playwright captures desktop, tablet, and mobile screenshots for:

- route intelligence;
- route exception detail.

It verifies:

- business-critical visual anchors;
- both lanes;
- route selector;
- lane filtering;
- disposal filtering;
- route switching;
- detail click-through;
- release gating;
- activity history;
- claim-safe language;
- no page-level horizontal overflow;
- blocking WCAG A/AA checks.

### Lighthouse

The automated Lighthouse route list now includes:

- `/route-intelligence/warner-robins-route-b`;
- `/exceptions/EX-2101`.

## Guardrails

- All route data is fictional and labeled.
- Recorded delay is not claimed as saved time.
- Potentially unbillable is an operational review flag, not a final billing judgment.
- Disposal status describes documentation only.
- No disposal verification or pricing exposure.
- No employee or compliance scoring.
- No routing or telematics claims.
- No real messages, production storage, or automatic customer notifications.

## Stop condition

Stop after PR15 is fully green and merged. Do not add driver capture, notification delivery, ROI calculation, maps, or integrations inside this PR.
