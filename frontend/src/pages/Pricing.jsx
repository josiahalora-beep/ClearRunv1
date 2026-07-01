import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pricingTiers } from "@/data/mockData";

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
