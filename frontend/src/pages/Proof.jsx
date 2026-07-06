import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileCheck2, Search } from "lucide-react";
import { Layout } from "@/components/Layout";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { brand, proofPackets } from "@/data/mockData";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "complete", label: "Clean" },
  { id: "review", label: "Review" },
  { id: "attention", label: "Needs follow-up" },
  { id: "incomplete", label: "Incomplete" },
];

const STATUS_STYLE = {
  complete: {
    label: "Clean packet",
    dot: "bg-emerald-600",
    badge: "border-emerald-700/15 bg-emerald-50 text-emerald-800",
    accent: "bg-emerald-700",
  },
  review: {
    label: "Review-ready",
    dot: "bg-navy-700",
    badge: "border-navy-900/15 bg-navy-900/5 text-navy-900",
    accent: "bg-navy-800",
  },
  attention: {
    label: "Needs follow-up",
    dot: "bg-amber-600",
    badge: "border-amber-700/20 bg-amber-50 text-amber-900",
    accent: "bg-amber-600",
  },
  incomplete: {
    label: "Incomplete record",
    dot: "bg-slate-500",
    badge: "border-slate-300 bg-slate-100 text-slate-700",
    accent: "bg-slate-500",
  },
};

const PACKET_SIGNALS = {
  "PP-10231": {
    completionScore: 96,
    evidenceCount: 5,
    routeName: "Macon Route A",
    snapshotStage: "Ready to share",
    lastAction: "Cleaned proof packet prepared",
    nextBestAction: "Send cleaned Proof Snapshot to Creekside Grill.",
    missingFields: [],
    evidenceItems: ["Photo", "Ticket", "Receipt", "Disposal", "Signature"],
    matters: "Complete enough to answer a customer without digging through field notes.",
  },
  "PP-10232": {
    completionScore: 88,
    evidenceCount: 4,
    routeName: "Macon Route A",
    snapshotStage: "Review-ready",
    lastAction: "Disposal note marked for office review",
    nextBestAction: "Confirm disposal receipt before sending.",
    missingFields: ["Disposal confirmation needs review"],
    evidenceItems: ["Photo", "Ticket", "Receipt", "Signature"],
    matters: "One office check turns this from a record pile into a shareable packet.",
  },
  "PP-10233": {
    completionScore: 72,
    evidenceCount: 3,
    routeName: "Macon Route B",
    snapshotStage: "Cleanup opportunity",
    lastAction: "Missing-record request sent",
    nextBestAction: "Request missing disposal receipt, then offer Route Cleanup.",
    missingFields: ["Disposal confirmation missing", "Customer signature missing"],
    evidenceItems: ["Photo", "Ticket", "Route note"],
    matters: "This is the kind of gap that supports a paid Route Cleanup offer.",
  },
  "PP-10234": {
    completionScore: 58,
    evidenceCount: 2,
    routeName: "Warner Robins Route",
    snapshotStage: "Field follow-up",
    lastAction: "Ticket flagged incomplete",
    nextBestAction: "Ask field tech for service photos and disposal note.",
    missingFields: ["Photo evidence missing", "Disposal confirmation missing", "Signature missing"],
    evidenceItems: ["Ticket", "Route note"],
    matters: "The owner can see exactly why this packet is not customer-ready yet.",
  },
  "PP-10235": {
    completionScore: 98,
    evidenceCount: 5,
    routeName: "Warner Robins Route",
    snapshotStage: "Ready to share",
    lastAction: "Proof packet quality checked",
    nextBestAction: "Send cleaned Proof Snapshot.",
    missingFields: [],
    evidenceItems: ["Photo", "Ticket", "Receipt", "Disposal", "Signature"],
    matters: "Strong example packet for showing the value of organized proof.",
  },
  "PP-10236": {
    completionScore: 94,
    evidenceCount: 5,
    routeName: "Perry Route",
    snapshotStage: "Ready to share",
    lastAction: "Proof packet reviewed",
    nextBestAction: "Keep as a clean customer-response packet.",
    missingFields: [],
    evidenceItems: ["Photo", "Ticket", "Receipt", "Disposal", "Signature"],
    matters: "Clean, organized packet that supports internal review and customer response.",
  },
  "PP-10237": {
    completionScore: 84,
    evidenceCount: 4,
    routeName: "Macon Route B",
    snapshotStage: "Review-ready",
    lastAction: "Receipt matched to service date",
    nextBestAction: "Review gallons and disposal note before sharing.",
    missingFields: ["Gallons need office review"],
    evidenceItems: ["Photo", "Ticket", "Receipt", "Disposal"],
    matters: "A light review prevents a small record mismatch from becoming customer confusion.",
  },
  "PP-10238": {
    completionScore: 61,
    evidenceCount: 2,
    routeName: "Macon Route C",
    snapshotStage: "Cleanup opportunity",
    lastAction: "Missing fields identified",
    nextBestAction: "Request photos and disposal receipt before route cleanup.",
    missingFields: ["Photo evidence missing", "Disposal confirmation missing"],
    evidenceItems: ["Ticket", "Route note"],
    matters: "Visible record gaps create a clear reason to sell a cleanup service.",
  },
};

function getPacketView(packet) {
  const signal = PACKET_SIGNALS[packet.id] || {};
  const missingFields = signal.missingFields || [];

  return {
    ...packet,
    completionScore: signal.completionScore ?? (packet.status === "complete" ? 92 : 68),
    evidenceCount: signal.evidenceCount ?? Math.max(1, packet.photos || 1),
    routeName: signal.routeName || "Route not assigned",
    snapshotStage: signal.snapshotStage || "Needs review",
    lastAction: signal.lastAction || "Packet organized for review",
    nextBestAction: signal.nextBestAction || "Review missing fields before sharing.",
    missingFields,
    missingFieldsCount: missingFields.length,
    evidenceItems: signal.evidenceItems || ["Ticket", "Photo"],
    matters: signal.matters || "Helps prepare cleaner records for internal review and customer response.",
  };
}

