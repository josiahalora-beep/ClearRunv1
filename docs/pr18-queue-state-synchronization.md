# PR18: Queue State Synchronization and Resolution Outcomes

## Objective

Connect PR17 issue-resolution work back to Route Review so the route queue, header counts, closeout counts, completed outcomes, and reopened work all derive from the same issue records.

PR18 closes this gap:

```text
Issue completed in detail view
→ issue leaves unresolved work
→ completed outcome appears in Route Review
→ route counts recalculate
→ final ticket status controls closeout readiness
→ reopened issue returns to unresolved work
→ prior evidence and history remain attached
```

## Scope

PR18 adds:

- a route queue projection model;
- combined built-in and browser-reported issues;
- saved PR17 workflow state applied to queue records;
- Open, Completed, Reopened, and All queue states;
- synchronized Needs Dispatch and Needs Office Review counts;
- synchronized completed and reopened counts;
- final ticket status in queue cards;
- resolution reason and completion time in completed cards;
- reopen count and preserved evidence in reopened cards;
- owner, contact, ticket-backup, final-outcome, lane, and receipt filters;
- completed-outcome summary;
- route closeout counts derived from final ticket state;
- tests that complete and reopen issues across screens.

PR18 does not add:

- a production database;
- multi-user synchronization;
- authentication;
- real-time server subscriptions;
- real messaging;
- real file upload;
- automatic invoice release;
- final billing approval;
- GPS or routing controls;
- disposal verification;
- facility pricing or margin data.

All changing state remains browser-only demo state.

## Authoritative projection

`frontend/src/data/routeQueueProjection.js` is the source of derived Route Review state.

It combines:

1. built-in sample issues from `routeIntelligenceData.js`;
2. browser-reported issues from `routeIssueCaptureData.js`;
3. per-issue workflow state from `issueResolutionWorkflow.js`.

The page must not manually add or subtract queue totals outside this model.

## Queue states

### Open

An issue is Open when:

- `workflow.resolved` is false; and
- `workflow.reopenedCount` is zero.

### Completed

An issue is Completed when:

- `workflow.resolved` is true.

Completed issues leave Needs Dispatch and Needs Office Review.

### Reopened

An issue is Reopened when:

- `workflow.resolved` is false; and
- `workflow.reopenedCount` is greater than zero.

Reopened issues:

- remain unresolved;
- count inside Open Issues;
- return to their original work lane;
- retain a distinct Reopened label;
- retain evidence confirmation;
- retain reopen count;
- retain work history;
- do not create a duplicate issue.

## Issue completion versus ticket readiness

Issue completion records that office follow-up reached an outcome. Ticket readiness is determined separately by final ticket status.

### Ready-to-close final statuses

- Ready to Close
- Closed Without Service

`Closed Without Service` is administratively closeable but must not be presented as billable completed service.

### Not-ready final statuses

- Follow-Up Complete
- Rescheduled
- Needs Billing Review

These issues leave unresolved queue work because the issue itself is complete, but the associated route record remains in the route’s not-ready total.

## Final-status mapping

| Final ticket status | Route closeout state |
|---|---|
| Ready to Close | Ready to Close |
| Closed Without Service | Ready to Close |
| Follow-Up Complete | Needs Review |
| Rescheduled | Follow-Up Needed |
| Needs Billing Review | Needs Review |

Unknown or empty completed states fall back to Needs Review.

## Disposal receipt projection

A completed issue with resolution reason `Disposal receipt matched` may project its receipt status as `Attached at route/load level`.

This means the office recorded a receipt relationship. It does not claim:

- physical disposal verification;
- legal sufficiency;
- facility attestation;
- facility pricing;
- facility margin visibility.

Other resolution reasons preserve the original receipt status.

## Contact progress projection

The queue derives one visible contact-progress label from Dispatch and Customer statuses.

Priority:

1. Needs contact — either contact is Needed.
2. Reached — no contact is Needed and at least one is Reached.
3. Attempted — no contact is Needed or Reached and at least one is Attempted.
4. Not needed — both contacts are Not Needed.

This summary does not replace the individual contact statuses in issue detail.

## Ticket-backup projection

Each issue receives one visible ticket-backup state:

- Needed — no required items are confirmed;
- Partial — some required items are confirmed;
- Ready — every required item has confirmation, source, and timestamp;
- Ready — no required items exist.

The card also shows the confirmed count and total requirement count.

## Route record reconciliation

### Scheduled stops

Base scheduled stops come from the sample route definition.

If issue count exceeds base scheduled stops, scheduled stops expand to the issue count so totals never become impossible.

### Browser-reported issues

A browser-reported issue is assumed to replace one previously clean sample stop while clean stops remain available.

Formula:

```text
completed cleanly = max(0, scheduled stops - total issue records)
```

This prevents a browser report from silently turning a 14-stop route into 15 records unless issue volume actually exceeds the base route size.

### Open issue count

```text
open issues = fresh open issues + reopened issues
```

### Lane counts

```text
Needs Dispatch = unresolved issues where lane = active
Needs Office Review = unresolved issues where lane = closeout
```

Completed issues do not remain in either lane.

### Reopened count

```text
Reopened = unresolved issues with reopenedCount > 0
```

Reopened is a subset of Open Issues.

### Completed issue count

```text
Completed Issues = issues where workflow.resolved = true
```

### Tickets not ready

```text
Tickets Not Ready = Scheduled Stops - Ready to Close records
```

Ready-to-close records include:

- clean records;
- completed issue records with final status Ready to Close;
- completed issue records with final status Closed Without Service.

### Closeout reconciliation

