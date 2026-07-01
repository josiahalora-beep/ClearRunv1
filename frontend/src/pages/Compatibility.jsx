import React from "react";
import { Puzzle, ArrowLeftRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { CTASection } from "@/components/shared/CTASection";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { compatibilityList } from "@/data/mockData";

export default function Compatibility() {
  return (
    <Layout>
      <section className="container-page py-16 sm:py-20">
        <PageHeader
          eyebrow="Compatibility"
          title="ClearRun works beside the tools you already use"
          description="Import/export workflows connect ClearRun to your existing spreadsheets, PDFs, paper tickets, and field-service software — no rip-and-replace."
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {compatibilityList.map((c) => (
            <div key={c.name} data-testid={`compatibility-card-${c.name.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900 mb-4"><Puzzle className="h-5 w-5" /></span>
              <h3 className="font-display font-semibold text-navy-950">{c.name}</h3>
              <p className="text-xs uppercase tracking-wide text-slate-400 mt-1">{c.type}</p>
              <p className="text-sm text-slate-500 mt-2.5 leading-relaxed">{c.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-card max-w-3xl flex gap-4 items-start">
          <ArrowLeftRight className="h-5 w-5 text-navy-800 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-500 leading-relaxed">
            These connections are import/export compatibility, built and maintained by ClearRun. They are not official
            partnerships or integrations endorsed by the named companies unless explicitly stated.
          </p>
        </div>
        <DisclaimerBanner className="max-w-3xl mt-6" />
      </section>
      <CTASection />
    </Layout>
  );
}
