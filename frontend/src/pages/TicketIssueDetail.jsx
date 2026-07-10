import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCheck2,
  History,
  MessageSquareText,
  ReceiptText,
  Repeat2,
  Route,
  UserRoundCheck,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { brand } from "@/data/mockData";

const ownerOptions = ["Dispatch", "Billing", "Route desk", "Customer service", "Operations manager"];

const issueContext = {
  "EX-1048": {
    route: "Perry Route C",
    truck: "Truck 12",
    technician: "T. Okafor",
    disposalLoad: "Load MG-221",
    disposalStatus: "Missing",
    disposalDetail: "No job-level or route/load-level disposal receipt is attached to this example record.",
    reasons: [
      ["Billing backup is incomplete", "The ticket should wait until the missing service proof is recovered or documented."],
      ["Driver follow-up is needed", "Dispatch needs the signed service ticket and stop photo."],
      ["The route record is not ready", "This ticket keeps the example route from closing cleanly."],
      ["The issue is aging", "The ticket has been open for two example days."],
    ],
    repeatCount: "4 of 9 recent records",
    repeatDetail: "Missing signatures or stop photos have appeared several times on this example route.",
  },
  "EX-1052": {
    route: "Warner Robins Route B",
    truck: "Truck 08",
    technician: "M. Chen",
    disposalLoad: "Load WR-118",
    disposalStatus: "Receipt needs matching",
    disposalDetail: "A route/load receipt is present, but the gallons and receipt relationship still need office review.",
    reasons: [
      ["Billing review is needed", "The office should match the service record and receipt before closing the ticket."],
      ["Disposal backup is unclear", "The receipt is present but does not clearly connect to the recorded gallons."],
      ["The route record is still open", "The example route remains partially unfinished."],
      ["Office time is being used", "Billing needs to compare the ticket, quantity note, and receipt."],
    ],
    repeatCount: "3 of 11 recent records",
    repeatDetail: "Unclear gallon-to-receipt relationships have appeared more than once in the example records.",
  },
  "EX-1061": {
    route: "Macon Route B",
    truck: "Truck 05",
    technician: "D. Alvarez",
    disposalLoad: "Load MC-304",
    disposalStatus: "Attached to route/load",
    disposalDetail: "The disposal receipt is attached to the route/load. The remaining work is preparing a customer-ready record.",
    reasons: [
      ["Customer response is waiting", "Customer service still needs an organized record to send."],
      ["The office must assemble the record", "Internal notes need to stay separate from the customer-ready view."],
      ["The same work is being repeated", "The office is rebuilding customer proof manually."],
      ["The request is aging", "The customer request has been open for four example hours."],
    ],
    repeatCount: "5 of 14 recent requests",
    repeatDetail: "Customer-ready record assembly has been repeated across the example requests.",
  },
  "EX-1067": {
    route: "Macon Route A",
    truck: "Truck 03",
    technician: "J. Reyes",
    disposalLoad: "Load MC-299",
    disposalStatus: "Attached to service record",
    disposalDetail: "The disposal receipt is attached. The unresolved item is the missing stop photo.",
    reasons: [
      ["Customer proof is weak", "The service record does not include the expected stop photo."],
      ["Technician follow-up is needed", "The route desk needs the photo or a note explaining why it is unavailable."],
      ["The ticket is not ready to close", "The record remains open until the photo issue is handled."],
      ["The office must reopen finished work", "The route desk is chasing proof after service completion."],
    ],
    repeatCount: "2 of 8 recent records",
    repeatDetail: "The example records show more than one missing stop photo for this technician.",
  },
};

const statusClass = {
  Hold: "border-status-incomplete/30 bg-status-incomplete-bg text-status-incomplete",
  Review: "border-status-attention/30 bg-status-attention-bg text-status-attention",
  Packet: "border-status-review/30 bg-status-review-bg text-status-review",
  Released: "border-status-complete/30 bg-status-complete-bg text-status-complete",
};

const statusLabel = {
  Hold: "Not Ready to Close",
  Review: "Needs Review",
  Packet: "Customer Record Needed",
  Released: "Ready to Close",
};