The sum of every closeout-state count must equal Scheduled Stops.

### Receipt reconciliation

The sum of every disposal-receipt-status count must equal Scheduled Stops.

## Route status

### Action Needed Now

Use when:

- the primary unresolved issue is Resolve Now; or
- at least one record still needs the defined billing-risk review.

### Needs Follow-Up

Use when:

- unresolved issues remain; or
- no unresolved issues remain but at least one ticket remains not ready to close.

### Ready to Close

Use only when:

- no unresolved issues remain; and
- every route record maps to Ready to Close.

## Primary action

The primary action uses unresolved issues only.

Sort order:

1. Reopened work before equivalent non-reopened work.
2. Existing transparent priority order.
3. Older issue before newer issue at equal priority.

When no unresolved issues remain, Route Review shows a no-open-issues completion state instead of linking to a completed issue as urgent work.

## Queue filters

### Queue state

- Open — fresh open plus reopened issues;
- Completed — completed issues only;
- Reopened — reopened issues only;
- All — every issue.

### Work lane

- All Issues
- Dispatch
- Office Review

### Assigned to

Uses the current workflow owner, not the original static owner.

### Contact

- Needs contact
- Attempted
- Reached
- Not needed

### Ticket backup

- Needed
- Partial
- Ready

### Final outcome

Uses the final ticket statuses from PR17.

### Disposal receipt status

Uses the projected receipt status.

Filters combine with AND semantics.

## Route Review visual hierarchy

1. Route identity and current route status.
2. Scheduled, clean, lane, completed, and reopened counts.
3. Immediate route consequence strip.
4. Highest-priority unresolved issue.
5. Queue state controls.
6. Refinement filters.
7. Open lane lists, completed outcomes, or reopened work.
8. Repeat issue, receipt status, closeout summary, and outcome summary.
9. Browser-state and claims disclaimer.

## Card hierarchy

### Open or reopened card

- priority;
- queue state;
- issue type;
- age;
- ticket and blocker;
- customer, route, and service outcome;
- assigned owner;
- contact progress;
- ticket-backup progress;
- ticket status;
- next step.

### Completed card

- Resolved priority label;
- Completed queue state;
- completion time;
- assigned owner;
- contact progress;
- ticket-backup progress;
- final ticket status;
- resolution reason;
- recorded outcome.

## Browser refresh behavior

Route Review recomputes state when:

- the route mounts;
- the route changes;
- the `reported` query value changes;
- the browser window regains focus;
- a browser `storage` event occurs;
- a future in-page queue-change event is dispatched.

Navigation from issue detail back to Route Review remounts the route and reads the saved workflow state.

## Compatibility

Preserved routes:

- `/route-review/:routeId`
- `/route-intelligence/:routeId`
- `/issues/:id`
- `/report-issue/:routeId`

Preserved visual anchors:

- `route-intelligence-page`
- `route-intelligence-header`
- `route-consequence-strip`
- `route-primary-action`
- `route-active-lane`
- `route-closeout-lane`
- `route-pattern-panel`
- `route-disposal-matrix`
- `route-closeout-summary`

New anchors:

- `route-queue-controls`
- `route-state-filter-open`
- `route-state-filter-completed`
- `route-state-filter-reopened`
- `route-state-filter-all`
- `route-owner-filter`
- `route-contact-filter`
- `route-evidence-filter`
- `route-outcome-filter`
- `route-completed-lane`
- `route-reopened-lane`
- `route-outcome-summary`
- synchronized metric anchors.

## Removed implementation

`frontend/src/pages/RouteReview.jsx` is removed because the application already used `RouteReviewLive.jsx`. Keeping the obsolete page would preserve an unsynchronized route view that could be restored accidentally.

## Automated model tests

Jest verifies:

- baseline route reconciliation;
- ready-to-close completion;
- rescheduled completion without false readiness;
- reopened issue return;
- preserved evidence after reopening;
- browser report replacing a clean record;
- receipt relationship projection;
- owner/contact/evidence/outcome filters;
- visible queue-state labels;
- ready-to-close final-status classification.

## Automated browser tests

Playwright verifies:

- open queue baseline;
- completed outcome synchronization;
- lane-count change after completion;
- closeout-count change after Ready to Close;
- completed card content;
- combined completed filters;
- reopen from detail;
- returned reopened issue;
- preserved evidence summary;
- not-ready count restored after reopen;
- rescheduled issue leaving open work;
- rescheduled record remaining not ready;
- state filters;
- work-lane filter;
- receipt filter;
- owner/contact/evidence filters;
- route selection;
- issue click-through;
- screenshots across breakpoints;
- Axe checks;
- Lighthouse review;
- no horizontal overflow in every queue state.

## Claims guardrails

- Completed does not mean billable.
- Ready to Close does not release an invoice.
- Closed Without Service does not mean completed service.
- Follow-Up Complete does not automatically mean ready to close.
- Rescheduled remains not ready to close.
- Needs Billing Review remains an office decision state.
- Receipt matched does not verify physical disposal.
- Browser state is not production persistence.
- Reopened is the same issue, not a duplicate.
- Counts are derived from fictional sample records and browser-only changes.

## Stop condition

Stop PR18 after:

- the projection model is implemented;
- Route Review uses the projection;
- the obsolete route page is removed;
- model tests pass;
- end-to-end completion and reopen tests pass;
- visual screenshots pass;
- Axe passes;
- Lighthouse passes;
- production build passes;
- Vercel passes or a platform-only limitation is documented separately.

Do not add database, authentication, real-time server sync, messaging, uploads, routing, telematics, disposal verification, or billing automation inside PR18.
