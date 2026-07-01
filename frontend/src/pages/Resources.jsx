import React from "react";
import { BookOpen, ClipboardList, BarChart2, FileText } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { CTASection } from "@/components/shared/CTASection";
import { resources } from "@/data/mockData";

const typeIcon = { Guide: BookOpen, Checklist: ClipboardList, Comparison: BarChart2 };

export default function Resources() {
  return (
    <Layout>
      <section className="container-page py-16 sm:py-20">
        <PageHeader
          eyebrow="Resources"
          title="Guides for regulated field-service record-keeping"
          description="Practical reading on grease-trap / FOG and liquid-waste compliance readiness, missing-record risk, and preparing for inspections — the same record discipline extends to septic and portable sanitation as ClearRun grows."
        />
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {resources.map((r) => {
            const Icon = typeIcon[r.type] || FileText;
            return (
              <div key={r.title} data-testid={`resource-card-${r.title.slice(0, 12).toLowerCase().replace(/\s+/g, "-")}`} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900"><Icon className="h-4 w-4" /></span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{r.type}</span>
                </div>
                <h3 className="font-display font-semibold text-navy-950 leading-snug">{r.title}</h3>
                <p className="text-xs text-slate-400 mt-2.5">{r.readTime}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-6">
          More guides are added regularly. Have a topic you want covered? Reach out through the partner or trial forms.
        </p>
      </section>
      <CTASection />
    </Layout>
  );
}
