import React from "react";
import { Building, FolderOutput, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { cityExportRecords } from "@/data/mockData";

export default function CityExport() {
  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <PageHeader
          eyebrow="City Export"
          title="A summary export built for municipal records requests"
          description="Generate a clean, standardized export of pump-out history across your customer locations — ready to hand to a city or county records request."
          actions={
            <Button data-testid="city-export-generate-btn"><FolderOutput className="h-4 w-4" /> Generate City Export</Button>
          }
        />

        <div className="mt-10 rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
            <Building className="h-4 w-4 text-navy-800" />
            <h2 className="font-display font-semibold text-navy-950">Millbrook, OH — Summary</h2>
          </div>
          <table data-testid="city-export-table" className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-6 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Last Pump-Out</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {cityExportRecords.map((c) => (
                <tr key={c.id} data-testid={`city-export-row-${c.id}`} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-3.5 font-medium text-navy-900">{c.business}</td>
                  <td className="px-4 py-3.5 text-slate-500">{c.lastPumpOut}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-start gap-2.5 text-sm text-status-attention bg-status-attention-bg border border-status-attention/20 rounded-lg px-4 py-3 max-w-2xl">
          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
          This export organizes service records for a municipal request. It is not an official city-approved or government-endorsed report.
        </div>
        <DisclaimerBanner className="max-w-2xl mt-4" />
      </section>
    </Layout>
  );
}
