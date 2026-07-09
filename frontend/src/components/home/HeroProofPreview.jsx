import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ShieldCheck } from "lucide-react";

const closeoutRows = [
  ["Service date", "Found", "complete"],
  ["Customer/site", "Found", "complete"],
  ["Service photo", "Missing", "incomplete"],
  ["Signature", "Missing", "incomplete"],
  ["Disposal backup", "Weak match", "attention"],
  ["Invoice support", "Not ready", "attention"],
];

const toneClass = {
  complete: "bg-status-complete-bg text-status-complete border-status-complete/30",
  incomplete: "bg-status-incomplete-bg text-status-incomplete border-status-incomplete/30",
  attention: "bg-status-attention-bg text-status-attention border-status-attention/30",
};

export default function HeroProofPreview() {
  return (
    <div className="relative animate-fade-in-up">
      <div className="absolute -inset-4 bg-gradient-to-tr from-navy-900/5 to-transparent rounded-3xl -z-10" />
      <div data-testid="hero-proof-preview" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-premium">
        <div className="border-b border-slate-100 bg-navy-950 px-6 py-5 text-white sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-white" aria-hidden="true" />
              <span className="font-display font-semibold text-sm text-white">Can This Record Be Closed?</span>
            </div>
            <span className="rounded-full border border-status-incomplete/30 bg-status-incomplete-bg px-2.5 py-1 text-xs font-semibold text-status-incomplete">
              Missing Proof
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="rounded-xl border border-status-incomplete/20 bg-status-incomplete-bg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-status-incomplete" aria-hidden="true" />
              <div>
                <p className="font-display text-lg font-semibold text-navy-950">Do not close yet</p>
                <p className="mt-1 text-sm leading-6 text-navy-900">
                  Request missing photo/signature and confirm disposal match before closing this route record.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {closeoutRows.map(([label, status, tone]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                <span className="text-sm font-medium text-navy-950">{label}</span>
                <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${toneClass[tone]}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-600">
            <span>Free sample check</span>
            <Link to="/closeout-check" className="font-semibold text-navy-800 hover:underline" data-testid="hero-view-proof-link">
              Get the closeout check →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
