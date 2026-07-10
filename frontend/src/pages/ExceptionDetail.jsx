import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCheck2,
  History,
  MessageSquareText,
  ShieldAlert,
  UserRoundCheck,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { brand, routeExceptionQueue } from "@/data/mockData";

const ownerOptions = ["Dispatch", "Billing", "Route desk", "Customer service", "Operations manager"];

const statusClass = {
  Hold: "border-status-incomplete/30 bg-status-incomplete-bg text-status-incomplete",
  Review: "border-status-attention/30 bg-status-attention-bg text-status-attention",
  Packet: "border-status-complete/30 bg-status-complete-bg text-status-complete",
  Released: "border-status-complete/30 bg-status-complete-bg text-status-complete",
};

const contextByException = {
  "EX-1048": {
    route: "Perry Route C",
    truck: "Truck 12",
    technician: "T. Okafor",
    disposalLoad: "Load MG-221",
    disposalStatus: "Disposal backup missing",
    disposalDetail: "No job-level or route/load-level disposal backup is attached in this fictional sample.",
    economicImpacts: [
      ["Invoice support at risk", "Ticket remains held until the missing backup is resolved."],
      ["Driver follow-up required", "Dispatch must request the signed ticket and stop photo."],
      ["Route closeout blocked", "This record prevents a clean closeout for the sample route."],
      ["Record aging", "The exception has remained open for two demo days."],
    ],
    repeatSignal: "Observed in 4 of the last 9 fictional sample records on this route.",
    repeatDetail: "Missing signatures or stop photos appear repeatedly. This is an operational pattern signal, not a compliance score.",
  },
  "EX-1052": {
    route: "Warner Robins Route B",
    truck: "Truck 08",
    technician: "M. Chen",
    disposalLoad: "Load WR-118",
    disposalStatus: "Receipt present but unmatched",
    disposalDetail: "A route/load receipt is present, but the quantity relationship is unclear and needs office review.",
    economicImpacts: [
      ["Invoice support needs review", "The record should not be treated as fully supported until the match is clarified."],
      ["Disposal backup unclear", "The receipt exists but does not clearly connect to the recorded gallons."],
      ["Billing review required", "Billing must compare the service record and disposal backup."],
      ["Route closeout delayed", "The sample route remains partially unresolved."],
    ],
    repeatSignal: "Observed in 3 of the last 11 fictional sample records tied to this disposal load pattern.",
    repeatDetail: "Unclear gallon-to-receipt relationships are recurring in the sample. ClearRun does not verify disposal.",
  },
  "EX-1061": {
    route: "Macon Route B",
    truck: "Truck 05",
    technician: "D. Alvarez",
    disposalLoad: "Load MC-304",
    disposalStatus: "Attached at route/load level",
    disposalDetail: "Disposal backup is present at the route/load level; the remaining issue is customer-safe packet assembly.",
    economicImpacts: [
      ["Customer response delayed", "Customer service is waiting for an organized packet."],
      ["Office assembly required", "Internal notes must be separated from the customer-safe proof view."],
      ["Repeat paperwork effort", "The same packet assembly work is being recreated manually."],
      ["Response aging", "The customer request has been open for four demo hours."],
    ],
    repeatSignal: "Observed in 5 of the last 14 fictional customer-proof requests.",
    repeatDetail: "Customer-safe packet assembly is being repeated manually across the sample set.",
  },
  "EX-1067": {
    route: "Macon Route A",
    truck: "Truck 03",
    technician: "J. Reyes",
    disposalLoad: "Load MC-299",
    disposalStatus: "Attached at job level",
    disposalDetail: "Job-level disposal backup is present; the unresolved issue is the missing stop photo.",
    economicImpacts: [
      ["Customer proof weakened", "The packet lacks the visual evidence expected for this sample record."],
      ["Technician follow-up required", "The route desk must request or disposition the missing photo."],
      ["Route closeout blocked", "The record remains held until the photo issue is resolved."],
      ["Office time consumed", "The route desk must reopen work after service completion."],
    ],
    repeatSignal: "Observed in 2 of the last 8 fictional sample records for this technician.",
    repeatDetail: "Missing stop photos recur in the sample, but the count is not a quality or compliance score.",
  },
};

function getExceptionContext(exception) {
  return contextByException[exception.id] || {
    route: exception.routeName,
    truck: "Not assigned in demo",
    technician: "Not assigned in demo",
    disposalLoad: "Not linked in demo",
    disposalStatus: "Office review required",
    disposalDetail: "Disposal backup status has not been classified in this fictional sample.",
    economicImpacts: [
      ["Office follow-up required", exception.impact],
      ["Record aging", `Open for ${exception.ageLabel} in the demo queue.`],
    ],
    repeatSignal: "Not enough fictional sample records to identify a recurring pattern.",
    repeatDetail: "ClearRun should show observed counts without turning them into a score.",
  };
}

