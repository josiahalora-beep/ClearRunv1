# PR15: Route-Level Exception Intelligence

## Internal objective

Build the route-level decision layer that combines active operating problems and after-service ticket problems without turning ClearRun into routing, GPS, telematics, fleet-maintenance, billing, or disposal-facility software.

The internal architecture is called **Route-Level Exception Intelligence**.

The visible operator screen is called **Route Review**.

The product must answer:

1. Which stops need dispatch or customer action now?
2. Which completed tickets still need office review?
3. Which tickets are not ready to close?
4. Which issue should the office work first?
5. Is the disposal receipt attached, missing, or in need of matching?
6. Which issue has repeated enough times to deserve a process change?

## Product boundary

ClearRun organizes route issues, ticket backup, ownership, follow-up, and ready-to-close status beside the operator’s existing routing, dispatch, driver, accounting, and billing tools.

PR15 does not add:

- GPS tracking;
- map views;
- route optimization;
- automatic rerouting;
- telematics;
- driver capture;
- real message delivery;
- ROI input forms;
- disposal verification;
- disposal pricing or margins;
- employee scores;
- final billing judgments.

## Internal two-lane model

The data model maintains two connected internal lanes.

### Active route lane

Problems that may require action while the route is still operating:

- locked or unsafe access;
- customer unavailable;
- insufficient truck capacity;
- partial or failed service;
- customer contact needed;
- dispatch action needed;
- same-day rescheduling.

### Closeout lane

Problems found after or near service completion:

- missing signature;
- weak or missing photo;
- missing gallons;
- unmatched disposal receipt;
- incomplete invoice support;
- office review required;
- customer-ready record not assembled.

Both lanes feed the final question: **Is this stop and ticket ready to close?**

## Visible language contract

The working product must use operator language rather than internal product-category language.

Visible labels include:

- Route Review
- Needs Dispatch
- Needs Office Review
- Ticket Issue
- Route Issue
- What Needs Attention First
- Disposal Receipt Status
- Repeat Issue
- Assigned To
- Open For
- Next Step
- Before This Can Close
- Ready to Close
- Work History

Visible product copy must not expose:

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

The complete rule is defined in `docs/customer-facing-language-contract.md`.

## Route data model

The model includes:

- route definition;
- scheduled stops;
- completed stops without an issue;
- active-route issues;
- ticket closeout issues;
- service outcome;
- work status;
- priority label;
- assigned person;
- ticket backup summary;
- customer-contact status;
- logged delay minutes;
- ready-to-close status;
- billing-review flag;
- disposal receipt status;
- repeat-issue sample;
- recommended follow-up.

## Transparent priority order

1. Resolve Now
2. Same-Day Follow-Up
3. Closeout Blocked
4. Invoice Support Needed
5. Customer Response Needed
6. Proof Recovery
7. Internal Review
8. Resolved

No unexplained numerical score is used.

## Repeat-issue rule

A repeat issue appears only when the selected sample has:

- at least 3 observations; and
- at least 20% of the relevant records.

The interface displays:

- numerator;
- denominator;
- percentage;
- sample window;
- affected route, customer, truck, driver, or issue group;
- recommended follow-up.

The signal is not a compliance, risk, technician-quality, or employee-performance score.

## Operator-facing routes

Primary routes:

- `/route-review`
- `/route-review/:routeId`
- `/issues/:id`
- `/exceptions/:id` for existing ticket issues

Compatibility aliases may preserve older internal URLs, but customer-facing links must use the operator-facing routes.

## Route Review screen

The route page contains:

- route selector;
- route status using Action Needed Now, Needs Follow-Up, or Ready to Close;
- scheduled-stop count;
- completed-cleanly count;
- Needs Dispatch count;
- Needs Office Review count;
- logged delay;
- tickets not ready to close;
- one dominant “What needs attention first” action;
- Needs Dispatch work section;
- Needs Office Review work section;
- All Issues, Dispatch, and Office Review filters;
- disposal receipt status filter;
- Repeat Issue section;
- Disposal Receipt Status section;
- Route Closeout section;
- direct links to Route Issue details.

## Route Issue screen

The route-issue detail includes:

- what happened;
- route, truck, driver, customer, and reported time;
- service result;
- ticket status;
- logged delay;
- customer-contact status;
- ticket backup available;
- disposal receipt status;
- assigned person;
- next step;
- requirements before closeout;
- Ready to Close gate;
- work history;
- browser-only sample state.

The screen does not send a message, reroute a truck, confirm disposal, or make a final billing decision.

## Existing Ticket Issue screen

Existing PR14 ticket issues now use the same market-language standard:

- Ticket Follow-Up;
- What Is Missing;
- Billing Review;
- Customer Record;
- Assigned To;
- Ready-to-Close Requirement;
- Why This Ticket Needs Attention;
- Service Details;
- Disposal Receipt;
- Repeat Paperwork Issue;
- What Needs to Happen Next;
- Ready to Close?;
- Work History.

The older internal-language page is retained only as an unknown-ID fallback and is not used for normal ticket records.

## Dashboard integration

The dashboard presents:

- Office Closeout;
- tickets needing attention;
- held-from-billing count;
- oldest open issue;
- next steps ready;
- first issue to work;
- clear table columns using ticket, assigned person, open time, status, and ready-to-close requirement;
- a Route Review entry point;
- example office-time assumptions that are clearly labeled as examples.

## Automated QA

### Model tests

The Frontend Build workflow runs Jest before compilation.

Tests enforce:

- scheduled-stop reconciliation;
- completed-cleanly plus issue stops equals scheduled stops;
- route-closeout counts equal scheduled stops;
- disposal receipt counts equal scheduled stops;
- tickets-not-ready calculation;
- priority ordering;
- repeat-issue threshold;
- numerator, denominator, and percentage;
- receipt-status filtering.

### Playwright and visual QA

Playwright captures desktop, tablet, and mobile screenshots for:

- dashboard;
- Route Review;
- Route Issue detail;
- Ticket Issue detail;
- existing proof surfaces.

It verifies:

- business-critical visual anchors;
- Needs Dispatch and Needs Office Review sections;
- route selector;
- work filtering;
- disposal receipt filtering;
- route switching;
- detail click-through;
- ready-to-close gating;
- work history;
- no page-level horizontal overflow;
- blocking WCAG A/AA checks;
- visible product copy does not contain banned internal phrases.

### Lighthouse

The automated Lighthouse route list includes:

- `/route-review/warner-robins-route-b`;
- `/issues/EX-2101`;
- dashboard and existing core product pages.

## Guardrails

- All route data is fictional and labeled as sample or example data.
- Logged delay is not claimed as saved time.
- Billing-review status is not a final billing judgment.
- Disposal receipt status describes documentation only.
- No disposal verification or facility-pricing exposure.
- No employee or compliance scoring.
- No routing or telematics claims.
- No real messages, production storage, or automatic customer notifications.
- Internal strategy language stays in code and documentation, not visible product copy.

## Stop condition

Stop after PR15 is fully green and merged. Do not add driver capture, notification delivery, ROI calculation, maps, or integrations inside this PR.
