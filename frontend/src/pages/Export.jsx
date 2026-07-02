import React, { useState } from "react";
import { FolderOutput, FileSpreadsheet, FileText, Package, Building2, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { exportFormats } from "@/data/mockData";

const icons = [FileSpreadsheet, FileText, Package, Building2];

export default function Export() {
  const [selected, setSelected] = useState(exportFormats[0]);
  const [exported, setExported] = useState(false);

  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <PageHeader
          eyebrow="Export Records"
          title="Billing-ready and branded exports"
          description="Export proof packets in the format your accounting team, hauler, or city needs - mapped and ready to use."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {exportFormats.map((f, i) => {
            const Icon = icons[i] || FileText;
            const active = selected === f;
            return (
              <button
                key={f}
                data-testid={`export-format-${i}`}
                onClick={() => { setSelected(f); setExported(false); }}
                className={`flex min-w-0 items-start gap-4 rounded-xl border p-5 text-left transition-all ${
                  active ? "border-navy-900 bg-white shadow-card-hover" : "border-slate-200 bg-white shadow-card hover:border-navy-900/30"
                }`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${active ? "bg-navy-900 text-white" : "bg-navy-900/5 text-navy-900"}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-navy-950 text-sm">{f}</p>
                  {active && <p className="text-xs text-status-complete mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Selected</p>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="surface-card mt-8 flex max-w-2xl flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Export selection</p>
            <p className="font-medium text-navy-900 mt-1">{selected}</p>
          </div>
          {!exported ? (
            <Button data-testid="export-generate-btn" onClick={() => setExported(true)} className="w-full sm:w-auto">
              <FolderOutput className="h-4 w-4" /> Generate Export
            </Button>
          ) : (
            <span data-testid="export-success-message" className="inline-flex items-center gap-2 text-sm font-medium text-status-complete">
              <CheckCircle2 className="h-4 w-4" /> Export ready - queued for download
            </span>
          )}
        </div>

        <DisclaimerBanner className="max-w-2xl mt-8" text="This is a demo export flow. No files are generated or stored by this preview." />
      </section>
    </Layout>
  );
}
