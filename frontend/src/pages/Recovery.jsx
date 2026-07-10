import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3, Send, ShieldAlert } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { brand, routeExceptionQueue } from "@/data/mockData";

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

function ExceptionCard({ exception }) {
  return (
    <article data-testid={`recovery-item-${exception.id}`} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={exception.status} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-offwhite px-2.5 py-1 text-xs font-semibold text-slate-700">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {exception.ageLabel}
            </span>
          </div>
          <Link to={`/proof/${exception.recordId}`} className="mt-4 block font-display text-2xl font-semibold leading-tight text-navy-950 hover:underline">
            {exception.ticketId}: {exception.blocker}
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-500">{exception.customer} · {exception.serviceType} · {exception.serviceDate}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-offwhite px-4 py-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owner</p>
          <p className="mt-1 font-semibold text-navy-950">{exception.owner}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-offwhite p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next follow-up</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{exception.nextAction}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-offwhite p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Release condition</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{exception.releaseCondition}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {exception.proofNeeded.map((item) => (
            <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              {item}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to="/requests" data-testid={`recovery-request-btn-${exception.id}`}>
            <Button variant="secondary" size="sm" className="w-full sm:w-auto"><Send className="h-3.5 w-3.5" /> Send Follow-Up</Button>
          </Link>
          <Link to={`/proof/${exception.recordId}`} data-testid={`recovery-open-record-${exception.id}`}>
            <Button size="sm" className="w-full sm:w-auto">Open Record <ArrowRight className="h-3.5 w-3.5" /></Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Recovery() {
  const openExceptions = routeExceptionQueue.filter((exception) => exception.status !== "Released");
  const holdCount = openExceptions.filter((exception) => exception.status === "Hold").length;
  const oldest = [...openExceptions].sort((a, b) => b.ageHours - a.ageHours)[0];
  const ownerCount = new Set(openExceptions.map((exception) => exception.owner)).size;

  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">Exception queue</p>
            <h1 className="mobile-safe-text mt-2 max-w-3xl font-display text-4xl font-bold leading-tight text-navy-950 sm:text-5xl">
              Work the route tickets holding up closeout.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              This is the operator-facing queue: blocker, owner, age, follow-up, and release condition before billing support or customer proof use.
            </p>
          </div>
          <Link to="/dashboard" data-testid="recovery-dashboard-link" className="shrink-0">
            <Button variant="secondary">Back to Console</Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Open exceptions</p>
            <p className="mt-2 font-display text-3xl font-semibold text-navy-950">{openExceptions.length}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">Tickets with unresolved backup blockers.</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Held from billing</p>
            <p className="mt-2 font-display text-3xl font-semibold text-navy-950">{holdCount}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">Records that should wait for backup.</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Oldest blocker</p>
            <p className="mt-2 font-display text-3xl font-semibold text-navy-950">{oldest?.ageLabel || "—"}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">Longest unresolved route-ticket issue.</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-ink p-5 text-white shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/55">Owners involved</p>
            <p className="mt-2 font-display text-3xl font-semibold text-white">{ownerCount}</p>
            <p className="mt-2 text-sm leading-6 text-white/62">Work is assigned instead of sitting in memory.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {openExceptions.map((exception) => <ExceptionCard key={exception.id} exception={exception} />)}
        </div>

        <div className="mt-8 rounded-premium border border-slate-200 bg-white p-6 shadow-editorial">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-xl font-semibold text-navy-950">Why this screen matters</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Operators can manually check one ticket. The bottleneck is making every weak ticket visible, assigned, aged, and tied to a release condition before the office trusts it for billing support or customer response.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {["Standard review rules", "Owner assigned", "Release condition"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-offwhite px-3 py-2 text-sm font-semibold text-navy-950">
                    <CheckCircle2 className="h-4 w-4 text-status-complete" aria-hidden="true" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-4xl text-xs leading-5 text-slate-500">
          {brand.disclaimer} Queue data is illustrative and does not represent real customer records, integrations, storage, payments, or automated document generation.
        </p>
      </section>
    </Layout>
  );
}
