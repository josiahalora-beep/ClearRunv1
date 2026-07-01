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
      { to: "/dashboard", label: "Dashboard", desc: "Command center for records status" },
      { to: "/proof", label: "Proof Packets", desc: "Branded proof of service records" },
      { to: "/recovery", label: "Missing-Record Recovery", desc: "Find and close record gaps" },
      { to: "/import", label: "Import Records", desc: "Bring in existing service data" },
      { to: "/export", label: "Export Records", desc: "Billing-ready & branded exports" },
      { to: "/field", label: "Field Capture", desc: "On-site service documentation" },
    ],
  },
  {
    label: "Customers",
    testId: "nav-customers",
    items: [
      { to: "/requests", label: "Proof Requests", desc: "Request loop with haulers" },
      { to: "/customer", label: "Customer Portal", desc: "Restaurant / customer proof view" },
      { to: "/disposal", label: "Disposal Certificates", desc: "Confirmed disposal records" },
      { to: "/reviewer", label: "Reviewer View", desc: "Read-only inspector-style view" },
      { to: "/city-export", label: "City Export", desc: "Municipal-ready summary export" },
      { to: "/audit", label: "Audit Log", desc: "Who touched what, and when" },
    ],
  },
  {
    label: "Company",
    testId: "nav-company",
    items: [
      { to: "/pricing", label: "Pricing" },
      { to: "/compatibility", label: "Compatibility" },
      { to: "/comparison", label: "Comparison" },
      { to: "/checklist", label: "Compliance Checklist" },
      { to: "/partners", label: "Partners" },
      { to: "/resources", label: "Resources" },
      { to: "/trust", label: "Trust & Security" },
      { to: "/objections", label: "FAQ" },
      { to: "/pilot", label: "Pilot Program" },
    ],
  },
  {
    label: "Roadmap",
    testId: "nav-roadmap",
    items: [
      { to: "/cityview", label: "CityView" },
      { to: "/proofgraph", label: "ProofGraph" },
      { to: "/intelligence", label: "Infrastructure Intelligence" },
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
          "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-slate-100",
          isActive ? "text-navy-950" : "text-slate-600"
        )}
      >
        {group.label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-premium animate-fade-in z-50">
          {group.items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-testid={`nav-link-${item.to.replace("/", "")}`}
              className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors"
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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1">
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
          className="lg:hidden p-2 text-navy-900"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div data-testid="mobile-nav-panel" className="lg:hidden border-t border-slate-200 bg-white max-h-[80vh] overflow-y-auto">
          <div className="container-page py-4 flex flex-col gap-5">
            {NAV_GROUPS.map((g) => (
              <div key={g.label}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">{g.label}</p>
                <div className="flex flex-col gap-1">
                  {g.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      data-testid={`mobile-nav-link-${item.to.replace("/", "")}`}
                      className="rounded-lg px-2 py-2 text-sm font-medium text-navy-800 hover:bg-slate-50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
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
