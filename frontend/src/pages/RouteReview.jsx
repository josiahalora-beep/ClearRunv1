import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileWarning,
  Filter,
  MapPinned,
  ReceiptText,
  Repeat2,
  Route,
  ShieldAlert,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { brand } from "@/data/mockData";
import {
  getRouteExceptions,
  getRouteSummary,
  routeDefinitions,
} from "@/data/routeIntelligenceData";

const priorityClass = {
  "Resolve Now": "border-status-incomplete/30 bg-status-incomplete-bg text-status-incomplete",
  "Same-Day Follow-Up": "border-status-attention/30 bg-status-attention-bg text-status-attention",
  "Closeout Blocked": "border-status-incomplete/30 bg-status-incomplete-bg text-status-incomplete",
  "Invoice Support Needed": "border-status-attention/30 bg-status-attention-bg text-status-attention",
  "Customer Response Needed": "border-status-attention/30 bg-status-attention-bg text-status-attention",
  "Proof Recovery": "border-status-review/30 bg-status-review-bg text-status-review",
  "Internal Review": "border-slate-200 bg-offwhite text-slate-700",
  Resolved: "border-status-complete/30 bg-status-complete-bg text-status-complete",
};

const routeStatusLabel = {
  "At Risk": "Action Needed Now",
  "Needs Attention": "Needs Follow-Up",
  "Ready to Close": "Ready to Close",
};

const routeStatusClass = {
  "At Risk": "border-status-incomplete/30 bg-status-incomplete-bg text-status-incomplete",
  "Needs Attention": "border-status-attention/30 bg-status-attention-bg text-status-attention",
  "Ready to Close": "border-status-complete/30 bg-status-complete-bg text-status-complete",
};

