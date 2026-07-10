# PR15 Route Review Acceptance Checklist

## Product behavior

- [ ] Route selector changes the entire route review.
- [ ] Needs Dispatch and Needs Office Review remain distinct.
- [ ] One “What needs attention first” action is visually dominant.
- [ ] Every route-issue row opens the correct issue detail.
- [ ] Work filters function correctly.
- [ ] Disposal receipt status filters matching route issues.
- [ ] Route closeout counts reconcile to scheduled stops.
- [ ] Disposal receipt counts reconcile to scheduled stops.
- [ ] Logged delay is shown as observed data, not claimed savings.
- [ ] Billing review is presented as an office flag, not a final billing decision.

## Repeat issues

- [ ] Repeat issue requires at least 3 observations.
- [ ] Repeat issue requires at least 20% of the relevant sample.
- [ ] Numerator and denominator are visible.
- [ ] Percentage and sample window are visible.
- [ ] Affected routes, customers, trucks, or drivers are visible where relevant.
- [ ] Recommended follow-up is visible.
- [ ] Repeat issue is not presented as a compliance or employee score.

## Ticket and route-issue workflow

- [ ] Assigned person can be changed.
- [ ] Required ticket items update ready-to-close status.
- [ ] Partial completion does not enable closeout.
- [ ] All required items enable closeout.
- [ ] Completion records work history.
- [ ] Browser-only sample state is disclosed.

## Customer-facing language

- [ ] Dashboard uses ticket, route, follow-up, billing, and closeout language.
- [ ] Route page is labeled Route Review.
- [ ] Work sections are labeled Needs Dispatch and Needs Office Review.
- [ ] Detail screens use Ticket Issue or Route Issue.
- [ ] Disposal section uses Disposal Receipt Status.
- [ ] Repeat section uses Repeat Issue.
- [ ] “Ready to close?” replaces internal release-gate wording.
- [ ] Visible copy does not include banned internal architecture phrases.
- [ ] `docs/customer-facing-language-contract.md` is satisfied.

## Visual quality

- [ ] Premium office-workflow hierarchy.
- [ ] No vague health score.
- [ ] No generic empty KPI wall.
- [ ] Desktop screenshot passes.
- [ ] Tablet screenshot passes.
- [ ] Mobile screenshot passes.
- [ ] No page-level horizontal overflow.
- [ ] Serious and critical Axe violations fail the gate.
- [ ] Route Review and Route Issue run through Lighthouse.

## CI and release

- [ ] Jest aggregation tests pass.
- [ ] Frontend build passes.
- [ ] Frontend Visual Review passes.
- [ ] Internal-language copy scan passes.
- [ ] Vercel preview passes.
- [ ] PR remains mergeable on the tested head SHA.
