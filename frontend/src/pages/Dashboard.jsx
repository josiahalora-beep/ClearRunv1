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

function StatusPill({ status }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass[status] || statusClass.Review}`}>
      {status}
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
        <p className="mt-1 text-xs text-slate-500">Owner</p>
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
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/52">Priority exception</p>
        <StatusPill status={priority.status} />
      </div>
      <h2 className="mt-5 font-display text-4xl font-bold leading-none text-white">{priority.ticketId}</h2>
      <p className="mt-3 text-sm leading-6 text-white/65">{priority.blocker}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="text-[10px] font-semibold uppercase text-white/55">Owner</p>
          <p className="mt-1 text-sm font-semibold text-white">{priority.owner}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="text-[10px] font-semibold uppercase text-white/55">Age</p>
          <p className="mt-1 text-sm font-semibold text-white">{priority.ageLabel}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="text-[10px] font-semibold uppercase text-white/55">Billing</p>
          <p className="mt-1 text-sm font-semibold text-white">{priority.billingSupport}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/55">Next action</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-white">{priority.nextAction}</p>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link to={`/exceptions/${priority.id}`} data-testid="dashboard-resolve-priority-exception">
          <Button className="w-full bg-white text-navy-950 hover:bg-slate-100 sm:w-auto">Resolve Exception</Button>
        </Link>
        <Link to="/recovery" data-testid="dashboard-open-exception-queue">
          <Button variant="outline" className="w-full border-white/25 text-white hover:bg-white hover:text-navy-950 sm:w-auto">Work Queue</Button>
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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">$150/month add-on math</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-navy-950">The product has to pay for itself in office time.</h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-offwhite px-3 py-1 text-xs font-semibold text-slate-600">Demo model</span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <MetricCard label="Modeled exceptions" value={modeledMonthlyExceptions} note="Monthly weak tickets in a small operator example." />
        <MetricCard label="Minutes saved" value={`${modeledMinutesSaved}m`} note="Per exception if owner, blocker, and follow-up are already clear." />
        <MetricCard label="Modeled value" value={`$${modeledMonthlyValue}`} note={`At $${adminHourlyCost}/hour admin cost.`} />
        <MetricCard label="Break-even" value={`${breakEvenExceptions}`} note="Exceptions/month needed to justify $150 at this model." tone="dark" />
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        This is illustrative math, not a promised customer result. The screen exists to prove why the product must manage repeated exceptions, not just create one proof packet.
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
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">Pre-billing exception console</p>
            <h1 className="mobile-safe-text mt-2 max-w-3xl font-display text-3xl font-bold leading-tight text-navy-950 sm:text-5xl">
              Which route tickets are blocking billing?
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              ClearRun turns messy after-route review into a queue: blocker, owner, age, follow-up, release condition, and customer-proof status.
            </p>
          </div>
          <Link to="/proof-snapshot" data-testid="dashboard-request-snapshot-link" className="shrink-0">
            <Button variant="secondary">Review One Route Ticket</Button>
          </Link>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Open exceptions" value={openExceptions.length} note="Tickets needing owner or release action." />
          <MetricCard label="Held from billing" value={heldExceptions.length} note="Records that should wait for backup." />
          <MetricCard label="Oldest blocker" value={oldestException?.ageLabel || "—"} note={oldestException?.ticketId || "No blocker"} />
          <MetricCard label="Follow-ups ready" value={followUpsReady.length} note={`${totalEstimatedMinutes} modeled minutes of admin rework in this queue.`} tone="dark" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.76fr_1.24fr]">
          <NextActionPanel priority={priorityException} />

          <div className="console-card" data-testid="dashboard-exception-activity">
            <div className="console-card-header">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Exception queue</p>
                <h2 className="mt-1 font-display font-semibold text-navy-950">Tickets that need action before release</h2>
              </div>
              <Link to="/recovery" data-testid="dashboard-proof-table-link" className="text-sm font-semibold text-navy-800 hover:underline">
                Work queue
              </Link>
            </div>
            <div className="table-scroll">
              <table data-testid="dashboard-exception-table" className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                    <th className="px-5 py-3 font-medium">Ticket</th>
                    <th className="px-4 py-3 font-medium">Blocker</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Age</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Release condition</th>
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
            [ShieldCheck, "Standard review rules", "Every weak ticket is reviewed against the same release logic before the office trusts it."],
            [TimerReset, "Aging exceptions", "The queue exposes what has been stuck for hours or days instead of hiding in texts or memory."],
            [Send, "Action-ready follow-up", "Each exception has a concrete owner and next message so dispatch, billing, or service can move."],
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
          {brand.disclaimer} Dashboard data is illustrative and does not represent real customer records, integrations, storage, payments, or automated document generation.
        </p>
      </section>
    </Layout>
  );
}
