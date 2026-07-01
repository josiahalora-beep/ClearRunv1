import React from "react";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { CTASection } from "@/components/shared/CTASection";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { checklistItems } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const riskStyle = {
  high: "bg-status-incomplete-bg text-status-incomplete border-status-incomplete/20",
  medium: "bg-status-attention-bg text-status-attention border-status-attention/20",
  low: "bg-status-review-bg text-status-review border-status-review/20",
};

export default function Checklist() {
  return (
    <Layout>
      <section className="container-page py-16 sm:py-20">
        <PageHeader
          eyebrow="Record Readiness Checklist"
          title="Are your service records inspection-ready?"
          description="Walk through the same gaps inspectors and customers ask about most. Anything marked high-risk is worth fixing first."
          align="center"
        />
        <div className="max-w-2xl mx-auto mt-12 flex flex-col gap-3">
          {checklistItems.map((c) => (
            <div key={c.item} data-testid={`checklist-item-${c.item.slice(0, 10).toLowerCase().replace(/\s+/g, "-")}`} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-card">
              <span className="flex items-center gap-3 text-sm font-medium text-navy-900">
                <AlertTriangle className="h-4 w-4 text-slate-300 shrink-0" />
                {c.item}
              </span>
              <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${riskStyle[c.risk]}`}>{c.risk} risk</span>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-card text-center">
          <CheckCircle2 className="h-8 w-8 text-status-complete mx-auto mb-3" />
          <p className="font-display font-semibold text-navy-950">Missing more than a couple of these?</p>
          <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
            ClearRun automatically flags gaps like these and generates a missing-record request — before an inspection forces the issue.
          </p>
          <Link to="/recovery" data-testid="checklist-recovery-link">
            <Button className="mt-4">See Missing-Record Recovery <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>

        <DisclaimerBanner className="max-w-2xl mx-auto mt-8" />
      </section>
      <CTASection />
    </Layout>
  );
}
