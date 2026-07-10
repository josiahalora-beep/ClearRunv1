# PR18 Queue State Synchronization Acceptance Checklist

## Projection model

- [ ] Built-in route issues are included.
- [ ] Browser-reported issues are included.
- [ ] Saved issue workflow state is applied.
- [ ] Duplicate issue IDs are removed.
- [ ] Current workflow owner replaces the original owner.
- [ ] Contact progress is derived consistently.
- [ ] Ticket-backup progress is derived consistently.
- [ ] Final ticket status is projected.
- [ ] Resolution reason is projected.
- [ ] Completion time is projected.
- [ ] Reopen count is projected.
- [ ] Reopen time is projected.
- [ ] Receipt relationship changes only for the matched-receipt resolution reason.

## Queue states

- [ ] Fresh unresolved issue is Open.
- [ ] Resolved issue is Completed.
- [ ] Unresolved issue with prior reopen count is Reopened.
- [ ] Reopened is included in Open Issues.
- [ ] Completed is excluded from Needs Dispatch.
- [ ] Completed is excluded from Needs Office Review.
- [ ] Reopened returns to its original lane.
- [ ] Reopened keeps the same issue ID.
- [ ] Reopened keeps confirmed evidence.
- [ ] Reopened keeps work history.

## Ticket readiness

- [ ] Ready to Close maps to Ready to Close.
- [ ] Closed Without Service maps to Ready to Close.
- [ ] Follow-Up Complete maps to Needs Review.
- [ ] Rescheduled maps to Follow-Up Needed.
- [ ] Needs Billing Review maps to Needs Review.
- [ ] Unknown completed outcome falls back to Needs Review.
- [ ] Completed issue can remain not ready to close.
- [ ] Closed Without Service is not described as billable service.
- [ ] Ready to Close does not claim invoice release.

## Route counts

- [ ] Scheduled Stops reconciles with projected records.
- [ ] Completed Cleanly excludes issue records.
- [ ] Browser reports replace clean sample records while available.
- [ ] Needs Dispatch counts unresolved active-lane issues.
- [ ] Needs Office Review counts unresolved closeout-lane issues.
- [ ] Completed Issues counts resolved issues.
- [ ] Reopened counts unresolved previously completed issues.
- [ ] Open Issues equals fresh open plus reopened.
- [ ] Tickets Not Ready uses final ticket readiness.
- [ ] Closeout-state totals equal Scheduled Stops.
- [ ] Receipt-status totals equal Scheduled Stops.
- [ ] Ready-to-close completion reduces Tickets Not Ready.
- [ ] Rescheduled completion does not reduce Tickets Not Ready.
- [ ] Reopening restores the original not-ready state.

## Primary action

- [ ] Completed issues cannot become the primary open action.
- [ ] Reopened work is prioritized before equal-priority fresh work.
- [ ] Existing priority order remains intact.
- [ ] Older issue wins at equal priority.
- [ ] No-open-work state replaces the action card when all issues are completed.

## Queue filters

- [ ] Open shows fresh open and reopened issues.
- [ ] Completed shows completed issues only.
- [ ] Reopened shows reopened issues only.
- [ ] All shows every issue.
- [ ] Dispatch lane filter works.
- [ ] Office Review lane filter works.
- [ ] Assigned To filter uses current workflow owner.
- [ ] Contact filter works.
- [ ] Ticket Backup filter works.
- [ ] Final Outcome filter works.
- [ ] Receipt status filter works.
- [ ] Filters combine with AND semantics.
- [ ] Clear Filters returns to Open and All Issues.
- [ ] Clear Filters removes receipt filtering.

## Route Review cards

- [ ] Open card shows priority.
- [ ] Open card shows queue state.
- [ ] Open card shows issue type.
- [ ] Open card shows age.
- [ ] Open card shows assigned owner.
- [ ] Open card shows contact progress.
- [ ] Open card shows ticket-backup progress.
- [ ] Open card shows ticket status.
- [ ] Open card shows next step.
- [ ] Completed card shows Resolved.
- [ ] Completed card shows completion time.
- [ ] Completed card shows final ticket status.
- [ ] Completed card shows resolution reason.
- [ ] Completed card shows recorded outcome.
- [ ] Reopened card shows reopen count.
- [ ] Reopened card shows preserved ticket-backup readiness.
- [ ] Reopened card links back to the same issue.

