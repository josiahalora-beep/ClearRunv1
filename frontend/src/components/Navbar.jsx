import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/#how-it-works", label: "How it works" },
  { to: "/proof", label: "Proof Packets" },
  { to: "/proof/PP-10231", label: "Proof Example" },
  { to: "/pricing", label: "Pricing" },
  { to: "/trust", label: "FAQ/Trust" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname, location.hash]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-offwhite/95 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const active = item.to === location.pathname || item.to === `${location.pathname}${location.hash}`;
            return (
              <Link
                key={item.to}
                to={item.to}
                data-testid={`nav-link-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className={cn(
                  "rounded-md px-3 py-2 text-[13px] font-medium transition-colors hover:bg-white",
                  active ? "text-navy-950" : "text-slate-600"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/proof-snapshot" data-testid="nav-primary-cta">
            <Button size="sm">Get Free Proof Snapshot</Button>
          </Link>
        </div>
        <button
          data-testid="mobile-menu-toggle"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          className="rounded-lg p-2 text-navy-900 transition-colors hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div data-testid="mobile-nav-panel" className="border-t border-slate-200 bg-offwhite lg:hidden">
          <div className="container-page flex flex-col gap-2 py-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-800 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/proof-snapshot" data-testid="mobile-nav-primary-cta" className="pt-2">
              <Button className="w-full">Get Free Proof Snapshot</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
