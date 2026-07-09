import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileWarning, MessageSquareText } from "lucide-react";

const findings = [
  ["Service photo", "Missing", "incomplete"],
  ["Signature", "Missing", "incomplete"],
  ["Disposal backup", "Weak match", "attention"],
  ["Invoice support", "Not ready", "attention"],
];

const toneClass = {
  incomplete: "bg-status-incomplete-bg text-status-incomplete border-status-incomplete/30",
  attention: "bg-status-attention-bg text-status-attention border-status-attention/30",
  complete: "bg-status-complete-bg text-status-complete border-status-complete/30",
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Free check output</p>
              <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">
                1 record
              </span>
            </div>

            <h3 className="mt-8 font-display text-4xl font-bold leading-[0.95] text-white">
              4 proof gaps found before closeout.
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/62">
              The free check is a diagnostic: what is missing, why it matters, and what the office should do next.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-[10px] font-semibold uppercase text-white/45">Missing</p>
                <p className="mt-1 font-display text-3xl font-semibold text-white">2</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-[10px] font-semibold uppercase text-white/45">Weak</p>
                <p className="mt-1 font-display text-3xl font-semibold text-white">2</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-[10px] font-semibold uppercase text-white/45">Action</p>
                <p className="mt-1 font-display text-3xl font-semibold text-white">1</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="rounded-2xl border border-slate-200 bg-offwhite p-4">
              <div className="flex items-start gap-3">
                <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-status-incomplete" aria-hidden="true" />
                <div>
                  <p className="font-display text-lg font-semibold text-navy-950">Hold before closing</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Request photo/signature and confirm disposal match before this record is used for invoice backup.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {findings.map(([label, status, tone]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                  <span className="text-sm font-semibold text-navy-950">{label}</span>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${toneClass[tone]}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-navy-800" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Office-ready next message</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-navy-950">
                    “Can you send the service photo, signed ticket, and disposal backup for this stop?”
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 font-semibold text-status-complete">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Diagnostic preview
              </span>
              <Link to="/closeout-check" className="inline-flex items-center gap-1 font-semibold text-navy-800 hover:underline" data-testid="hero-view-proof-link">
                Get this check <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}