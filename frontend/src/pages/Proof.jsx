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
  LayoutDashboard,
  ListChecks,
  Map,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { proofPackets } from "@/data/mockData";

const STATUS_CONFIG = {
  ready: {
    label: "Ready",
    full: "Ready to Close",
    tone: "border-status-complete/25 bg-status-complete-bg text-status-complete",
    dot: "bg-status-complete",
    ring: "ring-status-complete/20",
    icon: CheckCircle2,
  },
  review: {
    label: "Review",
    full: "Needs Review",
    tone: "border-status-review/25 bg-status-review-bg text-status-review",
    dot: "bg-status-review",
    ring: "ring-status-review/20",
    icon: ShieldCheck,
  },
  missing: {
    label: "Missing",
    full: "Missing Proof",
    tone: "border-status-incomplete/25 bg-status-incomplete-bg text-status-incomplete",
    dot: "bg-status-incomplete",
    ring: "ring-status-incomplete/20",
    icon: AlertTriangle,
  },
};

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ClipboardCheck, label: "Records" },
  { icon: ListChecks, label: "Queue" },
  { icon: Map, label: "Routes" },
];

const kpis = [
  { label: "Records", value: "3", note: "demo" },
  { label: "Ready", value: "1", note: "close" },
  { label: "Attention", value: "2", note: "review" },
  { label: "Avg. gaps", value: "1.3", note: "per record" },
];

function StatusPill({ packet }) {
  const cfg = STATUS_CONFIG[packet.demoType] || STATUS_CONFIG.review;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {packet.closeoutStatus}
    </span>
  );
}

