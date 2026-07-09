import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { proofPackets } from "@/data/mockData";

const kpis = [
  { label: "Records", value: "3" },
  { label: "Ready", value: "1" },
  { label: "Attention", value: "2" },
  { label: "Gaps", value: "4" },
];

function statusClasses(packet) {
  if (packet.demoType === "ready") return "border-status-complete/25 bg-status-complete-bg text-status-complete";
  if (packet.demoType === "missing") return "border-status-incomplete/25 bg-status-incomplete-bg text-status-incomplete";
  return "border-status-review/25 bg-status-review-bg text-status-review";
}

function statusLabel(packet) {
  if (packet.demoType === "ready") return "Ready";
  if (packet.demoType === "missing") return "Missing";
  return "Review";
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-3 py-3 sm:px-5">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3">
        <Logo />
        <Link to="/closeout-check" data-testid="proof-dashboard-top-cta">
          <Button size="sm">Free Check</Button>
        </Link>
      </div>
    </header>
  );
}

function StatusBadge({ packet }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(packet)}`}>
      {statusLabel(packet)}
    </span>
  );
}

function KpiRow({ mobile = false }) {
  return (
    <div className={mobile ? "flex gap-2 overflow-x-auto pb-1" : "grid grid-cols-4 gap-3"} tabIndex={mobile ? 0 : undefined} role={mobile ? "region" : undefined} aria-label={mobile ? "Dashboard metric cards" : undefined}>
      {kpis.map((item) => (
        <div key={item.label} className={`${mobile ? "w-28 shrink-0" : ""} rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-card`}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">{item.label}</p>
          <p className="mt-1 font-display text-2xl font-semibold text-navy-950">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function PacketCard({ packet, mobile = false }) {
  return (
    <Link to={`/proof/${packet.id}`} data-testid={`proof-card-${packet.id}`} className={`${mobile ? "w-72 shrink-0" : ""} rounded-3xl border border-slate-200 bg-white p-4 shadow-card hover:shadow-card-hover`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-navy-950">{packet.closeoutStatus}</p>
          <p className="mt-0.5 truncate text-xs font-medium text-slate-600">{packet.customer}</p>
        </div>
        <StatusBadge packet={packet} />
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
      <p className="mt-4 text-xs font-semibold text-navy-800">Open packet →</p>
    </Link>
  );
}

function BoardPanel({ mobile = false }) {
  return (
    <section className={`${mobile ? "w-80 shrink-0" : ""} rounded-3xl border border-slate-200 bg-white shadow-premium`}>
      <div className="border-b border-slate-200 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Workspace</p>
        <h2 className="font-display text-lg font-semibold text-navy-950">Closeout Board</h2>
      </div>
      <div className="bg-offwhite p-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-950 text-white">
            <span className="text-2xl font-bold">CR</span>
          </div>
          <div className="grid gap-3">
            {proofPackets.map((packet) => (
              <Link key={packet.id} to={`/proof/${packet.id}`} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy-950">{packet.closeoutStatus}</p>
                    <p className="text-xs text-slate-600">{packet.missingProofCount} missing · {packet.weakBackupCount} weak</p>
                  </div>
                  <StatusBadge packet={packet} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileDashboard() {
  return (
    <div className="min-h-screen bg-offwhite pb-24 lg:hidden">
      <TopBar />
      <main className="px-3 py-4">
        <section className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-navy-700">Proof Dashboard</p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-navy-950">Closeout board</h1>
        </section>
        <KpiRow mobile />
        <section className="mt-3 flex gap-3 overflow-x-auto pb-2" tabIndex={0} role="region" aria-label="Swipe dashboard panels">
          <BoardPanel mobile />
          <div className="w-80 shrink-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-premium">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Queue</p>
                <h2 className="font-display text-lg font-semibold text-navy-950">3 examples</h2>
              </div>
              <StatusBadge packet={proofPackets[2]} />
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1" tabIndex={0} role="region" aria-label="Swipe proof packet examples">
              {proofPackets.map((packet) => <PacketCard key={packet.id} packet={packet} mobile />)}
            </div>
          </div>
        </section>
        <p className="mt-2 px-1 text-[11px] leading-5 text-slate-600">Swipe sideways. Tap a record to open the proof packet.</p>
      </main>
      <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-3xl border border-slate-200 bg-white p-2 shadow-premium" aria-label="Proof dashboard navigation">
        <div className="grid grid-cols-3 gap-1">
          <span className="rounded-2xl bg-navy-950 px-2 py-2 text-center text-[10px] font-semibold text-white">Board</span>
          <span className="rounded-2xl px-2 py-2 text-center text-[10px] font-semibold text-slate-600">Queue</span>
          <Link to="/closeout-check" className="rounded-2xl px-2 py-2 text-center text-[10px] font-semibold text-slate-600">Free Check</Link>
        </div>
      </nav>
    </div>
  );
}

function DesktopDashboard() {
  return (
    <div className="hidden min-h-screen bg-offwhite text-navy-950 lg:block">
      <TopBar />
      <main className="mx-auto grid w-full max-w-screen-2xl gap-5 px-6 py-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <section className="mb-4 grid gap-4 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-700">Proof Packet Demo Dashboard</p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-navy-950">Closeout decisions, not packet clutter.</h1>
            </div>
            <div className="flex justify-end gap-2">
              <Link to="/closeout-check" data-testid="proof-primary-cta"><Button>Get Free Check</Button></Link>
              <Link to="/proof/PP-10234" data-testid="proof-secondary-cta"><Button variant="secondary">Missing Example</Button></Link>
            </div>
          </section>
          <KpiRow />
          <div className="mt-4"><BoardPanel /></div>
        </div>
        <aside className="flex flex-col gap-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Closeout queue</p>
            <h2 className="font-display text-xl font-semibold text-navy-950">3 records</h2>
          </div>
          {proofPackets.map((packet) => <PacketCard key={packet.id} packet={packet} />)}
        </aside>
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