function loadState(issue) {
  const checks = Object.fromEntries(issue.proofNeeded.map((item) => [item, false]));
  const fallback = {
    owner: issue.owner,
    proofChecks: checks,
    followUpText: issue.nextAction,
    followUpPrepared: false,
    released: false,
    activity: [
      { id: "opened", label: "Issue opened", note: issue.blocker },
      { id: "assigned", label: `Assigned to ${issue.owner}`, note: `Open for ${issue.ageLabel}` },
    ],
  };

  if (typeof window === "undefined") return fallback;
  try {
    const saved = window.localStorage.getItem(`clearrun-demo-exception-${issue.id}`);
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch {
    return fallback;
  }
}

function StatusPill({ status }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[status] || statusClass.Review}`}>
      {statusLabel[status] || status}
    </span>
  );
}

export default function TicketIssueDetail({ issue }) {
  const context = issueContext[issue.id] || {
    route: issue.routeName,
    truck: "Not listed",
    technician: "Not listed",
    disposalLoad: "Not linked",
    disposalStatus: "Needs office review",
    disposalDetail: "The disposal receipt status has not been classified for this example record.",
    reasons: [
      ["Office follow-up is needed", issue.impact],
      ["The issue is aging", `Open for ${issue.ageLabel}.`],
    ],
    repeatCount: "Not enough records yet",
    repeatDetail: "More records are needed before showing a repeat issue.",
  };
  const [state, setState] = useState(() => loadState(issue));

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(`clearrun-demo-exception-${issue.id}`, JSON.stringify(state));
  }, [issue.id, state]);

  const allProofReady = useMemo(
    () => issue.proofNeeded.every((item) => state.proofChecks[item]),
    [issue.proofNeeded, state.proofChecks]
  );
  const readyToClose = Boolean(state.owner) && allProofReady;
  const currentStatus = state.released ? "Released" : issue.status;

  const handleOwnerChange = (event) => {
    const owner = event.target.value;
    setState((current) => ({
      ...current,
      owner,
      activity: [
        { id: `${Date.now()}-owner`, label: `Assigned to ${owner}`, note: "Assignment updated." },
        ...current.activity,
      ],
    }));
  };

  const handleProofToggle = (item) => {
    const checked = !state.proofChecks[item];
    setState((current) => ({
      ...current,
      proofChecks: { ...current.proofChecks, [item]: checked },
      activity: [
        {
          id: `${Date.now()}-${item}`,
          label: checked ? `${item} confirmed` : `${item} needs attention again`,
          note: checked ? "Ready-to-close step completed." : "Step reopened for review.",
        },
        ...current.activity,
      ],
    }));
  };

  const handlePrepareFollowUp = () => {
    setState((current) => ({
      ...current,
      followUpPrepared: true,
      activity: [
        { id: `${Date.now()}-followup`, label: "Follow-up prepared", note: current.followUpText },
        ...current.activity,
      ],
    }));
  };

  const handleRelease = () => {
    if (!readyToClose || state.released) return;
    setState((current) => ({
      ...current,
      released: true,
      activity: [
        { id: `${Date.now()}-closed`, label: "Ticket marked ready to close", note: "All required steps were completed in this example." },
        ...current.activity,
      ],
    }));
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`clearrun-demo-exception-${issue.id}`);
    }
    setState(loadState({ ...issue, id: `${issue.id}-reset` }));
  };

  return (
    <Layout>
      <main className="container-page py-10 sm:py-14" data-testid="exception-detail-workflow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/recovery" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:underline">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to work list
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">Ticket Follow-Up</p>
            <h1 className="mobile-safe-text mt-2 max-w-4xl font-display text-4xl font-bold leading-tight text-navy-950 sm:text-5xl">
              Complete {issue.ticketId} before the office closes it.
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              See what is missing, assign the next step, prepare the follow-up, and mark the ticket ready when every requirement is complete.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={currentStatus} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {issue.ageLabel}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.28fr)_minmax(19rem,0.72fr)]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-premium border border-slate-200 bg-white shadow-editorial">
              <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="bg-ink p-6 text-white sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">What is missing</p>
                  <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white">{issue.blocker}</h2>
                  <p className="mt-4 text-sm leading-6 text-white/65">{issue.impact}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">Billing review</p>
                      <p className="mt-2 text-sm font-semibold text-white">{issue.billingSupport}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">Customer record</p>
                      <p className="mt-2 text-sm font-semibold text-white">{issue.customerProof}</p>
                    </div>
                  </div>
                  {issue.recordId ? (
                    <Link to={`/proof/${issue.recordId}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white hover:underline">
                      <FileCheck2 className="h-4 w-4" aria-hidden="true" /> View service record
                    </Link>
                  ) : null}
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
                      <UserRoundCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <label htmlFor="ticket-issue-owner" className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned to</label>
                      <select
                        id="ticket-issue-owner"
                        data-testid="exception-owner-select"
                        value={state.owner}
                        onChange={handleOwnerChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                      >
                        {ownerOptions.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-offwhite p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ready-to-close requirement</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{issue.releaseCondition}</p>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">What must be completed</p>
                    <div className="mt-3 grid gap-2">
                      {issue.proofNeeded.map((item) => (
                        <label key={item} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
                          <input
                            type="checkbox"
                            checked={Boolean(state.proofChecks[item])}
                            onChange={() => handleProofToggle(item)}
                            className="h-4 w-4 rounded border-slate-300"
                          />
                          <span className="text-sm font-semibold text-navy-950">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="exception-economic-impact">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Why this ticket needs attention</p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">What the issue is holding up</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {context.reasons.map(([label, detail]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-offwhite p-4">
                    <p className="text-sm font-semibold text-navy-950">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="exception-route-context">
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-navy-800" aria-hidden="true" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Service details</p>
                </div>
                <h2 className="mt-2 font-display text-xl font-semibold text-navy-950">Where this ticket belongs</h2>
                <div className="mt-5 grid gap-3 text-sm">
                  {[
                    ["Route", context.route],
                    ["Truck", context.truck],
                    ["Technician", context.technician],
                    ["Service date", issue.serviceDate],
                    ["Disposal load", context.disposalLoad],
                    ["Customer / record", issue.customer],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <span className="text-slate-500">{label}</span>
                      <span className="text-right font-semibold text-navy-950">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="exception-disposal-status">
                <div className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-navy-800" aria-hidden="true" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Disposal receipt</p>
                </div>
                <h2 className="mt-2 font-display text-xl font-semibold text-navy-950">{context.disposalStatus}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{context.disposalDetail}</p>
                <div className="mt-5 rounded-2xl border border-slate-200 bg-offwhite p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Office step</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">Confirm whether the receipt is attached, missing, or needs matching before closing the ticket.</p>
                </div>
              </section>
            </div>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="exception-repeat-signal">
              <div className="flex items-center gap-2">
                <Repeat2 className="h-4 w-4 text-navy-800" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Repeat paperwork issue</p>
              </div>
              <h2 className="mt-2 font-display text-2xl font-semibold text-navy-950">Seen in {context.repeatCount}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{context.repeatDetail}</p>
              <p className="mt-3 text-xs leading-5 text-slate-500">This is a record pattern, not an employee rating.</p>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="exception-followup-panel">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
                  <MessageSquareText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">What needs to happen next</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">Prepare the office follow-up</h2>
                </div>
              </div>
              <textarea
                value={state.followUpText}
                onChange={(event) => setState((current) => ({ ...current, followUpText: event.target.value }))}
                rows={4}
                aria-label="Ticket follow-up"
                className="mt-5 w-full rounded-2xl border border-slate-200 bg-offwhite p-4 text-sm leading-6 text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
              />
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">Example action only. No customer or driver message is sent from this preview.</p>
                <Button type="button" onClick={handlePrepareFollowUp} data-testid="exception-followup-button">
                  {state.followUpPrepared ? "Follow-Up Ready" : "Prepare Follow-Up"}
                </Button>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="premium-card-dark">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Ready to close?</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-white">
                {state.released ? "Ticket is ready." : readyToClose ? "Ready to mark complete." : "More work is needed."}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/65">Confirm who owns the ticket and complete every required step before closing it.</p>
              <div className="mt-6 grid gap-2">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-semibold text-white/80">
                  <CheckCircle2 className={`h-4 w-4 ${state.owner ? "text-white" : "text-white/30"}`} aria-hidden="true" /> Assigned to someone
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-semibold text-white/80">
                  <CheckCircle2 className={`h-4 w-4 ${allProofReady ? "text-white" : "text-white/30"}`} aria-hidden="true" /> Required work completed
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-semibold text-white/80">
                  <CheckCircle2 className={`h-4 w-4 ${state.followUpPrepared ? "text-white" : "text-white/30"}`} aria-hidden="true" /> Follow-up prepared when needed
                </div>
              </div>
              <Button
                type="button"
                onClick={handleRelease}
                disabled={!readyToClose || state.released}
                data-testid="exception-release-button"
                className="mt-6 w-full bg-white text-navy-950 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {state.released ? "Ready to Close" : "Mark Ready to Close"}
              </Button>
              <button type="button" onClick={handleReset} className="mt-3 w-full text-xs font-semibold text-white/55 hover:text-white">Reset example</button>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Estimated office follow-up</p>
              <p className="mt-3 font-display text-4xl font-semibold text-navy-950">{issue.estimatedMinutesSaved}m</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Example time for handling this record when the missing item, assigned person, and next step are already clear.</p>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="exception-activity-timeline">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-navy-800" aria-hidden="true" />
                <h2 className="font-display text-xl font-semibold text-navy-950">Work history</h2>
              </div>
              <div className="mt-5 grid gap-4">
                {state.activity.map((item) => (
                  <div key={item.id} className="relative pl-5">
                    <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-navy-800" />
                    <p className="text-sm font-semibold text-navy-950">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <p className="mt-8 max-w-4xl text-xs leading-5 text-slate-500">{brand.disclaimer} Example data is shown. Actions in this preview do not contact customers, change billing, or update a live service record.</p>
      </main>
    </Layout>
  );
}
