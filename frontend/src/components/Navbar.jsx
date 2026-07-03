import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/proof-snapshot", label: "Proof Snapshot" },
  { to: "/proof", label: "Proof Packets" },
  { to: "/pricing", label: "Pricing" },
  { to: "/objections", label: "FAQ" },
  { to: "/trust", label: "Trust" },
];

function NavLink({ to, label, mobile = false }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "rounded-lg font-semibold transition-colors",
        mobile ? "px-3 py-3 text-sm" : "px-3 py-2 text-[13px]",
        active ? "bg-slate-100 text-navy-950" : "text-slate-600 hover:bg-slate-100 hover:text-navy-950"
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/proof" data-testid="nav-secondary-cta">
            <Button variant="ghost" size="sm">See Proof Example</Button>
          </Link>
          <Link to="/proof-snapshot" data-testid="nav-primary-cta">
            <Button size="sm">Get Free Proof Snapshot</Button>
          </Link>
        </div>

        <button
          type="button"
          data-testid="mobile-menu-toggle"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          className="rounded-lg p-2 text-navy-900 transition-colors hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-nav-panel" data-testid="mobile-nav-panel" className="border-t border-slate-200 bg-white lg:hidden">
          <nav aria-label="Mobile navigation" className="container-page flex flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} {...item} mobile />
            ))}
            <div className="mt-3 grid gap-2 border-t border-slate-200 pt-3">
              <Link to="/proof" data-testid="mobile-nav-secondary-cta">
                <Button variant="secondary" className="w-full">See Proof Example</Button>
              </Link>
              <Link to="/proof-snapshot" data-testid="mobile-nav-primary-cta">
                <Button className="w-full">Get Free Proof Snapshot</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
