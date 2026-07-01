import React from "react";
import { Check, X, MinusCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { CTASection } from "@/components/shared/CTASection";
import { comparisonRows } from "@/data/mockData";

function Cell({ value }) {
  if (value === true) return <Check className="h-4 w-4 text-status-complete mx-auto" />;
  if (value === false) return <X className="h-4 w-4 text-status-incomplete mx-auto" />;
  return <MinusCircle className="h-4 w-4 text-status-attention mx-auto" />;
}

export default function Comparison() {
  return (
    <Layout>
      <section className="container-page py-16 sm:py-20">
        <PageHeader
          eyebrow="Comparison"
          title="Spreadsheets vs. paper tickets vs. ClearRun"
          description="A practical look at where each approach holds up — and where records fall through the cracks."
          align="center"
        />
        <div className="mt-12 max-w-3xl mx-auto overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-card">
          <table data-testid="comparison-table" className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left font-semibold text-navy-900 px-5 py-3.5">Capability</th>
                <th className="font-semibold text-slate-500 px-4 py-3.5">Spreadsheets</th>
                <th className="font-semibold text-slate-500 px-4 py-3.5">Paper Tickets</th>
                <th className="font-semibold text-navy-900 px-4 py-3.5 bg-navy-900/5">ClearRun</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((r) => (
                <tr key={r.capability} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-4 text-navy-900 font-medium">{r.capability}</td>
                  <td className="px-4 py-4"><Cell value={r.spreadsheets} /></td>
                  <td className="px-4 py-4"><Cell value={r.paper} /></td>
                  <td className="px-4 py-4 bg-navy-900/5"><Cell value={r.clearrun} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl mx-auto mt-4 text-center">
          Comparison reflects typical capability gaps observed in field-service record-keeping, not a claim about any specific competing product.
        </p>
      </section>
      <CTASection />
    </Layout>
  );
}
