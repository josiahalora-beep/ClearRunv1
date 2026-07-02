import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const columns = [
  {
    title: "Product",
    links: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/proof", label: "Proof Packets" },
      { to: "/proof-snapshot", label: "Proof Snapshot" },
      { to: "/recovery", label: "Missing-Record Recovery" },
      { to: "/import", label: "Import" },
      { to: "/export", label: "Export" },
    ],
  },
  {
    title: "Operations",
    links: [
      { to: "/requests", label: "Proof Requests" },
      { to: "/customer", label: "Customer Portal" },
      { to: "/disposal", label: "Disposal Certificates" },
      { to: "/reviewer", label: "Reviewer View" },
      { to: "/city-export", label: "City Export" },
      { to: "/audit", label: "Audit Log" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/pricing", label: "Pricing" },
      { to: "/compatibility", label: "Compatibility" },
      { to: "/comparison", label: "Comparison" },
      { to: "/partners", label: "Partners" },
      { to: "/resources", label: "Resources" },
      { to: "/trust", label: "Trust & Security" },
    ],
  },
  {
    title: "Trust",
    links: [
      { to: "/cityview", label: "CityView" },
      { to: "/proofgraph", label: "ProofGraph" },
      { to: "/intelligence", label: "Infrastructure Intelligence" },
      { to: "/objections", label: "FAQ" },
      { to: "/checklist", label: "Compliance Checklist" },
      { to: "/pilot", label: "Pilot Program" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-navy-950 text-slate-300">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2 flex flex-col gap-4">
            <Logo dark />
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Field proof. Clear records. ClearRun turns messy field service records into branded proof packets and billing-ready exports.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-2.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{col.title}</p>
              {col.links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  data-testid={`footer-link-${l.to.replace("/", "")}`}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} ClearRun Records. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 max-w-xl">
            ClearRun helps organize service proof and record visibility. It does not certify legal compliance or guarantee inspection outcomes.
          </p>
        </div>
      </div>
    </footer>
  );
}
