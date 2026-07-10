import React from "react";
import { Link } from "react-router-dom";
import { Clock3, Send, ShieldCheck, TimerReset } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { brand, routeExceptionQueue } from "@/data/mockData";

const adminHourlyCost = 25;
const targetSubscriptionPrice = 150;
const sampleMonthlyIssues = 60;
const sampleMinutesPerIssue = 8;
const sampleHours = (sampleMonthlyIssues * sampleMinutesPerIssue) / 60;
const sampleMonthlyCost = sampleHours * adminHourlyCost;
const breakEvenHours = targetSubscriptionPrice / adminHourlyCost;
const breakEvenIssues = Math.ceil((breakEvenHours * 60) / sampleMinutesPerIssue);

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

function TicketRow({ issue }) {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
      <td className="px-5 py-4 align-top">
        <Link to={`/exceptions/${issue.id}`} data-testid={`dashboard-exception-${issue.id}`} className="font-semibold text-navy-950 hover:underline">
          {issue.ticketId}
        </Link>
        <p className="mt-1 text-xs leading-5 text-slate-500">{issue.customer}</p>
      </td>
      <td className="px-4 py-4 align-top text-slate-700">
        <p className="font-semibold text-navy-950">{issue.blocker}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{issue.impact}</p>
      </td>
      <td className="px-4 py-4 align-top">
        <p className="text-sm font-semibold text-navy-950">{issue.owner}</p>
      </td>
      <td className="px-4 py-4 align-top">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {issue.ageLabel}
        </span>
      </td>
      <td className="px-4 py-4 align-top"><StatusPill status={issue.status} /></td>
      <td className="px-4 py-4 align-top text-slate-700">
        <p className="text-sm leading-6">{issue.releaseCondition}</p>
      </td>
    </tr>
  );
}

function TopTicket({ issue }) {
  return (
    <div className="premium-card-dark" data-testid="dashboard-priority-exception">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/52">Top ticket issue</p>
        <StatusPill status={issue.status} />
      </div>
      <h2 className="mt-5 font-display text-4xl font-bold leading-none text-white">{issue.ticketId}</h2>
      <p className="mt-3 text-sm leading-6 text-white/65">{issue.blocker}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="text-[10px] font-semibold uppercase text-white/55">Assigned to</p>
          <p className="mt-1 text-sm font-semibold text-white">{issue.owner}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="text-[10px] font-semibold uppercase text-white/55">Open for</p>
          <p className="mt-1 text-sm font-semibold text-white">{issue.ageLabel}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="text-[10px] font-semibold uppercase text-white/55">Billing</p>
          <p className="mt-1 text-sm font-semibold text-white">{issue.billingSupport}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/55">Next step</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-white">{issue.nextAction}</p>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link to={`/exceptions/${issue.id}`} data-testid="dashboard-resolve-priority-exception">
          <Button className="w-full bg-white text-navy-950 hover:bg-slate-100 sm:w-auto">Open Ticket Issue</Button>
        </Link>
        <Link to="/recovery" data-testid="dashboard-open-exception-queue">
          <Button variant="outline" className="w-full border-white/25 text-white hover:bg-white hover:text-navy-950 sm:w-auto">View Ticket Queue</Button>
        </Link>
      </div>
    </div>
  );
}

function OfficeTimeEstimate() {
  return (
    <div className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="dashboard-value-math">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sample office-time estimate</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-navy-950">What repeated ticket follow-up can cost the office</h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-offwhite px-3 py-1 text-xs font-semibold text-slate-600">Sample assumptions</span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <MetricCard label="Ticket issues" value={sampleMonthlyIssues} note="Sample number of monthly tickets needing follow-up." />
        <MetricCard label="Minutes each" value={`${sampleMinutesPerIssue}m`} note="Sample time spent finding backup and contacting the right person." />
        <MetricCard label="Estimated office cost" value={`$${sampleMonthlyCost}`} note={`Using a sample $${adminHourlyCost}/hour office labor cost.`} />
        <MetricCard label="Break-even volume" value={breakEvenIssues} note="Sample monthly issue count needed to cover a $150 software cost." tone="dark" />
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        These numbers are examples only. Real savings should use the operator’s measured ticket volume, follow-up time, labor cost, and live pilot results.
      </p>
    </div>
  );
}

