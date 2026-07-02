import React from "react";
import { Users2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { LeadQualificationForm } from "@/components/LeadQualificationForm";
import { Card, CardContent } from "@/components/ui/card";

const phases = [
  { title: "Week 1: Onboarding", desc: "Import your existing records and connect your first location(s)." },
  { title: "Weeks 2-3: Live proof packets", desc: "Every new service generates a branded proof packet automatically." },
  { title: "Week 4: Review", desc: "We review missing-record catches, exports, and gather your feedback." },
];

export default function Pilot() {
  return (
    <Layout>
      <section className="container-page grid grid-cols-1 gap-8 py-14 sm:py-16 lg:grid-cols-2 lg:gap-12">
        <div className="min-w-0">
          <PageHeader
            eyebrow="Pilot Program"
            title="Run a 30-day pilot with your own service records."
            description="A structured, low-risk way to test ClearRun with a real location or route before rolling it out further."
          />
          <div className="mt-8 flex max-w-full flex-col gap-4">
            {phases.map((p, i) => (
              <div key={p.title} className="surface-card flex min-w-0 gap-4 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-white text-xs font-bold shrink-0">{i + 1}</span>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-navy-950 text-sm">{p.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <DisclaimerBanner className="mt-8 max-w-full sm:max-w-md" />
        </div>

        <Card className="form-card h-fit min-w-0">
          <CardContent className="p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white"><Users2 className="h-4 w-4" /></span>
              <div>
                <p className="font-display font-semibold text-navy-950">Apply for the pilot</p>
                <p className="text-xs text-slate-500">Limited pilot slots per quarter</p>
              </div>
            </div>
            <LeadQualificationForm leadType="pilot" sourcePage="/pilot" submitLabel="Apply for Pilot Program" />
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
