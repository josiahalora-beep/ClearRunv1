import React from "react";
import { Link } from "react-router-dom";
import { Clock3, Send, ShieldCheck, TimerReset } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { brand, routeExceptionQueue } from "@/data/mockData";

const adminHourlyCost = 25;
const targetSubscriptionPrice = 150;
const modeledMonthlyExceptions = 60;
const modeledMinutesSaved = 8;
const modeledHoursSaved = (modeledMonthlyExceptions * modeledMinutesSaved) / 60;
const modeledMonthlyValue = modeledHoursSaved * adminHourlyCost;
const breakEvenHours = targetSubscriptionPrice / adminHourlyCost;
const breakEvenExceptions = Math.ceil((breakEvenHours * 60) / modeledMinutesSaved);

const statusClass = {
  Hold: "border-status-incomplete/30 bg-status-incomplete-bg text-status-incomplete",
  Review: "border-status-attention/30 bg-status-attention-bg text-status-attention",
  Packet: "border-status-complete/30 bg-status-complete-bg text-status-complete",
};

const statusLabel = {
  Hold: "Not Ready",
  Review: "Needs Review",
  Packet: "Packet Needed",
};

function StatusPill({ status }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass[status] || statusClass.Review}`}>
      {statusLabel[status] || status}
    </span>
  );
}

function MetricCard({ label, value, note, tone = "default" }) {
  const toneClass = tone === "dark" ? "bg-ink text-white" : "bg-white text-navy-950";
  const noteClass = tone === "dark" ? "text-white/62" : "text-slate-500";

  return (
    <div className={`rounded-[1.5rem] border border-slate-200 p-5 shadow-card ${toneClass}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${noteClass}`}>{label}</p>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
      <p className={`mt-2 text-sm leading-6 ${noteClass}`}>{note}</p>
    </div>
  );
}

function QueueRow({ exception }) {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
      <td className="px-5 py-4 align-top">
        <Link to={`/exceptions/${exception.id}`} data-testid={`dashboard-exception-${exception.id}`} className="font-semibold text-navy-950 hover:underline">
          {exception.ticketId}
        </Link>
        <p className="mt-1 text-xs leading-5 text-slate-500">{exception.customer}</p>
      </td>
      <td className="px-4 py-4 align-top text-slate-700">
        <p className="font-semibold text-navy-950">{exception.blocker}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{exception.impact}</p>
      </td>
      <td className="px-4 py-4 align-top">
        <p className="text-sm font-semibold text-navy-950">{exception.owner}</p>
        <p className="mt-1 text-xs text-slate-500">Assigned to</p>
      </td>
      <td className="px-4 py-4 align-top">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {exception.ageLabel}
        </span>
      </td>
      <td className="px-4 py-4 align-top">
        <StatusPill status={exception.status} />
      </td>
      <td className="px-4 py-4 align-top text-slate-700">
        <p className="text-sm leading-6">{exception.releaseCondition}</p>
      </td>
    </tr>
  );
}

function NextActionPanel({ priority }) {
  return (
    <div className="premium-card-dark" data-testid="dashboard-priority-exception">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/52">First issue to work</p>
        <StatusPill status={priority.status} />
      </div>
      <h2 className="mt-5 font-display text-4xl font-bold leading-none text-white">{priority.ticketId}</h2>
      <p className="mt-3 text-sm leading-6 text-white/65">{priority.blocker}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="text-[10px] font-semibold uppercase text-white/55">Assigned to</p>
          <p className="mt-1 text-sm font-semibold text-white">{priority.owner}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="text-[10px] font-semibold uppercase text-white/55">Open for</p>
          <p className="mt-1 text-sm font-semibold text-white">{priority.ageLabel}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="text-[10px] font-semibold uppercase text-white/55">Billing review</p>
          <p className="mt-1 text-sm font-semibold text-white">{priority.billingSupport}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/55">What needs to happen next</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-white">{priority.nextAction}</p>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link to={`/exceptions/${priority.id}`} data-testid="dashboard-resolve-priority-exception">
          <Button className="w-full bg-white text-navy-950 hover:bg-slate-100 sm:w-auto">Open Issue</Button>
        </Link>
        <Link to="/recovery" data-testid="dashboard-open-exception-queue">
          <Button variant="outline" className="w-full border-white/25 text-white hover:bg-white hover:text-navy-950 sm:w-auto">Open Work List</Button>
        </Link>
      </div>
    </div>
  );
}

function ValueMathPanel() {
  return (
    <div className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="dashboard-value-math">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Example office-time estimate</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-navy-950">See how repeated ticket follow-up can add up.</h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-offwhite px-3 py-1 text-xs font-semibold text-slate-600">Example assumptions</span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <MetricCard label="Monthly issues" value={modeledMonthlyExceptions} note="Example number of route tickets needing office follow-up." />
        <MetricCard label="Time per issue" value={`${modeledMinutesSaved}m`} note="Example time when the owner and next step are already clear." />
        <MetricCard label="Office-time value" value={`$${modeledMonthlyValue}`} note={`Using an example office cost of $${adminHourlyCost}/hour.`} />
        <MetricCard label="Break-even volume" value={`${breakEvenExceptions}`} note={`Issues per month needed to cover an example $${targetSubscriptionPrice} monthly price.`} tone="dark" />
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Example only. Actual time and value should be measured using the operator’s own workload, labor cost, and live pilot results.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const openExceptions = routeExceptionQueue.filter((exception) => exception.status !== "Released");
  const heldExceptions = openExceptions.filter((exception) => exception.status === "Hold");
  const followUpsReady = openExceptions.filter((exception) => exception.nextAction);
  const oldestException = [...openExceptions].sort((a, b) => b.ageHours - a.ageHours)[0] || openExceptions[0];
  const totalEstimatedMinutes = openExceptions.reduce((total, exception) => total + exception.estimatedMinutesSaved, 0);
  const priorityException = oldestException || routeExceptionQueue[0];

  return (
    <Layout>
      <section className="container-page py-10 sm:py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">Office Closeout</p>
            <h1 className="mobile-safe-text mt-2 max-w-3xl font-display text-3xl font-bold leading-tight text-navy-950 sm:text-5xl">
              Which route tickets need attention before billing?
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              See what is missing, who owns the next step, how long it has been open, and what must happen before the record is ready.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/route-intelligence/warner-robins-route-b" data-testid="dashboard-route-intelligence-link" className="shrink-0">
              <Button>Review Route Issues</Button>
            </Link>
            <Link to="/proof-snapshot" data-testid="dashboard-request-snapshot-link" className="shrink-0">
              <Button variant="secondary">Review One Route Ticket</Button>
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Tickets needing attention" value={openExceptions.length} note="Records that still need an owner, proof, or a closeout decision." />
          <MetricCard label="Held from billing" value={heldExceptions.length} note="Records that should wait for supporting information." />
          <MetricCard label="Oldest open issue" value={oldestException?.ageLabel || "—"} note={oldestException?.ticketId || "No open issue"} />
          <MetricCard label="Next steps ready" value={followUpsReady.length} note={`${totalEstimatedMinutes} example minutes of office follow-up represented in this work list.`} tone="dark" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.76fr_1.24fr]">
          <NextActionPanel priority={priorityException} />

          <div className="console-card" data-testid="dashboard-exception-activity">
            <div className="console-card-header">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Tickets needing attention</p>
                <h2 className="mt-1 font-display font-semibold text-navy-950">What still needs follow-up before billing</h2>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/route-intelligence/warner-robins-route-b" className="text-sm font-semibold text-navy-800 hover:underline">
                  Review route issues
                </Link>
                <Link to="/recovery" data-testid="dashboard-proof-table-link" className="text-sm font-semibold text-navy-800 hover:underline">
                  Open work list
                </Link>
              </div>
            </div>
            <div className="table-scroll">
              <table data-testid="dashboard-exception-table" className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                    <th className="px-5 py-3 font-medium">Ticket</th>
                    <th className="px-4 py-3 font-medium">What is wrong</th>
                    <th className="px-4 py-3 font-medium">Assigned to</th>
                    <th className="px-4 py-3 font-medium">Open for</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Ready-to-close requirement</th>
                  </tr>
                </thead>
                <tbody>
                  {openExceptions.map((exception) => <QueueRow key={exception.id} exception={exception} />)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <ValueMathPanel />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            [ShieldCheck, "Same review steps", "Each weak ticket is checked against the same ready-to-close requirements before the office trusts it."],
            [TimerReset, "Old issues stay visible", "The work list shows what has been open for hours or days instead of leaving it in texts or memory."],
            [Send, "Clear next steps", "Each issue has an assigned person and a specific follow-up so dispatch, billing, or customer service can move."],
          ].map(([Icon, title, copy]) => (
            <div key={title} className="surface-card p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900/5 text-navy-900">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-navy-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-4xl text-xs leading-5 text-slate-500">
          {brand.disclaimer} Example records are shown. Actions in this preview do not contact customers, change billing, or update a live route.
        </p>
      </section>
    </Layout>
  );
}

export default Dashboard;
