# PR08 Mobile Proof Dashboard Correction

## Reason for PR08

PR07 made `/proof` look more like a dashboard on desktop, but mobile still collapsed into a long vertical page. The user also noted that the proof packet detail views need the same level of visual improvement.

## PR08 goals

- Make `/proof` mobile-first instead of desktop-first.
- Avoid the "huge long page" feeling on phones.
- Use horizontal swipe sections so the dashboard feels like an app.
- Keep the design closer to the uploaded reference video: compact app header, dashboard navigation, visual board, status queue, and concise cards.
- Redesign `/proof/:id` so proof packet detail pages match the new app dashboard style.

## Implementation direction

- `/proof` now has separate mobile and desktop layouts.
- Mobile uses:
  - sticky app header
  - compact KPI scroll row
  - horizontal swipe dashboard cards
  - fixed bottom app nav
  - concise record cards
- Desktop keeps:
  - top utility bar
  - left rail
  - KPI row
  - central closeout board
  - right-side queue
- `/proof/:id` now has matching mobile and desktop app-style detail layouts.

## Customer-facing standard

A customer should not feel like they are reading a long marketing page. They should feel like they are previewing a real ClearRun product dashboard.
