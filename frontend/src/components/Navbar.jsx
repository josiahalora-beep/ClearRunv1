import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/#how-it-works", label: "How it works" },
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
            <Button size="sm">Get a Free Route Closeout Check</Button>
          </Link>
        </div>
        <button
          data-testid="mobile-menu-toggle"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-white lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-offwhite px-4 pb-4 pt-3 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-slate-200 pt-3">
            <Link to="/proof-snapshot" data-testid="mobile-primary-cta">
              <Button size="sm" className="w-full">Get a Free Route Closeout Check</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
