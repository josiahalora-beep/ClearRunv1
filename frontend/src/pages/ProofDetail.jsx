import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Home,
  LayoutDashboard,
  ListChecks,
  Map,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { proofPackets } from "@/data/mockData";

const STATUS = {
  ready: {
    label: "Ready to Close",
    short: "Ready",
    tone: "border-status-complete/25 bg-status-complete-bg text-status-complete",
    dot: "bg-status-complete",
    panel: "border-status-complete/20 bg-status-complete-bg",
    icon: CheckCircle2,
  },
  review: {
    label: "Needs Review",
    short: "Review",
    tone: "border-status-review/25 bg-status-review-bg text-status-review",
    dot: "bg-status-review",
    panel: "border-status-review/20 bg-status-review-bg",
    icon: ShieldCheck,
  },
  missing: {
    label: "Missing Proof",
    short: "Missing",
    tone: "border-status-incomplete/25 bg-status-incomplete-bg text-status-incomplete",
    dot: "bg-status-incomplete",
    panel: "border-status-incomplete/20 bg-status-incomplete-bg",
    icon: AlertTriangle,
  },
};

const navItems = [
  { icon: LayoutDashboard, label: "Board", to: "/proof" },
  { icon: ClipboardCheck, label: "Packet", to: null, active: true },
  { icon: ListChecks, label: "Queue", to: "/proof" },
  { icon: Map, label: "Routes", to: "/proof" },
];

function configFor(packet) {
  return STATUS[packet?.demoType] || STATUS.review;
}

function StatusBadge({ packet }) {
  const cfg = configFor(packet);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${cfg.tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.short}
    </span>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-5">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link to="/proof" aria-label="Back to proof dashboard" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-900">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-900 sm:flex" aria-label="Home">
            <Home className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link to="/closeout-check"><Button size="sm">Free Check</Button></Link>
        </div>
      </div>
    </header>
  );
}

function Rail() {
  return (
    <aside className="hidden h-[calc(100svh-7rem)] w-20 shrink-0 rounded-[1.75rem] bg-navy-950 p-3 text-white shadow-premium lg:flex lg:flex-col lg:items-center">
      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-navy-950">
        <FileCheck2 className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="mt-8 flex flex-1 flex-col items-center gap-3">
        {navItems.map((item) => {
          const button = (
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${item.active ? "bg-white text-navy-950" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </span>
          );
          return item.to ? <Link key={item.label} to={item.to} aria-label={item.label}>{button}</Link> : <button key={item.label} type="button" aria-label={item.label}>{button}</button>;
        })}
      </div>
    </aside>
  );
}

function MobileBottomNav() {
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-[1.5rem] border border-slate-200 bg-white/95 p-2 shadow-premium backdrop-blur lg:hidden" aria-label="Proof packet navigation">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const content = (
            <span className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold ${item.active ? "bg-navy-950 text-white" : "text-slate-600"}`}>
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </span>
          );
          return item.to ? <Link key={item.label} to={item.to}>{content}</Link> : <button key={item.label} type="button">{content}</button>;
        })}
      </div>
    </nav>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-navy-950">{value}</p>
    </div>
  );
}

function EvidenceStrip({ packet, mobile = false }) {
  const items = [
    ...packet.presentProof.map((label) => [label, "Found", "border-status-complete/25 bg-status-complete-bg text-status-complete"]),
    ...packet.weakBackup.map((label) => [label, "Weak", "border-status-review/25 bg-status-review-bg text-status-review"]),
    ...packet.missingProof.map((label) => [label, "Missing", "border-status-incomplete/25 bg-status-incomplete-bg text-status-incomplete"]),
  ];

  return (
    <div className={`${mobile ? "flex snap-x gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "grid grid-cols-2 gap-3"}`}>
      {items.map(([label, status, cls]) => (
        <div key={`${label}-${status}`} className={`${mobile ? "min-w-[10.5rem] snap-start" : ""} rounded-2xl border border-slate-200 bg-white p-3 shadow-card`}>
          <p className="truncate text-sm font-semibold text-navy-950">{label}</p>
          <span className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold ${cls}`}>{status}</span>
        </div>
      ))}
    </div>
  );
}

function PacketHero({ packet }) {
  const cfg = configFor(packet);
  const Icon = cfg.icon;
  return (
    <section className={`rounded-[1.75rem] border p-4 shadow-premium ${cfg.panel}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-700">{packet.id}</p>
          <h1 className="mt-1 truncate font-display text-2xl font-bold text-navy-950 sm:text-3xl">{packet.closeoutStatus}</h1>
          <p className="mt-1 truncate text-sm font-medium text-navy-900">{packet.customer}</p>
        </div>
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${cfg.tone}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric label="Missing" value={packet.missingProofCount} />
        <Metric label="Weak" value={packet.weakBackupCount} />
        <Metric label="Photos" value={packet.photos} />
      </div>
    </section>
  );
}

function ActionCard({ packet }) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-navy-950 p-4 text-white shadow-premium">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-300">Next office action</p>
      <h2 className="mt-2 font-display text-xl font-semibold text-white">{packet.nextOfficeAction}</h2>
      <Link to="/closeout-check" className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-semibold text-navy-950">
        Run another check <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </section>
  );
}

function MobileDetail({ packet }) {
  return (
    <div className="min-h-screen bg-offwhite pb-24 lg:hidden">
      <TopBar />
      <main className="space-y-3 px-3 py-4">
        <PacketHero packet={packet} />
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-premium">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Packet proof</p>
              <h2 className="font-display text-lg font-semibold text-navy-950">Swipe evidence</h2>
            </div>
            <StatusBadge packet={packet} />
          </div>
          <div className="mt-3">
            <EvidenceStrip packet={packet} mobile />
          </div>
        </section>
        <ActionCard packet={packet} />
      </main>
      <MobileBottomNav />
    </div>
  );
}

function DesktopDetail({ packet }) {
  return (
    <div className="hidden min-h-screen bg-offwhite text-navy-950 lg:block">
      <TopBar />
      <main className="mx-auto flex w-full max-w-[1440px] gap-5 px-6 py-5">
        <Rail />
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-700">Proof packet</p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-navy-950">{packet.customer}</h1>
            </div>
            <Link to="/proof"><Button variant="secondary">Back to board</Button></Link>
          </div>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="space-y-4">
              <PacketHero packet={packet} />
              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-premium">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold text-navy-950">Evidence grid</h2>
                  <StatusBadge packet={packet} />
                </div>
                <EvidenceStrip packet={packet} />
              </section>
            </div>
            <aside className="space-y-4">
              <ActionCard packet={packet} />
              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Record details</p>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="flex justify-between gap-4"><span className="text-slate-600">Service</span><span className="font-semibold text-navy-950">{packet.serviceType}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-600">Gallons</span><span className="font-semibold text-navy-950">{packet.gallons}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-600">Date</span><span className="font-semibold text-navy-950">{packet.serviceDate}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-600">Technician</span><span className="font-semibold text-navy-950">{packet.technician}</span></div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function MissingPacket() {
  return (
    <div className="min-h-screen bg-offwhite px-4 py-8">
      <div className="mx-auto max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-premium">
        <p className="font-display text-xl font-semibold text-navy-950">Packet not found</p>
        <Link to="/proof" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-800 hover:underline">
          Back to dashboard <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function ProofDetail() {
  const { id } = useParams();
  const packet = proofPackets.find((item) => item.id === id);

  if (!packet) return <MissingPacket />;

  return (
    <>
      <MobileDetail packet={packet} />
      <DesktopDetail packet={packet} />
    </>
  );
}
