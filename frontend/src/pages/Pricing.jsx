import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Building2, Target, HelpCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pricingTiers } from "@/data/mockData";

const clarity = [
  { icon: Building2, label: "Who it's for", text: "Grease-trap / FOG and liquid-waste haulers and multi-location operators — expanding to septic and portable sanitation." },
  { icon: Target, label: "What it solves", text: "Scattered service records that can't be produced quickly when a customer, biller, or inspector asks for proof." },
  { icon: HelpCircle, label: "Why not just spreadsheets", text: "Spreadsheets don't flag missing records, generate branded proof, or export billing-ready formats automatically." },
];

export default function Pricing() {
  return (
    <Layout>
      <section className="container-page py-16 sm:py-20">
        <PageHeader
          eyebrow="Pricing"
          title="Straightforward pricing for regulated field-service records"
          description="Every plan includes proof packets, missing-record recovery, and import/export. Scale up as your record volume grows."
          align="center"
        />

        <div className="mt-10 grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {clarity.map((c) => (
            <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900 mb-3"><c.icon className="h-4 w-4" /></span>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{c.label}</p>
              <p className="text-sm text-navy-800 mt-1.5 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              data-testid={`pricing-tier-${tier.name.toLowerCase()}`}
              className={cn(
                "rounded-2xl border p-7 flex flex-col gap-5 bg-white",
                tier.highlighted ? "border-navy-900 shadow-premium relative lg:scale-[1.03]" : "border-slate-200 shadow-card"
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-navy-900 text-white text-xs font-semibold px-3 py-1">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="font-display font-bold text-lg text-navy-950">{tier.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{tier.description}</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="font-display text-4xl font-bold text-navy-950">{tier.price}</span>
                <span className="text-slate-400 text-sm mb-1">{tier.period}</span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-status-complete mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to={tier.cta.includes("Trial") ? "/try-free" : "/proof-mockup"} data-testid={`pricing-cta-${tier.name.toLowerCase()}`}>
                <Button variant={tier.highlighted ? "primary" : "secondary"} className="w-full mt-2">{tier.cta}</Button>
              </Link>
            </div>
          ))}
        </div>
        <DisclaimerBanner className="max-w-xl mx-auto mt-10" />
      </section>
    </Layout>
  );
}
