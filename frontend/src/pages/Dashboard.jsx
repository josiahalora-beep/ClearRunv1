import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, CheckCircle2, FileSearch, Route } from "lucide-react";
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { brand, proofPackets, requests } from "@/data/mockData";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dashboardStats = [
  { label: "Proof Snapshots Requested", value: "8", delta: "Target sample submissions", status: "review" },
  { label: "Proof Packets Delivered", value: "6", delta: "Quality snapshots completed", status: "complete" },
  { label: "Missing Records / Needs Follow-Up", value: "3", delta: "Records blocking clean proof", status: "attention" },
  { label: "Route Cleanup Opportunity", value: "$1.6k", delta: "Demo value from flagged routes", status: "incomplete" },
];

const dashboardPipeline = [
  { label: "Snapshot Requested", count: 8, note: "sample submissions" },
  { label: "Sample Received", count: 6, note: "records ready to review" },
  { label: "Snapshot Delivered", count: 6, note: "quality snapshots" },
  { label: "Cleanup Offered", count: 6, note: "route cleanup offers" },
  { label: "Paid Cleanup", count: 1, note: "first conversion target" },
];

const packetSignals = {
  "PP-10231": {
    snapshotStage: "Snapshot Delivered",
    missingFieldsCount: 0,
    missingFields: [],
    nextBestAction: "Share finished proof packet if the customer asks for service records.",
    lastAction: "Proof Snapshot delivered",
    routeName: "Macon Route A",
    cleanupOpportunityValue: 0,
  },
  "PP-10232": {
    snapshotStage: "Snapshot Delivered",
    missingFieldsCount: 1,
    missingFields: ["Disposal receipt match"],
    nextBestAction: "Confirm the receipt match before marking the packet ready.",
    lastAction: "Sample received and reviewed",
    routeName: "Macon Route A",
    cleanupOpportunityValue: 0,
  },
  "PP-10233": {
    snapshotStage: "Cleanup Offered",
    missingFieldsCount: 2,
    missingFields: ["Disposal confirmation", "Volume note"],
    nextBestAction: "Send Route Cleanup offer for the missing disposal detail.",
    lastAction: "Missing disposal detail flagged",
    routeName: "Macon Route B",
    cleanupOpportunityValue: 650,
  },
  "PP-10234": {
    snapshotStage: "Sample Received",
    missingFieldsCount: 3,
    missingFields: ["Signature", "Photo evidence", "Disposal receipt"],
    nextBestAction: "Ask the field tech for the missing photo and signature.",
    lastAction: "Ticket imported without photos",
    routeName: "Warner Robins Route C",
    cleanupOpportunityValue: 550,
  },
  "PP-10235": {
    snapshotStage: "Snapshot Delivered",
    missingFieldsCount: 0,
    missingFields: [],
    nextBestAction: "Keep packet ready for customer response.",
    lastAction: "Proof Snapshot delivered",
    routeName: "Warner Robins Route C",
    cleanupOpportunityValue: 0,
  },
  "PP-10236": {
    snapshotStage: "Snapshot Delivered",
    missingFieldsCount: 0,
    missingFields: [],
    nextBestAction: "Keep packet ready for customer response.",
    lastAction: "Proof Snapshot delivered",
    routeName: "Perry Route D",
    cleanupOpportunityValue: 0,
  },
  "PP-10237": {
    snapshotStage: "Snapshot Delivered",
    missingFieldsCount: 1,
    missingFields: ["Customer approval note"],
    nextBestAction: "Confirm the approval note before sending the packet.",
    lastAction: "Packet moved to review",
    routeName: "Macon Route B",
    cleanupOpportunityValue: 0,
  },
  "PP-10238": {
    snapshotStage: "Sample Received",
    missingFieldsCount: 2,
    missingFields: ["Photo evidence", "Signature"],
    nextBestAction: "Ask the technician for missing photo evidence.",
    lastAction: "Record gap found in sample packet",
    routeName: "Macon Route A",
    cleanupOpportunityValue: 400,
  },
};

