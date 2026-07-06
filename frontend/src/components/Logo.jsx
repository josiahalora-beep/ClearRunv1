import React from "react";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Logo({ className, dark = false }) {
  return (
    <Link to="/" data-testid="logo-home-link" className={cn("flex items-center gap-2.5 group", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 shadow-sm group-hover:bg-navy-800 transition-colors">
        <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.25} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display font-bold text-[17px] tracking-tight", dark ? "text-white" : "text-navy-950")}>
          ClearRun
        </span>
        <span className={cn("font-display font-medium text-[10px] tracking-[0.18em] uppercase", dark ? "text-slate-300" : "text-slate-600")}>
          Records
        </span>
      </span>
    </Link>
  );
}
