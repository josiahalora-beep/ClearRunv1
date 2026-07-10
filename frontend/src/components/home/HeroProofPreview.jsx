import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileWarning, MessageSquareText } from "lucide-react";

const queueItems = [
  ["GT-1048", "Missing signed ticket", "Dispatch", "2d", "Hold"],
  ["GT-1052", "Disposal gallons mismatch", "Billing", "1d", "Review"],
  ["GT-1061", "Customer backup request", "Service", "4h", "Packet"],
];

const releaseRules = [
  "Signed ticket attached",
  "Stop photo confirmed",
  "Disposal ticket matched",
];

const statusClass = {
  Hold: "bg-status-incomplete-bg text-status-incomplete border-status-incomplete/30",
  Review: "bg-status-attention-bg text-status-attention border-status-attention/30",
  Packet: "bg-status-complete-bg text-status-complete border-status-complete/30",
};

export default function HeroProofPreview() {
  return (
    <div className="relative animate-fade-in-up">
      <div className="premium-gradient-orb bg-grape-300 -right-6 top-10 h-40 w-40 opacity-40" />
      <div className="premium-gradient-orb bg-skyglass-300 -left-6 bottom-4 h-44 w-44 opacity-40" />

      <div data-testid="hero-proof-preview" className="relative overflow-hidden rounded-premium border border-slate-200 bg-white shadow-editorial">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
          <div className="bg-ink p-6 text-white sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Pre-billing queue</p>
              <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/82">
                Route desk
              </span>
            </div>

            <h3 className="mt-8 font-display text-4xl font-bold leading-[0.95] text-white">
              3 tickets held before billing.
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/70">
              ClearRun shows what is blocking each ticket, who owns the follow-up, how old it is, and what has to happen before billing can release it.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-[10px] font-semibold uppercase text-white/68">Exceptions</p>
                <p className="mt-1 font-display text-3xl font-semibold text-white">3</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-[10px] font-semibold uppercase text-white/68">Oldest</p>
                <p className="mt-1 font-display text-3xl font-semibold text-white">2d</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-[10px] font-semibold uppercase text-white/68">Release</p>
                <p className="mt-1 font-display text-3xl font-semibold text-white">1</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="rounded-2xl border border-slate-200 bg-offwhite p-4">
              <div className="flex items-start gap-3">
                <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-status-incomplete" aria-hidden="true" />
                <div>
                  <p className="font-display text-lg font-semibold text-navy-950">Hold ticket GT-1048</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Missing signed service ticket. Owner: Dispatch. Age: 2 days. Release when signed ticket and stop photo are attached.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {queueItems.map(([ticket, blocker, owner, age, status]) => (
                <div key={ticket} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-navy-950">{ticket}</span>
                    <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${statusClass[status]}`}>
                      {status}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-xs text-slate-600">
                    <span className="truncate">{blocker}</span>
                    <span className="font-semibold text-navy-800">{owner} · {age}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-navy-800" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Auto-ready follow-up</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-navy-950">
                    “Can you send the signed service ticket and stop photo for GT-1048 before billing releases this stop?”
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Release checklist</p>
              <div className="mt-3 grid gap-2">
                {releaseRules.map((rule) => (
                  <div key={rule} className="flex items-center gap-2 text-sm font-semibold text-navy-950">
                    <CheckCircle2 className="h-4 w-4 text-status-complete" aria-hidden="true" />
                    {rule}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 font-semibold text-status-complete">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Queue preview
              </span>
              <Link to="/closeout-check" className="inline-flex items-center gap-1 font-semibold text-navy-800 hover:underline" data-testid="hero-view-proof-link">
                Review a ticket <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
