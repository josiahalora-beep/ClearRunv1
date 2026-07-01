import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/data/mockData";

export function DisclaimerBanner({ className, text }) {
  return (
    <div
      data-testid="legal-disclaimer-banner"
      className={cn(
        "flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500",
        className
      )}
    >
      <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
      <p>{text || brand.disclaimer}</p>
    </div>
  );
}
