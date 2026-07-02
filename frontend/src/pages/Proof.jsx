import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileCheck2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { proofPackets } from "@/data/mockData";

const FILTERS = ["all", "complete", "review", "attention", "incomplete"];

export default function Proof() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = proofPackets.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesQuery = p.customer.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <PageHeader
          eyebrow="Proof Packets"
          title="Branded proof of every service"
          description="Every completed service becomes a report-grade proof packet that is searchable, shareable, and export-ready."
        />

        <div className="surface-card mt-8 mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full min-w-0 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input data-testid="proof-search-input" placeholder="Search customer or ID" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                data-testid={`proof-filter-${f}`}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  filter === f ? "bg-navy-900 text-white border-navy-900" : "bg-white text-slate-600 border-slate-200 hover:border-navy-900/30"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={FileCheck2} title="No proof packets match" description="Try clearing your filters or search term." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to={`/proof/${p.id}`}
                data-testid={`proof-card-${p.id}`}
                className="surface-card surface-card-hover flex min-w-0 flex-col gap-3 p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-400">{p.id}</span>
                  <StatusBadge status={p.status} />
                </div>
                <div>
                  <h3 className="mobile-safe-text font-display font-semibold text-navy-950">{p.customer}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{p.address}</p>
                </div>
                <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  <span>{p.serviceType}</span>
                  <span>{p.serviceDate}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
