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
              {summary.currentRouteStatus}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
              Observed demo route data
            </span>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Route exception intelligence</p>
          <h1 className="mobile-safe-text mt-3 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            {summary.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            {summary.region} · {summary.serviceDate} · {summary.truck} · Lead technician {summary.leadTechnician}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-3 lg:grid-cols-2">
          {[
            ["Scheduled", summary.scheduledStops],
            ["Clean stops", summary.completedWithoutException],
            ["Active exceptions", summary.activeExceptions.length],
            ["Closeout exceptions", summary.closeoutExceptions.length],
            ["Recorded delay", `${summary.recordedDelayMinutes}m`],
            ["Not ready", summary.recordsNotReady],
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

function ConsequenceStrip({ summary }) {
  const items = [
    {
      label: "Truck currently delayed",
      value: summary.activeExceptions.some((item) => item.priority === "Resolve Now") ? "Yes" : "No",
      note: "Based on current demo exceptions.",
    },
    {
      label: "Stops requiring follow-up",
      value: summary.stopsRequiringFollowUp,
      note: "Active exceptions awaiting action.",
    },
    {
      label: "Records blocked from closeout",
      value: summary.recordsNotReady,
      note: "Not in Ready to Close state.",
    },
    {
      label: "Potentially unbillable",
      value: summary.potentiallyUnbillableStops,
      note: "Operational flag, not a billing judgment.",
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

function PrimaryAction({ exception }) {
  if (!exception) return null;

  return (
    <section className="rounded-premium border border-slate-200 bg-navy-950 p-6 text-white shadow-editorial" data-testid="route-primary-action">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityPill priority={exception.priority} />
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/65">
              Primary office action
            </span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white">
            {exception.nextAction}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Highest-priority unresolved exception: {exception.ticketId} · {exception.customer} · {exception.blocker}
          </p>
        </div>
        <Link to={`/exceptions/${exception.id}`} className="shrink-0" data-testid="route-primary-action-link">
          <Button className="w-full bg-white text-navy-950 hover:bg-slate-100 lg:w-auto">
            Work This Exception <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

function ExceptionRow({ exception }) {
  return (
    <article className="border-b border-slate-100 px-4 py-5 last:border-0 sm:px-5" data-testid={`route-exception-${exception.id}`}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityPill priority={exception.priority} />
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
              {exception.exceptionType}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {exception.ageLabel}
            </span>
          </div>
          <Link to={`/exceptions/${exception.id}`} className="mt-3 block font-display text-xl font-semibold leading-tight text-navy-950 hover:underline">
            {exception.ticketId}: {exception.blocker}
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {exception.customer} · Reported {exception.reportedTime} · {exception.serviceOutcome}
          </p>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-3 xl:w-[32rem]">
          <div className="rounded-xl border border-slate-200 bg-offwhite p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Evidence</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-navy-950">{exception.evidenceSummary}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-offwhite p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Owner</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-navy-950">{exception.owner}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-offwhite p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Customer notice</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-navy-950">{exception.customerNotification}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Closeout consequence</p>
          <p className="mt-1 text-sm font-semibold text-navy-950">{exception.closeoutConsequence}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Next action</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-navy-950">{exception.nextAction}</p>
        </div>
        <Link to={`/exceptions/${exception.id}`}>
          <Button variant="secondary" size="sm" className="w-full lg:w-auto">
            Resolve <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </article>
  );
}

function LaneSection({ title, description, icon: Icon, exceptions, testId, emptyMessage }) {
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
              {exceptions.length}
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      {exceptions.length > 0 ? (
        exceptions.map((exception) => <ExceptionRow key={exception.id} exception={exception} />)
      ) : (
        <p className="px-5 py-8 text-sm leading-6 text-slate-500">{emptyMessage}</p>
      )}
    </section>
  );
}

function PatternPanel({ pattern }) {
  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-pattern-panel">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
          <Repeat2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Recurring exception pattern</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">
            {pattern ? pattern.label : "No recurring pattern meets the threshold"}
          </h2>
        </div>
      </div>

      {pattern ? (
        <>
          <p className="mt-5 font-display text-4xl font-semibold text-navy-950">
            {pattern.occurrences} of {pattern.denominator}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-600">{pattern.percentage}% of the relevant sample · {pattern.sampleWindow}</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Affected: {pattern.affectedEntities.join(", ")}.
          </p>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-offwhite p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended office intervention</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{pattern.recommendedIntervention}</p>
          </div>
        </>
      ) : null}

      <p className="mt-4 text-xs leading-5 text-slate-500">
        A recurring signal requires at least 3 observations and at least 20% of the relevant sample. This is not a compliance, employee-performance, or risk score.
      </p>
    </section>
  );
}

function DisposalMatrix({ rows, selectedStatus, onSelect }) {
  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-disposal-matrix">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
          <ReceiptText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Disposal backup matrix</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">Documentation status across the route</h2>
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
        Selecting a row filters route exceptions with that documentation status. ClearRun does not verify disposal and does not expose facility pricing or margins.
      </p>
    </section>
  );
}

function CloseoutSummary({ counts }) {
  const iconByState = {
    "Ready to Close": CheckCircle2,
    "Missing Proof": FileWarning,
    "Follow-Up Needed": Clock3,
    "Service Not Completed": ShieldAlert,
    "Needs Review": AlertTriangle,
  };

  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-closeout-summary">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Route closeout summary</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">What can and cannot close</h2>
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

export default function RouteIntelligence() {
  const { routeId = routeDefinitions[0].id } = useParams();
  const navigate = useNavigate();
  const [laneView, setLaneView] = useState("all");
  const [disposalFilter, setDisposalFilter] = useState("");
  const summary = getRouteSummary(routeId) || getRouteSummary(routeDefinitions[0].id);

  const visibleActive = useMemo(
    () => getRouteExceptions(summary.id, { lane: "active", disposalStatus: disposalFilter }),
    [summary.id, disposalFilter]
  );
  const visibleCloseout = useMemo(
    () => getRouteExceptions(summary.id, { lane: "closeout", disposalStatus: disposalFilter }),
    [summary.id, disposalFilter]
  );

  const handleRouteChange = (event) => {
    setDisposalFilter("");
    setLaneView("all");
    navigate(`/route-intelligence/${event.target.value}`);
  };

  return (
    <Layout>
      <main className="container-page py-10 sm:py-14" data-testid="route-intelligence-page">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:underline">
              <Route className="h-4 w-4" aria-hidden="true" /> Back to exception console
            </Link>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              See what is going wrong on a route, what operational consequences are recorded, and which office action should happen first.
            </p>
          </div>
          <label className="min-w-0 sm:w-72">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Demo route</span>
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
        <div className="mt-5"><ConsequenceStrip summary={summary} /></div>
        <div className="mt-5"><PrimaryAction exception={summary.primaryException} /></div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-navy-950">
            <Filter className="h-4 w-4" aria-hidden="true" /> Queue view
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["all", "Both lanes"],
              ["active", "Active route"],
              ["closeout", "Closeout"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setLaneView(value)}
                data-testid={`route-lane-filter-${value}`}
                className={`rounded-xl px-3 py-2 text-xs font-semibold ${laneView === value ? "bg-navy-950 text-white" : "bg-offwhite text-slate-700 hover:bg-slate-100"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {disposalFilter ? (
          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-status-review/20 bg-status-review-bg px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold text-status-review">Filtering exceptions: {disposalFilter}</span>
            <button type="button" onClick={() => setDisposalFilter("")} className="text-left text-xs font-semibold text-status-review underline sm:text-right">
              Clear filter
            </button>
          </div>
        ) : null}

        <div className="mt-6 grid gap-6">
          {laneView !== "closeout" ? (
            <LaneSection
              title="Active Route Exceptions"
              description="Disruptions that may need immediate dispatch, customer, or service action while the route is operating."
              icon={MapPinned}
              exceptions={visibleActive}
              testId="route-active-lane"
              emptyMessage="No active-route exceptions match the selected disposal filter."
            />
          ) : null}
          {laneView !== "active" ? (
            <LaneSection
              title="Closeout Exceptions"
              description="Evidence and review problems that prevent service records, invoices, or customer proof from being cleanly closed."
              icon={FileWarning}
              exceptions={visibleCloseout}
              testId="route-closeout-lane"
              emptyMessage="No closeout exceptions match the selected disposal filter."
            />
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <PatternPanel pattern={summary.recurringPattern} />
          <DisposalMatrix rows={summary.disposalMatrix} selectedStatus={disposalFilter} onSelect={setDisposalFilter} />
          <CloseoutSummary counts={summary.closeoutCounts} />
        </div>

        <section className="mt-6 rounded-premium border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="font-display text-xl font-semibold text-navy-950">What this page does not do</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            ClearRun does not optimize routes, automatically reroute trucks, verify disposal, make final billing judgments, or score technicians. It organizes observed exceptions, evidence, ownership, closeout consequences, and next actions beside the operator’s existing dispatch and routing tools.
          </p>
        </section>

        <p className="mt-6 max-w-4xl text-xs leading-5 text-slate-500">
          {brand.disclaimer} All route, delay, stop, customer, truck, technician, and pattern data on this page are fictional demonstration records. “Potentially unbillable” is an operational review flag, not a legal or final billing determination.
        </p>
      </main>
    </Layout>
  );
}
