import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileWarning,
  Filter,
  History,
  MapPinned,
  Plus,
  ReceiptText,
  RefreshCcw,
  Repeat2,
  Route,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { brand } from "@/data/mockData";
import { finalStatusOptions } from "@/data/issueResolutionWorkflow";
import {
  contactProgressOptions,
  evidenceProgressOptions,
  filterProjectedIssues,
  getRouteQueueOwners,
  getRouteQueueProjection,
} from "@/data/routeQueueProjection";
import { ROUTE_QUEUE_CHANGE_EVENT } from "@/data/routeQueueEvents";
import { routeDefinitions } from "@/data/routeIntelligenceData";

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

const queueStateClass = {
  Open: "border-status-attention/25 bg-status-attention-bg text-status-attention",
  Reopened: "border-status-review/30 bg-status-review-bg text-status-review",
  Completed: "border-status-complete/30 bg-status-complete-bg text-status-complete",
};

const routeStatusClass = {
  "At Risk": "border-status-incomplete/30 bg-status-incomplete-bg text-status-incomplete",
  "Needs Attention": "border-status-attention/30 bg-status-attention-bg text-status-attention",
  "Ready to Close": "border-status-complete/30 bg-status-complete-bg text-status-complete",
};

const routeStatusLabel = {
  "At Risk": "Action Needed Now",
  "Needs Attention": "Needs Follow-Up",
  "Ready to Close": "Ready to Close",
};

function PriorityPill({ priority }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityClass[priority] || priorityClass["Internal Review"]}`}>
      {priority}
    </span>
  );
}

function QueueStatePill({ label }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${queueStateClass[label] || queueStateClass.Open}`}>
      {label}
    </span>
  );
}

function Metric({ label, value, testId }) {
  return (
    <div className="bg-white p-4 sm:p-5" data-testid={testId}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-navy-950">{value}</p>
    </div>
  );
}

function DetailTile({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-offwhite p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-navy-950">{value || "Not recorded"}</p>
    </div>
  );
}

