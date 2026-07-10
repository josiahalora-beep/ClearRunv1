# PR17: Follow-Up, Evidence, and Resolution Workflow

## Objective

Turn a reported route issue into structured office work that can be followed from first contact through final ticket status without claiming that ClearRun sends messages, uploads evidence, verifies disposal, reroutes trucks, or makes final billing decisions.

PR16 created the route issue. PR17 answers:

1. Who owns the follow-up?
2. Has dispatch been contacted?
3. Has the customer been contacted?
4. What ticket backup exists?
5. Who supplied or reviewed each required item?
6. When was each item confirmed?
7. What follow-up was prepared?
8. What response was received?
9. Why was the issue completed?
10. What is the final ticket status?
11. Why was a completed issue reopened?

## Visible workflow

```text
Issue reported
→ assign follow-up
→ update dispatch contact
→ update customer contact
→ confirm required ticket backup
→ add supporting evidence
→ prepare follow-up
→ record response when reached
→ choose resolution reason
→ choose final ticket status
→ complete issue
→ reopen with a reason when necessary
```

## Product boundary

PR17 does not add:

- real email, SMS, chat, or push delivery;
- real photo or document upload;
- cloud evidence storage;
- GPS, geofences, arrival times, or departure times;
- automatic rerouting;
- telematics;
- customer authentication;
- driver authentication;
- production database persistence;
- disposal verification;
- facility pricing or margin visibility;
- automatic invoice release;
- final billing approval;
- compliance scoring;
- employee scoring;
- legal-document sufficiency claims.

The implementation uses fictional sample data and local browser storage.

## Operator-facing terminology

Use:

- Route Issue Follow-Up
- Contact Progress
- Assigned To
- Dispatch
- Customer
- Not Needed
- Needed
- Attempted
- Reached
- Ticket Backup
- Evidence Source
- Confirmed At
- Add Supporting Evidence
- Follow-Up Prepared
- Response Recorded
- Resolution Reason
- Final Ticket Status
- Complete Issue
- Reopen Issue
- Work History

Do not expose internal workflow-engine, state-machine, mapping, or transition terminology.

## Contact progress

### Visible statuses

- Not Needed
- Needed
- Attempted
- Reached

### Completion rule

A contact is considered documented for completion when its status is:

- Not Needed;
- Attempted; or
- Reached.

A contact with status Needed remains incomplete.

### Response rule

When Dispatch or Customer is marked Reached, a response note is required before the issue can be completed.

Attempted contact does not require a response note because no response may have been received. The final resolution reason still must explain the issue disposition.

### Initial status mapping

- Active route issues default Dispatch to Needed unless a reported contact value already exists.
- Active route issues default Customer to Needed when customer follow-up is not complete.
- Not required maps to Not Needed.
- Attempted maps to Attempted.
- Reached or an explicit sent state maps to Reached.
- Not sent maps to Needed.
- Closeout issues default irrelevant contacts to Not Needed.

## Required ticket backup

Every issue requirement becomes a visible closeout item.

Each required item records:

- requirement label;
- confirmed or not confirmed;
- evidence source;
- confirmation timestamp.

Available sources:

- Driver
- Dispatch
- Customer
- Route desk
- Billing
- Disposal receipt
- Office review

### Completion rule

A required item is complete only when:

- it is confirmed;
- a source is present; and
- a confirmation timestamp is present.

Unchecking a confirmed item reopens that requirement and records the change in work history.

## Supporting evidence log

The user can add an evidence record with:

- evidence label;
- source;
- optional note;
- automatic added timestamp.

Examples:

- Gate photo
- Signed service ticket
- Receipt image
- Driver call note
- Customer email summary
- Gallon clarification

The evidence log is an office record in browser storage. It does not upload or retain a file.

## Follow-up templates

Templates are selected by issue context.

### Access issues

- Customer access request
- Dispatch follow-up

### Service issues

- Service completion update
- Dispatch completion plan

### Disposal receipt or gallon issues

- Receipt review request
- Driver receipt request

### Ticket backup issues

- Missing ticket backup request
- Office backup review

### Customer or billing issues

- Customer response
- Billing review request

The user can edit the generated text. Preparing a follow-up records an office action in work history. It does not send a message.

## Response record

The response section records:

- response note;
- response-recorded flag;
- timestamp;
- work-history event.

A reached contact blocks completion until a non-empty response note is recorded.

Editing the response note after it was recorded resets the response-recorded flag until the updated note is recorded again.

## Resolution

### Resolution reasons

- Access instructions confirmed
- Customer response recorded
- Service rescheduled
- Remaining service completed
- Missing ticket backup received
- Missing backup disposition approved
- Disposal receipt matched
- Billing review completed
- Customer dispute resolved
- Office approval recorded
- Closed without service
- Other

### Final ticket statuses

- Ready to Close
- Follow-Up Complete
- Rescheduled
- Closed Without Service
- Needs Billing Review

### Completion gate

