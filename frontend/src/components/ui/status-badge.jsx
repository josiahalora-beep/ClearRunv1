import React from "react";
import { cn } from "@/lib/utils";

/**
 * StatusBadge - status pill used across proof packets, requests, audit rows.
 * status: "complete" | "attention" | "incomplete" | "review"
 */
const STATUS_MAP = {
  complete: { label: "Complete", cls: "bg-status-complete-bg text-status-complete border-status-complete/20" },
  attention: { label: "Needs Attention", cls: "bg-status-attention-bg text-status-attention border-status-attention/20" },
  incomplete: { label: "Incomplete", cls: "bg-status-incomplete-bg text-status-incomplete border-status-incomplete/20" },
  review: { label: "Review-Ready", cls: "bg-status-review-bg text-status-review border-status-review/20" },
};

export function StatusBadge({ status, label, className, dot = true }) {
  const cfg = STATUS_MAP[status] || STATUS_MAP.review;
  return (
    <span
      data-testid={`status-badge-${status}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        cfg.cls,
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {label || cfg.label}
    </span>
  );
}
