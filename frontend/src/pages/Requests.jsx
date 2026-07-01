import React from "react";
import { Link } from "react-router-dom";
import { Send, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/ui/status-badge";
import { requests } from "@/data/mockData";

export default function Requests() {
  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <PageHeader
          eyebrow="Proof Requests"
          title="The request loop that closes record gaps"
          description="When a record is missing, ClearRun sends a request to the hauler or field tech, and tracks the response until it's resolved."
        />

        {requests.length === 0 ? (
          <EmptyState icon={Send} title="No open requests" description="You're all caught up — no missing records need follow-up." className="mt-10" />
        ) : (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden">
            <table data-testid="requests-table" className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="px-6 py-3 font-medium">Business</th>
                  <th className="px-4 py-3 font-medium">Request Type</th>
                  <th className="px-4 py-3 font-medium">Sent</th>
                  <th className="px-4 py-3 font-medium">Responded</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} data-testid={`request-row-${r.id}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70">
                    <td className="px-6 py-3.5 font-medium text-navy-900">{r.business}<p className="text-xs text-slate-400 font-normal">{r.id}</p></td>
                    <td className="px-4 py-3.5 text-slate-500">{r.type}</td>
                    <td className="px-4 py-3.5 text-slate-500">{r.sentDate}</td>
                    <td className="px-4 py-3.5 text-slate-500">{r.respondedDate || "—"}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-card max-w-2xl">
          <h3 className="font-display font-semibold text-navy-950 mb-2">How the loop closes</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Requests are sent, tracked, and marked complete once the hauler or customer responds with the missing record —
            visible end-to-end in the <Link to="/audit" data-testid="requests-audit-link" className="text-navy-800 font-semibold hover:underline">Audit Log</Link>.
          </p>
          <Link to="/audit" data-testid="requests-view-audit-btn" className="inline-flex items-center gap-1 text-sm font-semibold text-navy-800 mt-4 hover:underline">
            View audit log <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
