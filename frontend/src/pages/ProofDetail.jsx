import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Droplets,
  FileCheck2,
  FileText,
  MapPin,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { cn } from "@/lib/utils";
import { proofPackets, auditLog } from "@/data/mockData";

const SAFE_DISCLAIMER =
  "ClearRun organizes service proof and record visibility. It does not certify legal compliance, verify regulatory sufficiency, approve disposal activity, or guarantee customer, reviewer, city, state, federal, or inspection outcomes.";

const CLOSEOUT_STYLES = {
  ready: {
    label: "Ready to Close",
    badge: "border-emerald-700/15 bg-emerald-50 text-emerald-900",
    panel: "border-emerald-800/15 bg-emerald-50/80",
    dot: "bg-emerald-700",
  },
  missing: {
    label: "Missing Proof",
    badge: "border-amber-700/20 bg-amber-50 text-amber-950",
    panel: "border-amber-700/20 bg-amber-50/80",
    dot: "bg-amber-700",
  },
  weak: {
    label: "Weak Backup",
    badge: "border-amber-700/20 bg-amber-50 text-amber-950",
    panel: "border-amber-700/20 bg-amber-50/80",
    dot: "bg-amber-700",
  },
  review: {
    label: "Needs Review",
    badge: "border-navy-900/15 bg-navy-900/5 text-navy-900",
    panel: "border-navy-900/15 bg-white",
    dot: "bg-navy-800",
  },
  followup: {
    label: "Follow-Up Needed",
    badge: "border-slate-300 bg-slate-100 text-slate-700",
    panel: "border-slate-300 bg-slate-50",
    dot: "bg-slate-500",
  },
};

const PROOF_STATUS_STYLES = {
  Found: "border-emerald-700/15 bg-emerald-50 text-emerald-900",
  Missing: "border-amber-700/20 bg-amber-50 text-amber-950",
  Weak: "border-amber-700/20 bg-amber-50 text-amber-950",
  "Needs Review": "border-navy-900/15 bg-navy-900/5 text-navy-900",
  "Not Applicable": "border-slate-200 bg-slate-50 text-slate-600",
  "Not Claimed": "border-slate-200 bg-slate-50 text-slate-600",
};

const DETAIL_SIGNALS = {
  "PP-10231": {
    closeoutKey: "ready",
    closeoutStatus: "Ready to Close",
    closeoutReason:
      "Core service proof is present. The only caveat is that disposal backup is attached at the route/load level, so keep that language visible if the packet is shared.",
    routeName: "Macon Route A",
    routeLoad: "Macon Route A / Load 14",
    completionScore: 96,
    evidenceCount: 5,
    missingCount: 0,
    weakCount: 1,
    reviewCount: 0,
    mainIssue: "No blocking proof gaps flagged",
    disposalStatus: "Route/Load Level",
    disposalSummary:
      "Disposal backup is attached to the route/load that includes this job. ClearRun shows the relationship without claiming one-to-one legal sufficiency.",
    invoiceSupport: "Strong invoice backup support",
    invoiceSummary:
      "The packet gives the office a clean service date, customer, volume, ticket, route reference, and evidence set for internal review and customer response.",
    customerStatus: "Ready for customer response",
    customerSummary:
      "This record can be used to answer a customer question without digging through field notes, texts, and route paperwork.",
    nextActionTitle: "Keep ready for customer response",
    nextActionNeeded: "Keep the route/load disposal note attached and share the cleaned Proof Snapshot if Creekside Grill asks for backup.",
    nextActionWhy:
      "The record is already organized enough to close internally, but the disposal caveat should travel with the packet so expectations stay accurate.",
    nextActionStep: "Save this as the closeout packet and use the same format on the next messy route cleanup.",
    proofItems: [
      {
        item: "Service date",
        status: "Found",
        why: "Anchors the packet to the day service was performed.",
        action: "Keep as recorded: 2026-01-28.",
      },
      {
        item: "Customer / location",
        status: "Found",
        why: "Shows the packet belongs to the correct account and site.",
        action: "No office follow-up needed.",
      },
      {
        item: "Route / job reference",
        status: "Found",
        why: "Connects the job to the operator's route record.",
        action: "Keep Macon Route A / Load 14 on the packet.",
      },
      {
        item: "Ticket / photo proof",
        status: "Found",
        why: "Gives the office visual and ticket backup for the service.",
        action: "Keep the six field images grouped with the ticket.",
      },
      {
        item: "Volume / gallons",
        status: "Found",
        why: "Supports internal review and customer response.",
        action: "Keep 320 gallons visible in the summary.",
      },
      {
        item: "Signature / status note",
        status: "Found",
        why: "Shows the field ticket was acknowledged in the record set.",
        action: "No follow-up needed unless the customer requests original paperwork.",
      },
      {
        item: "Disposal backup",
        status: "Weak",
        why: "Backup is route/load level, not a claimed one-to-one disposal record.",
        action: "Keep the route/load caveat attached to the packet.",
      },
      {
        item: "Office notes",
        status: "Found",
        why: "Explains what changed after field records were cleaned.",
        action: "Leave the closeout note in the record.",
      },
    ],
    evidenceItems: [
      {
        label: "Ticket",
        type: "ticket",
        status: "Found",
        note: "Service ticket with account, date, and volume.",
      },
      {
        label: "Photo",
        type: "photo",
        status: "Found",
        note: "Field image set grouped with the service.",
      },
      {
        label: "Receipt",
        type: "receipt",
        status: "Found",
        note: "Treatment facility receipt attached to route/load.",
      },
      {
        label: "Disposal",
        type: "route",
        status: "Weak",
        note: "Route/load level backup, not claimed as legally sufficient.",
      },
      {
        label: "Signature",
        type: "signature",
        status: "Found",
        note: "Ticket acknowledgement present.",
      },
    ],
    timeline: [
      { label: "Captured", detail: "Field ticket and photos received.", status: "done" },
      { label: "Reviewed", detail: "Core customer, date, route, and gallons checked.", status: "done" },
      { label: "Packet prepared", detail: "Proof items grouped into one closeout view.", status: "done" },
      { label: "Gaps checked", detail: "No missing proof; disposal caveat noted.", status: "done" },
      { label: "Ready for response", detail: "Keep ready if the customer asks for backup.", status: "current" },
    ],
  },
};