function PriorityPill({ priority }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityClass[priority] || priorityClass["Internal Review"]}`}>
      {priority}
    </span>
  );
}

function RouteHeader({ summary }) {
  return (
    <section className="overflow-hidden rounded-premium border border-slate-200 bg-white shadow-editorial" data-testid="route-intelligence-header">
      <div className="grid lg:grid-cols-[minmax(0,1.18fr)_minmax(19rem,0.82fr)]">
        <div className="bg-ink p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${routeStatusClass[summary.currentRouteStatus]}`}>
              {routeStatusLabel[summary.currentRouteStatus]}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
              Sample route records
            </span>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Route review</p>
          <h1 className="mobile-safe-text mt-3 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            {summary.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            {summary.serviceDate} · {summary.truck} · Driver {summary.leadTechnician}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-3 lg:grid-cols-2">
          {[
            ["Scheduled stops", summary.scheduledStops],
            ["Completed cleanly", summary.completedWithoutException],
            ["Needs dispatch", summary.activeExceptions.length],
            ["Needs office review", summary.closeoutExceptions.length],
            ["Delay logged", `${summary.recordedDelayMinutes}m`],
            ["Not ready to close", summary.recordsNotReady],
          ].map(([label, value]) => (
            <div key={label} className="bg-white p-4 sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-navy-950">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RouteSummaryStrip({ summary }) {
  const items = [
    {
      label: "Truck waiting now",
      value: summary.activeExceptions.some((item) => item.priority === "Resolve Now") ? "Yes" : "No",
      note: "Based on the open route issues shown here.",
    },
    {
      label: "Stops needing follow-up",
      value: summary.stopsRequiringFollowUp,
      note: "Dispatch or customer action is still needed.",
    },
    {
      label: "Tickets not ready",
      value: summary.recordsNotReady,
      note: "These records still need work before closeout.",
    },
    {
      label: "Billing review needed",
      value: summary.potentiallyUnbillableStops,
      note: "The office should review before billing.",
    },
  ];

  return (
    <section className="rounded-premium border border-slate-200 bg-white p-4 shadow-card" data-testid="route-consequence-strip">
      <div className="grid gap-3 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-offwhite p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-navy-950">{item.value}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FirstAction({ issue }) {
  if (!issue) return null;

  return (
    <section className="rounded-premium border border-slate-200 bg-navy-950 p-6 text-white shadow-editorial" data-testid="route-primary-action">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityPill priority={issue.priority} />
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/65">
              What needs attention first
            </span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white">
            {issue.nextAction}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/65">
            {issue.ticketId} · {issue.customer} · {issue.blocker}
          </p>
        </div>
        <Link to={`/issues/${issue.id}`} className="shrink-0" data-testid="route-primary-action-link">
          <Button className="w-full bg-white text-navy-950 hover:bg-slate-100 lg:w-auto">
            Open Issue <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

function IssueRow({ issue }) {
  return (
    <article className="border-b border-slate-100 px-4 py-5 last:border-0 sm:px-5" data-testid={`route-exception-${issue.id}`}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityPill priority={issue.priority} />
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
              {issue.exceptionType}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {issue.ageLabel}
            </span>
          </div>
          <Link to={`/issues/${issue.id}`} className="mt-3 block font-display text-xl font-semibold leading-tight text-navy-950 hover:underline">
            {issue.ticketId}: {issue.blocker}
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {issue.customer} · Reported {issue.reportedTime} · {issue.serviceOutcome}
          </p>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-3 xl:w-[32rem]">
          <div className="rounded-xl border border-slate-200 bg-offwhite p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Ticket backup</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-navy-950">{issue.evidenceSummary}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-offwhite p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Assigned to</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-navy-950">{issue.owner}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-offwhite p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Customer contacted</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-navy-950">{issue.customerNotification}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Ticket status</p>
          <p className="mt-1 text-sm font-semibold text-navy-950">{issue.closeoutConsequence}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Next step</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-navy-950">{issue.nextAction}</p>
        </div>
        <Link to={`/issues/${issue.id}`}>
          <Button variant="secondary" size="sm" className="w-full lg:w-auto">
            Open Issue <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </article>
  );
}

function WorkSection({ title, description, icon: Icon, issues, testId, emptyMessage }) {
  return (
    <section className="overflow-hidden rounded-premium border border-slate-200 bg-white shadow-card" data-testid={testId}>
      <div className="flex items-start gap-3 border-b border-slate-100 bg-offwhite px-4 py-4 sm:px-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-semibold text-navy-950">{title}</h2>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
              {issues.length}
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      {issues.length > 0 ? (
        issues.map((issue) => <IssueRow key={issue.id} issue={issue} />)
      ) : (
        <p className="px-5 py-8 text-sm leading-6 text-slate-500">{emptyMessage}</p>
      )}
    </section>
  );
}

function RepeatIssue({ pattern }) {
  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-pattern-panel">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
          <Repeat2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Repeat issue</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">
            {pattern ? pattern.label : "No repeat issue found yet"}
          </h2>
        </div>
      </div>

      {pattern ? (
        <>
          <p className="mt-5 font-display text-4xl font-semibold text-navy-950">
            {pattern.occurrences} of {pattern.denominator}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-600">Seen in {pattern.percentage}% of reviewed records · {pattern.sampleWindow}</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">Affected: {pattern.affectedEntities.join(", ")}.</p>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-offwhite p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended follow-up</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{pattern.recommendedIntervention}</p>
          </div>
        </>
      ) : null}

      <p className="mt-4 text-xs leading-5 text-slate-500">
        ClearRun only shows a repeat issue after it appears at least 3 times and in at least 20% of reviewed records. This is not an employee score or compliance grade.
      </p>
    </section>
  );
}

function DisposalReceiptStatus({ rows, selectedStatus, onSelect }) {
  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-disposal-matrix">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
          <ReceiptText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Disposal receipt status</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">How receipts are attached across this route</h2>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
        {rows.map((row) => {
          const active = selectedStatus === row.status;
          return (
            <button
              key={row.status}
              type="button"
              onClick={() => onSelect(active ? "" : row.status)}
              className={`flex w-full items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 text-left text-sm last:border-0 ${active ? "bg-navy-950 text-white" : "bg-white text-navy-950 hover:bg-offwhite"}`}
              data-testid={`route-disposal-filter-${row.status.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-")}`}
            >
              <span className="font-semibold">{row.status}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-white/15 text-white" : "bg-offwhite text-slate-700"}`}>
                {row.count}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Select a receipt status to see the related route issues. ClearRun organizes the receipt record; it does not confirm disposal or show facility pricing.
      </p>
    </section>
  );
}

function RouteCloseout({ counts }) {
  const iconByState = {
    "Ready to Close": CheckCircle2,
    "Missing Proof": FileWarning,
    "Follow-Up Needed": Clock3,
    "Service Not Completed": ShieldAlert,
    "Needs Review": AlertTriangle,
  };

  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-closeout-summary">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Route closeout</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">What is ready and what still needs work</h2>
      <div className="mt-5 grid gap-2">
        {Object.entries(counts).map(([state, count]) => {
          const Icon = iconByState[state] || AlertTriangle;
          return (
            <div key={state} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-offwhite px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-navy-950">
                <Icon className="h-4 w-4 text-navy-800" aria-hidden="true" /> {state}
              </span>
              <span className="font-display text-xl font-semibold text-navy-950">{count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function RouteReview() {
  const { routeId = routeDefinitions[0].id } = useParams();
  const navigate = useNavigate();
  const [workView, setWorkView] = useState("all");
  const [receiptFilter, setReceiptFilter] = useState("");
  const summary = getRouteSummary(routeId) || getRouteSummary(routeDefinitions[0].id);

  const dispatchIssues = useMemo(
    () => getRouteExceptions(summary.id, { lane: "active", disposalStatus: receiptFilter }),
    [summary.id, receiptFilter]
  );
  const officeIssues = useMemo(
    () => getRouteExceptions(summary.id, { lane: "closeout", disposalStatus: receiptFilter }),
    [summary.id, receiptFilter]
  );

  const handleRouteChange = (event) => {
    setReceiptFilter("");
    setWorkView("all");
    navigate(`/route-review/${event.target.value}`);
  };

  return (
    <Layout>
      <main className="container-page py-10 sm:py-14" data-testid="route-intelligence-page">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:underline">
              <Route className="h-4 w-4" aria-hidden="true" /> Back to route tickets
            </Link>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              See which stops need dispatch, which tickets need office review, and what should be handled first.
            </p>
          </div>
          <label className="min-w-0 sm:w-72">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Route</span>
            <select
              value={summary.id}
              onChange={handleRouteChange}
              data-testid="route-selector"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
            >
              {routeDefinitions.map((route) => <option key={route.id} value={route.id}>{route.name}</option>)}
            </select>
          </label>
        </div>

        <RouteHeader summary={summary} />
        <div className="mt-5"><RouteSummaryStrip summary={summary} /></div>
        <div className="mt-5"><FirstAction issue={summary.primaryException} /></div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-navy-950">
            <Filter className="h-4 w-4" aria-hidden="true" /> Show
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["all", "All issues"],
              ["active", "Dispatch"],
              ["closeout", "Office review"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setWorkView(value)}
                data-testid={`route-lane-filter-${value}`}
                className={`rounded-xl px-3 py-2 text-xs font-semibold ${workView === value ? "bg-navy-950 text-white" : "bg-offwhite text-slate-700 hover:bg-slate-100"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {receiptFilter ? (
          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-status-review/20 bg-status-review-bg px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold text-status-review">Showing receipt status: {receiptFilter}</span>
            <button type="button" onClick={() => setReceiptFilter("")} className="text-left text-xs font-semibold text-status-review underline sm:text-right">
              Show all
            </button>
          </div>
        ) : null}

        <div className="mt-6 grid gap-6">
          {workView !== "closeout" ? (
            <WorkSection
              title="Needs Dispatch"
              description="Stops that need customer contact, driver support, rescheduling, or another same-day decision."
              icon={MapPinned}
              issues={dispatchIssues}
              testId="route-active-lane"
              emptyMessage="No dispatch issues match the selected receipt status."
            />
          ) : null}
          {workView !== "active" ? (
            <WorkSection
              title="Needs Office Review"
              description="Completed stops with missing ticket backup, receipt questions, or billing follow-up before closeout."
              icon={FileWarning}
              issues={officeIssues}
              testId="route-closeout-lane"
              emptyMessage="No office-review issues match the selected receipt status."
            />
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <RepeatIssue pattern={summary.recurringPattern} />
          <DisposalReceiptStatus rows={summary.disposalMatrix} selectedStatus={receiptFilter} onSelect={setReceiptFilter} />
          <RouteCloseout counts={summary.closeoutCounts} />
        </div>

        <section className="mt-6 rounded-premium border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="font-display text-xl font-semibold text-navy-950">Works with the tools your team already uses</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            ClearRun helps dispatch and office staff work route issues and close tickets. It does not replace GPS, routing, dispatch, billing, or driver software.
          </p>
        </section>

        <p className="mt-6 max-w-4xl text-xs leading-5 text-slate-500">
          {brand.disclaimer} All route, stop, customer, truck, driver, delay, and repeat-issue information shown here is fictional sample data. Billing review labels require office confirmation.
        </p>
      </main>
    </Layout>
  );
}
