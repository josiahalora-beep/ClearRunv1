import React from "react";
import { FileCheck2, ShieldCheck } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { MockupRequestForm } from "@/components/MockupRequestForm";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { proofPackets } from "@/data/mockData";

export default function ProofMockup() {
  const sample = proofPackets[1];
  return (
    <Layout>
      <section className="container-page grid grid-cols-1 gap-8 py-14 sm:py-16 lg:grid-cols-2 lg:gap-12">
        <div className="min-w-0">
          <PageHeader
            eyebrow="Free Proof Packet Mockup"
            title="See exactly what a branded proof packet looks like, built with your data."
            description="Send us a sample service ticket or two, and we'll turn it into a real, branded proof packet mockup so you can see the format before you commit to anything."
          />
          <p className="mt-6 max-w-full text-sm leading-relaxed text-slate-500 sm:max-w-md">
            This mockup is a preview, not a live product account. It shows the report-grade format ClearRun generates
            automatically once you're onboarded.
          </p>
          <DisclaimerBanner className="mt-8 max-w-full sm:max-w-md" />

          <div data-testid="mockup-sample-preview" className="surface-card mt-8 max-w-full p-5 sm:max-w-md">
            <div className="mb-3 flex flex-col gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-navy-950"><FileCheck2 className="h-4 w-4 shrink-0" /> Sample: {sample.id}</span>
              <StatusBadge status={sample.status} />
            </div>
            <p className="mobile-safe-text text-xs text-slate-400">{sample.customer} - {sample.serviceType} - {sample.serviceDate}</p>
          </div>
        </div>

        <Card className="form-card h-fit min-w-0">
          <CardContent className="p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white"><ShieldCheck className="h-4 w-4" /></span>
              <div>
                <p className="font-display font-semibold text-navy-950">Request your free mockup</p>
                <p className="text-xs text-slate-500">We'll follow up within 1 business day</p>
              </div>
            </div>
            <MockupRequestForm sourcePage="/proof-mockup" submitLabel="Get a Free Proof Packet Mockup" />
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
