import React from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Filter,
  Home,
  LayoutDashboard,
  ListChecks,
  Map,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { proofPackets } from "@/data/mockData";

const STATUS = {
  ready: {
    label: "Ready",
    full: "Ready to Close",
    tone: "border-status-complete/25 bg-status-complete-bg text-status-complete",
    dot: "bg-status-complete",
    icon: CheckCircle2,
  },
  review: {
    label: "Review",
    full: "Needs Review",
    tone: "border-status-review/25 bg-status-review-bg text-status-review",
    dot: "bg-status-review",
    icon: ShieldCheck,
  },
  missing: {
    label: "Missing",
    full: "Missing Proof",
    tone: "border-status-incomplete/25 bg-status-incomplete-bg text-status-incomplete",
    dot: "bg-status-incomplete",
    icon: AlertTriangle,
  },
};

const kpis = [
  { label: "Records", value: "3" },
  { label: "Ready", value: "1" },
  { label: "Attention", value: "2" },
  { label: "Gaps", value: "4" },
];

const navItems = [
  { icon: LayoutDashboard, label: "Board", active: true },
  { icon: ClipboardCheck, label: "Records" },
  { icon: ListChecks, label: "Queue" },
  { icon: Map, label: "Routes" },
];

function StatusBadge({ packet }) {
  const cfg = STATUS[packet.demoType] || STATUS.review;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${cfg.tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function AppTop({ compact = false }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-5">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
        <Logo />
        <div className="hidden min-w-0 max-w-md flex-1 items-center gap-2 rounded-full border border-slate-200 bg-offwhite px-3 py-2 text-sm text-slate-600 md:flex">
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Search closeout records</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-900 sm:flex" aria-label="Home">
            <Home className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link to="/closeout-check" data-testid="proof-dashboard-top-cta">
            <Button size="sm">Free Check</Button>
          </Link>
          {!compact && (
            <button type="button" aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-900">
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-status-incomplete px-1.5 text-[10px] font-bold text-white">2</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function DesktopRail() {
  return (
    <aside className="hidden h-[calc(100svh-7rem)] w-20 shrink-0 rounded-[1.75rem] bg-navy-950 p-3 text-white shadow-premium lg:flex lg:flex-col lg:items-center">
      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-navy-950">
        <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="mt-8 flex flex-1 flex-col items-center gap-3">
        {navItems.map((item) => (
          <button key={item.label} type="button" aria-label={item.label} className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${item.active ? "bg-white text-navy-950" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
            <item.icon className="h-5 w-5" aria-hidden="true" />
          </button>
        ))}
      </div>
    </aside>
  );
}

function MobileBottomNav() {
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-[1.5rem] border border-slate-200 bg-white/95 p-2 shadow-premium backdrop-blur lg:hidden" aria-label="Proof dashboard navigation">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => (
          <button key={item.label} type="button" className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold ${item.active ? "bg-navy-950 text-white" : "text-slate-600"}`}>
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function KpiRow({ mobile = false }) {
  return (
    <div
      className={mobile ? "flex snap-x gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "grid grid-cols-4 gap-3"}
      tabIndex={mobile ? 0 : undefined}
      role={mobile ? "region" : undefined}
      aria-label={mobile ? "Dashboard metric cards" : undefined}
    >
      {kpis.map((item) => (
        <div key={item.label} className={`${mobile ? "min-w-[7.5rem] snap-start" : ""} rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-card`}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">{item.label}</p>
          <p className="mt-1 font-display text-2xl font-semibold text-navy-950">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function MiniNode({ packet, className = "" }) {
  const cfg = STATUS[packet.demoType] || STATUS.review;
  const Icon = cfg.icon;
  return (
    <Link to={`/proof/${packet.id}`} className={`group absolute rounded-2xl border border-slate-200 bg-white p-3 shadow-card transition-transform hover:-translate-y-1 ${className}`}>
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${cfg.tone}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-navy-950">{cfg.full}</p>
          <p className="text-[10px] font-semibold text-slate-600">{packet.missingProofCount} missing · {packet.weakBackupCount} weak</p>
        </div>
      </div>
    </Link>
  );
}

function BoardCanvas({ mobile = false }) {
  const [ready, review, missing] = proofPackets;
  const heightClass = mobile ? "h-[22rem]" : "h-[32rem]";
  return (
    <section className={`overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-premium ${mobile ? "min-w-[88vw] snap-center" : ""}`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Workspace</p>
          <h2 className="font-display text-lg font-semibold text-navy-950">Closeout Board</h2>
        </div>
        <button type="button" aria-label="Filter records" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-offwhite text-navy-900">
          <Filter className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className={`relative ${heightClass} bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] [background-size:26px_26px]`}>
        <div className="absolute inset-5 rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-offwhite via-white to-slate-100" />
        <div className="absolute left-8 right-8 top-1/2 h-px bg-slate-300/70" />
        <div className="absolute bottom-10 left-1/4 top-10 w-px rotate-12 bg-slate-300/70" />
        <div className="absolute bottom-10 right-1/3 top-12 w-px -rotate-12 bg-slate-300/70" />
        <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-navy-900/10 bg-white shadow-premium sm:h-24 sm:w-24">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-950 text-white sm:h-14 sm:w-14">
            <FileCheck2 className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
        <MiniNode packet={ready} className="left-[5%] top-[12%] w-[10.5rem]" />
        <MiniNode packet={review} className="right-[5%] top-[32%] w-[10.5rem]" />
        <MiniNode packet={missing} className="bottom-[13%] left-[22%] w-[11rem]" />
      </div>
    </section>
  );
}

function PacketCard({ packet, compact = false }) {
  const cfg = STATUS[packet.demoType] || STATUS.review;
  const Icon = cfg.icon;
  return (
    <Link to={`/proof/${packet.id}`} data-testid={`proof-card-${packet.id}`} className={`${compact ? "min-w-[82vw] snap-start" : ""} group rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${cfg.tone}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-navy-950">{cfg.full}</p>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-600">{packet.customer}</p>
          </div>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 group-hover:text-navy-900" aria-hidden="true" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[["Missing", packet.missingProofCount], ["Weak", packet.weakBackupCount], ["Photos", packet.photos]].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-offwhite p-2">
            <p className="text-[10px] font-semibold uppercase text-slate-600">{label}</p>
            <p className="font-display text-xl font-semibold text-navy-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <StatusBadge packet={packet} />
        <span className="text-xs font-semibold text-navy-800">Open</span>
      </div>
    </Link>
  );
}

function MobileDashboard() {
  return (
    <div className="min-h-screen bg-offwhite pb-24 lg:hidden">
      <AppTop compact />
      <main className="px-3 py-4">
        <section className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-navy-700">Proof Dashboard</p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-navy-950">Closeout board</h1>
        </section>
        <KpiRow mobile />
        <section className="mt-3 flex snap-x gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" tabIndex={0} role="region" aria-label="Swipe dashboard panels">
          <BoardCanvas mobile />
          <div className="min-w-[88vw] snap-center rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-premium">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Queue</p>
                <h2 className="font-display text-lg font-semibold text-navy-950">3 examples</h2>
              </div>
              <StatusBadge packet={proofPackets[2]} />
            </div>
            <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" tabIndex={0} role="region" aria-label="Swipe proof packet examples">
              {proofPackets.map((packet) => <PacketCard key={packet.id} packet={packet} compact />)}
            </div>
          </div>
        </section>
        <p className="mt-2 px-1 text-[11px] leading-5 text-slate-600">Swipe sideways. Tap a record to open the proof packet.</p>
      </main>
      <MobileBottomNav />
    </div>
  );
}

function DesktopDashboard() {
  return (
    <div className="hidden min-h-screen bg-offwhite text-navy-950 lg:block">
      <AppTop />
      <main className="mx-auto flex w-full max-w-[1440px] gap-5 px-6 py-5">
        <DesktopRail />
        <div className="min-w-0 flex-1">
          <section className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-700">Proof Packet Demo Dashboard</p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-navy-950">Closeout decisions, not packet clutter.</h1>
            </div>
            <div className="flex justify-end gap-2">
              <Link to="/closeout-check" data-testid="proof-primary-cta"><Button>Get Free Check</Button></Link>
              <Link to="/proof/PP-10234" data-testid="proof-secondary-cta"><Button variant="secondary">Missing Example</Button></Link>
            </div>
          </section>
          <KpiRow />
          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <BoardCanvas />
            <aside className="flex flex-col gap-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Closeout queue</p>
                <h2 className="font-display text-xl font-semibold text-navy-950">3 records</h2>
              </div>
              {proofPackets.map((packet) => <PacketCard key={packet.id} packet={packet} />)}
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Proof() {
  return (
    <>
      <MobileDashboard />
      <DesktopDashboard />
    </>
  );
}
