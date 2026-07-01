import React from "react";
import { Eye, Lock } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { proofPackets } from "@/data/mockData";

export default function Reviewer() {
  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <PageHeader
          eyebrow="Reviewer View"
          title="A read-only view built for inspectors"
          description="Share a locked-down, read-only view of service records with an inspector or reviewer — no edit access, no clutter."
        />

        <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-status-review/20 bg-status-review-bg px-4 py-2.5 text-sm text-status-review">
          <Lock className="h-4 w-4" /> Read-only mode — this view cannot edit or delete records.
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden">
          <table data-testid="reviewer-table" className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-6 py-3 font-medium">Packet ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Service Date</th>
                <th className="px-4 py-3 font-medium">Disposal Site</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {proofPackets.map((p) => (
                <tr key={p.id} data-testid={`reviewer-row-${p.id}`} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-3.5 font-mono text-xs text-slate-500">{p.id}</td>
                  <td className="px-4 py-3.5 text-navy-900 font-medium">{p.customer}</td>
                  <td className="px-4 py-3.5 text-slate-500">{p.serviceDate}</td>
                  <td className="px-4 py-3.5 text-slate-500">{p.disposalSite}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-start gap-2.5 text-sm text-slate-500 max-w-2xl">
          <Eye className="h-4 w-4 mt-0.5 shrink-0 text-slate-400" />
          Reviewer views are generated per request and expire after a set period. This preview shows demo data.
        </div>
        <DisclaimerBanner className="max-w-2xl mt-4" />
      </section>
    </Layout>
  );
}
