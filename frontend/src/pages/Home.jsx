import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, FileCheck2, SearchX, FolderInput, FolderOutput, Stamp, History,
  Users, Camera, LineChart, Waves,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/shared/CTASection";
import { RoadmapCard } from "@/components/shared/RoadmapCard";
import { compatibilityList } from "@/data/mockData";

const HeroProofPreview = lazy(() => import("@/components/home/HeroProofPreview"));

const features = [
  { icon: FileCheck2, title: "Route Closeout Check", desc: "Shows whether one messy record is ready to close, missing proof, weak, or needs office review.", to: "/closeout-check" },
  { icon: SearchX, title: "Missing-Proof Queue", desc: "Turns proof gaps into a clear office follow-up list instead of scattered screenshots and notes.", to: "/recovery" },
  { icon: FolderInput, title: "Import", desc: "Bring in spreadsheets, PDFs, photos, screenshots, and paper-ticket details you already have.", to: "/import" },
  { icon: FolderOutput, title: "Invoice Backup Support", desc: "Organize record support before invoices, customer questions, or reviewer requests create more work.", to: "/export" },
  { icon: Stamp, title: "Disposal Backup Review", desc: "Classify whether disposal backup appears present, weak, missing, or needs office review.", to: "/disposal" },
  { icon: History, title: "Record Timeline", desc: "Keep the office trail visible without pretending ClearRun is a legal verifier or city approval system.", to: "/audit" },
];

const steps = [
  { icon: Camera, title: "Send one messy record", desc: "Use a redacted or sample ticket, photo set, receipt, invoice backup, or customer proof request." },
  { icon: FileCheck2, title: "ClearRun reviews closeout readiness", desc: "The check separates complete proof, missing proof, weak backup, and items needing office review." },
  { icon: Users, title: "Get one office action", desc: "Know exactly what to chase next before the record gets closed or shared." },
  { icon: FolderOutput, title: "Decide if a batch rescue is worth it", desc: "If the sample shows real pain, move to Record Closeout Rescue for multiple records." },
];

function HeroPreviewFallback() {
  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-4 bg-gradient-to-tr from-navy-900/5 to-transparent rounded-3xl -z-10" />
      <div className="rounded-2xl border border-slate-200 bg-white shadow-premium p-6 sm:p-8 min-h-[420px]">
        <div className="h-5 w-48 rounded bg-slate-100 mb-6" />
        <div className="h-24 rounded-xl bg-slate-100 mb-6" />
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
              <div className="h-4 w-28 rounded bg-slate-100" />
              <div className="h-5 w-20 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeferredHeroProofPreview() {
  const [shouldRenderPreview, setShouldRenderPreview] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const renderPreview = () => setShouldRenderPreview(true);
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(renderPreview, { timeout: 900 })
      : window.setTimeout(renderPreview, 250);

    return () => {
      if (window.cancelIdleCallback && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  if (!shouldRenderPreview) {
    return <HeroPreviewFallback />;
  }

  return (
    <Suspense fallback={<HeroPreviewFallback />}>
      <HeroProofPreview />
    </Suspense>
  );
}

export default function Home() {
  return (
    <Layout>
      <section className="container-page pt-16 sm:pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 stagger">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-navy-900/5 border border-navy-900/10 px-3 py-1 text-xs font-semibold tracking-wide text-navy-800 uppercase">
            Free Route Closeout Check
          </span>
          <h1 className="mobile-safe-text text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-navy-950">
            Find missing proof before your office closes the record.
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed">
            ClearRun helps FOG and liquid-waste offices answer the practical question: can this route record be closed, or is proof missing, weak, scattered, or unclear?
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/closeout-check" data-testid="hero-primary-cta">
              <Button size="lg" className="w-full sm:w-auto">Get Free Route Closeout Check <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/closeout-check#example-check" data-testid="hero-secondary-cta">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">See Example Check</Button>
            </Link>
          </div>
          <p className="text-xs text-slate-600 max-w-md">
            No card. No signup. No sales call required. Redacted or sample records welcome. Not legal certification or inspection approval.
          </p>
        </div>

        <DeferredHeroProofPreview />
      </section>

      <section className="container-page pb-16">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-slate-600 shadow-card">
          <span className="flex items-center gap-2"><Waves className="h-4 w-4 text-navy-800" /> Grease Trap / FOG</span>
          <span className="flex items-center gap-2"><Waves className="h-4 w-4 text-navy-800" /> Liquid Waste</span>
          <span className="flex items-center gap-2 text-slate-600"><Waves className="h-4 w-4" /> Septic (planned)</span>
          <span className="flex items-center gap-2 text-slate-600"><Waves className="h-4 w-4" /> Portable Sanitation (planned)</span>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-wide text-status-incomplete">The office problem</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-950 mt-3">Messy records are easy to close too early.</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: "Proof is scattered", desc: "Photos, receipts, notes, route sheets, and customer requests live in different places." },
            { title: "Billing support gets weak", desc: "The office may not know what is missing until a customer asks or an invoice needs backup." },
            { title: "The next action is unclear", desc: "Staff wastes time deciding whether to chase a driver, match a disposal receipt, or hold the record." },
          ].map((p) => (
            <div key={p.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="font-display font-semibold text-navy-950 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-white border-y border-slate-200 py-20">
        <div className="container-page">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wide text-navy-700">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-950 mt-3">From messy record to one clean office decision.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="relative flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white shrink-0">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-semibold text-slate-600">Step {i + 1}</span>
                </div>
                <h3 className="font-display font-semibold text-navy-950">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wide text-navy-700">Built around closeout readiness</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-950 mt-3">Simple on the surface. Useful under the hood.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              data-testid={`home-feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-card-hover hover:border-navy-900/20 transition-all"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900 mb-4 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display font-semibold text-navy-950 mb-1.5">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy-800 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 py-20">
        <div className="container-page">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wide text-navy-700">Works with what you already use</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-950 mt-3">No rip-and-replace required</h2>
            <p className="text-slate-600 mt-3 leading-relaxed">
              ClearRun works beside spreadsheets, PDFs, paper tickets, QuickBooks, ServiceCore, PumpDocket, Tank Track, and other
              existing systems through import/export workflows.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {compatibilityList.map((c) => (
              <span key={c.name} className="rounded-full border border-slate-200 bg-offwhite px-4 py-2 text-sm font-medium text-navy-800">
                {c.name}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-5">
            These reflect import/export compatibility, not official integration partnerships.
          </p>
          <Link to="/compatibility" data-testid="home-compatibility-link" className="inline-flex items-center gap-1 text-sm font-semibold text-navy-800 mt-4 hover:underline">
            See full compatibility details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-navy-700">Where ClearRun is headed</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-950 mt-3">Beyond grease traps and FOG</h2>
        </div>
        <RoadmapCard
          icon={LineChart}
          title="Infrastructure Intelligence"
          description="ClearRun is building toward septic, portable sanitation, disposal confirmations, review-ready exports, municipal visibility (CityView), and infrastructure-wide record intelligence (ProofGraph)."
          bullets={["Septic & liquid waste expansion", "CityView municipal visibility", "ProofGraph record relationships", "Infrastructure-wide intelligence"]}
        />
      </section>

      <CTASection />
    </Layout>
  );
}
