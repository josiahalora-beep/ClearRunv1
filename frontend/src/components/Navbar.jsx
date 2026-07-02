import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Product",
    testId: "nav-product",
    items: [
      { to: "/dashboard", label: "Dashboard", desc: "Records command center" },
      { to: "/proof", label: "Proof Packets", desc: "Branded proof of service" },
      { to: "/recovery", label: "Recovery", desc: "Close missing-record gaps" },
      { to: "/import", label: "Import", desc: "Bring existing records in" },
      { to: "/export", label: "Export", desc: "Send billing-ready records out" },
    ],
  },
  {
    label: "Solutions",
    testId: "nav-solutions",
    items: [
      { to: "/try-free", label: "Try Free", desc: "Start with your own records" },
      { to: "/proof-mockup", label: "Proof Mockup", desc: "See a branded packet first" },
      { to: "/comparison", label: "Comparison", desc: "Paper, spreadsheets, or ClearRun" },
      { to: "/compatibility", label: "Compatibility", desc: "Works with existing workflows" },
      { to: "/pilot", label: "Pilot Program", desc: "Test with one route or location" },
    ],
  },
  {
    label: "Resources",
    testId: "nav-resources",
    items: [
      { to: "/pricing", label: "Pricing" },
      { to: "/checklist", label: "Readiness Checklist" },
      { to: "/resources", label: "Resources" },
      { to: "/objections", label: "FAQ" },
      { to: "/partners", label: "Partners" },
    ],
  },
  {
    label: "Trust",
    testId: "nav-trust",
    items: [
      { to: "/trust", label: "Trust Center", desc: "Security and record posture" },
      { to: "/reviewer", label: "Reviewer View", desc: "Read-only external record view" },
      { to: "/city-export", label: "City Export", desc: "Municipal summary preview" },
      { to: "/audit", label: "Audit Log", desc: "Record activity history" },
      { to: "/disposal", label: "Disposal", desc: "Linked disposal confirmation" },
      { to: "/cityview", label: "Roadmap", desc: "CityView, ProofGraph, and intelligence" },
    ],
  },
];

function DesktopDropdown({ group }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const isActive = group.items.some((i) => i.to === location.pathname);

  return (
    <div className="relative" ref={ref}>
      <button
        data-testid={group.testId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1 rounded-md px-2.5 py-2 text-[13px] font-semibold transition-colors hover:bg-slate-100",
          isActive ? "text-navy-950" : "text-slate-600"
        )}
      >
        {group.label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-slate-200/80 bg-white p-2 shadow-premium animate-fade-in">
          {group.items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-testid={`nav-link-${item.to.replace("/", "")}`}
              className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50"
            >
              <span className="text-sm font-semibold text-navy-900">{item.label}</span>
              {item.desc && <span className="text-xs text-slate-500">{item.desc}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_GROUPS.map((g) => (
            <DesktopDropdown key={g.label} group={g} />
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/proof-mockup" data-testid="nav-secondary-cta">
            <Button variant="ghost" size="sm">Get a Free Proof Packet Mockup</Button>
          </Link>
          <Link to="/try-free" data-testid="nav-primary-cta">
            <Button size="sm">Start Free Records Trial</Button>
          </Link>
        </div>
        <button
          data-testid="mobile-menu-toggle"
          className="rounded-lg p-2 text-navy-900 transition-colors hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div data-testid="mobile-nav-panel" className="max-h-[80vh] overflow-y-auto border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page flex flex-col gap-4 py-4">
            {NAV_GROUPS.map((g) => (
              <div key={g.label}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{g.label}</p>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {g.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      data-testid={`mobile-nav-link-${item.to.replace("/", "")}`}
                      className="rounded-lg border border-slate-100 px-3 py-2 text-sm font-medium text-navy-800 hover:bg-slate-50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2 border-t border-slate-200 pt-3">
              <Link to="/proof-mockup" data-testid="mobile-nav-secondary-cta">
                <Button variant="secondary" className="w-full">Get a Free Proof Packet Mockup</Button>
              </Link>
              <Link to="/try-free" data-testid="mobile-nav-primary-cta">
                <Button className="w-full">Start Free Records Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
