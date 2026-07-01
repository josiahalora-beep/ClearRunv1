import React from "react";
import { Lock, Eye, FileLock2, ServerCog } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { CTASection } from "@/components/shared/CTASection";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";

const pillars = [
  { icon: Lock, title: "Access-controlled records", desc: "Proof packets and exports are only accessible to people you explicitly share them with." },
  { icon: Eye, title: "Full visibility", desc: "The audit log shows who viewed, edited, or exported every record — no hidden changes." },
  { icon: FileLock2, title: "Your data stays yours", desc: "Records you import remain exportable at any time in standard formats." },
  { icon: ServerCog, title: "Responsible infrastructure", desc: "Built on standard cloud infrastructure with encrypted storage and transit." },
];

export default function Trust() {
  return (
    <Layout>
      <section className="container-page py-16 sm:py-20">
        <PageHeader
          eyebrow="Trust & Security"
          title="How ClearRun handles your records"
          description="Straight answers about data handling — without claiming certifications we haven't earned."
          align="center"
        />
        <div className="mt-12 grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {pillars.map((p) => (
            <div key={p.title} data-testid={`trust-pillar-${p.title.slice(0, 10).toLowerCase().replace(/\s+/g, "-")}`} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900 mb-4"><p.icon className="h-5 w-5" /></span>
              <h3 className="font-display font-semibold text-navy-950">{p.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto mt-8 rounded-xl border border-status-attention/20 bg-status-attention-bg p-5 text-sm text-status-attention">
          ClearRun does not currently hold SOC 2, ISO, EPA, or municipal compliance certifications. We will update this page if that changes.
        </div>
        <DisclaimerBanner className="max-w-3xl mx-auto mt-6" />
      </section>
      <CTASection />
    </Layout>
  );
}