export default function DashboardOperator() {
  const openIssues = routeExceptionQueue.filter((issue) => issue.status !== "Released");
  const billingHolds = openIssues.filter((issue) => issue.status === "Hold");
  const followUpsNeeded = openIssues.filter((issue) => issue.nextAction);
  const oldestIssue = [...openIssues].sort((a, b) => b.ageHours - a.ageHours)[0] || openIssues[0];
  const sampleOfficeMinutes = openIssues.reduce((total, issue) => total + issue.estimatedMinutesSaved, 0);
  const topIssue = oldestIssue || routeExceptionQueue[0];

  return (
    <Layout>
      <section className="container-page py-10 sm:py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">Route ticket closeout</p>
            <h1 className="mobile-safe-text mt-2 max-w-3xl font-display text-3xl font-bold leading-tight text-navy-950 sm:text-5xl">
              Which route tickets still need attention?
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              See what backup is missing, who owns the follow-up, how long the ticket has been open, and what must happen before billing or customer response.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/route-review/warner-robins-route-b" data-testid="dashboard-route-intelligence-link" className="shrink-0">
              <Button>Review a Route</Button>
            </Link>
            <Link to="/proof-snapshot" data-testid="dashboard-request-snapshot-link" className="shrink-0">
              <Button variant="secondary">Review One Ticket</Button>
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Open ticket issues" value={openIssues.length} note="Tickets still waiting on follow-up or review." />
          <MetricCard label="Billing holds" value={billingHolds.length} note="Records that should wait for backup or office review." />
          <MetricCard label="Oldest open issue" value={oldestIssue?.ageLabel || "—"} note={oldestIssue?.ticketId || "No open ticket"} />
          <MetricCard label="Follow-ups needed" value={followUpsNeeded.length} note={`${sampleOfficeMinutes} sample office minutes across the tickets shown.`} tone="dark" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.76fr_1.24fr]">
          <TopTicket issue={topIssue} />

          <div className="console-card" data-testid="dashboard-exception-activity">
            <div className="console-card-header">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Ticket issues</p>
                <h2 className="mt-1 font-display font-semibold text-navy-950">Tickets that still need work before closeout</h2>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/route-review/warner-robins-route-b" className="text-sm font-semibold text-navy-800 hover:underline">Review route</Link>
                <Link to="/recovery" data-testid="dashboard-proof-table-link" className="text-sm font-semibold text-navy-800 hover:underline">View all tickets</Link>
              </div>
            </div>
            <div className="table-scroll">
              <table data-testid="dashboard-exception-table" className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                    <th className="px-5 py-3 font-medium">Ticket</th>
                    <th className="px-4 py-3 font-medium">Issue</th>
                    <th className="px-4 py-3 font-medium">Assigned to</th>
                    <th className="px-4 py-3 font-medium">Open for</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Before closeout</th>
                  </tr>
                </thead>
                <tbody>{openIssues.map((issue) => <TicketRow key={issue.id} issue={issue} />)}</tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6"><OfficeTimeEstimate /></div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            [ShieldCheck, "Same closeout checklist", "Each ticket is checked for the same required backup before the office marks it ready."],
            [TimerReset, "Old tickets stay visible", "The office can see which tickets have been waiting for hours or days instead of relying on memory or text messages."],
            [Send, "Clear next step", "Each ticket shows who should follow up and what they need to request."],
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
          {brand.disclaimer} The tickets and office-time assumptions shown here are fictional sample data. ClearRun does not make final billing decisions or send real follow-up messages from this demo.
        </p>
      </section>
    </Layout>
  );
}
