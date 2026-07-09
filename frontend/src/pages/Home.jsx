import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileCheck2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/shared/CTASection";

const HeroProofPreview = lazy(() => import("@/components/home/HeroProofPreview"));

const proofPoints = [
  "Find missing proof before closeout",
  "Separate ready, review, and missing records",
  "Give the office one next action",
];

const programs = [
  {
    number: "01",
    title: "Route Closeout Check",
    body: "A free first look at one messy record before the office closes it.",
    glow: "bg-sageglass-300",
    to: "/closeout-check",
  },
  {
    number: "02",
    title: "Proof Packet Demo",
    body: "Preview the three outcomes ClearRun organizes: ready, review, missing.",
    glow: "bg-grape-300",
    to: "/proof",
  },
  {
    number: "03",
    title: "Record Closeout Rescue",
    body: "Turn a batch of weak records into a cleaner office action queue.",
    glow: "bg-skyglass-300",
    to: "/pricing",
  },
];

const outcomes = [
  ["Ready", "Close the record and share backup if requested."],
  ["Review", "Confirm weak backup before the office signs off."],
  ["Missing", "Chase the photo, signature, volume, or disposal backup."],
];

function HeroPreviewFallback() {
  return (
    <div className="premium-shell p-5" aria-hidden="true">
      <div className="h-72 rounded-[1.5rem] bg-slate-100" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="h-24 rounded-2xl bg-slate-100" />
        <div className="h-24 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

function DeferredHeroProofPreview() {
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const id = window.setTimeout(() => setShowPreview(true), 180);
    return () => window.clearTimeout(id);
  }, []);

  if (!showPreview) return <HeroPreviewFallback />;

  return (
    <Suspense fallback={<HeroPreviewFallback />}>
      <HeroProofPreview />
    </Suspense>
  );
}

function ProgramCard({ item }) {
  return (
    <Link to={item.to} className="group premium-card-dark relative min-h-[22rem] overflow-hidden p-6 transition-transform hover:-translate-y-1">
      <span className="relative z-10 text-sm font-semibold text-white/70">{item.number}</span>
      <div className={`premium-gradient-orb ${item.glow} left-1/2 top-20 h-32 w-32 -translate-x-1/2 opacity-80`} />
      <div className="premium-gradient-orb bg-white/20 left-1/2 top-24 h-20 w-20 -translate-x-1/2" />
      <div className="relative z-10 mt-40">
        <h3 className="font-display text-2xl font-semibold text-white">{item.title}</h3>
        <p className="mt-3 max-w-xs text-sm leading-6 text-white/68">{item.body}</p>
        <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white">
          Open <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function OutcomeRow({ title, copy }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-200 py-4 last:border-b-0">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-grape-500 text-white">
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold text-navy-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout>
      <section className="container-editorial section-y grid items-center gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)]">
        <div className="stagger">
          <span className="premium-pill">Free Route Closeout Check</span>
          <h1 className="mobile-safe-text mt-7 max-w-3xl font-display text-5xl font-bold leading-[0.92] text-ink sm:text-6xl lg:text-7xl">
            Better proof.
            <span className="block text-slate-400">Cleaner closeout.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
            ClearRun helps FOG and liquid-waste offices see whether a route record is ready, weak, or missing proof before it gets closed.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/closeout-check" data-testid="hero-primary-cta">
              <Button size="lg" className="w-full bg-black text-white hover:bg-navy-900 sm:w-auto">
                Start Free Check <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/proof" data-testid="hero-secondary-cta">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">View Dashboard</Button>
            </Link>
          </div>
          <div className="mt-16 max-w-xl divide-y divide-slate-200">
            {proofPoints.map((point) => (
              <div key={point} className="flex items-center gap-3 py-3 text-sm font-medium text-navy-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-grape-500 text-white">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </span>
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="premium-gradient-orb bg-grape-300 right-6 top-0 h-52 w-52 opacity-40" />
          <div className="premium-gradient-orb bg-skyglass-300 bottom-8 left-8 h-56 w-56 opacity-45" />
          <DeferredHeroProofPreview />
        </div>
      </section>

      <section className="container-editorial pb-8 pt-4 sm:pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="premium-kicker">Programs</p>
          <h2 className="premium-section-title mt-4">Designed around record closeout priorities</h2>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {programs.map((item) => <ProgramCard key={item.title} item={item} />)}
        </div>
        <p className="premium-section-copy">
          Choose the path that matches the office problem: one free record check, a product demo, or a batch closeout rescue.
        </p>
      </section>

      <section className="container-editorial section-y">
        <div className="grid gap-8 rounded-premium border border-slate-200 bg-white p-5 shadow-editorial md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:p-8 lg:p-10">
          <div className="rounded-[1.75rem] bg-ink p-6 text-white md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Closeout logic</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-none text-white sm:text-5xl">
              One record. Three possible outcomes.
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/65">
              ClearRun should feel like the office can understand the next action in seconds, not read through another long report.
            </p>
          </div>
          <div className="px-1 md:px-2">
            {outcomes.map(([title, copy]) => <OutcomeRow key={title} title={title} copy={copy} />)}
          </div>
        </div>
      </section>

      <section className="container-editorial pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["No card", "Start with one redacted or sample record."],
            ["No sales call", "The first check should explain the value itself."],
            ["No approval claims", "ClearRun organizes office review, not legal certification."],
          ].map(([title, copy]) => (
            <div key={title} className="premium-card">
              <FileCheck2 className="h-7 w-7 text-navy-800" aria-hidden="true" />
              <h3 className="mt-5 font-display text-xl font-semibold text-navy-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </Layout>
  );
}
