import React from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, delta, status, className }) {
  return (
    <div data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`} className={cn("surface-card p-5", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="font-display text-3xl font-bold leading-none text-navy-950">{value}</span>
        {status && <StatusBadge status={status} dot={false} label={status === "attention" ? "Attention" : status === "incomplete" ? "Incomplete" : status === "review" ? "Review" : "On Track"} />}
      </div>
      {delta && <p className="mt-2 text-xs text-slate-500">{delta}</p>}
    </div>
  );
}
