import React from "react";
import { CheckCircle2 } from "lucide-react";

export function LeadFormSuccess({ firstName, message }) {
  return (
    <div data-testid="lead-form-success" className="flex flex-col items-center text-center gap-3 py-10">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-status-complete-bg text-status-complete">
        <CheckCircle2 className="h-6 w-6" />
      </span>
      <h3 className="font-display font-semibold text-lg text-navy-950">You're on the list</h3>
      <p className="text-sm text-slate-500 max-w-sm">
        {message || `Thanks, ${firstName || "there"} — our team will reach out shortly with next steps.`}
      </p>
    </div>
  );
}
