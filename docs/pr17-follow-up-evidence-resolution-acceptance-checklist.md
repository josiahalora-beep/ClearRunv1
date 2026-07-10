# PR17 Follow-Up, Evidence, and Resolution Acceptance Checklist

## Contact progress

- [ ] Assigned person can be changed.
- [ ] Dispatch supports Not Needed, Needed, Attempted, and Reached.
- [ ] Customer supports Not Needed, Needed, Attempted, and Reached.
- [ ] Needed blocks completion.
- [ ] Attempted counts as documented follow-up.
- [ ] Reached requires a response note.
- [ ] Not sent maps to Needed.
- [ ] Not required maps to Not Needed.
- [ ] Contact changes appear in work history.

## Ticket backup and evidence

- [ ] Every issue requirement appears in the ticket-backup checklist.
- [ ] Confirmed requirement records a source.
- [ ] Confirmed requirement records a timestamp.
- [ ] Unconfirmed requirement blocks completion.
- [ ] Reopened requirement clears source and timestamp.
- [ ] Added evidence requires a label.
- [ ] Added evidence requires a source.
- [ ] Added evidence can include a note.
- [ ] Added evidence records a timestamp.
- [ ] Added evidence appears in work history.
- [ ] UI does not claim evidence is uploaded.

## Follow-up

- [ ] Access issues receive access templates.
- [ ] Service issues receive service templates.
- [ ] Receipt and gallon issues receive receipt templates.
- [ ] Ticket-backup issues receive backup templates.
- [ ] Customer and billing issues receive response/review templates.
- [ ] Template selection updates the editable text.
- [ ] Preparing follow-up records work history.
- [ ] UI states that prepared follow-up is not sent.

## Response

- [ ] Response note can be entered.
- [ ] Empty response cannot be recorded.
- [ ] Recording response creates a work-history event.
- [ ] Editing a recorded response requires recording it again.
- [ ] Reached contact blocks completion until response is recorded.
- [ ] Attempted contact does not require a response note.

## Resolution

- [ ] Resolution reason is required.
- [ ] Final ticket status is required.
- [ ] Owner is required.
- [ ] Contact progress must be complete.
- [ ] Required ticket backup must be complete.
- [ ] Reached-contact response requirement must be complete.
- [ ] Complete Issue button remains disabled until all rules pass.
- [ ] No numerical readiness score is shown.
- [ ] Completion records the reason, final status, timestamp, and history.
- [ ] Billing note still states that billing makes the final decision.

## Final ticket statuses

- [ ] Ready to Close is available.
- [ ] Follow-Up Complete is available.
- [ ] Rescheduled is available.
- [ ] Closed Without Service is available.
- [ ] Needs Billing Review is available.
- [ ] Final status is not presented as automatic invoice release.

## Reopen

- [ ] Completed issue shows Reopen Issue.
- [ ] Reopen button is disabled without a reason.
- [ ] Reopen reason is recorded in history.
- [ ] Prior final status is recorded in history.
- [ ] Reopen count increments.
- [ ] Resolution reason is cleared.
- [ ] Final ticket status is cleared.
- [ ] Response note and recorded flag are cleared.
- [ ] Confirmed evidence remains available.
- [ ] Contact progress remains available.
- [ ] Reopened issue must pass the completion gate again.

## Browser-state compatibility

- [ ] Version 2 workflow saves and loads.
- [ ] Missing stored arrays receive safe fallbacks.
- [ ] Invalid stored JSON falls back safely.
- [ ] Legacy owner is retained.
- [ ] Legacy proof checks migrate.
- [ ] Legacy confirmed proof receives Office review source.
- [ ] Legacy follow-up text is retained.
- [ ] Legacy prepared status is retained.
- [ ] Legacy released status migrates to Ready to Close.
- [ ] Legacy history receives fallback actor and timestamp values.
- [ ] PR16 browser-reported issues open in the PR17 workflow.

## Customer-facing language

- [ ] Screen uses Route Issue Follow-Up.
- [ ] Screen uses Contact Progress.
- [ ] Screen uses Ticket Backup.
- [ ] Screen uses Follow-Up.
- [ ] Screen uses Response.
- [ ] Screen uses Resolution Reason.
- [ ] Screen uses Final Ticket Status.
- [ ] Screen uses Complete Issue.
- [ ] Screen uses Reopen Issue.
- [ ] Screen uses Work History.
- [ ] Internal architecture phrases remain absent.
- [ ] `docs/customer-facing-language-contract.md` remains satisfied.

## Visual quality

- [ ] Issue summary remains visually dominant.
- [ ] Contact controls are grouped clearly.
- [ ] Required ticket backup is distinct from optional added evidence.
- [ ] Follow-up and response are distinct.
- [ ] Completion gate remains visible on desktop.
- [ ] Work history is easy to scan.
- [ ] Mobile order remains logical.
- [ ] No page-level horizontal overflow.
- [ ] Desktop screenshot passes.
- [ ] Tablet screenshot passes.
- [ ] Mobile screenshot passes.
- [ ] Serious and critical Axe violations fail the gate.
- [ ] Existing Lighthouse issue-detail route passes.

## Automated tests

- [ ] Template model test passes.
- [ ] Initial-state model test passes.
- [ ] Evidence source/timestamp model test passes.
- [ ] Reached-response model test passes.
- [ ] Attempted-contact model test passes.
- [ ] Added-evidence model test passes.
- [ ] Resolution-gate model test passes.
- [ ] Reopen model test passes.
- [ ] Browser migration model test passes.
- [ ] Required visual anchors pass.
- [ ] Reached-contact browser test passes.
- [ ] Template-switch browser test passes.
- [ ] Added-evidence browser test passes.
- [ ] Resolve-and-reopen browser test passes.
- [ ] PR16 report-to-review compatibility test passes.

## Claims and boundaries

- [ ] No real message-delivery claim.
- [ ] No real upload claim.
- [ ] No GPS or geofence claim.
- [ ] No automatic rerouting claim.
- [ ] No disposal-verification claim.
- [ ] No legal-sufficiency claim.
- [ ] No final billing-decision claim.
- [ ] No automatic invoice-release claim.
- [ ] No production-persistence claim.
- [ ] No authentication or integration added in PR17.

## Release

- [ ] Frontend Build passes.
- [ ] Jest tests pass.
- [ ] Frontend Visual Review passes.
- [ ] Lighthouse passes.
- [ ] Vercel preview passes or any platform-only limitation is documented separately.
- [ ] PR remains mergeable on the exact tested head SHA.
