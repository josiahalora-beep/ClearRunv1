import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardCheck, FileCheck2, ShieldCheck } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { proofPackets } from "@/data/mockData";

const STATUS_CONFIG = {
  ready: {
    eyebrow: "Clean record",
    title: "Ready to Close",
    line: "Everything needed is organized.",
    badge: "border-status-complete/30 bg-status-complete-bg text-status-complete",
    panel: "border-status-complete/20 bg-status-complete-bg",
    icon: CheckCircle2,
    iconClass: "text-status-complete",
  },
  review: {
    eyebrow: "Weak backup",
    title: "Needs Review",
    line: "Most proof exists, but one match needs office review.",
    badge: "border-status-review/30 bg-status-review-bg text-status-review",
    panel: "border-status-review/20 bg-status-review-bg",
    icon: ShieldCheck,
    iconClass: "text-status-review",
  },
  missing: {
    eyebrow: "Missing proof",
    title: "Missing Proof",
    line: "This should not be closed until the gaps are chased.",
    badge: "border-status-incomplete/30 bg-status-incomplete-bg text-status-incomplete",
    panel: "border-status-incomplete/20 bg-status-incomplete-bg",
    icon: AlertTriangle,
    iconClass: "text-status-incomplete",
  },
};

const summaryStats = [
  { label: "Demo records", value: "3", note: "curated examples" },
  { label: "Ready to close", value: "1", note: "clean packet" },
  { label: "Need office attention", value: "2", note: "review or missing proof" },
];

function MetricCard({ label, value, note }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-300">{note}</p>
    </div>
  );
}

function ProofChips({ title, items, emptyText }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{title}</p>
      {items.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className="rounded-full border border-slate-200 bg-offwhite px-2.5 py-1 text-xs font-semibold text-navy-800">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm font-medium text-slate-600">{emptyText}</p>
      )}
    </div>
  );
}

function DemoPacketCard({ packet }) {
  const config = STATUS_CONFIG[packet.demoType] || STATUS_CONFIG.review;
  const Icon = config.icon;

  return (
    <Link
      to={`/proof/${packet.id}`}
      data-testid={`proof-card-${packet.id}`}
      aria-label={`Open ${packet.closeoutStatus} proof packet example`}
      className="group surface-card surface-card-hover flex min-w-0 flex-col overflow-hidden"
    >
      <div className={`border-b px-5 py-5 ${config.panel}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">{config.eyebrow}</p>
            <h2 className="mobile-safe-text mt-2 font-display text-2xl font-semibold text-navy-950">{config.title}</h2>
            <p className="mt-2 text-sm leading-6 text-navy-900">{config.line}</p>
          </div>
          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
            <Icon className={`h-7 w-7 ${config.iconClass}`} aria-hidden="true" />
            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${config.badge}`}>
              {packet.closeoutStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Demo packet</p>
          <h3 className="mobile-safe-text mt-1 font-display text-xl font-semibold text-navy-950">{packet.customer}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{packet.summary}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-offwhite p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Missing proof</p>
            <p className="mt-1 font-display text-2xl font-semibold text-navy-950">{packet.missingProofCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-offwhite p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Weak backup</p>
            <p className="mt-1 font-display text-2xl font-semibold text-navy-950">{packet.weakBackupCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-offwhite p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Photos</p>
            <p className="mt-1 font-display text-2xl font-semibold text-navy-950">{packet.photos}</p>
          </div>
        </div>

        <div className="grid gap-3">
          <ProofChips title="Present proof" items={packet.presentProof} emptyText="None listed" />
          <ProofChips title="Missing proof" items={packet.missingProof} emptyText="No missing proof" />
          <ProofChips title="Weak backup" items={packet.weakBackup} emptyText="No weak backup flagged" />
        </div>

        <div className="mt-auto rounded-xl border border-navy-900/10 bg-navy-950 p-4 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">Next office action</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-white">{packet.nextOfficeAction}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-200 group-hover:text-white">
            Open example <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Proof() {
  const missingPacket = proofPackets.find((packet) => packet.demoType === "missing") || proofPackets[proofPackets.length - 1];

  return (
    <Layout>
      <section className="container-page py-10 sm:py-14">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-navy-950 shadow-premium">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:p-10">
            <div className="min-w-0 text-white">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" /> Proof Packet Demo Dashboard
              </span>
              <h1 className="mobile-safe-text mt-5 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
                See what ClearRun gives your office after checking records.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                Three curated examples show how ClearRun turns messy route records into a closeout decision, proof summary, invoice-support state, and next office action.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/closeout-check" data-testid="proof-primary-cta">
                  <Button size="lg" className="w-full bg-white text-navy-950 hover:bg-slate-100 sm:w-auto">
                    Get Free Route Closeout Check <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to={`/proof/${missingPacket.id}`} data-testid="proof-secondary-cta">
                  <Button size="lg" variant="outline" className="w-full border-white/25 text-white hover:bg-white/10 hover:text-white sm:w-auto">
                    View Missing Proof Example
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {summaryStats.map((stat) => <MetricCard key={stat.label} {...stat} />)}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {proofPackets.map((packet) => <DemoPacketCard key={packet.id} packet={packet} />)}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center">
          <div className="surface-card p-6 sm:p-7">
            <FileCheck2 className="h-9 w-9 text-navy-800" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-navy-950">This is not a random packet list.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The demo dashboard shows the three outcomes an office needs to understand before closeout: ready, review, or missing proof. That makes ClearRun easier to buy, easier to explain, and easier to test with one real sample record.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Closeout status", "Can this record be closed?"],
              ["Proof gaps", "What is missing or weak?"],
              ["Office action", "What should staff do next?"],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                <p className="font-display text-lg font-semibold text-navy-950">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
