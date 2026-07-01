import React from "react";
import { cn } from "@/lib/utils";

const LEAD_STATUS_STYLES = {
  "New": "bg-status-review-bg text-status-review border-status-review/20",
  "Reviewed": "bg-slate-100 text-slate-600 border-slate-300",
  "Followed Up": "bg-status-attention-bg text-status-attention border-status-attention/20",
  "Trial Started": "bg-status-complete-bg text-status-complete border-status-complete/20",
  "Not Fit": "bg-status-incomplete-bg text-status-incomplete border-status-incomplete/20",
  "Closed": "bg-slate-100 text-slate-500 border-slate-300",
};

export function LeadStatusBadge({ status, className }) {
  return (
    <span
      data-testid={`lead-status-badge-${status.toLowerCase().replace(/\s+/g, "-")}`}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        LEAD_STATUS_STYLES[status] || LEAD_STATUS_STYLES["New"],
        className
      )}
    >
      {status}
    </span>
  );
}
