import React from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { LeadQualificationForm } from "@/components/LeadQualificationForm";
import { Card, CardContent } from "@/components/ui/card";

const included = [
  "Full access to proof packets, import/export, and missing-record recovery",
  "Sample proof packet generated from your own service data",
  "Guided onboarding call with a records specialist",
  "No credit card required to start",
];

export default function TryFree() {
  return (
    <Layout>
      <section className="container-page py-16 sm:py-20 grid lg:grid-cols-2 gap-12">
        <div>
          <PageHeader
            eyebrow="Start Free Records Trial"
            title="See your service records the way an inspector would."
            description="Start a free trial and turn your existing service tickets into branded, report-grade proof packets — no migration required."
          />
          <div className="mt-8 flex flex-col gap-3">
            {included.map((i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-status-complete mt-0.5 shrink-0" />
                {i}
              </div>
            ))}
          </div>
          <DisclaimerBanner className="mt-8 max-w-md" />
        </div>

        <Card className="h-fit">
          <CardContent className="p-7 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white"><ShieldCheck className="h-4 w-4" /></span>
              <div>
                <p className="font-display font-semibold text-navy-950">Start your free trial</p>
                <p className="text-xs text-slate-500">Takes about 2 minutes</p>
              </div>
            </div>
            <LeadQualificationForm leadType="trial" sourcePage="/try-free" submitLabel="Start Free Records Trial" />
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