function defaultSignals(packet) {
  const needsMissing = packet.status === "attention" || packet.status === "incomplete";
  const needsReview = packet.status === "review";
  const closeoutKey = packet.status === "complete" ? "ready" : needsMissing ? "missing" : needsReview ? "review" : "followup";
  const closeoutStatus = CLOSEOUT_STYLES[closeoutKey].label;
  const missingCount = needsMissing ? Math.max(1, packet.photos === 0 ? 3 : 1) : 0;
  const weakCount = packet.status === "complete" || packet.status === "review" ? 1 : 0;
  const reviewCount = needsReview ? 1 : 0;

  return {
    closeoutKey,
    closeoutStatus,
    closeoutReason: needsMissing
      ? "This packet still has missing proof that should be requested before closeout."
      : needsReview
        ? "The packet is organized, but one office review should happen before the record is closed."
        : "Core proof is present. Keep disposal backup language accurate before sharing.",
    routeName: "Route not assigned",
    routeLoad: "Route/load not assigned",
    completionScore: packet.status === "complete" ? 92 : needsReview ? 84 : 64,
    evidenceCount: Math.max(2, packet.photos || 2),
    missingCount,
    weakCount,
    reviewCount,
    mainIssue: needsMissing ? "Missing proof blocks closeout" : needsReview ? "Office review needed" : "No blocking proof gaps flagged",
    disposalStatus: needsMissing ? "Missing" : needsReview ? "Needs Review" : "Route/Load Level",
    disposalSummary: needsMissing
      ? "Disposal backup is missing from the current record set."
      : "Disposal backup is shown at the route/load level where available, without claiming legal sufficiency.",
    invoiceSupport: needsMissing ? "Weak invoice backup support" : needsReview ? "Internal review support" : "Strong invoice backup support",
    invoiceSummary: needsMissing
      ? "The office should request missing proof before using this record for customer response."
      : "The packet organizes the record for internal review and customer response.",
    customerStatus: needsMissing ? "Follow-up needed before response" : "Prepared for customer response",
    customerSummary: needsMissing
      ? "Send a cleaner response after the missing items are collected."
      : "The office can answer customer questions from one organized packet.",
    nextActionTitle: needsMissing ? "Request missing proof" : needsReview ? "Review before closeout" : "Keep ready for customer response",
    nextActionNeeded: needsMissing
      ? "Ask the field tech or hauler for missing photos, signature, or disposal backup."
      : needsReview
        ? "Confirm the flagged field before closing the packet."
        : "Keep the packet available for internal review or customer response.",
    nextActionWhy: needsMissing
      ? "The record is not ready to close until the office can explain what happened and what proof exists."
      : "A short office review keeps the packet accurate without overstating what ClearRun verifies.",
    nextActionStep: needsMissing ? "Start Route Cleanup for this account." : "Save the closeout note and keep the packet ready.",
    proofItems: [
      { item: "Service date", status: "Found", why: "Anchors the record to a service day.", action: "Keep visible in summary." },
      { item: "Customer / location", status: "Found", why: "Ties the packet to the correct account.", action: "No office follow-up needed." },
      { item: "Route / job reference", status: needsReview ? "Needs Review" : "Found", why: "Connects field work to office records.", action: needsReview ? "Confirm route/load reference." : "Keep with packet." },
      { item: "Ticket / photo proof", status: packet.photos > 0 ? "Found" : "Missing", why: "Shows service backup exists.", action: packet.photos > 0 ? "Keep grouped with ticket." : "Request field photos." },
      { item: "Volume / gallons", status: "Found", why: "Supports internal review and customer response.", action: `Keep ${packet.gallons} gallons visible.` },
      { item: "Signature / status note", status: needsMissing ? "Needs Review" : "Found", why: "Shows whether the field ticket was acknowledged.", action: needsMissing ? "Confirm ticket acknowledgement." : "No follow-up needed." },
      { item: "Disposal backup", status: needsMissing ? "Missing" : "Weak", why: "Disposal is often route/load level, not always one-to-one.", action: needsMissing ? "Request route/load backup." : "Keep caveat attached." },
      { item: "Office notes", status: needsMissing ? "Needs Review" : "Found", why: "Explains what the office should do next.", action: "Keep closeout note with record." },
    ],
    evidenceItems: [
      { label: "Ticket", type: "ticket", status: "Found", note: "Service ticket details organized." },
      { label: "Photo", type: "photo", status: packet.photos > 0 ? "Found" : "Missing", note: packet.photos > 0 ? "Field image set attached." : "Photo set not attached." },
      { label: "Receipt", type: "receipt", status: needsMissing ? "Missing" : "Found", note: needsMissing ? "Needs route/load backup." : "Receipt attached where available." },
      { label: "Disposal", type: "route", status: needsMissing ? "Missing" : "Weak", note: needsMissing ? "No backup attached." : "Route/load level backup." },
      { label: "Signature", type: "signature", status: needsMissing ? "Needs Review" : "Found", note: "Ticket acknowledgement field." },
    ],
    timeline: [
      { label: "Captured", detail: "Field ticket data entered.", status: "done" },
      { label: "Reviewed", detail: "Office fields checked for gaps.", status: needsMissing ? "current" : "done" },
      { label: "Packet prepared", detail: "Proof items grouped into packet.", status: needsMissing ? "upcoming" : "done" },
      { label: "Gaps checked", detail: needsMissing ? "Missing fields still open." : "Known caveats noted.", status: needsMissing ? "upcoming" : "done" },
      { label: "Ready for response", detail: needsMissing ? "Wait until proof is collected." : "Ready for office use.", status: needsMissing ? "upcoming" : "current" },
    ],
  };
}

