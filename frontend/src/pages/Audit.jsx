import React from "react";
import { History } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { auditLog } from "@/data/mockData";

export default function Audit() {
  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <PageHeader
          eyebrow="Audit Log"
          title="Who touched a record, and when"
          description="A complete, read-only history of every action taken on a proof packet — uploads, edits, requests, and status changes."
        />

        {auditLog.length === 0 ? (
          <EmptyState icon={History} title="No activity yet" description="Actions on proof packets will appear here as they happen." className="mt-10" />
        ) : (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden">
            <div className="divide-y divide-slate-100">
              {auditLog.map((a) => (
                <div key={a.id} data-testid={`audit-row-${a.id}`} className="flex items-start gap-4 px-6 py-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900 shrink-0 mt-0.5">
                    <History className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-navy-900"><span className="font-semibold">{a.actor}</span> — {a.action}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.timestamp} · Related to {a.target}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