function loadDemoState(exception) {
  const initialChecks = Object.fromEntries(exception.proofNeeded.map((item) => [item, false]));
  const fallback = {
    owner: exception.owner,
    proofChecks: initialChecks,
    followUpText: exception.nextAction,
    followUpSent: false,
    released: false,
    activity: [
      { id: "created", label: "Exception created", note: exception.blocker },
      { id: "assigned", label: `Assigned to ${exception.owner}`, note: `Age at review: ${exception.ageLabel}` },
    ],
  };

  if (typeof window === "undefined") return fallback;

  try {
    const saved = window.localStorage.getItem(`clearrun-demo-exception-${exception.id}`);
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch {
    return fallback;
  }
}

function StatusPill({ status }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[status] || statusClass.Review}`}>
      {status}
    </span>
  );
}

function MissingException() {
  return (
    <Layout>
      <section className="container-page py-16">
        <div className="mx-auto max-w-lg rounded-premium border border-slate-200 bg-white p-6 shadow-editorial">
          <ShieldAlert className="h-8 w-8 text-status-incomplete" aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-semibold text-navy-950">Exception not found</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">This demo exception is not available.</p>
          <Link to="/recovery" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to exception queue
          </Link>
        </div>
      </section>
    </Layout>
  );
}

function EconomicImpactPanel({ context }) {
  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="exception-economic-impact">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Economic impact</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">Why the office should work this exception now</h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-offwhite px-3 py-1 text-xs font-semibold text-slate-600">Operational labels, not estimated dollars</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {context.economicImpacts.map(([label, detail]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-offwhite p-4">
            <p className="text-sm font-semibold text-navy-950">{label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContextPanels({ exception, context }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="exception-route-context">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Route context</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-navy-950">Where this exception belongs</h2>
        <div className="mt-5 grid gap-3 text-sm">
          {[
            ["Route", context.route],
            ["Truck", context.truck],
            ["Technician", context.technician],
            ["Service date", exception.serviceDate],
            ["Disposal load", context.disposalLoad],
            ["Customer / record", exception.customer],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <span className="text-slate-500">{label}</span>
              <span className="text-right font-semibold text-navy-950">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="exception-disposal-status">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Disposal backup status</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-navy-950">{context.disposalStatus}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{context.disposalDetail}</p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-offwhite p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Safe interpretation</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">
            ClearRun records whether backup is attached, missing, or ambiguous. It does not verify disposal or expose facility pricing.
          </p>
        </div>
      </section>
    </div>
  );
}

function RepeatSignal({ context }) {
  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="exception-repeat-signal">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Recurring proof gap</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-navy-950">{context.repeatSignal}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{context.repeatDetail}</p>
    </section>
  );
}

export default function ExceptionDetail() {
  const { id } = useParams();
  const exception = routeExceptionQueue.find((item) => item.id === id);
  const [demoState, setDemoState] = useState(() => (exception ? loadDemoState(exception) : null));

  useEffect(() => {
    if (!exception || !demoState || typeof window === "undefined") return;
    window.localStorage.setItem(`clearrun-demo-exception-${exception.id}`, JSON.stringify(demoState));
  }, [demoState, exception]);

  const allProofReady = useMemo(() => {
    if (!exception || !demoState) return false;
    return exception.proofNeeded.every((item) => demoState.proofChecks[item]);
  }, [demoState, exception]);

  if (!exception || !demoState) return <MissingException />;

  const context = getExceptionContext(exception);
  const currentStatus = demoState.released ? "Released" : exception.status;
  const releaseReady = Boolean(demoState.owner) && allProofReady;

  const handleOwnerChange = (event) => {
    const owner = event.target.value;
    setDemoState((current) => ({
      ...current,
      owner,
      activity: [
        { id: `${Date.now()}-owner`, label: `Assigned to ${owner}`, note: "Demo assignment updated in this browser." },
        ...current.activity,
      ],
    }));
  };

  const handleProofToggle = (item) => {
    const nextValue = !demoState.proofChecks[item];
    setDemoState((current) => ({
      ...current,
      proofChecks: { ...current.proofChecks, [item]: nextValue },
      activity: [
        {
          id: `${Date.now()}-${item}`,
          label: nextValue ? `${item} confirmed` : `${item} reopened`,
          note: nextValue ? "Release requirement marked complete." : "Release requirement needs review again.",
        },
        ...current.activity,
      ],
    }));
  };

  const handleFollowUp = () => {
    setDemoState((current) => ({
      ...current,
      followUpSent: true,
      activity: [
        { id: `${Date.now()}-followup`, label: "Follow-up prepared", note: current.followUpText },
        ...current.activity,
      ],
    }));
  };

  const handleRelease = () => {
    if (!releaseReady || demoState.released) return;
    setDemoState((current) => ({
      ...current,
      released: true,
      activity: [
        { id: `${Date.now()}-released`, label: "Ticket released", note: "All demo release requirements were confirmed." },
        ...current.activity,
      ],
    }));
  };

  const handleReset = () => {
    const reset = loadDemoState({ ...exception, id: `${exception.id}-reset` });
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`clearrun-demo-exception-${exception.id}`);
    }
    setDemoState(reset);
  };

  return (
    <Layout>
      <section className="container-page py-10 sm:py-14" data-testid="exception-detail-workflow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/recovery" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:underline">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Exception queue
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">Exception resolution workspace</p>
            <h1 className="mobile-safe-text mt-2 max-w-3xl font-display text-4xl font-bold leading-tight text-navy-950 sm:text-5xl">
              Resolve {exception.ticketId} without losing the work trail.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Assign the blocker, prepare the follow-up, confirm the missing backup, and release the ticket only when its conditions are satisfied.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={currentStatus} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {exception.ageLabel}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.28fr)_minmax(19rem,0.72fr)]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-premium border border-slate-200 bg-white shadow-editorial">
              <div className="grid gap-0 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
                <div className="bg-ink p-6 text-white sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Current blocker</p>
                  <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white">{exception.blocker}</h2>
                  <p className="mt-4 text-sm leading-6 text-white/65">{exception.impact}</p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">Billing support</p>
                      <p className="mt-2 text-sm font-semibold text-white">{exception.billingSupport}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">Customer proof</p>
                      <p className="mt-2 text-sm font-semibold text-white">{exception.customerProof}</p>
                    </div>
                  </div>

                  <Link to={`/proof/${exception.recordId}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white hover:underline">
                    <FileCheck2 className="h-4 w-4" aria-hidden="true" /> View supporting proof record
                  </Link>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
                      <UserRoundCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <label htmlFor="exception-owner" className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned owner</label>
                      <select
                        id="exception-owner"
                        data-testid="exception-owner-select"
                        value={demoState.owner}
                        onChange={handleOwnerChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                      >
                        {ownerOptions.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-offwhite p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Release condition</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{exception.releaseCondition}</p>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Proof requirements</p>
                    <div className="mt-3 grid gap-2">
                      {exception.proofNeeded.map((item) => (
                        <label key={item} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
                          <input
                            type="checkbox"
                            checked={Boolean(demoState.proofChecks[item])}
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

            <EconomicImpactPanel context={context} />
            <ContextPanels exception={exception} context={context} />
            <RepeatSignal context={context} />

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="exception-followup-panel">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
                  <MessageSquareText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Action-ready follow-up</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">Prepare the exact request before anyone starts chasing.</h2>
                </div>
              </div>

              <textarea
                value={demoState.followUpText}
                onChange={(event) => setDemoState((current) => ({ ...current, followUpText: event.target.value }))}
                rows={4}
                className="mt-5 w-full rounded-2xl border border-slate-200 bg-offwhite p-4 text-sm leading-6 text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                aria-label="Follow-up message"
              />

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">Demo only. This records a prepared follow-up in the browser; it does not send a real message.</p>
                <Button type="button" onClick={handleFollowUp} data-testid="exception-followup-button" className="shrink-0">
                  {demoState.followUpSent ? "Follow-Up Prepared" : "Prepare Follow-Up"}
                </Button>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="premium-card-dark">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Release gate</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-white">
                {demoState.released ? "Ticket released." : releaseReady ? "Ready to release." : "Release is still blocked."}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/65">
                {demoState.released
                  ? "The demo activity trail now shows the release decision."
                  : releaseReady
                    ? "The assigned owner and all proof requirements are confirmed."
                    : "Confirm the assigned owner and every proof requirement before release."}
              </p>

              <div className="mt-6 grid gap-2">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-semibold text-white/80">
                  <CheckCircle2 className={`h-4 w-4 ${demoState.owner ? "text-white" : "text-white/30"}`} aria-hidden="true" /> Owner assigned
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-semibold text-white/80">
                  <CheckCircle2 className={`h-4 w-4 ${allProofReady ? "text-white" : "text-white/30"}`} aria-hidden="true" /> Proof requirements confirmed
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-semibold text-white/80">
                  <CheckCircle2 className={`h-4 w-4 ${demoState.followUpSent ? "text-white" : "text-white/30"}`} aria-hidden="true" /> Follow-up prepared when needed
                </div>
              </div>

              <Button
                type="button"
                onClick={handleRelease}
                disabled={!releaseReady || demoState.released}
                data-testid="exception-release-button"
                className="mt-6 w-full bg-white text-navy-950 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {demoState.released ? "Released" : "Release Ticket"}
              </Button>
              <button type="button" onClick={handleReset} className="mt-3 w-full text-xs font-semibold text-white/55 hover:text-white">
                Reset browser demo
              </button>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Manual office-time estimate</p>
              <p className="mt-3 font-display text-4xl font-semibold text-navy-950">{exception.estimatedMinutesSaved}m</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Illustrative estimate for this fictional record. ClearRun should use measured or user-entered time before making ROI claims.
              </p>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="exception-activity-timeline">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-navy-800" aria-hidden="true" />
                <h2 className="font-display text-xl font-semibold text-navy-950">Activity history</h2>
              </div>
              <div className="mt-5 grid gap-4">
                {demoState.activity.map((item) => (
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

        <p className="mt-8 max-w-4xl text-xs leading-5 text-slate-500">
          {brand.disclaimer} This resolution workspace uses fictional demo data and browser-only state. It does not send messages, store customer records, verify disposal, expose facility pricing, or authorize billing.
        </p>
      </section>
    </Layout>
  );
}