function Rail() {
  return (
    <aside className="hidden w-20 shrink-0 rounded-[1.75rem] bg-navy-950 p-3 text-white shadow-premium lg:flex lg:flex-col lg:items-center">
      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-navy-950">
        <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="mt-8 flex flex-1 flex-col items-center gap-3">
        {sidebarItems.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-label={item.label}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${
              item.active ? "bg-white text-navy-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="mb-1 h-11 w-11 rounded-2xl bg-white/10" aria-hidden="true" />
    </aside>
  );
}

function TopBar() {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between gap-4">
        <Logo />
        <span className="rounded-full border border-slate-200 bg-offwhite px-3 py-1 text-xs font-semibold text-navy-800 lg:hidden">
          Proof Dashboard
        </span>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:justify-end">
        <div className="hidden min-w-0 max-w-md flex-1 items-center gap-2 rounded-full border border-slate-200 bg-offwhite px-3 py-2 text-sm text-slate-600 md:flex">
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Search records, routes, missing proof...</span>
        </div>
        <Link to="/closeout-check" data-testid="proof-dashboard-top-cta">
          <Button size="sm">Free Check</Button>
        </Link>
        <button type="button" aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-900">
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute -right-0.5 -top-0.5 rounded-full bg-status-incomplete px-1.5 text-[10px] font-bold text-white">2</span>
        </button>
      </div>
    </header>
  );
}

function KpiStrip() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">{item.label}</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="font-display text-2xl font-semibold text-navy-950">{item.value}</p>
            <span className="rounded-full bg-offwhite px-2 py-1 text-[11px] font-semibold text-slate-600">{item.note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProofNode({ packet, index }) {
  const cfg = STATUS_CONFIG[packet.demoType] || STATUS_CONFIG.review;
  const Icon = cfg.icon;
  return (
    <Link
      to={`/proof/${packet.id}`}
      data-testid={`proof-node-${packet.id}`}
      className={`absolute group flex min-w-[10rem] flex-col gap-2 rounded-2xl border bg-white p-3 shadow-card ring-8 transition-transform hover:-translate-y-1 hover:shadow-card-hover ${cfg.ring} ${
        index === 0 ? "left-[6%] top-[14%]" : index === 1 ? "right-[8%] top-[28%]" : "left-[30%] bottom-[12%]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${cfg.tone}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-[11px] font-semibold text-slate-600">{packet.id}</span>
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-navy-950">{cfg.full}</p>
        <p className="mt-0.5 text-xs text-slate-600">{packet.missingProofCount} missing · {packet.weakBackupCount} weak</p>
      </div>
    </Link>
  );
}

function ProofCanvas() {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-premium">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Live demo workspace</p>
          <h2 className="font-display text-xl font-semibold text-navy-950">Closeout board</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border border-slate-200 bg-offwhite px-3 py-1.5 text-xs font-semibold text-navy-800">All 3</button>
          <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">Ready 1</button>
          <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">Attention 2</button>
        </div>
      </div>

      <div className="relative min-h-[28rem] bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] [background-size:28px_28px]">
        <div className="absolute inset-6 rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-offwhite via-white to-slate-100" />
        <div className="absolute left-8 right-8 top-1/2 h-px bg-slate-300/70" />
        <div className="absolute bottom-12 left-1/4 top-10 w-px rotate-12 bg-slate-300/70" />
        <div className="absolute bottom-10 right-1/3 top-16 w-px -rotate-12 bg-slate-300/70" />

        <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-navy-900/10 bg-white shadow-premium">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-950 text-white">
            <FileCheck2 className="h-7 w-7" aria-hidden="true" />
          </div>
        </div>

        {proofPackets.map((packet, index) => <ProofNode key={packet.id} packet={packet} index={index} />)}

        <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-card backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-navy-950">One record check becomes a visible closeout decision.</p>
          <Link to="/closeout-check" className="inline-flex items-center gap-1 text-sm font-semibold text-navy-800 hover:underline">
            Start free check <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function QueueCard({ packet }) {
  const cfg = STATUS_CONFIG[packet.demoType] || STATUS_CONFIG.review;
  const Icon = cfg.icon;
  return (
    <Link to={`/proof/${packet.id}`} data-testid={`proof-card-${packet.id}`} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${cfg.tone}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-base font-semibold text-navy-950">{cfg.full}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-600">{packet.customer}</p>
          </div>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 text-slate-400 group-hover:text-navy-900" aria-hidden="true" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-offwhite p-2">
          <p className="text-[10px] font-semibold uppercase text-slate-600">Missing</p>
          <p className="font-display text-xl font-semibold text-navy-950">{packet.missingProofCount}</p>
        </div>
        <div className="rounded-xl bg-offwhite p-2">
          <p className="text-[10px] font-semibold uppercase text-slate-600">Weak</p>
          <p className="font-display text-xl font-semibold text-navy-950">{packet.weakBackupCount}</p>
        </div>
        <div className="rounded-xl bg-offwhite p-2">
          <p className="text-[10px] font-semibold uppercase text-slate-600">Photos</p>
          <p className="font-display text-xl font-semibold text-navy-950">{packet.photos}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <StatusPill packet={packet} />
        <span className="text-xs font-semibold text-navy-800">Open</span>
      </div>
    </Link>
  );
}

function RightPanel() {
  return (
    <aside className="flex flex-col gap-4">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Closeout queue</p>
            <h2 className="font-display text-xl font-semibold text-navy-950">3 records</h2>
          </div>
          <button type="button" aria-label="Filter records" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-offwhite text-navy-900">
            <Filter className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      {proofPackets.map((packet) => <QueueCard key={packet.id} packet={packet} />)}
    </aside>
  );
}

export default function Proof() {
  return (
    <div className="min-h-screen bg-offwhite text-navy-950">
      <TopBar />
      <main className="mx-auto flex w-full max-w-[1440px] gap-4 px-3 py-4 sm:px-5 lg:gap-5 lg:px-6">
        <Rail />
        <div className="min-w-0 flex-1">
          <section className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-700">Proof Packet Demo Dashboard</p>
              <h1 className="mobile-safe-text mt-2 font-display text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
                Closeout decisions, not packet clutter.
              </h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
              <Link to="/closeout-check" data-testid="proof-primary-cta">
                <Button className="w-full sm:w-auto">Get Free Check</Button>
              </Link>
              <Link to="/proof/PP-10234" data-testid="proof-secondary-cta">
                <Button variant="secondary" className="w-full sm:w-auto">Missing Example</Button>
              </Link>
            </div>
          </section>

          <KpiStrip />

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <ProofCanvas />
            <RightPanel />
          </div>

          <p className="px-1 py-4 text-xs text-slate-600">
            Demo data only. ClearRun organizes office review and proof readiness; it does not certify legal compliance or guarantee outcomes.
          </p>
        </div>
      </main>
    </div>
  );
}
