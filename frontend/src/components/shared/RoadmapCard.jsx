import React from "react";
import { Compass } from "lucide-react";

/** Polished roadmap placeholder for future modules (CityView, ProofGraph, Infrastructure Intelligence). */
export function RoadmapCard({ icon: Icon = Compass, title, description, bullets = [] }) {
  return (
    <div
      data-testid={`roadmap-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
      className="relative overflow-hidden rounded-2xl border border-navy-900/10 bg-gradient-to-br from-navy-950 to-navy-800 p-8 sm:p-10 text-white shadow-premium"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="relative flex flex-col gap-5 max-w-2xl">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
          On the Roadmap
        </span>
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/10">
          <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">{title}</h2>
        <p className="text-slate-300 text-base leading-relaxed">{description}</p>
        {bullets.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-3 mt-2">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-200">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-slate-400 mt-2">
          Not yet available — this module is planned but not built. No timeline is guaranteed.
        </p>
      </div>
    </div>
  );
}
