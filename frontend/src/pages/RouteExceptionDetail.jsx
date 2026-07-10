import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  History,
  MessageSquareText,
  Route,
  ShieldAlert,
  UserRoundCheck,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { brand } from "@/data/mockData";

const ownerOptions = ["Dispatch", "Billing", "Route desk", "Customer service", "Operations manager"];

const statusClass = {
  Hold: "border-status-incomplete/30 bg-status-incomplete-bg text-status-incomplete",
  Review: "border-status-attention/30 bg-status-attention-bg text-status-attention",
  Released: "border-status-complete/30 bg-status-complete-bg text-status-complete",
};

const statusLabel = {
  Hold: "Not Ready to Close",
  Review: "Needs Review",
  Released: "Resolved",
};

const issueTypeLabel = {
  Access: "access issue",
  Service: "service issue",
  Proof: "missing service proof",
  Disposal: "disposal receipt issue",
  Commercial: "customer follow-up",
};

function StatusPill({ status }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[status] || statusClass.Review}`}>
      {statusLabel[status] || status}
    </span>
  );
}

function loadDemoState(issue) {
  const initialChecks = Object.fromEntries(issue.proofNeeded.map((item) => [item, false]));
  const fallback = {
    owner: issue.owner,
    proofChecks: initialChecks,
    followUpText: issue.nextAction,
    followUpPrepared: false,
    released: false,
    activity: [
      { id: "reported", label: "Issue reported", note: `${issue.reportedTime} · ${issue.blocker}` },
      { id: "assigned", label: `Assigned to ${issue.owner}`, note: issue.resolutionStatus },
    ],
  };

  if (typeof window === "undefined") return fallback;
  try {
    const saved = window.localStorage.getItem(`clearrun-route-exception-${issue.id}`);
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch {
    return fallback;
  }
}

export default function RouteExceptionDetail({ exception }) {
  const [demoState, setDemoState] = useState(() => loadDemoState(exception));

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(`clearrun-route-exception-${exception.id}`, JSON.stringify(demoState));
  }, [demoState, exception.id]);

  const allEvidenceReady = useMemo(
    () => exception.proofNeeded.every((item) => demoState.proofChecks[item]),
    [demoState.proofChecks, exception.proofNeeded]
  );
  const releaseReady = Boolean(demoState.owner) && allEvidenceReady;
  const currentStatus = demoState.released ? "Released" : exception.status;

  const handleOwnerChange = (event) => {
    const owner = event.target.value;
    setDemoState((current) => ({
      ...current,
      owner,
      activity: [
        { id: `${Date.now()}-owner`, label: `Assigned to ${owner}`, note: "Assignment updated." },
        ...current.activity,
      ],
    }));
  };

  const handleEvidenceToggle = (item) => {
    const nextValue = !demoState.proofChecks[item];
    setDemoState((current) => ({
      ...current,
      proofChecks: { ...current.proofChecks, [item]: nextValue },
      activity: [
        {
          id: `${Date.now()}-${item}`,
          label: nextValue ? `${item} confirmed` : `${item} needs attention again`,
          note: nextValue ? "Required step marked complete." : "Required step reopened for review.",
        },
        ...current.activity,
      ],
    }));
  };

  const handlePrepareFollowUp = () => {
    setDemoState((current) => ({
      ...current,
      followUpPrepared: true,
      activity: [
        { id: `${Date.now()}-followup`, label: "Next step prepared", note: current.followUpText },
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
        {
          id: `${Date.now()}-released`,
          label: "Issue marked resolved",
          note: "All required steps were completed in this example.",
        },
        ...current.activity,
      ],
    }));
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`clearrun-route-exception-${exception.id}`);
    }
    setDemoState(loadDemoState({ ...exception, id: `${exception.id}-reset` }));
  };

  return (
    <Layout>
      <main className="container-page py-10 sm:py-14" data-testid="route-exception-detail">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to={`/route-intelligence/${exception.routeId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:underline">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {exception.routeName}
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">Route Issue</p>
            <h1 className="mobile-safe-text mt-2 max-w-4xl font-display text-4xl font-bold leading-tight text-navy-950 sm:text-5xl">
              Work {exception.ticketId}: {issueTypeLabel[exception.exceptionType] || "route issue"}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Review what happened, confirm who owns the next step, complete the required work, and mark the issue resolved when the record is ready.
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
              <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                <div className="bg-ink p-6 text-white sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">What happened</p>
                  <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white">{exception.blocker}</h2>
                  <p className="mt-4 text-sm leading-6 text-white/65">{exception.impact}</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Service result", exception.serviceOutcome],
                      ["Service record status", exception.closeoutConsequence],
                      ["Delay recorded", `${exception.recordedDelayMinutes} minutes`],
                      ["Customer contacted", exception.customerNotification],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">{label}</p>
                        <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
                      <UserRoundCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <label htmlFor="route-exception-owner" className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned to</label>
                      <select
                        id="route-exception-owner"
                        value={demoState.owner}
                        onChange={handleOwnerChange}
                        data-testid="route-exception-owner"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                      >
                        {ownerOptions.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-offwhite p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ready-to-close requirement</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{exception.releaseCondition}</p>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">What must be completed</p>
                    <div className="mt-3 grid gap-2">
                      {exception.proofNeeded.map((item) => (
                        <label key={item} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
                          <input
                            type="checkbox"
                            checked={Boolean(demoState.proofChecks[item])}
                            onChange={() => handleEvidenceToggle(item)}
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

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-exception-context">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
                  <Route className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Route details</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">What the office has on file</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Route", exception.routeName],
                  ["Truck", exception.truck],
                  ["Technician", exception.technician],
                  ["Reported", exception.reportedTime],
                  ["Proof on file", exception.evidenceSummary],
                  ["Disposal receipt", exception.disposalStatus],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-offwhite p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="route-exception-followup">
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
                value={demoState.followUpText}
                onChange={(event) => setDemoState((current) => ({ ...current, followUpText: event.target.value }))}
                rows={4}
                aria-label="Route issue follow-up"
                className="mt-5 w-full rounded-2xl border border-slate-200 bg-offwhite p-4 text-sm leading-6 text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
              />
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">Example action only. No customer or driver message is sent from this preview.</p>
                <Button type="button" onClick={handlePrepareFollowUp} data-testid="route-exception-followup-button">
                  {demoState.followUpPrepared ? "Follow-Up Ready" : "Prepare Follow-Up"}
                </Button>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="premium-card-dark">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Ready to finish?</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-white">
                {demoState.released ? "Issue resolved." : releaseReady ? "Ready to mark resolved." : "More work is needed."}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Confirm who owns the issue and complete every required step before marking it resolved.
              </p>
              <div className="mt-6 grid gap-2">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-semibold text-white/80">
                  <CheckCircle2 className={`h-4 w-4 ${demoState.owner ? "text-white" : "text-white/30"}`} aria-hidden="true" /> Assigned to someone
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-semibold text-white/80">
                  <CheckCircle2 className={`h-4 w-4 ${allEvidenceReady ? "text-white" : "text-white/30"}`} aria-hidden="true" /> Required work completed
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-semibold text-white/80">
                  <CheckCircle2 className={`h-4 w-4 ${demoState.followUpPrepared ? "text-white" : "text-white/30"}`} aria-hidden="true" /> Follow-up prepared when needed
                </div>
              </div>
              <Button
                type="button"
                onClick={handleRelease}
                disabled={!releaseReady || demoState.released}
                data-testid="route-exception-release-button"
                className="mt-6 w-full bg-white text-navy-950 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {demoState.released ? "Resolved" : "Mark Issue Resolved"}
              </Button>
              <button type="button" onClick={handleReset} className="mt-3 w-full text-xs font-semibold text-white/55 hover:text-white">
                Reset example
              </button>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-status-attention" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Billing review</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{exception.billingSupport}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">The office makes the final billing decision.</p>
                </div>
              </div>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-exception-activity">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-navy-800" aria-hidden="true" />
                <h2 className="font-display text-xl font-semibold text-navy-950">Work history</h2>
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
          {brand.disclaimer} Example data is shown. Actions in this preview do not contact customers, change billing, or update a live route.
        </p>
      </main>
    </Layout>
  );
}
