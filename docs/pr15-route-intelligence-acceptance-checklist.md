# PR15 Route Intelligence Acceptance Checklist

## Product behavior

- [ ] Route selector changes the entire route summary.
- [ ] Active Route and Closeout lanes remain distinct.
- [ ] One primary office action is visually dominant.
- [ ] Every lane row opens the correct exception detail.
- [ ] Lane filters work.
- [ ] Disposal matrix filters matching exceptions.
- [ ] Route closeout counts reconcile to scheduled stops.
- [ ] Disposal matrix counts reconcile to scheduled stops.
- [ ] Recorded delay is shown as observed data, not savings.
- [ ] Potentially unbillable is labeled as an operational review flag.

## Recurring patterns

- [ ] Pattern requires at least 3 observations.
- [ ] Pattern requires at least 20% of the relevant sample.
- [ ] Numerator and denominator are visible.
- [ ] Percentage and sample window are visible.
- [ ] Affected entities and recommended intervention are visible.
- [ ] Pattern is not presented as a compliance or employee score.

## Resolution workflow

- [ ] Route-exception owner can be changed.
- [ ] Blocking requirements update release readiness.
- [ ] Partial requirements do not enable resolution.
- [ ] All requirements enable resolution.
- [ ] Resolution records activity history.
- [ ] Browser-only demo state is disclosed.

## Visual quality

- [ ] Premium command-center hierarchy.
- [ ] No vague health score.
- [ ] No generic empty KPI wall.
- [ ] Desktop screenshot passes.
- [ ] Tablet screenshot passes.
- [ ] Mobile screenshot passes.
- [ ] No page-level horizontal overflow.
- [ ] Serious and critical Axe violations fail the gate.
- [ ] Route intelligence and route-exception detail run through Lighthouse.

## CI and release

- [ ] Jest aggregation tests pass.
- [ ] Frontend build passes.
- [ ] Frontend Visual Review passes.
- [ ] Vercel preview passes.
- [ ] PR remains mergeable on the tested head SHA.
