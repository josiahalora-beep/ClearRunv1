# PR16: Fast Route Issue Capture

## Objective

Give a driver, dispatcher, route-desk employee, or office user a fast way to report what happened at a stop without forcing them through a long fleet-management form.

The visible workflow is:

1. Confirm the route and stop.
2. Choose what happened.
3. Record the service result.
4. Add a short note or photo.
5. Optionally record dispatch and customer follow-up details.
6. Submit the issue to Route Review.
7. Open the reported issue for normal follow-up and closeout.

## Business reason

PR15 made route issues visible and actionable. PR16 creates the upstream record that feeds that workflow.

The value is not a generic incident form. ClearRun must capture enough structured information to answer:

- what happened;
- which route, truck, driver, customer, stop, and service date are affected;
- whether service was completed;
- what ticket backup exists;
- whether dispatch was contacted;
- whether the customer needs follow-up;
- who should own the next step;
- whether the issue belongs in Needs Dispatch or Needs Office Review;
- what must happen before the ticket can close.

## Product boundary

PR16 does not add:

- GPS tracking;
- maps;
- automatic route or customer lookup from a production system;
- automatic rerouting;
- real photo upload or cloud storage;
- real notification delivery;
- driver authentication;
- telematics;
- disposal verification;
- final billing decisions;
- live production persistence;
- public speed claims.

The implementation uses fictional sample routes and browser-only storage.

## Operator-facing routes

- `/report-issue`
- `/report-issue/:routeId`
- `/route-review/:routeId?reported=:issueId`
- `/issues/:issueId`

## Visible terminology

Use:

- Report a Route Issue
- What happened at this stop?
- Confirm the Stop
- Choose What Happened
- Record the Service Result
- Add a Note or Photo
- Dispatch Contacted
- Customer Follow-Up
- Recommended Next Step
- Report Route Issue
- Just Reported
- Route Review
- Needs Dispatch
- Needs Office Review

Do not expose internal taxonomy, lane, rule-engine, or architecture language in the UI.

## Capture taxonomy

### Access problem

- Cannot access service area
- Customer unavailable
- Unsafe access condition
- Alley or service area blocked
- Trap covered or buried

### Service problem

- Could not finish service
- More truck capacity needed
- Equipment problem
- Wrong trap or interceptor
- Additional service needed

### Ticket backup problem

- Missing signature
- Missing or weak photo
- Gallons missing
- Service notes unclear
- Timestamp missing

### Disposal receipt problem

- Disposal receipt missing
- Receipt needs matching
- Disposal delay reported
- Disposal destination changed
- Receipt quantity needs review

### Customer or billing problem

- Customer disputes service
- Billing review needed
- Customer notification needed
- Stop needs rescheduling
- Office approval needed

## Service result

Issue type and service result remain separate.

Allowed visible results:

- Completed
- Completed with missing backup
- Partially completed
- Not completed
- Rescheduled
- Customer cancelled
- Needs office review

This separation prevents a ticket-backup issue from being confused with a failed service stop.

## Required first-report fields

Required:

- route;
- customer or site;
- issue choice;
- service result;
- short note or at least one selected photo.

Prefilled from the selected sample route:

- route;
- truck;
- driver.

Optional:

- stop or ticket number;
- dispatch-contacted status;
- customer-follow-up status;
- logged delay minutes;
- operator-entered recommended next step.

## Evidence behavior

The demo accepts image selection through a file input, but it stores only:

- photo count;
- photo filenames during the current form state;
- an evidence summary on the browser-only issue record.

It does not upload, retain, transmit, or display the image contents.

Submission requires either:

- a non-empty note; or
- one or more selected photos.

## Transparent mapping rules

The selected issue maps to:

- Needs Dispatch or Needs Office Review;
- priority label;
- assigned team;
- suggested next step;
- requirement before closeout;
- disposal receipt status;
- billing-review wording.

Examples:

