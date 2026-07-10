import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileWarning,
  Filter,
  MapPinned,
  Plus,
  ReceiptText,
  Repeat2,
  Route,
  ShieldAlert,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { brand } from "@/data/mockData";
import {
  getPriorityRank,
  getRouteExceptions,
  getRouteSummary,
  routeDefinitions,
} from "@/data/routeIntelligenceData";
import { readCapturedRouteIssues } from "@/data/routeIssueCaptureData";

const priorityClass = {
  "Resolve Now": "border-status-incomplete/30 bg-status-incomplete-bg text-status-incomplete",
  "Same-Day Follow-Up": "border-status-attention/30 bg-status-attention-bg text-status-attention",
  "Closeout Blocked": "border-status-incomplete/30 bg-status-incomplete-bg text-status-incomplete",
  "Invoice Support Needed": "border-status-attention/30 bg-status-attention-bg text-status-attention",
  "Customer Response Needed": "border-status-attention/30 bg-status-attention-bg text-status-attention",
  "Proof Recovery": "border-status-review/30 bg-status-review-bg text-status-review",
  "Internal Review": "border-slate-200 bg-offwhite text-slate-700",
};

function PriorityPill({ priority }) {
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityClass[priority] || priorityClass["Internal Review"]}`}>{priority}</span>;
}

function Metric({ label, value }) {
  return (
    <div className="bg-white p-4 sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-navy-950">{value}</p>
    </div>
  );
}

function IssueCard({ issue, highlighted = false }) {
  return (
    <article data-testid={`route-exception-${issue.id}`} className={`border-b border-slate-100 px-4 py-5 last:border-0 sm:px-5 ${highlighted ? "bg-status-complete-bg/40" : "bg-white"}`}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityPill priority={issue.priority} />
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{issue.exceptionType}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {issue.ageLabel}</span>
            {highlighted ? <span className="rounded-full bg-status-complete-bg px-2.5 py-1 text-xs font-semibold text-status-complete">Just reported</span> : null}
          </div>
          <Link to={`/issues/${issue.id}`} className="mt-3 block font-display text-xl font-semibold leading-tight text-navy-950 hover:underline">
            {issue.ticketId}: {issue.blocker}
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-500">{issue.customer} · Reported {issue.reportedTime} · {issue.serviceOutcome}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 xl:w-[31rem]">
          <div className="rounded-xl border border-slate-200 bg-offwhite p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Ticket backup</p><p className="mt-1 text-xs font-semibold leading-5 text-navy-950">{issue.evidenceSummary}</p></div>
          <div className="rounded-xl border border-slate-200 bg-offwhite p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Assigned to</p><p className="mt-1 text-xs font-semibold leading-5 text-navy-950">{issue.owner}</p></div>
          <div className="rounded-xl border border-slate-200 bg-offwhite p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Customer follow-up</p><p className="mt-1 text-xs font-semibold leading-5 text-navy-950">{issue.customerNotification}</p></div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)_auto] lg:items-center">
        <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Ticket status</p><p className="mt-1 text-sm font-semibold text-navy-950">{issue.closeoutConsequence}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Next step</p><p className="mt-1 text-sm font-semibold leading-6 text-navy-950">{issue.nextAction}</p></div>
        <Link to={`/issues/${issue.id}`}><Button variant="secondary" size="sm" className="w-full lg:w-auto">Open Issue <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Button></Link>
      </div>
    </article>
  );
}

function WorkList({ title, description, icon: Icon, issues, testId, reportedId }) {
  return (
    <section className="overflow-hidden rounded-premium border border-slate-200 bg-white shadow-card" data-testid={testId}>
      <div className="flex items-start gap-3 border-b border-slate-100 bg-offwhite px-4 py-4 sm:px-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900"><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <div><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-xl font-semibold text-navy-950">{title}</h2><span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{issues.length}</span></div><p className="mt-1 text-sm leading-6 text-slate-500">{description}</p></div>
      </div>
      {issues.length ? issues.map((issue) => <IssueCard key={issue.id} issue={issue} highlighted={issue.id === reportedId} />) : <p className="px-5 py-8 text-sm text-slate-500">No issues match the selected filter.</p>}
    </section>
  );
}

function RepeatIssue({ pattern }) {
  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-pattern-panel">
      <div className="flex items-start gap-3"><Repeat2 className="mt-1 h-5 w-5 text-navy-800" aria-hidden="true" /><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Repeat issue</p><h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">{pattern?.label || "No repeat issue found yet"}</h2></div></div>
      {pattern ? <><p className="mt-5 font-display text-4xl font-semibold text-navy-950">{pattern.occurrences} of {pattern.denominator}</p><p className="mt-1 text-sm font-semibold text-slate-600">Seen in {pattern.percentage}% of reviewed records · {pattern.sampleWindow}</p><div className="mt-4 rounded-2xl border border-slate-200 bg-offwhite p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended follow-up</p><p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{pattern.recommendedIntervention}</p></div></> : null}
      <p className="mt-4 text-xs leading-5 text-slate-500">ClearRun only shows a repeat issue after it appears at least 3 times and in at least 20% of reviewed records. This is not an employee score or compliance grade.</p>
    </section>
  );
}

function ReceiptStatus({ rows, selected, onSelect }) {
  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-disposal-matrix">
      <div className="flex items-start gap-3"><ReceiptText className="mt-1 h-5 w-5 text-navy-800" aria-hidden="true" /><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Disposal receipt status</p><h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">Receipts attached to this route</h2></div></div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
        {rows.map((row) => <button key={row.status} type="button" onClick={() => onSelect(selected === row.status ? "" : row.status)} className={`flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left text-sm last:border-0 ${selected === row.status ? "bg-navy-950 text-white" : "bg-white text-navy-950 hover:bg-offwhite"}`}><span className="font-semibold">{row.status}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selected === row.status ? "bg-white/15" : "bg-offwhite text-slate-700"}`}>{row.count}</span></button>)}
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">Select a receipt status to filter the issue list. ClearRun organizes receipt records; it does not confirm disposal or show facility pricing.</p>
    </section>
  );
}