function buildPacketView(packet) {
  const signals = DETAIL_SIGNALS[packet.id] || defaultSignals(packet);
  const foundCount = signals.proofItems.filter((item) => item.status === "Found").length;

  return {
    ...packet,
    ...signals,
    foundCount,
    reviewFlags: [
      ...signals.proofItems.filter((item) => item.status !== "Found" && item.status !== "Not Applicable"),
    ],
  };
}

function StatusPill({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        PROOF_STATUS_STYLES[status] || PROOF_STATUS_STYLES["Needs Review"],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function MetricBox({ label, value, tone = "slate" }) {
  const toneClass = tone === "amber" ? "text-amber-900" : tone === "green" ? "text-emerald-900" : "text-navy-950";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold", toneClass)}>{value}</p>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value, subtext }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-card">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-navy-900">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mobile-safe-text mt-1 font-semibold text-navy-950">{value}</p>
        {subtext && <p className="mobile-safe-text mt-1 text-sm leading-relaxed text-slate-500">{subtext}</p>}
      </div>
    </div>
  );
}

function EvidenceVisual({ item }) {
  const isReview = item.status === "Weak" || item.status === "Needs Review" || item.status === "Missing";

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card">
      <div className={cn("h-1 w-full", isReview ? "bg-amber-600" : "bg-navy-800")} />
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
          <StatusPill status={item.status} />
        </div>
        <div className="relative h-28 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
          {item.type === "photo" && (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#e2e8f0_0%,#f8fafc_42%,#cbd5e1_100%)]">
              <div className="absolute bottom-3 left-3 h-8 w-16 rounded bg-slate-300/80" />
              <div className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white/80" />
              <div className="absolute bottom-3 right-3 h-12 w-20 rounded border border-white/60 bg-navy-900/10" />
            </div>
          )}
          {item.type === "ticket" && (
            <div className="absolute inset-0 p-4">
              <div className="h-3 w-24 rounded bg-navy-900/80" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="h-2 rounded bg-slate-300" />
                <div className="h-2 rounded bg-slate-200" />
                <div className="h-2 rounded bg-slate-200" />
                <div className="h-2 rounded bg-slate-300" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 h-8 rounded border border-slate-300 bg-white" />
            </div>
          )}
          {item.type === "receipt" && (
            <div className="absolute inset-0 p-4">
              <div className="mx-auto h-full w-28 rounded-sm border border-slate-300 bg-white p-3 shadow-sm">
                <div className="h-2 w-16 rounded bg-slate-300" />
                <div className="mt-3 h-px bg-slate-200" />
                <div className="mt-3 space-y-2">
                  <div className="h-2 rounded bg-slate-200" />
                  <div className="h-2 rounded bg-slate-300" />
                  <div className="h-2 w-14 rounded bg-slate-200" />
                </div>
              </div>
            </div>
          )}
          {item.type === "route" && (
            <div className="absolute inset-0 p-4">
              <div className="absolute left-7 top-7 h-3 w-3 rounded-full bg-navy-800" />
              <div className="absolute left-12 top-8 h-px w-24 rotate-12 bg-slate-400" />
              <div className="absolute right-9 top-12 h-3 w-3 rounded-full bg-amber-600" />
              <div className="absolute bottom-8 left-16 h-px w-28 -rotate-12 bg-slate-400" />
              <div className="absolute bottom-6 right-12 h-3 w-3 rounded-full bg-navy-800" />
              <div className="absolute bottom-4 left-4 rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500">
                route/load
              </div>
            </div>
          )}
          {item.type === "signature" && (
            <div className="absolute inset-0 p-4">
              <div className="h-16 rounded border border-slate-200 bg-white" />
              <div className="absolute bottom-7 left-8 h-px w-28 bg-slate-400" />
              <div className="absolute bottom-10 left-9 h-5 w-24 rounded-full border-b-2 border-navy-800" />
              <div className="absolute bottom-4 left-8 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                acknowledgement
              </div>
            </div>
          )}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.note}</p>
      </div>
    </div>
  );
}

