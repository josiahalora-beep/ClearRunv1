import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { CTASection } from "@/components/shared/CTASection";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { objections } from "@/data/mockData";
import { cn } from "@/lib/utils";

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div data-testid="faq-item" className="rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden">
      <button
        data-testid="faq-toggle-btn"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4.5 text-left"
      >
        <span className="font-display font-semibold text-navy-950 text-sm sm:text-base">{q}</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function Objections() {
  return (
    <Layout>
      <section className="container-page py-16 sm:py-20">
        <PageHeader
          eyebrow="Common Questions"
          title="Honest answers to the questions we get most"
          description="No hype, no overpromising — here's exactly what ClearRun does and doesn't do."
          align="center"
        />
        <div className="max-w-2xl mx-auto mt-12 flex flex-col gap-3">
          {objections.map((o) => (
            <FaqItem key={o.q} q={o.q} a={o.a} />
          ))}
        </div>
        <DisclaimerBanner className="max-w-2xl mx-auto mt-8" />
      </section>
      <CTASection />
    </Layout>
  );
}