function PipelineStrip({ items }) {
  return (
    <div className="surface-card p-5" data-testid="dashboard-pipeline-strip">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">First clean-record path</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-navy-950">Proof Snapshot to Route Cleanup</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          The dashboard keeps the current sales motion visible: sample records in, proof artifact out, then a cleanup offer when gaps are real.
        </p>
      </div>

      <div className="mt-5 overflow-x-auto pb-1">
        <ol className="grid min-w-[760px] grid-cols-5 gap-3">
          {items.map((item, index) => (
            <li key={item.label} className="relative rounded-lg border border-slate-200 bg-cream p-4">
              {index < items.length - 1 && <span aria-hidden="true" className="absolute left-[calc(100%+0.25rem)] top-7 h-px w-2 bg-slate-300" />}
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-navy-800" />
                <span className="font-display text-2xl font-semibold text-navy-950">{item.count}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-navy-950">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function MissingFields({ fields }) {
  if (!fields?.length) {
    return <span className="text-slate-400">None flagged</span>;
  }

  return (
    <span className="flex flex-wrap gap-1.5">
      {fields.slice(0, 2).map((field) => (
        <span key={field} className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
          {field}
        </span>
      ))}
      {fields.length > 2 && <span className="text-xs font-medium text-slate-500">+{fields.length - 2} more</span>}
    </span>
  );
}

function NextBestActionCard({ record }) {
  return (
    <div className="surface-card p-5" data-testid="dashboard-next-best-action">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Next Best Action</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-navy-950">{record.customer}</h2>
          <p className="mt-1 text-sm text-slate-500">{record.routeName} - {record.id}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
          <FileSearch className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="rounded-lg border border-slate-200 bg-cream p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Missing</p>
          <div className="mt-2 text-sm text-navy-900">
            <MissingFields fields={record.missingFields} />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy-950">Why it matters</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            This record cannot become clean proof until the missing fields are resolved. A cleaner packet also makes the Route Cleanup offer concrete.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy-950">Suggested action</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{record.nextBestAction}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link to="/recovery" data-testid="dashboard-review-missing-records-btn">
          <Button className="w-full sm:w-auto">Review Missing Records <ArrowRight className="h-4 w-4" /></Button>
        </Link>
        <Link to={`/proof/${record.id}`} data-testid="dashboard-open-priority-packet-btn">
          <Button variant="secondary" className="w-full sm:w-auto">Open Packet</Button>
        </Link>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const dashboardPackets = proofPackets.map((packet) => ({
    ...packet,
    ...packetSignals[packet.id],
  }));
  const attentionRecords = dashboardPackets.filter((packet) => packet.status === "attention" || packet.status === "incomplete");
  const recordsWithGaps = dashboardPackets.filter((packet) => (packet.missingFieldsCount || 0) > 0);
  const openRequests = requests.filter((request) => request.status !== "complete");
  const cleanupOpportunity = attentionRecords.reduce((total, packet) => total + (packet.cleanupOpportunityValue || 0), 0);
  const priorityRecord = [...attentionRecords].sort(
    (a, b) => (b.cleanupOpportunityValue || 0) - (a.cleanupOpportunityValue || 0) || (b.missingFieldsCount || 0) - (a.missingFieldsCount || 0)
  )[0] || dashboardPackets[0];

  return (
    <Layout>
      <section className="container-page py-10 sm:py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-navy-800">Owner command center</p>
            <h1 className="mobile-safe-text mt-2 max-w-3xl font-display text-3xl font-bold leading-tight text-navy-950 sm:text-5xl">
              What needs attention today.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Demo-safe view of sample records, missing fields, and the next cleanup action before records become customer-ready proof.
            </p>
          </div>
          <Link to="/proof-snapshot" data-testid="dashboard-request-snapshot-link" className="shrink-0">
            <Button variant="secondary">Request Proof Snapshot</Button>
          </Link>
        </div>

        <div className="mt-7 overflow-hidden rounded-xl border border-navy-900 bg-navy-950 shadow-premium" data-testid="dashboard-attention-panel">
          <div className="grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="p-5 text-white sm:p-7">
              <div className="flex items-center gap-2 text-amber-200">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase">Attention today</span>
              </div>
              <h2 className="mt-4 max-w-2xl font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
                {attentionRecords.length} records need follow-up before they can become clean proof.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Start with {priorityRecord.customer}. It has {priorityRecord.missingFieldsCount} missing fields on {priorityRecord.routeName}, creating a {money.format(priorityRecord.cleanupOpportunityValue || 0)} Route Cleanup opportunity in this demo.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link to="/recovery" data-testid="dashboard-primary-recovery-link">
                  <Button className="w-full bg-white text-navy-950 hover:bg-slate-100 sm:w-auto">Review Missing Records</Button>
                </Link>
                <Link to={`/proof/${priorityRecord.id}`} data-testid="dashboard-priority-record-link">
                  <Button variant="outline" className="w-full border-white/25 text-white hover:bg-white hover:text-navy-950 sm:w-auto">
                    View Priority Packet
                  </Button>
                </Link>
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/5 p-5 sm:p-7 lg:border-l lg:border-t-0">
              <div className="grid gap-4 text-white">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Affected account</p>
                  <p className="mt-1 font-display text-lg font-semibold">{priorityRecord.customer}</p>
                  <p className="mt-1 text-sm text-slate-300">{priorityRecord.routeName}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-slate-400">Open requests</p>
                    <p className="mt-1 font-display text-2xl font-semibold">{openRequests.length}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-slate-400">Cleanup value</p>
                    <p className="mt-1 font-display text-2xl font-semibold">{money.format(cleanupOpportunity)}</p>
                  </div>
                </div>
                <p className="text-xs leading-5 text-slate-400">
                  Sample data only. ClearRun organizes service proof; it does not certify legal compliance or guarantee inspection outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="mt-6">
          <PipelineStrip items={dashboardPipeline} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <NextBestActionCard record={priorityRecord} />

          <div className="console-card" data-testid="dashboard-proof-activity">
            <div className="console-card-header">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Recent proof activity</p>
                <h2 className="mt-1 font-display font-semibold text-navy-950">Packets moving through review</h2>
              </div>
              <Link to="/proof" data-testid="dashboard-proof-table-link" className="text-sm font-semibold text-navy-800 hover:underline">
                View packets
              </Link>
            </div>
            <div className="table-scroll">
              <table data-testid="dashboard-proof-table" className="w-full min-w-[880px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                    <th className="px-5 py-3 font-medium">Packet</th>
                    <th className="px-4 py-3 font-medium">Stage</th>
                    <th className="px-4 py-3 font-medium">Missing fields</th>
                    <th className="px-4 py-3 font-medium">Last action</th>
                    <th className="px-4 py-3 font-medium">Next step</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardPackets.map((packet) => (
                    <tr key={packet.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70">
                      <td className="px-5 py-4 align-top">
                        <Link to={`/proof/${packet.id}`} data-testid={`dashboard-row-${packet.id}`} className="font-semibold text-navy-900 hover:underline">
                          {packet.customer}
                        </Link>
                        <p className="mt-1 text-xs text-slate-400">{packet.id} - {packet.routeName}</p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <StatusBadge status={packet.status} label={packet.snapshotStage} dot={false} />
                      </td>
                      <td className="px-4 py-4 align-top text-slate-600">
                        <MissingFields fields={packet.missingFields} />
                      </td>
                      <td className="px-4 py-4 align-top text-slate-600">{packet.lastAction}</td>
                      <td className="px-4 py-4 align-top text-slate-600">{packet.nextBestAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.72fr]">
          <div className="surface-card p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900">
                <Route className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-navy-950">Workflow links</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Kept intentionally small so the dashboard stays focused on action instead of becoming a sitemap.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link to="/recovery" data-testid="dashboard-workflow-recovery-link">
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">Review Missing Records</Button>
                  </Link>
                  <Link to="/proof" data-testid="dashboard-workflow-proof-link">
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto">Open Proof Packets</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-navy-950">Today&apos;s operating signal</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {recordsWithGaps.length} sample packets have at least one gap. {attentionRecords.length} are blocking a clean proof handoff and should be worked first.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-4xl text-xs leading-5 text-slate-500">
          {brand.disclaimer} Dashboard data is illustrative and does not represent real customer records, integrations, storage, payments, or automated document generation.
        </p>
      </section>
    </Layout>
  );
}
