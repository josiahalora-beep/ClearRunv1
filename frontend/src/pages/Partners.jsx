import React from "react";
import { Handshake, Truck, Calculator, Share2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { Card, CardContent } from "@/components/ui/card";
import { partners } from "@/data/mockData";

const icons = { "Hauling Companies": Truck, "Pumping & Septic Providers": Truck, "Accountants & Billing Partners": Calculator, "Referral Partners": Share2 };

export default function Partners() {
  return (
    <Layout>
      <section className="container-page py-16 sm:py-20 grid lg:grid-cols-2 gap-12">
        <div>
          <PageHeader
            eyebrow="Partners"
            title="Build proof-ready records with your customers, together"
            description="ClearRun partners with hauling companies, septic and pumping providers, and billing partners to extend proof-of-service records further."
          />
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {partners.map((p) => {
              const Icon = icons[p.type] || Handshake;
              return (
                <div key={p.type} data-testid={`partner-type-${p.type.slice(0, 10).toLowerCase().replace(/\s+/g, "-")}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900 mb-3"><Icon className="h-4 w-4" /></span>
                  <h3 className="font-display font-semibold text-navy-950 text-sm">{p.type}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
          <DisclaimerBanner className="mt-8 max-w-md" />
        </div>

        <Card className="h-fit">
          <CardContent className="p-7 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white"><Handshake className="h-4 w-4" /></span>
              <div>
                <p className="font-display font-semibold text-navy-950">Become a partner</p>
                <p className="text-xs text-slate-500">We'll follow up within 2 business days</p>
              </div>
            </div>
            <LeadCaptureForm leadType="partner" submitLabel="Submit Partner Inquiry" messageLabel="Tell us about your business" />
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