function CloseoutSummary({ counts }) {
  const icons = { "Ready to Close": CheckCircle2, "Missing Proof": FileWarning, "Follow-Up Needed": Clock3, "Service Not Completed": ShieldAlert, "Needs Review": AlertTriangle };
  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-closeout-summary">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Route closeout</p><h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">What is ready and what still needs work</h2>
      <div className="mt-5 grid gap-2">{Object.entries(counts).map(([state, count]) => { const Icon = icons[state] || AlertTriangle; return <div key={state} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-offwhite px-4 py-3"><span className="flex items-center gap-2 text-sm font-semibold text-navy-950"><Icon className="h-4 w-4 text-navy-800" aria-hidden="true" />{state}</span><span className="font-display text-xl font-semibold text-navy-950">{count}</span></div>; })}</div>
    </section>
  );
}

export default function RouteReviewLive() {
  const { routeId = routeDefinitions[0].id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reportedId = searchParams.get("reported") || "";
  const [workView, setWorkView] = useState("all");
  const [receiptFilter, setReceiptFilter] = useState("");
  const [capturedIssues, setCapturedIssues] = useState([]);
  const summary = getRouteSummary(routeId) || getRouteSummary(routeDefinitions[0].id);

  useEffect(() => { setCapturedIssues(readCapturedRouteIssues()); }, [routeId, reportedId]);

  const routeCaptured = useMemo(() => capturedIssues.filter((issue) => issue.routeId === summary.id), [capturedIssues, summary.id]);
  const combine = (lane) => [...getRouteExceptions(summary.id, { lane }), ...routeCaptured.filter((issue) => issue.lane === lane)]
    .filter((issue) => !receiptFilter || issue.disposalStatus === receiptFilter)
    .sort((a, b) => getPriorityRank(a.priority) - getPriorityRank(b.priority) || b.ageHours - a.ageHours);
  const dispatchIssues = combine("active");
  const officeIssues = combine("closeout");
  const allIssues = [...dispatchIssues, ...officeIssues].sort((a, b) => getPriorityRank(a.priority) - getPriorityRank(b.priority));
  const firstIssue = allIssues[0] || summary.primaryException;

  const changeRoute = (event) => { setReceiptFilter(""); setWorkView("all"); navigate(`/route-review/${event.target.value}`); };

  return (
    <Layout>
      <main className="container-page py-10 sm:py-14" data-testid="route-intelligence-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:underline"><Route className="h-4 w-4" aria-hidden="true" /> Back to route tickets</Link><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">See which stops need dispatch, which tickets need office review, and what should be handled first.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="sm:w-64"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Route</span><select value={summary.id} onChange={changeRoute} data-testid="route-selector" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-950">{routeDefinitions.map((route) => <option key={route.id} value={route.id}>{route.name}</option>)}</select></label>
            <Link to={`/report-issue/${summary.id}`} data-testid="route-report-issue-link"><Button className="w-full sm:w-auto"><Plus className="h-4 w-4" aria-hidden="true" /> Report Issue</Button></Link>
          </div>
        </div>

        {reportedId ? <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-status-complete/20 bg-status-complete-bg px-4 py-3 sm:flex-row sm:items-center sm:justify-between" data-testid="route-reported-success"><span className="text-sm font-semibold text-status-complete">Route issue reported and added below.</span><Link to={`/issues/${reportedId}`} className="text-xs font-semibold text-status-complete underline">Open reported issue</Link></div> : null}

        <section className="mt-5 overflow-hidden rounded-premium border border-slate-200 bg-white shadow-editorial" data-testid="route-intelligence-header">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]"><div className="bg-ink p-6 text-white sm:p-8"><span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">Sample route records</span><p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Route review</p><h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">{summary.name}</h1><p className="mt-3 text-sm text-white/65">{summary.serviceDate} · {summary.truck} · Driver {summary.leadTechnician}</p></div><div className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-3 lg:grid-cols-2"><Metric label="Scheduled stops" value={summary.scheduledStops} /><Metric label="Completed cleanly" value={summary.completedWithoutException} /><Metric label="Needs dispatch" value={dispatchIssues.length} /><Metric label="Needs office review" value={officeIssues.length} /><Metric label="Delay logged" value={`${summary.recordedDelayMinutes + routeCaptured.reduce((total, issue) => total + issue.recordedDelayMinutes, 0)}m`} /><Metric label="Not ready to close" value={summary.recordsNotReady + routeCaptured.length} /></div></div>
        </section>

        <section className="mt-5 grid gap-3 rounded-premium border border-slate-200 bg-white p-4 shadow-card md:grid-cols-4" data-testid="route-consequence-strip">
          {[ ["Truck waiting now", dispatchIssues.some((issue) => issue.priority === "Resolve Now") ? "Yes" : "No"], ["Stops needing follow-up", dispatchIssues.length], ["Tickets not ready", summary.recordsNotReady + routeCaptured.length], ["New browser reports", routeCaptured.length] ].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-offwhite p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 font-display text-2xl font-semibold text-navy-950">{value}</p></div>)}
        </section>

        {firstIssue ? <section className="mt-5 rounded-premium bg-navy-950 p-6 text-white shadow-editorial" data-testid="route-primary-action"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex flex-wrap gap-2"><PriorityPill priority={firstIssue.priority} /><span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/65">What needs attention first</span></div><h2 className="mt-4 font-display text-3xl font-semibold">{firstIssue.nextAction}</h2><p className="mt-3 text-sm text-white/65">{firstIssue.ticketId} · {firstIssue.customer} · {firstIssue.blocker}</p></div><Link to={`/issues/${firstIssue.id}`} data-testid="route-primary-action-link"><Button className="w-full bg-white text-navy-950 hover:bg-slate-100">Open Issue <ArrowRight className="h-4 w-4" /></Button></Link></div></section> : null}

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-sm font-semibold text-navy-950"><Filter className="h-4 w-4" /> Show</div><div className="grid grid-cols-3 gap-2">{[["all", "All issues"], ["active", "Dispatch"], ["closeout", "Office review"]].map(([value, label]) => <button key={value} type="button" onClick={() => setWorkView(value)} data-testid={`route-lane-filter-${value}`} className={`rounded-xl px-3 py-2 text-xs font-semibold ${workView === value ? "bg-navy-950 text-white" : "bg-offwhite text-slate-700"}`}>{label}</button>)}</div></div>

        {receiptFilter ? <div className="mt-3 flex justify-between rounded-2xl bg-status-review-bg px-4 py-3 text-sm"><span className="font-semibold text-status-review">Showing receipt status: {receiptFilter}</span><button type="button" onClick={() => setReceiptFilter("")} className="text-xs font-semibold text-status-review underline">Show all</button></div> : null}

        <div className="mt-6 grid gap-6">{workView !== "closeout" ? <WorkList title="Needs Dispatch" description="Stops that need customer contact, driver support, rescheduling, or another same-day decision." icon={MapPinned} issues={dispatchIssues} testId="route-active-lane" reportedId={reportedId} /> : null}{workView !== "active" ? <WorkList title="Needs Office Review" description="Completed stops with missing ticket backup, receipt questions, or billing follow-up before closeout." icon={FileWarning} issues={officeIssues} testId="route-closeout-lane" reportedId={reportedId} /> : null}</div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3"><RepeatIssue pattern={summary.recurringPattern} /><ReceiptStatus rows={summary.disposalMatrix} selected={receiptFilter} onSelect={setReceiptFilter} /><CloseoutSummary counts={summary.closeoutCounts} /></div>

        <p className="mt-6 max-w-4xl text-xs leading-5 text-slate-500">{brand.disclaimer} New issues reported here are saved only in this browser. Photos are not uploaded, and ClearRun does not send messages, reroute trucks, confirm disposal, or make final billing decisions.</p>
      </main>
    </Layout>
  );
}