## Outcome and closeout panels

- [ ] Completed Outcomes summary is visible.
- [ ] Every final ticket status appears in the outcome summary.
- [ ] Zero outcome counts remain visible for clarity.
- [ ] Route Closeout remains visible.
- [ ] Receipt Status remains visible.
- [ ] Repeat Issue remains visible.
- [ ] Outcome panel states that completion is not automatic billing readiness.

## Browser-state behavior

- [ ] Route mount reads current browser state.
- [ ] Route change reads current browser state.
- [ ] Reported query value refreshes the route state.
- [ ] Returning from issue detail shows saved completion.
- [ ] Returning after reopen shows reopened work.
- [ ] Window focus refresh is registered.
- [ ] Browser storage-event refresh is registered.
- [ ] Invalid browser state falls back safely through PR17 workflow loading.

## Compatibility

- [ ] `/route-review/:routeId` still works.
- [ ] `/route-intelligence/:routeId` still works.
- [ ] `/issues/:id` still works.
- [ ] `/report-issue/:routeId` still works.
- [ ] Browser-reported issue success banner still works.
- [ ] Browser-reported issue opens in detail.
- [ ] Existing route visual anchors remain.
- [ ] Existing route selector remains.
- [ ] Existing receipt filter remains.
- [ ] Existing issue click-through remains.
- [ ] Obsolete `RouteReview.jsx` is removed.

## Language and claims

- [ ] Uses Open Issues.
- [ ] Uses Completed Issues.
- [ ] Uses Completed Outcomes.
- [ ] Uses Reopened Work.
- [ ] Uses Queue State.
- [ ] Uses Final Ticket Status.
- [ ] Uses Ticket Backup.
- [ ] Internal projection terminology is absent from visible UI.
- [ ] Completed does not mean billable.
- [ ] Reopened does not imply duplicate issue.
- [ ] Receipt matched does not claim disposal verification.
- [ ] Browser state does not claim production persistence.
- [ ] No employee score appears.
- [ ] No compliance score appears.
- [ ] No facility pricing appears.

## Automated model tests

- [ ] Baseline route reconciliation test passes.
- [ ] Ready-to-close completion test passes.
- [ ] Rescheduled completion test passes.
- [ ] Reopen restoration test passes.
- [ ] Preserved evidence test passes.
- [ ] Browser report replacement test passes.
- [ ] Matched receipt projection test passes.
- [ ] Combined filter test passes.
- [ ] Visible state-label test passes.
- [ ] Final-status readiness classification test passes.

## Automated browser tests

- [ ] Completion removes issue from open lane.
- [ ] Completion updates lane count.
- [ ] Completion updates completed count.
- [ ] Completion updates Tickets Not Ready when appropriate.
- [ ] Completed card appears.
- [ ] Completed filters return the issue.
- [ ] Review Outcome opens the same issue.
- [ ] Reopen requires a reason.
- [ ] Reopen updates reopened count.
- [ ] Reopen returns issue to the lane.
- [ ] Reopen restores Tickets Not Ready.
- [ ] Reopened card shows evidence preserved.
- [ ] Rescheduled issue leaves open work.
- [ ] Rescheduled issue remains not ready.
- [ ] Queue state controls work.
- [ ] Work lane control works.
- [ ] Receipt filter works.
- [ ] Owner/contact/backup filters work.
- [ ] Route selector works.
- [ ] No horizontal overflow in Open.
- [ ] No horizontal overflow in Completed.
- [ ] No horizontal overflow in Reopened.
- [ ] No horizontal overflow in All.

## Visual and release gates

- [ ] Desktop screenshot passes.
- [ ] Tablet screenshot passes.
- [ ] Mobile screenshot passes.
- [ ] Serious and critical Axe violations fail the gate.
- [ ] Lighthouse passes.
- [ ] Jest passes.
- [ ] Frontend production build passes.
- [ ] Frontend Visual Review passes.
- [ ] Vercel preview passes or a platform-only limitation is documented.
- [ ] PR remains mergeable at the exact tested head SHA.
