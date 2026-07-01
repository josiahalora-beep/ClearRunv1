import React, { useState } from "react";
import { Building2, FileCheck2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { restaurants, proofPackets } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function Customer() {
  const [active, setActive] = useState(restaurants[0].id);
  const current = restaurants.find((r) => r.id === active);
  const history = proofPackets.filter((p) => p.customer === current.name);

  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <PageHeader
          eyebrow="Customer Portal"
          title="What your restaurant customers see"
          description="A simple, branded view where customers can see their own service history and proof packets — no login friction."
        />

        <div className="mt-10 grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-2">
            {restaurants.map((r) => (
              <button
                key={r.id}
                data-testid={`customer-select-${r.id}`}
                onClick={() => setActive(r.id)}
                className={cn(
                  "text-left rounded-lg px-4 py-3 border transition-colors",
                  active === r.id ? "bg-navy-900 text-white border-navy-900" : "bg-white text-navy-900 border-slate-200 hover:border-navy-900/30"
                )}
              >
                <p className="font-medium text-sm">{r.name}</p>
                <p className={cn("text-xs mt-0.5", active === r.id ? "text-slate-300" : "text-slate-400")}>Last service: {r.lastService}</p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white shadow-card p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900"><Building2 className="h-5 w-5" /></span>
                <div>
                  <h2 className="font-display font-bold text-lg text-navy-950">{current.name}</h2>
                  <p className="text-xs text-slate-400">Next service due {current.nextDue}</p>
                </div>
              </div>
              <StatusBadge status={current.status} />
            </div>

            <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">Proof packet history</p>
            <div className="flex flex-col gap-2.5">
              {history.length > 0 ? history.map((p) => (
                <Link key={p.id} to={`/proof/${p.id}`} data-testid={`customer-history-${p.id}`} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 hover:bg-slate-50">
                  <span className="flex items-center gap-2 text-sm text-navy-900"><FileCheck2 className="h-4 w-4 text-navy-800" /> {p.serviceType} — {p.serviceDate}</span>
                  <StatusBadge status={p.status} dot={false} />
                </Link>
              )) : (
                <p className="text-sm text-slate-400">No proof packets on file for this location yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
