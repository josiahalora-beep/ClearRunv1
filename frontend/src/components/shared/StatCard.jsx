import React from "react";
import { cn } from "@/lib/utils";

const dotStyles = {
  complete: "bg-emerald-600",
  attention: "bg-amber-600",
  incomplete: "bg-slate-500",
  review: "bg-navy-700",
};

export function StatCard({ label, value, delta, status, className }) {
  return (
    <div
      data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className={cn("surface-card p-5 shadow-sm shadow-slate-900/5", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-[12rem] text-xs font-semibold uppercase text-slate-500">{label}</p>
        {status && <span aria-hidden="true" className={cn("mt-1 h-2.5 w-2.5 rounded-full", dotStyles[status] || "bg-slate-400")} />}
      </div>
      <div className="mt-3">
        <span className="font-display text-3xl font-semibold leading-none text-navy-950">{value}</span>
      </div>
      {delta && <p className="mt-3 text-sm leading-5 text-slate-500">{delta}</p>}
    </div>
  );
}
