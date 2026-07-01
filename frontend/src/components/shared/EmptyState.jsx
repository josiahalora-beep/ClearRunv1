import React from "react";
import { cn } from "@/lib/utils";

/** Consistent empty-state pattern used across product/demo pages. */
export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      data-testid="empty-state"
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 px-8 py-14",
        className
      )}
    >
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-1">
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </span>
      )}
      <h3 className="font-display font-semibold text-navy-950 text-lg">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
