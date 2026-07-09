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

const statusConfig = {
  ready: {
    label: "Ready",
    title: "Ready to Close",
    color: "border-status-complete/25 bg-status-complete-bg text-status-complete",
    dot: "bg-status-complete",
    icon: CheckCircle2,
  },
  review: {
    label: "Review",
    title: "Needs Review",
    color: "border-status-review/25 bg-status-review-bg text-status-review",
    dot: "bg-status-review",
    icon: ShieldCheck,
  },
  missing: {
    label: "Missing",
    title: "Missing Proof",
    color: "border-status-incomplete/25 bg-status-incomplete-bg text-status-incomplete",
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
  { label: "Board", icon: LayoutDashboard, active: true },
  { label: "Records", icon: ClipboardCheck },
  { label: "Queue", icon: ListChecks },
  { label: "Routes", icon: Map },
];

function getStatus(packet) {
  return statusConfig[packet.demoType] || statusConfig.review;
}

function StatusBadge({ packet }) {
  const status = getStatus(packet);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
      {status.label}
    </span>
  );
}

function TopBar({ mobile = false }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-3 py-3 sm:px-5">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3">
        <Logo />
        <div className="hidden flex-1 items-center gap-2 rounded-full border border-slate-200 bg-offwhite px-3 py-2 text-sm text-slate-600 md:flex">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="truncate">Search records</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" aria-label="Home" className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-900 sm:flex">
            <Home className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link to="/closeout-check" data-testid="proof-dashboard-top-cta">
            <Button size="sm">Free Check</Button>
          </Link>
          {!mobile && (
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

function KpiCard({ label, value, mobile }) {
  return (
    <div className={`${mobile ? "w-28 shrink-0" : ""} rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-card`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-navy-950">{value}</p>
    </div>
  );
}

function KpiRow({ mobile = false }) {
  return (
    <div className={mobile ? "flex gap-2 overflow-x-auto pb-1" : "grid grid-cols-4 gap-3"} tabIndex={mobile ? 0 : undefined} role={mobile ? "region" : undefined} aria-label={mobile ? "Dashboard metric cards" : undefined}>
      {kpis.map((item) => <KpiCard key={item.label} {...item} mobile={mobile} />)}
    </div>
  );
}

function BoardRecord({ packet }) {
  const status = getStatus(packet);
  const Icon = status.icon;
  return (
    <Link to={`/proof/${packet.id}`} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${status.color}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-navy-950">{status.title}</p>
          <p className="text-xs text-slate-600">{packet.missingProofCount} missing · {packet.weakBackupCount} weak</p>
        </div>
        <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
      </div>
    </Link>
  );
}

function BoardPanel({ mobile = false }) {
  return (
    <section className={`${mobile ? "w-80 shrink-0" : ""} overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-premium`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Workspace</p>
          <h2 className="font-display text-lg font-semibold text-navy-950">Closeout Board</h2>
        </div>
        <button type="button" aria-label="Filter records" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-offwhite text-navy-900">
          <Filter className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="bg-offwhite p-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-950 text-white">
            <FileCheck2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <div className="grid gap-3">
            {proofPackets.map((packet) => <BoardRecord key={packet.id} packet={packet} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function PacketCard({ packet, mobile = false }) {
  const status = getStatus(packet);
  const Icon = status.icon;
  return (
    <Link to={`/proof/${packet.id}`} data-testid={`proof-card-${packet.id}`} className={`${mobile ? "w-72 shrink-0" : ""} rounded-3xl border border-slate-200 bg-white p-4 shadow-card hover:shadow-card-hover`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${status.color}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-navy-950">{status.title}</p>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-600">{packet.customer}</p>
          </div>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-offwhite p-2"><p className="text-[10px] font-semibold uppercase text-slate-600">Missing</p><p className="font-display text-xl font-semibold text-navy-950">{packet.missingProofCount}</p></div>
        <div className="rounded-xl bg-offwhite p-2"><p className="text-[10px] font-semibold uppercase text-slate-600">Weak</p><p className="font-display text-xl font-semibold text-navy-950">{packet.weakBackupCount}</p></div>
        <div className="rounded-xl bg-offwhite p-2"><p className="text-[10px] font-semibold uppercase text-slate-600">Photos</p><p className="font-display text-xl font-semibold text-navy-950">{packet.photos}</p></div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3"><StatusBadge packet={packet} /><span className="text-xs font-semibold text-navy-800">Open</span></div>
    </Link>
  );
}

function MobileNav() {
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-3xl border border-slate-200 bg-white p-2 shadow-premium lg:hidden" aria-label="Proof dashboard navigation">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} type="button" className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold ${item.active ? "bg-navy-950 text-white" : "text-slate-600"}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function MobileDashboard() {
  return (
    <div className="min-h-screen bg-offwhite pb-24 lg:hidden">
      <TopBar mobile />
      <main className="px-3 py-4">
        <section className="mb-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-navy-700">Proof Dashboard</p><h1 className="font-display text-2xl font-bold tracking-tight text-navy-950">Closeout board</h1></section>
        <KpiRow mobile />
        <section className="mt-3 flex gap-3 overflow-x-auto pb-2" tabIndex={0} role="region" aria-label="Swipe dashboard panels">
          <BoardPanel mobile />
          <div className="w-80 shrink-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-premium">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Queue</p><h2 className="font-display text-lg font-semibold text-navy-950">3 examples</h2></div><StatusBadge packet={proofPackets[2]} /></div>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1" tabIndex={0} role="region" aria-label="Swipe proof packet examples">
              {proofPackets.map((packet) => <PacketCard key={packet.id} packet={packet} mobile />)}
            </div>
          </div>
        </section>
        <p className="mt-2 px-1 text-[11px] leading-5 text-slate-600">Swipe sideways. Tap a record to open the proof packet.</p>
      </main>
      <MobileNav />
    </div>
  );
}

function DesktopDashboard() {
  return (
    <div className="hidden min-h-screen bg-offwhite text-navy-950 lg:block">
      <TopBar />
      <main className="mx-auto flex w-full max-w-screen-2xl gap-5 px-6 py-5">
        <DesktopRail />
        <div className="min-w-0 flex-1">
          <section className="mb-4 grid gap-4 lg:grid-cols-2 lg:items-end">
            <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-navy-700">Proof Packet Demo Dashboard</p><h1 className="font-display text-4xl font-bold tracking-tight text-navy-950">Closeout decisions, not packet clutter.</h1></div>
            <div className="flex justify-end gap-2"><Link to="/closeout-check" data-testid="proof-primary-cta"><Button>Get Free Check</Button></Link><Link to="/proof/PP-10234" data-testid="proof-secondary-cta"><Button variant="secondary">Missing Example</Button></Link></div>
          </section>
          <KpiRow />
          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2"><BoardPanel /></div>
            <aside className="flex flex-col gap-3"><div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card"><p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Closeout queue</p><h2 className="font-display text-xl font-semibold text-navy-950">3 records</h2></div>{proofPackets.map((packet) => <PacketCard key={packet.id} packet={packet} />)}</aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Proof() {
  return (<><MobileDashboard /><DesktopDashboard /></>);
}