function ProofItemsTable({ items }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <h2 className="font-display text-lg font-semibold text-navy-950">Proof Items Checked</h2>
        <p className="mt-1 text-sm text-slate-500">Each field shows what the office can rely on and what still needs attention.</p>
      </div>
      <div className="hidden md:grid md:grid-cols-[1.1fr_0.85fr_1.4fr_1.4fr] md:border-b md:border-slate-200 md:bg-white md:px-5 md:py-3">
        {["Proof item", "Status", "Why it matters", "Next office action"].map((heading) => (
          <p key={heading} className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{heading}</p>
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.item} className="grid gap-3 px-4 py-4 sm:px-5 md:grid-cols-[1.1fr_0.85fr_1.4fr_1.4fr] md:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 md:hidden">Proof item</p>
              <p className="mt-1 font-semibold text-navy-950 md:mt-0">{item.item}</p>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 md:hidden">Status</p>
              <StatusPill status={item.status} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 md:hidden">Why it matters</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 md:mt-0">{item.why}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 md:hidden">Next office action</p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-navy-950 md:mt-0">{item.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Timeline({ steps }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <h2 className="font-display text-lg font-semibold text-navy-950">Proof Timeline</h2>
      <div className="mt-5 space-y-4">
        {steps.map((step, index) => (
          <div key={step.label} className="grid grid-cols-[28px_1fr] gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold",
                  step.status === "done"
                    ? "border-emerald-700/15 bg-emerald-50 text-emerald-800"
                    : step.status === "current"
                      ? "border-navy-900/20 bg-navy-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                )}
              >
                {step.status === "done" ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              {index < steps.length - 1 && <span className="mt-2 h-full min-h-7 w-px bg-slate-200" />}
            </div>
            <div className="pb-1">
              <p className="font-semibold text-navy-950">{step.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProofDetail() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [copiedAction, setCopiedAction] = useState(false);
  const packet = proofPackets.find((p) => p.id === id);
  const packetView = useMemo(() => (packet ? buildPacketView(packet) : null), [packet]);
  const relatedAudit = packetView ? auditLog.filter((a) => a.target === packetView.id) : [];

  const copyText = async (text, onCopied) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch (err) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch (fallbackErr) {
        console.warn("Copy to clipboard failed:", fallbackErr);
      }
    }
    onCopied(true);
    setTimeout(() => onCopied(false), 1800);
  };

  if (!packetView) {
    return (
      <Layout>
        <section className="container-page py-20">
          <EmptyState title="Proof packet not found" description="This proof packet ID does not exist in this demo dataset." />
        </section>
      </Layout>
    );
  }

  const closeoutStyle = CLOSEOUT_STYLES[packetView.closeoutKey] || CLOSEOUT_STYLES.review;
  const actionNote = `${packetView.id} closeout: ${packetView.closeoutStatus}. Next office action: ${packetView.nextActionNeeded}`;

  return (
    <Layout>
      <section className="container-page py-10 sm:py-14">
        <Link
          to="/proof"
          data-testid="proof-detail-back-link"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Proof Packets
        </Link>

        <div data-testid="proof-report-card" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-premium">
          <div className="bg-navy-950 px-5 py-6 text-white sm:px-7 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">ClearRun Proof Packet</p>
                <h1 className="mobile-safe-text mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Closeout Status: {packetView.closeoutStatus}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">{packetView.closeoutReason}</p>
              </div>
              <div className="grid gap-2 text-sm text-slate-300 lg:min-w-[220px] lg:text-right">
                <span className={cn("inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold lg:ml-auto", closeoutStyle.badge)}>
                  <span className={cn("h-2 w-2 rounded-full", closeoutStyle.dot)} />
                  {packetView.closeoutStatus}
                </span>
                <p className="font-mono text-slate-100">{packetView.id}</p>
                <p>{packetView.customer}</p>
                <p>{packetView.serviceDate}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Route / load</p>
                <p className="mt-1 font-semibold text-white">{packetView.routeLoad}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Service type</p>
                <p className="mt-1 font-semibold text-white">{packetView.serviceType}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Evidence count</p>
                <p className="mt-1 font-semibold text-white">{packetView.evidenceCount} items</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Quality indicator</p>
                <p className="mt-1 font-semibold text-white">{packetView.completionScore}% organized</p>
              </div>
            </div>

            <p className="mt-5 max-w-4xl text-xs leading-relaxed text-slate-400">{SAFE_DISCLAIMER}</p>
          </div>

          <div className="grid gap-5 bg-offwhite/70 p-5 sm:p-7 lg:grid-cols-[1fr_340px] lg:p-8">
            <div className="space-y-5">
              <div className={cn("rounded-xl border p-5 shadow-card", closeoutStyle.panel)}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Closeout Decision Summary</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold text-navy-950">
                      {packetView.closeoutStatus === "Ready to Close" ? "Yes, this record can be closed." : "Not yet. This record needs office action."}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{packetView.mainIssue}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    data-testid="proof-detail-copy-link-btn"
                    onClick={() => copyText(window.location.href, setCopied)}
                    className="w-full sm:w-auto"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Link Copied" : "Copy Packet Link"}
                  </Button>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  <MetricBox label="Found" value={packetView.foundCount} tone="green" />
                  <MetricBox label="Missing" value={packetView.missingCount} tone={packetView.missingCount ? "amber" : "slate"} />
                  <MetricBox label="Weak" value={packetView.weakCount} tone={packetView.weakCount ? "amber" : "slate"} />
                  <MetricBox label="Needs review" value={packetView.reviewCount} tone={packetView.reviewCount ? "amber" : "slate"} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <SummaryItem icon={MapPin} label="Customer / location" value={packetView.customer} subtext={packetView.address} />
                <SummaryItem icon={Truck} label="Hauler / technician" value={packetView.hauler} subtext={`Tech: ${packetView.technician}`} />
                <SummaryItem icon={Droplets} label="Volume / service date" value={`${packetView.gallons} gallons`} subtext={`Service date: ${packetView.serviceDate}`} />
                <SummaryItem icon={Route} label="Route / load" value={packetView.routeName} subtext={packetView.routeLoad} />
              </div>

              <ProofItemsTable items={packetView.proofItems} />

              <div className="grid gap-5 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-navy-900">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Disposal Status</p>
                      <h2 className="mt-1 font-display text-lg font-semibold text-navy-950">{packetView.disposalStatus}</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{packetView.disposalSummary}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-navy-900">
                      <ClipboardCheck className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Invoice Support Status</p>
                      <h2 className="mt-1 font-display text-lg font-semibold text-navy-950">{packetView.invoiceSupport}</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{packetView.invoiceSummary}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-navy-900">
                      <FileCheck2 className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Customer Response Status</p>
                      <h2 className="mt-1 font-display text-lg font-semibold text-navy-950">{packetView.customerStatus}</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{packetView.customerSummary}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-navy-950">Evidence Stack</h2>
                    <p className="mt-1 text-sm text-slate-500">CSS-generated previews show record types without using customer images, logos, or copyrighted assets.</p>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{packetView.evidenceCount} organized items</p>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {packetView.evidenceItems.map((item) => (
                    <EvidenceVisual key={`${item.label}-${item.status}`} item={item} />
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                  <h2 className="font-display text-lg font-semibold text-navy-950">Found / Missing / Weak</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {packetView.reviewFlags.length > 0 ? (
                    packetView.reviewFlags.map((flag) => (
                      <div key={flag.item} className="rounded-lg border border-amber-700/15 bg-amber-50/70 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-amber-950">{flag.item}</p>
                          <StatusPill status={flag.status} />
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-amber-950/80">{flag.action}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-emerald-700/10 bg-emerald-50 p-3">
                      <div className="flex items-center gap-2 text-emerald-900">
                        <CheckCircle2 className="h-4 w-4" />
                        <p className="font-semibold">No missing proof flagged</p>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-emerald-900/80">
                        The packet can be kept ready for internal closeout and customer response.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-navy-900/15 bg-navy-950 p-5 text-white shadow-card">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Next Office Action</p>
                <h2 className="mt-2 font-display text-xl font-semibold text-white">{packetView.nextActionTitle}</h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-300">
                  <div>
                    <p className="font-semibold text-white">What is needed</p>
                    <p className="mt-1">{packetView.nextActionNeeded}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Why it matters</p>
                    <p className="mt-1">{packetView.nextActionWhy}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Suggested next step</p>
                    <p className="mt-1">{packetView.nextActionStep}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyText(actionNote, setCopiedAction)}
                  className="mt-5 w-full bg-white text-navy-950 hover:bg-slate-100"
                >
                  {copiedAction ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedAction ? "Action Copied" : "Copy Action Note"}
                </Button>
              </div>

              <Timeline steps={packetView.timeline} />

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                <h2 className="font-display text-lg font-semibold text-navy-950">Record History</h2>
                <div className="mt-4 space-y-3">
                  {relatedAudit.length > 0 ? (
                    relatedAudit.map((entry) => (
                      <div key={entry.id} className="border-l-2 border-slate-200 pl-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{entry.timestamp}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          <span className="font-semibold text-navy-950">{entry.actor}</span>: {entry.action}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-relaxed text-slate-500">No history recorded for this packet yet.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <DisclaimerBanner className="mt-6" text={SAFE_DISCLAIMER} />
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-navy-900">
              <FileText className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-navy-950">Why this packet matters</h2>
              <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
                ClearRun turns scattered field records into a closeout view the office can scan quickly: what happened, what proof exists,
                what is weak or missing, and what action should happen next. This supports the Proof Snapshot to Route Cleanup path without
                claiming regulatory approval or replacing the operator's existing record system.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
