import React from "react";
import { Link } from "react-router-dom";
import { SearchX, Send, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { proofPackets } from "@/data/mockData";

export default function Recovery() {
  const missing = proofPackets.filter((p) => p.status === "incomplete" || p.status === "attention");

  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <PageHeader
          eyebrow="Missing-Record Recovery"
          title="Catch record gaps before an inspection does"
          description="ClearRun flags incomplete tickets automatically — missing photos, missing disposal confirmation, or missing volume data — so you can close the gap early."
        />

        {missing.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No missing records right now"
            description="Every proof packet currently has complete photos, volume, and disposal confirmation."
            className="mt-10"
          />
        ) : (
          <div className="mt-10 flex flex-col gap-4">
            {missing.map((p) => (
              <div key={p.id} data-testid={`recovery-item-${p.id}`} className="rounded-xl border border-slate-200 bg-white shadow-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <StatusBadge status={p.status} />
                  <div>
                    <Link to={`/proof/${p.id}`} className="font-display font-semibold text-navy-950 hover:underline">{p.customer}</Link>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {p.id} · {p.serviceType} · {p.serviceDate}
                    </p>
                    <p className="text-xs text-status-incomplete mt-1">
                      {p.photos === 0 ? "Missing photo evidence" : "Missing disposal confirmation"}
                    </p>
                  </div>
                </div>
                <Link to="/requests" data-testid={`recovery-request-btn-${p.id}`}>
                  <Button variant="secondary" size="sm"><Send className="h-3.5 w-3.5" /> Send Record Request</Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-card max-w-2xl">
          <h3 className="font-display font-semibold text-navy-950 mb-2">How recovery works</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            When a ticket is missing required proof — photos, volume, or disposal confirmation — ClearRun flags it automatically
            and lets you send a request directly to the field technician or hauler through the{" "}
            <Link to="/requests" data-testid="recovery-requests-link" className="text-navy-800 font-semibold hover:underline">Proof Requests</Link> flow.
          </p>
          <Link to="/requests" data-testid="recovery-view-requests-btn" className="inline-flex items-center gap-1 text-sm font-semibold text-navy-800 mt-4 hover:underline">
            View request loop <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