| Visible issue | Work section | Priority | Assigned to |
|---|---|---|---|
| Cannot access service area | Needs Dispatch | Resolve Now | Dispatch |
| Unsafe access condition | Needs Dispatch | Resolve Now | Operations manager |
| More truck capacity needed | Needs Dispatch | Same-Day Follow-Up | Dispatch |
| Missing signature | Needs Office Review | Closeout Blocked | Route desk |
| Gallons missing | Needs Office Review | Invoice Support Needed | Billing |
| Disposal receipt missing | Needs Office Review | Closeout Blocked | Billing |
| Customer disputes service | Needs Office Review | Customer Response Needed | Customer service |

A service result of Partially Completed, Not Completed, Rescheduled, or Customer Cancelled keeps the issue in Needs Dispatch even if the chosen problem normally belongs to office review.

No unexplained numerical score is used.

## Browser-only issue record

Submitted records include:

- generated issue ID;
- generated sample ticket ID;
- route ID and route name;
- truck;
- driver;
- customer or site;
- stop or ticket number;
- service date;
- reported time;
- issue group and issue choice;
- service result;
- work section;
- priority;
- assigned team;
- age label;
- ticket-backup summary;
- operator note;
- dispatch-contacted status;
- customer-follow-up status;
- logged delay;
- suggested next step;
- requirement before closeout;
- billing-review wording;
- disposal receipt status;
- browser-demo source label.

The newest 25 browser-reported issues are retained in local storage.

## Route Review integration

After submission:

1. The user is redirected to the selected Route Review.
2. A success banner confirms that the issue was added.
3. The issue appears in Needs Dispatch or Needs Office Review.
4. The issue receives a Just Reported marker.
5. Route Review metrics include the browser-reported issue.
6. The success banner links directly to the issue.
7. The issue opens in the existing Route Issue follow-up screen.

## Desktop design

- Two-column layout.
- Main form on the left.
- Sticky completion and submit card on the right.
- Large, touch-friendly issue choices.
- Optional dispatch and customer fields collapsed under a disclosure.
- Premium office-workflow styling consistent with PR15.

## Mobile design

- Single-column layout.
- Route context first.
- Issue categories and choices stack vertically.
- Service-result buttons remain touch-friendly.
- Note and photo controls stack.
- Completion card follows the form content.
- No page-level horizontal overflow.

## Automated model tests

Jest verifies:

- required-field validation;
- note-or-photo evidence requirement;
- route, truck, and driver defaults;
- access problem mapping;
- ticket-backup mapping;
- photo-only evidence;
- browser-only save and read behavior.

## Automated interaction tests

Playwright verifies:

- report screen and required visual anchors;
- operator-facing wording;
- blocking Axe checks;
- desktop, tablet, and mobile screenshots through the existing project matrix;
- prefilled route, truck, and driver;
- disabled submit before required work is complete;
- note evidence enables submit;
- photo evidence enables submit without a note;
- submission redirects to Route Review;
- success banner appears;
- reported issue appears in the correct work section;
- Just Reported marker appears;
- issue-detail click-through works;
- no page-level horizontal overflow.

## Lighthouse

The automated Lighthouse review includes:

- `/report-issue/warner-robins-route-b`.

## Claims and safety guardrails

- Do not claim the form takes a guaranteed number of seconds.
- “Fast first report” is a design description, not a measured performance claim.
- Do not claim selected photos are uploaded or retained.
- Do not claim dispatch or customers are contacted.
- Do not claim GPS, arrival, departure, or geofence data exists.
- Do not claim an issue is legally sufficient documentation.
- Do not claim disposal is verified.
- Do not claim a billing-review flag is a final billing decision.
- Do not claim the workflow reroutes a truck.

## Stop condition

Stop after the browser-only capture flow, Route Review placement, issue-detail click-through, unit tests, visual tests, accessibility checks, Lighthouse review, and Vercel preview are green.

Do not add real uploads, notifications, production storage, authentication, maps, telematics, or integrations in PR16.