The Complete Issue button remains disabled until all conditions are true:

1. An owner is assigned.
2. Dispatch contact is no longer Needed.
3. Customer contact is no longer Needed.
4. Every required ticket-backup item is confirmed with source and timestamp.
5. A response is recorded when a contact is Reached.
6. A resolution reason is selected.
7. A final ticket status is selected.
8. The issue is not already completed.

No hidden score controls readiness.

## Reopen behavior

A completed issue can be reopened only when a non-empty reason is entered.

Reopening:

- records the reason;
- records the prior final status;
- increments the reopen count;
- clears the completed timestamp;
- clears the current resolution reason;
- clears the current final ticket status;
- clears the current response note and recorded-response flag;
- preserves contact status;
- preserves confirmed evidence;
- preserves the complete work history.

The issue must then pass the completion gate again.

## Browser-state migration

PR17 reads the existing `clearrun-route-issue-<issueId>` local-storage key.

### Version 2 state

Version 2 records are loaded directly with safe fallbacks for missing arrays.

### Legacy PR15/PR16 state

Legacy fields are migrated:

- owner is retained;
- proof checks become sourced evidence requirements;
- confirmed legacy proof uses Office review as the migration source;
- follow-up text and prepared status are retained;
- released state becomes Ready to Close;
- legacy activity entries receive fallback actor and timestamp labels.

The migration prevents an existing browser demo from breaking after PR17.

## Work history

Every material action creates a history event with:

- event label;
- actor;
- timestamp;
- note.

Tracked actions include:

- issue reported;
- assignment updated;
- dispatch contact updated;
- customer contact updated;
- required item confirmed;
- required item reopened;
- supporting evidence added;
- follow-up prepared;
- response recorded;
- issue completed;
- issue reopened.

Newest activity appears first.

## Visual hierarchy

### Desktop

- Main workflow column on the left.
- Sticky completion and work-history column on the right.
- Issue summary first.
- Contact progress second.
- Ticket backup and supporting evidence third.
- Follow-up and response fourth.
- Completion gate remains visible while working.

### Mobile

- Single-column reading order.
- Issue summary first.
- Contact controls stack.
- Evidence requirements stack with source controls.
- Follow-up and response fields remain full width.
- Completion gate follows the work sections.
- No page-level horizontal overflow.

## Compatibility

The following remain stable:

- `/issues/:id` route;
- browser-reported PR16 issues;
- sample route issues;
- route-review click-through;
- `route-exception-detail` test anchor;
- `route-exception-owner` test anchor;
- `route-exception-context` test anchor;
- `route-exception-followup` test anchor;
- `route-exception-release-button` initial test anchor;
- `route-exception-activity` test anchor.

New anchors include:

- `route-contact-progress`
- `route-dispatch-status`
- `route-customer-status`
- `route-evidence-work`
- `route-response-work`
- `route-resolution-panel`
- `route-resolution-reason`
- `route-final-status`
- `route-reopen-reason`
- `route-reopen-button`

## Automated model tests

Jest verifies:

- issue-specific templates;
- initial contact states;
- initial evidence requirements;
- source and timestamp recording;
- reached-contact response requirement;
- attempted-contact completion behavior;
- supporting-evidence creation;
- blocked incomplete resolution;
- successful resolution;
- reason-required reopen;
- prior-status history on reopen;
- browser-state persistence;
- legacy-state migration.

## Automated browser tests

Playwright verifies:

- desktop, tablet, and mobile screenshots;
- business-critical workflow anchors;
- Axe A/AA checks;
- operator-language guardrails;
- assignment and contact controls;
- evidence requirement count;
- completion remains blocked after partial work;
- resolution reason and final status are required;
- reached contact requires a recorded response;
- issue-specific template switching;
- prepared follow-up history;
- supporting evidence source and history;
- issue completion;
- reason-required reopen;
- reopened issue returns to a blocked completion state;
- page-level horizontal overflow.

## Lighthouse

No new route is required. The existing automated Lighthouse route `/issues/EX-2101` now covers the PR17 workflow.

## Claims and safety guardrails

- Prepared follow-up is not sent communication.
- Evidence records are not uploaded documents.
- Evidence source and timestamp do not guarantee legal sufficiency.
- Disposal receipt review does not verify disposal.
- Final ticket status does not make a final billing decision.
- Ready to Close does not automatically release an invoice.
- Attempted contact does not claim the customer or dispatch was reached.
- Completed Issue does not claim service was completed unless that is the selected and documented outcome.
- Reopened issue remains the same issue record rather than creating a false duplicate.

## Stop condition

Stop after:

- the structured route-issue workflow is implemented;
- the obsolete shallow route-issue screen is removed;
- model tests pass;
- browser interaction tests pass;
- visual screenshots pass;
- Axe checks pass;
- Lighthouse passes;
- Vercel preview passes or any platform-only limitation is documented separately.

Do not add real messaging, uploads, production persistence, authentication, routing, telematics, or billing automation inside PR17.
