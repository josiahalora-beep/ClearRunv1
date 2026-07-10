# PR16 Fast Route Issue Capture Acceptance Checklist

## Capture flow

- [ ] `/report-issue/:routeId` opens the correct route.
- [ ] Route, truck, and driver are prefilled.
- [ ] Customer or site is required.
- [ ] Issue choice is required.
- [ ] Service result is required.
- [ ] A short note or at least one photo is required.
- [ ] Photo selection does not claim or perform a real upload.
- [ ] Dispatch-contacted status is optional.
- [ ] Customer-follow-up status is optional.
- [ ] Logged delay is optional.
- [ ] Recommended next step is optional.
- [ ] Submit remains disabled until required work is complete.

## Taxonomy

- [ ] Access problem choices are present.
- [ ] Service problem choices are present.
- [ ] Ticket backup problem choices are present.
- [ ] Disposal receipt problem choices are present.
- [ ] Customer or billing problem choices are present.
- [ ] Service result remains separate from issue choice.
- [ ] No unexplained numerical score is shown.

## Rule mapping

- [ ] Cannot access service area maps to Needs Dispatch, Resolve Now, and Dispatch.
- [ ] Unsafe access maps to Needs Dispatch and Operations manager.
- [ ] More truck capacity needed maps to Needs Dispatch and Dispatch.
- [ ] Missing signature maps to Needs Office Review and Route desk.
- [ ] Gallons missing maps to Needs Office Review and Billing.
- [ ] Disposal receipt missing maps to Needs Office Review and Billing.
- [ ] Customer dispute maps to Customer Response Needed and Customer service.
- [ ] An incomplete service result keeps the issue in Needs Dispatch.

## Route Review integration

- [ ] Submission redirects to the selected Route Review.
- [ ] Success banner appears.
- [ ] Reported issue appears in the correct work section.
- [ ] Just Reported marker appears.
- [ ] Captured issue affects visible route-review issue counts.
- [ ] Captured issue can be filtered by receipt status where applicable.
- [ ] Success banner opens the reported issue.
- [ ] Reported issue opens the existing Route Issue follow-up workflow.

## Browser storage

- [ ] Captured issue is stored only in local storage.
- [ ] Newest issue appears first.
- [ ] Duplicate issue IDs are not retained.
- [ ] Storage is limited to the newest 25 captured issues.
- [ ] Invalid stored data returns an empty list safely.

## Customer-facing language

- [ ] Screen uses Report a Route Issue.
- [ ] Screen asks What happened at this stop?
- [ ] Screen uses Confirm the Stop.
- [ ] Screen uses Record the Service Result.
- [ ] Screen uses Add a Note or Photo.
- [ ] Screen uses Report Route Issue.
- [ ] Route Review uses Just Reported.
- [ ] No internal architecture phrases appear.
- [ ] `docs/customer-facing-language-contract.md` remains satisfied.

## Visual and responsive quality

- [ ] Premium office-workflow hierarchy.
- [ ] Large touch-friendly issue choices.
- [ ] Required items are easy to scan.
- [ ] Optional details are visually secondary.
- [ ] Sticky review card works on desktop.
- [ ] Form stacks cleanly on mobile.
- [ ] No page-level horizontal overflow.
- [ ] Desktop screenshot passes.
- [ ] Tablet screenshot passes.
- [ ] Mobile screenshot passes.
- [ ] Serious and critical Axe violations fail the gate.
- [ ] Lighthouse includes the reporting screen.

## Automated tests

- [ ] Validation unit test passes.
- [ ] Route-prefill unit test passes.
- [ ] Access-problem mapping test passes.
- [ ] Ticket-backup mapping test passes.
- [ ] Photo-only evidence test passes.
- [ ] Browser-storage test passes.
- [ ] End-to-end note submission passes.
- [ ] End-to-end photo-only validation passes.
- [ ] Route Review placement passes.
- [ ] Issue-detail click-through passes.

## Claims and scope

- [ ] No guaranteed report-time claim.
- [ ] No real photo-upload claim.
- [ ] No notification-delivery claim.
- [ ] No GPS or geofence claim.
- [ ] No automatic rerouting claim.
- [ ] No disposal-verification claim.
- [ ] No final billing-decision claim.
- [ ] No production-storage claim.
- [ ] No authentication or integration added in PR16.

## Release

- [ ] Frontend Build and Jest pass.
- [ ] Frontend Visual Review passes.
- [ ] Lighthouse review passes.
- [ ] Vercel preview passes or any platform-only failure is documented separately.
- [ ] PR remains mergeable on the tested head SHA.
