import React from "react";
import { cn } from "@/lib/utils";

/** Section eyebrow + heading + optional description, used at the top of every page. */
export function PageHeader({ eyebrow, title, description, actions, align = "left", className }) {
  return (
    <div
      data-testid="page-header"
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex w-fit items-center rounded-full bg-navy-900/5 border border-navy-900/10 px-3 py-1 text-xs font-semibold tracking-wide text-navy-800 uppercase">
          {eyebrow}
        </span>
      )}
      <h1 className={cn("text-4xl sm:text-5xl font-bold tracking-tight text-navy-950 max-w-3xl", align === "center" && "mx-auto")}>
        {title}
      </h1>
      {description && (
        <p className={cn("text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
      {actions && <div className="flex flex-wrap gap-3 mt-1">{actions}</div>}
    </div>
  );
}
