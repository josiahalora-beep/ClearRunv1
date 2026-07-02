import React from "react";
import { cn } from "@/lib/utils";

/** Section eyebrow + heading + optional description, used at the top of every page. */
export function PageHeader({ eyebrow, title, description, actions, align = "left", className }) {
  return (
    <div
      data-testid="page-header"
      className={cn(
        "flex w-full min-w-0 flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex w-fit items-center rounded-full bg-navy-900/5 border border-navy-900/10 px-3 py-1 text-xs font-semibold tracking-wide text-navy-800 uppercase">
          {eyebrow}
        </span>
      )}
      <h1 className={cn("mobile-safe-text w-full max-w-3xl text-3xl font-bold leading-[1.08] tracking-tight text-navy-950 sm:text-5xl", align === "center" && "mx-auto")}>
        {title}
      </h1>
      {description && (
        <p className={cn("w-full max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
      {actions && <div className={cn("mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap", align === "center" && "sm:justify-center")}>{actions}</div>}
    </div>
  );
}
