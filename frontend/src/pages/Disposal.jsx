import React from "react";
import { Link } from "react-router-dom";
import { Stamp } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/ui/status-badge";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { disposalCertificates } from "@/data/mockData";

export default function Disposal() {
  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <PageHeader
          eyebrow="Disposal Certificates"
          title="Disposal confirmation, tied to every service"
          description="Track proof of disposal alongside the pump-out record it belongs to — no more chasing down separate paperwork."
        />

        {disposalCertificates.length === 0 ? (
          <EmptyState icon={Stamp} title="No disposal certificates yet" description="Certificates will appear once linked to a proof packet." className="mt-10" />
        ) : (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {disposalCertificates.map((d) => (
              <div key={d.id} data-testid={`disposal-card-${d.id}`} className="rounded-xl border border-slate-200 bg-white shadow-card p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900"><Stamp className="h-4 w-4" /></span>
                  <StatusBadge status={d.status} />
                </div>
                <div>
                  <p className="font-display font-semibold text-navy-950 text-sm">{d.facility}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{d.date} · {d.volume}</p>
                </div>
                <Link to={`/proof/${d.relatedPacket}`} data-testid={`disposal-related-link-${d.id}`} className="text-xs font-semibold text-navy-800 hover:underline pt-2 border-t border-slate-100">
                  View related proof packet →
                </Link>
              </div>
            ))}
          </div>
        )}

        <DisclaimerBanner className="max-w-2xl mt-8" text="ClearRun tracks disposal confirmations you or your hauler provide. It does not independently verify disposal with treatment facilities." />
      </section>
    </Layout>
  );
}
