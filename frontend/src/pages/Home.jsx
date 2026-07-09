import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileCheck2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/shared/CTASection";

const HeroProofPreview = lazy(() => import("@/components/home/HeroProofPreview"));

const proofPoints = [
  "Proof gaps found and labeled",
  "Why the record should not be closed yet",
  "Exact next message for the office to send",
];

const programs = [
  {
    number: "01",
    title: "Free Closeout Diagnostic",
    body: "Send one messy record and see the kind of gaps ClearRun catches before closeout.",
    glow: "bg-sageglass-300",
    to: "/closeout-check",
  },
  {
    number: "02",
    title: "Proof Dashboard Preview",
    body: "Open the dashboard view for ready, review, and missing-proof examples.",
    glow: "bg-grape-300",
    to: "/proof",
  },
  {
    number: "03",
    title: "Batch Closeout Rescue",
    body: "If the first check exposes real pain, organize a group of weak records next.",
    glow: "bg-skyglass-300",
    to: "/pricing",
  },
];

const deliverables = [
  ["Gap list", "What is missing, weak, or already present."],
  ["Closeout decision", "Whether the record is ready, needs review, or should be held."],
  ["Office action", "The next message or task your team can use immediately."],
  ["Invoice support view", "Whether the record is strong enough to support a billing or customer question."],
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

function DeliverableRow({ title, copy }) {
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
      <section className="container-editorial section-y grid items-center gap-12 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.04fr)]">
        <div className="stagger">
          <span className="premium-pill">Free closeout diagnostic</span>
          <h1 className="mobile-safe-text mt-7 max-w-3xl font-display text-5xl font-bold leading-[0.92] text-ink sm:text-6xl lg:text-7xl">
            One messy record.
            <span className="block text-slate-400">A full proof diagnosis.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
            The free check should prove the value fast: ClearRun shows what is missing, why it matters, and what your office should do before closing the record.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/closeout-check" data-testid="hero-primary-cta">
              <Button size="lg" className="w-full bg-black text-white hover:bg-navy-900 sm:w-auto">
                Get My Free Diagnosis <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/proof" data-testid="hero-secondary-cta">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">View Dashboard</Button>
            </Link>
          </div>
          <div className="mt-14 max-w-xl divide-y divide-slate-200">
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
          <p className="premium-kicker">What the free check proves</p>
          <h2 className="premium-section-title mt-4">A sample record should feel like a real diagnosis</h2>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {programs.map((item) => <ProgramCard key={item.title} item={item} />)}
        </div>
      </section>

      <section className="container-editorial section-y">
        <div className="grid gap-8 rounded-premium border border-slate-200 bg-white p-5 shadow-editorial md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:p-8 lg:p-10">
          <div className="rounded-[1.75rem] bg-ink p-6 text-white md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Diagnostic output</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-none text-white sm:text-5xl">
              Not just a yes/no check.
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/65">
              One record is enough to show whether ClearRun can find gaps your office would otherwise chase later.
            </p>
          </div>
          <div className="px-1 md:px-2">
            {deliverables.map(([title, copy]) => <DeliverableRow key={title} title={title} copy={copy} />)}
          </div>
        </div>
      </section>

      <section className="container-editorial pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Disproportionate value", "The first record should expose the full workflow: gaps, risk, action, and proof readiness."],
            ["No sales pressure", "The diagnostic should make the next step obvious without a pitch."],
            ["No approval claims", "ClearRun organizes office review, not legal certification or inspection approval."],
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