function EvidenceStrip({ items, packetId }) {
  return (
    <div data-testid={`proof-evidence-strip-${packetId}`} className="grid grid-cols-5 gap-1.5">
      {items.map((item) => (
        <div key={item} className="min-w-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-2">
          <div className="mb-1.5 h-5 rounded border border-slate-200 bg-white">
            <div className="h-full w-2/3 rounded-l bg-slate-200/70" />
          </div>
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-500">{item}</p>
        </div>
      ))}
    </div>
  );
}

function MissingFields({ fields, count }) {
  if (!count) {
    return (
      <div className="rounded-lg border border-emerald-700/10 bg-emerald-50/70 px-3 py-2 text-xs font-semibold text-emerald-800">
        No missing fields flagged
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-amber-700/15 bg-amber-50/75 px-3 py-2">
      <p className="text-xs font-semibold text-amber-950">{count} missing {count === 1 ? "field" : "fields"}</p>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-amber-900/80">{fields.join(" - ")}</p>
    </div>
  );
}

function ProofPacketCard({ packet }) {
  const status = STATUS_STYLE[packet.status] || STATUS_STYLE.review;

  return (
    <Link
      to={`/proof/${packet.id}`}
      data-testid={`proof-card-${packet.id}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-900/20 hover:shadow-card-hover"
    >
      <div className={cn("h-1.5 w-full", status.accent)} />
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{packet.id}</p>
            <h2 className="mobile-safe-text mt-2 font-display text-xl font-semibold leading-tight text-navy-950">{packet.customer}</h2>
            <p className="mobile-safe-text mt-1 text-sm leading-relaxed text-slate-500">{packet.address}</p>
          </div>
          <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", status.badge)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
        </div>

        <div className="grid gap-3 border-y border-slate-100 py-4 text-sm text-slate-600 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Service</p>
            <p className="mt-1 font-semibold text-navy-950">{packet.serviceType}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Date</p>
            <p className="mt-1 font-semibold text-navy-950">{packet.serviceDate}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Route</p>
            <p className="mt-1 font-semibold text-navy-950">{packet.routeName}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[0.75fr_1fr]">
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Quality</p>
                <p className="mt-1 text-2xl font-bold text-navy-950">{packet.completionScore}%</p>
              </div>
              <p className="text-right text-xs font-semibold text-slate-500">{packet.evidenceCount} evidence items</p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className={cn("h-full rounded-full", status.accent)} style={{ width: `${packet.completionScore}%` }} />
            </div>
          </div>
          <MissingFields fields={packet.missingFields} count={packet.missingFieldsCount} />
        </div>

        <EvidenceStrip items={packet.evidenceItems} packetId={packet.id} />

        <div className="rounded-lg border border-slate-200 bg-offwhite/60 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Next action</p>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-navy-950">{packet.nextBestAction}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{packet.matters}</p>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-slate-500">Last: {packet.lastAction}</p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 transition-colors group-hover:text-navy-700">
            View Proof Packet <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Proof() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const packets = useMemo(() => proofPackets.map(getPacketView), []);
  const needsFollowUp = packets.filter((packet) => packet.missingFieldsCount > 0).length;
  const cleanPackets = packets.filter((packet) => packet.status === "complete").length;

  const filtered = packets.filter((packet) => {
    const searchable = [
      packet.customer,
      packet.id,
      packet.address,
      packet.serviceType,
      packet.routeName,
      packet.snapshotStage,
      packet.nextBestAction,
    ]
      .join(" ")
      .toLowerCase();
    const matchesFilter = filter === "all" || packet.status === filter;
    const matchesQuery = searchable.includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <Layout>
      <section className="container-page py-10 sm:py-14">
        <div className="grid gap-6 border-b border-slate-200 pb-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="min-w-0">
            <span className="inline-flex w-fit items-center rounded-full border border-navy-900/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-800">
              Proof Packets
            </span>
            <h1 className="mobile-safe-text mt-4 max-w-3xl font-display text-3xl font-bold leading-[1.08] tracking-tight text-navy-950 sm:text-4xl">
              A cleaner library for messy field records.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Proof Packets organize service proof, highlight missing fields, and show the next action before a record becomes a customer-ready Proof Snapshot.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-card">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-navy-950">{packets.length}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Packets</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-950">{cleanPackets}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Clean</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-800">{needsFollowUp}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Follow-up</p>
              </div>
            </div>
            <Link
              to="/proof-snapshot"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              Get Free Proof Snapshot <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-6 mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full min-w-0 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                data-testid="proof-search-input"
                placeholder="Search packet, customer, route, or next action"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Proof packet filters">
              {FILTERS.map((filterOption) => (
                <button
                  key={filterOption.id}
                  data-testid={`proof-filter-${filterOption.id}`}
                  onClick={() => setFilter(filterOption.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs font-semibold transition-colors",
                    filter === filterOption.id
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-navy-900/30 hover:text-navy-900"
                  )}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Showing {filtered.length} of {packets.length} sample packets. {brand.disclaimer}
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={FileCheck2} title="No proof packets match" description="Try clearing the search or selecting a different packet status." />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filtered.map((packet) => (
              <ProofPacketCard key={packet.id} packet={packet} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
