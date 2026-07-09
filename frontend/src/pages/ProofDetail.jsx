import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Home,
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
    panel: "border-status-complete/20 bg-status-complete-bg",
    dot: "bg-status-complete",
    icon: CheckCircle2,
  },
  review: {
    label: "Review",
    title: "Needs Review",
    color: "border-status-review/25 bg-status-review-bg text-status-review",
    panel: "border-status-review/20 bg-status-review-bg",
    dot: "bg-status-review",
    icon: ShieldCheck,
  },
  missing: {
    label: "Missing",
    title: "Missing Proof",
    color: "border-status-incomplete/25 bg-status-incomplete-bg text-status-incomplete",
    panel: "border-status-incomplete/20 bg-status-incomplete-bg",
    dot: "bg-status-incomplete",
    icon: AlertTriangle,
  },
};

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

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-3 py-3 sm:px-5">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link to="/proof" aria-label="Back to dashboard" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-900">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" aria-label="Home" className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-900 sm:flex">
            <Home className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link to="/closeout-check">
            <Button size="sm">Free Check</Button>
          </Link>
        </div>
      </div>
    </header>
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

function EvidenceCard({ label, state }) {
  const color = state === "Found"
    ? "border-status-complete/25 bg-status-complete-bg text-status-complete"
    : state === "Weak"
      ? "border-status-review/25 bg-status-review-bg text-status-review"
      : "border-status-incomplete/25 bg-status-incomplete-bg text-status-incomplete";

  return (
    <div className="w-44 shrink-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-card md:w-auto">
      <p className="truncate text-sm font-semibold text-navy-950">{label}</p>
      <span className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold ${color}`}>{state}</span>
    </div>
  );
}

function EvidenceRail({ packet }) {
  const found = packet.presentProof.map((label) => ({ label, state: "Found" }));
  const weak = packet.weakBackup.map((label) => ({ label, state: "Weak" }));
  const missing = packet.missingProof.map((label) => ({ label, state: "Missing" }));
  const items = [...found, ...weak, ...missing];

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-2" tabIndex={0} role="region" aria-label="Swipe packet evidence cards">
      {items.map((item) => <EvidenceCard key={`${item.label}-${item.state}`} {...item} />)}
    </div>
  );
}

function PacketHero({ packet }) {
  const status = getStatus(packet);
  const Icon = status.icon;
  return (
    <section className={`rounded-3xl border p-4 shadow-premium ${status.panel}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-700">{packet.id}</p>
          <h1 className="mt-1 truncate font-display text-2xl font-bold text-navy-950 sm:text-3xl">{packet.closeoutStatus}</h1>
          <p className="mt-1 truncate text-sm font-medium text-navy-900">{packet.customer}</p>
        </div>
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${status.color}`}>
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
    <section className="rounded-3xl border border-slate-200 bg-navy-950 p-4 text-white shadow-premium">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-300">Next office action</p>
      <h2 className="mt-2 font-display text-xl font-semibold text-white">{packet.nextOfficeAction}</h2>
      <Link to="/closeout-check" className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-semibold text-navy-950">
        Run another check <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </section>
  );
}

function MobileNav() {
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-3xl border border-slate-200 bg-white p-2 shadow-premium lg:hidden" aria-label="Proof packet navigation">
      <div className="grid grid-cols-3 gap-1">
        <Link to="/proof" className="rounded-2xl px-2 py-2 text-center text-[10px] font-semibold text-slate-600">Board</Link>
        <span className="rounded-2xl bg-navy-950 px-2 py-2 text-center text-[10px] font-semibold text-white">Packet</span>
        <Link to="/closeout-check" className="rounded-2xl px-2 py-2 text-center text-[10px] font-semibold text-slate-600">Free Check</Link>
      </div>
    </nav>
  );
}

function PacketLayout({ packet }) {
  return (
    <div className="min-h-screen bg-offwhite pb-24 lg:pb-0">
      <TopBar />
      <main className="mx-auto grid w-full max-w-screen-2xl gap-4 px-3 py-4 sm:px-5 lg:grid-cols-3 lg:px-6 lg:py-5">
        <div className="space-y-4 lg:col-span-2">
          <PacketHero packet={packet} />
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-premium">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Packet proof</p>
                <h2 className="font-display text-lg font-semibold text-navy-950">Evidence</h2>
              </div>
              <StatusBadge packet={packet} />
            </div>
            <EvidenceRail packet={packet} />
          </section>
        </div>
        <aside className="space-y-4">
          <ActionCard packet={packet} />
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Record details</p>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><span className="text-slate-600">Service</span><span className="font-semibold text-navy-950">{packet.serviceType}</span></div>
              <div className="flex justify-between gap-4"><span className="text-slate-600">Gallons</span><span className="font-semibold text-navy-950">{packet.gallons}</span></div>
              <div className="flex justify-between gap-4"><span className="text-slate-600">Date</span><span className="font-semibold text-navy-950">{packet.serviceDate}</span></div>
              <div className="flex justify-between gap-4"><span className="text-slate-600">Technician</span><span className="font-semibold text-navy-950">{packet.technician}</span></div>
            </div>
          </section>
        </aside>
      </main>
      <MobileNav />
    </div>
  );
}

function MissingPacket() {
  return (
    <div className="min-h-screen bg-offwhite px-4 py-8">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-premium">
        <FileCheck2 className="h-8 w-8 text-navy-800" aria-hidden="true" />
        <p className="mt-3 font-display text-xl font-semibold text-navy-950">Packet not found</p>
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
  return <PacketLayout packet={packet} />;
}