function IssueCard({ issue, highlighted = false }) {
  const completed = issue.queueState === "completed";
  const reopened = issue.queueState === "reopened";
  const evidenceLabel = issue.evidenceRequirementCount > 0
    ? `${issue.evidenceConfirmedCount} of ${issue.evidenceRequirementCount} confirmed`
    : "No required items";

  return (
    <article
      data-testid={`route-exception-${issue.id}`}
      className={`border-b border-slate-100 px-4 py-5 last:border-0 sm:px-5 ${highlighted ? "bg-status-complete-bg/40" : "bg-white"}`}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityPill priority={issue.priority} />
            <QueueStatePill label={issue.queueStateLabel} />
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
              {issue.exceptionType}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {completed ? issue.resolvedAt || "Completed" : issue.ageLabel}
            </span>
            {highlighted ? (
              <span className="rounded-full bg-status-complete-bg px-2.5 py-1 text-xs font-semibold text-status-complete">Just reported</span>
            ) : null}
            {reopened ? (
              <span className="rounded-full border border-status-review/25 bg-status-review-bg px-2.5 py-1 text-xs font-semibold text-status-review">
                Reopened {issue.reopenedCount} time{issue.reopenedCount === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>

          <Link to={`/issues/${issue.id}`} className="mt-3 block font-display text-xl font-semibold leading-tight text-navy-950 hover:underline">
            {issue.ticketId}: {issue.blocker}
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {issue.customer} · {issue.routeName} · {issue.serviceOutcome}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:w-[32rem]">
          <DetailTile label="Assigned to" value={issue.owner} />
          <DetailTile label="Contact progress" value={issue.contactProgress} />
          <DetailTile label="Ticket backup" value={`${issue.evidenceProgress} · ${evidenceLabel}`} />
          <DetailTile label={completed ? "Final ticket status" : "Ticket status"} value={completed ? issue.finalStatus : issue.closeoutConsequence} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)_auto] lg:items-center">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{completed ? "Resolution reason" : "Work state"}</p>
          <p className="mt-1 text-sm font-semibold text-navy-950">{completed ? issue.resolutionReason : issue.queueStateLabel}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{completed ? "Recorded outcome" : "Next step"}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-navy-950">
            {completed ? `${issue.finalStatus}${issue.resolutionNote ? ` · ${issue.resolutionNote}` : ""}` : issue.nextAction}
          </p>
        </div>
        <Link to={`/issues/${issue.id}`}>
          <Button variant="secondary" size="sm" className="w-full lg:w-auto">
            {completed ? "Review Outcome" : reopened ? "Continue Reopened Issue" : "Open Issue"}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </article>
  );
}

function WorkList({ title, description, icon: Icon, issues, testId, reportedId, emptyMessage }) {
  return (
    <section className="overflow-hidden rounded-premium border border-slate-200 bg-white shadow-card" data-testid={testId}>
      <div className="flex items-start gap-3 border-b border-slate-100 bg-offwhite px-4 py-4 sm:px-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-semibold text-navy-950">{title}</h2>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{issues.length}</span>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      {issues.length > 0 ? (
        issues.map((issue) => <IssueCard key={issue.id} issue={issue} highlighted={issue.id === reportedId} />)
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
        <Repeat2 className="mt-1 h-5 w-5 text-navy-800" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Repeat issue</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">{pattern?.label || "No repeat issue found yet"}</h2>
        </div>
      </div>
      {pattern ? (
        <>
          <p className="mt-5 font-display text-4xl font-semibold text-navy-950">{pattern.occurrences} of {pattern.denominator}</p>
          <p className="mt-1 text-sm font-semibold text-slate-600">Seen in {pattern.percentage}% of reviewed records · {pattern.sampleWindow}</p>
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

function ReceiptStatus({ rows, selected, onSelect }) {
  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-disposal-matrix">
      <div className="flex items-start gap-3">
        <ReceiptText className="mt-1 h-5 w-5 text-navy-800" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Disposal receipt status</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">Receipts attached to this route</h2>
        </div>
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
        {rows.map((row) => (
          <button
            key={row.status}
            type="button"
            onClick={() => onSelect(selected === row.status ? "" : row.status)}
            aria-pressed={selected === row.status}
            className={`flex w-full items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 text-left text-sm last:border-0 ${selected === row.status ? "bg-navy-950 text-white" : "bg-white text-navy-950 hover:bg-offwhite"}`}
          >
            <span className="font-semibold">{row.status}</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selected === row.status ? "bg-white/15 text-white" : "bg-offwhite text-slate-700"}`}>{row.count}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Select a receipt status to filter the queue. ClearRun organizes receipt records; it does not confirm disposal or show facility pricing.
      </p>
    </section>
  );
}

function CloseoutSummary({ counts }) {
  const icons = {
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
          const Icon = icons[state] || AlertTriangle;
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

function OutcomeSummary({ counts }) {
  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-outcome-summary">
      <div className="flex items-start gap-3">
        <History className="mt-1 h-5 w-5 text-navy-800" aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Completed outcomes</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">How completed issues ended</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-2">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-offwhite px-4 py-3">
            <span className="text-sm font-semibold text-navy-950">{status}</span>
            <span className="font-display text-xl font-semibold text-navy-950">{count}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">
        A completed issue is not automatically billing-ready. The final ticket status controls the route closeout count.
      </p>
    </section>
  );
}

function FilterSelect({ label, value, onChange, options, testId, allLabel }) {
  return (
    <label>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        data-testid={testId}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default function RouteReviewLive() {
  const { routeId = routeDefinitions[0].id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reportedId = searchParams.get("reported") || "";
  const [revision, setRevision] = useState(0);
  const [queueState, setQueueState] = useState("open");
  const [workView, setWorkView] = useState("all");
  const [receiptFilter, setReceiptFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [contactFilter, setContactFilter] = useState("");
  const [evidenceFilter, setEvidenceFilter] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("");

  const projection = useMemo(
    () => getRouteQueueProjection(routeId) || getRouteQueueProjection(routeDefinitions[0].id),
    [routeId, reportedId, revision]
  );

  useEffect(() => {
    const refresh = () => setRevision((current) => current + 1);
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(ROUTE_QUEUE_CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(ROUTE_QUEUE_CHANGE_EVENT, refresh);
    };
  }, []);

  const owners = useMemo(() => getRouteQueueOwners(projection.issues), [projection.issues]);
  const filteredIssues = useMemo(() => filterProjectedIssues(projection.issues, {
    queueState,
    lane: workView,
    owner: ownerFilter,
    contactProgress: contactFilter,
    evidenceProgress: evidenceFilter,
    finalStatus: outcomeFilter,
    disposalStatus: receiptFilter,
  }), [projection.issues, queueState, workView, ownerFilter, contactFilter, evidenceFilter, outcomeFilter, receiptFilter]);

  const dispatchIssues = filteredIssues.filter((issue) => issue.queueState !== "completed" && issue.lane === "active");
  const officeIssues = filteredIssues.filter((issue) => issue.queueState !== "completed" && issue.lane === "closeout");
  const completedIssues = filteredIssues.filter((issue) => issue.queueState === "completed");
  const reopenedIssues = filteredIssues.filter((issue) => issue.queueState === "reopened");

  const clearFilters = () => {
    setQueueState("open");
    setWorkView("all");
    setReceiptFilter("");
    setOwnerFilter("");
    setContactFilter("");
    setEvidenceFilter("");
    setOutcomeFilter("");
  };

  const changeRoute = (event) => {
    clearFilters();
    navigate(`/route-review/${event.target.value}`);
  };

  const queueTabs = [
    ["open", "Open", projection.openIssueCount],
    ["completed", "Completed", projection.completedIssueCount],
    ["reopened", "Reopened", projection.reopenedIssueCount],
    ["all", "All", projection.issues.length],
  ];

  const showOpenSections = queueState === "open" || queueState === "all";
  const showCompletedSection = queueState === "completed" || queueState === "all";
  const showReopenedSection = queueState === "reopened";
  const activeFilterCount = [ownerFilter, contactFilter, evidenceFilter, outcomeFilter, receiptFilter].filter(Boolean).length + (workView === "all" ? 0 : 1);

  return (
    <Layout>
      <main className="container-page py-10 sm:py-14" data-testid="route-intelligence-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:underline">
              <Route className="h-4 w-4" aria-hidden="true" /> Back to route tickets
            </Link>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              See open work, completed outcomes, reopened issues, and the route records that are still not ready to close.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="sm:w-64">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Route</span>
              <select value={projection.id} onChange={changeRoute} data-testid="route-selector" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-950">
                {routeDefinitions.map((route) => <option key={route.id} value={route.id}>{route.name}</option>)}
              </select>
            </label>
            <Link to={`/report-issue/${projection.id}`} data-testid="route-report-issue-link">
              <Button className="w-full sm:w-auto"><Plus className="h-4 w-4" aria-hidden="true" /> Report Issue</Button>
            </Link>
          </div>
        </div>

        {reportedId ? (
          <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-status-complete/20 bg-status-complete-bg px-4 py-3 sm:flex-row sm:items-center sm:justify-between" data-testid="route-reported-success">
            <span className="text-sm font-semibold text-status-complete">Route issue reported and added below.</span>
            <Link to={`/issues/${reportedId}`} className="text-xs font-semibold text-status-complete underline">Open reported issue</Link>
          </div>
        ) : null}

        <section className="mt-5 overflow-hidden rounded-premium border border-slate-200 bg-white shadow-editorial" data-testid="route-intelligence-header">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="bg-ink p-6 text-white sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${routeStatusClass[projection.currentRouteStatus]}`}>
                  {routeStatusLabel[projection.currentRouteStatus]}
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">Sample route records</span>
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Route review</p>
              <h1 className="mobile-safe-text mt-3 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">{projection.name}</h1>
              <p className="mt-3 text-sm text-white/65">{projection.serviceDate} · {projection.truck} · Driver {projection.leadTechnician}</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-3 lg:grid-cols-2">
              <Metric label="Scheduled stops" value={projection.scheduledStops} testId="route-metric-scheduled" />
              <Metric label="Completed cleanly" value={projection.completedWithoutException} testId="route-metric-clean" />
              <Metric label="Needs dispatch" value={projection.dispatchIssues.length} testId="route-metric-dispatch" />
              <Metric label="Needs office review" value={projection.officeIssues.length} testId="route-metric-office" />
              <Metric label="Completed issues" value={projection.completedIssueCount} testId="route-metric-completed" />
              <Metric label="Reopened" value={projection.reopenedIssueCount} testId="route-metric-reopened" />
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 rounded-premium border border-slate-200 bg-white p-4 shadow-card md:grid-cols-4" data-testid="route-consequence-strip">
          {[
            ["Truck waiting now", projection.dispatchIssues.some((issue) => issue.priority === "Resolve Now") ? "Yes" : "No", "Based on unresolved route work."],
            ["Open issues", projection.openIssueCount, "Includes reopened work."],
            ["Tickets not ready", projection.recordsNotReady, "Based on final ticket status."],
            ["New browser reports", projection.capturedIssueCount, "Stored only in this browser."],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-offwhite p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-navy-950">{value}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{note}</p>
            </div>
          ))}
        </section>

        {projection.primaryException ? (
          <section className="mt-5 rounded-premium bg-navy-950 p-6 text-white shadow-editorial" data-testid="route-primary-action">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <PriorityPill priority={projection.primaryException.priority} />
                  {projection.primaryException.queueState === "reopened" ? <QueueStatePill label="Reopened" /> : null}
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/65">What needs attention first</span>
                </div>
                <h2 className="mt-4 font-display text-3xl font-semibold leading-tight">{projection.primaryException.nextAction}</h2>
                <p className="mt-3 text-sm text-white/65">{projection.primaryException.ticketId} · {projection.primaryException.customer} · {projection.primaryException.blocker}</p>
              </div>
              <Link to={`/issues/${projection.primaryException.id}`} data-testid="route-primary-action-link">
                <Button className="w-full bg-white text-navy-950 hover:bg-slate-100">Open Issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
              </Link>
            </div>
          </section>
        ) : (
          <section className="mt-5 rounded-premium border border-status-complete/20 bg-status-complete-bg p-6" data-testid="route-primary-action">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-status-complete">No open route issues</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy-950">All reported issues have a recorded outcome.</h2>
          </section>
        )}

        <section className="mt-6 rounded-premium border border-slate-200 bg-white p-4 shadow-card" data-testid="route-queue-controls">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-navy-950">
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Queue state
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {queueTabs.map(([value, label, count]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setQueueState(value)}
                    data-testid={`route-state-filter-${value}`}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold ${queueState === value ? "bg-navy-950 text-white" : "bg-offwhite text-slate-700 hover:bg-slate-100"}`}
                  >
                    {label} <span className="ml-1 opacity-70">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="min-w-0 flex-1 xl:max-w-4xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy-950"><Filter className="h-4 w-4" aria-hidden="true" /> Refine queue</div>
                <button type="button" onClick={clearFilters} className="text-xs font-semibold text-navy-800 hover:underline" data-testid="route-clear-filters">
                  Clear {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"}` : "filters"}
                </button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <FilterSelect label="Assigned to" value={ownerFilter} onChange={setOwnerFilter} options={owners} testId="route-owner-filter" allLabel="All owners" />
                <FilterSelect label="Contact" value={contactFilter} onChange={setContactFilter} options={contactProgressOptions} testId="route-contact-filter" allLabel="All contact states" />
                <FilterSelect label="Ticket backup" value={evidenceFilter} onChange={setEvidenceFilter} options={evidenceProgressOptions} testId="route-evidence-filter" allLabel="All backup states" />
                <FilterSelect label="Final outcome" value={outcomeFilter} onChange={setOutcomeFilter} options={finalStatusOptions} testId="route-outcome-filter" allLabel="All outcomes" />
                <label>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Work lane</span>
                  <select value={workView} onChange={(event) => setWorkView(event.target.value)} aria-label="Work lane" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-navy-950">
                    <option value="all">All issues</option>
                    <option value="active">Dispatch</option>
                    <option value="closeout">Office review</option>
                  </select>
                  <div className="sr-only">
                    <button type="button" data-testid="route-lane-filter-all" onClick={() => setWorkView("all")}>All issues</button>
                    <button type="button" data-testid="route-lane-filter-active" onClick={() => setWorkView("active")}>Dispatch</button>
                    <button type="button" data-testid="route-lane-filter-closeout" onClick={() => setWorkView("closeout")}>Office review</button>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {receiptFilter ? (
            <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-status-review-bg px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="font-semibold text-status-review">Showing receipt status: {receiptFilter}</span>
              <button type="button" onClick={() => setReceiptFilter("")} className="text-left text-xs font-semibold text-status-review underline sm:text-right">Show all receipts</button>
            </div>
          ) : null}
        </section>

        <div className="mt-6 grid gap-6">
          {showOpenSections ? (
            <>
              {workView !== "closeout" ? (
                <WorkList
                  title="Needs Dispatch"
                  description="Stops that need customer contact, driver support, rescheduling, or another same-day decision. Reopened dispatch work returns here."
                  icon={MapPinned}
                  issues={dispatchIssues}
                  testId="route-active-lane"
                  reportedId={reportedId}
                  emptyMessage="No dispatch issues match the selected filters."
                />
              ) : null}
              {workView !== "active" ? (
                <WorkList
                  title="Needs Office Review"
                  description="Completed stops with missing ticket backup, receipt questions, or billing follow-up before closeout. Reopened office work returns here."
                  icon={FileWarning}
                  issues={officeIssues}
                  testId="route-closeout-lane"
                  reportedId={reportedId}
                  emptyMessage="No office-review issues match the selected filters."
                />
              ) : null}
            </>
          ) : null}

          {showCompletedSection ? (
            <WorkList
              title="Completed Outcomes"
              description="Issues with a recorded resolution reason, final ticket status, and completion time. Completion does not automatically mean billing-ready."
              icon={CheckCircle2}
              issues={completedIssues}
              testId="route-completed-lane"
              reportedId={reportedId}
              emptyMessage="No completed issues match the selected filters."
            />
          ) : null}

          {showReopenedSection ? (
            <WorkList
              title="Reopened Work"
              description="Previously completed issues that returned to active work with a recorded reopen reason and preserved history."
              icon={RefreshCcw}
              issues={reopenedIssues}
              testId="route-reopened-lane"
              reportedId={reportedId}
              emptyMessage="No reopened issues match the selected filters."
            />
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <RepeatIssue pattern={projection.recurringPattern} />
          <ReceiptStatus rows={projection.disposalMatrix} selected={receiptFilter} onSelect={setReceiptFilter} />
          <CloseoutSummary counts={projection.closeoutCounts} />
          <OutcomeSummary counts={projection.outcomeCounts} />
        </div>

        <p className="mt-6 max-w-4xl text-xs leading-5 text-slate-500">
          {brand.disclaimer} New issues and workflow changes are saved only in this browser. Prepared follow-up is not sent, evidence is not uploaded, and ClearRun does not reroute trucks, confirm disposal, release invoices, or make final billing decisions.
        </p>
      </main>
    </Layout>
  );
}
