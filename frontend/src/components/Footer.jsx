import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const columns = [
  {
    title: "Product",
    links: [
      { to: "/proof-snapshot", label: "Proof Snapshot" },
      { to: "/proof", label: "Proof Packets" },
      { to: "/recovery", label: "Route Cleanup" },
      { to: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/objections", label: "FAQ" },
      { to: "/trust", label: "Trust" },
      { to: "/partners", label: "Partners/Contact" },
    ],
  },
  {
    title: "Legal/Company",
    links: [
      { to: "/trust", label: "Disclaimer" },
      { to: "/resources", label: "Privacy/Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-navy-950 text-slate-300">
      <div className="container-page py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_2fr]">
          <div className="flex max-w-sm flex-col gap-4">
            <Logo dark />
            <p className="text-sm leading-relaxed text-slate-300">
              Field proof. Clear records. ClearRun organizes messy service records into proof packets and missing-field summaries.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-2.5">
                <p className="text-xs font-semibold uppercase text-slate-300">{col.title}</p>
                {col.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-testid={`footer-link-${link.to.replace("/", "")}`}
                    className="text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="max-w-3xl text-xs leading-relaxed text-slate-300">
            ClearRun helps organize service proof and record visibility. It does not certify legal compliance or guarantee inspection outcomes.
          </p>
          <p className="mt-3 text-xs text-slate-300">
            Copyright {new Date().getFullYear()} ClearRun Records. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
