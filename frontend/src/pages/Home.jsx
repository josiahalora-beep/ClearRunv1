import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileCheck2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/shared/CTASection";

const HeroProofPreview = lazy(() => import("@/components/home/HeroProofPreview"));

const proofPoints = [
  "Ticket backup gaps found and labeled",
  "Why the route packet is not billing-ready yet",
  "Exact follow-up for dispatch or billing to send",
];

const programs = [
  {
    number: "01",
    title: "Free Route Ticket Review",
    body: "Send one messy pump-out ticket and see the backup gaps ClearRun catches before billing or a customer request.",
    glow: "bg-sageglass-300",
    to: "/closeout-check",
  },
  {
    number: "02",
    title: "Proof Packet Demo",
    body: "See ready, needs-review, and missing-backup route packet examples.",
    glow: "bg-grape-300",
    to: "/proof",
  },
  {
    number: "03",
    title: "Route Packet Cleanup",
    body: "If the first ticket exposes real pain, organize a batch of weak tickets next.",
    glow: "bg-skyglass-300",
    to: "/pricing",
  },
];

const deliverables = [
  ["Backup gap list", "What is missing, weak, or already attached to the route packet."],
  ["Billing-ready signal", "Whether the ticket is ready, needs review, or should be held."],
  ["Dispatch follow-up", "The next message or task dispatch, billing, or the route manager can use."],
  ["Customer backup view", "Whether the ticket can support an invoice question or customer proof request."],
];

const workflowSteps = ["Job done", "Ticket returns", "Exception caught", "Follow-up sent", "Billing supported"];

const exceptionRows = [
  ["Missing signed ticket", "Driver or route desk follow-up"],
  ["No stop photo", "Proof request before billing"],
  ["Gallons do not match disposal ticket", "Hold for review"],
  ["Customer asks for backup", "Packet already organized"],
];

const stackItems = ["Routing", "Dispatch", "Driver app", "Billing", "Customer service"];

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

function OperatorWorkflowSection() {
  return (
    <section className="container-editorial pb-10 pt-2 sm:pb-16">
      <div className="overflow-hidden rounded-premium border border-slate-200 bg-white shadow-editorial">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
          <div className="bg-ink p-6 text-white sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Pre-billing exception check</p>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[0.95] text-white sm:text-5xl">
              Protect the money after the pump-out is done.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/70">
              Operators already have routing, dispatch, driver apps, and billing. ClearRun catches the messy ticket backup problems that show up after service but before invoices, account questions, or customer proof requests.
            </p>

            <div className="mt-8 grid gap-3">
              {["Fewer weak tickets reaching billing", "Less dispatch rework chasing backup", "Cleaner packet when a customer asks for proof"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                  <span className="text-sm font-semibold text-white/82">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {stackItems.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/75">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6 lg:p-8">
            <div className="rounded-[1.5rem] border border-slate-200 bg-offwhite p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Where the buying pain happens</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-5">
                {workflowSteps.map((step, index) => (
                  <div key={step} className={`rounded-2xl border p-3 ${index === 2 ? "border-grape-300 bg-white shadow-card" : "border-slate-200 bg-white/70"}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Step {index + 1}</p>
                    <p className="mt-2 text-sm font-semibold leading-5 text-navy-950">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-card">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Exception queue</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-navy-950">What gets caught before billing</h3>
                </div>
                <span className="rounded-full border border-status-attention/30 bg-status-attention-bg px-3 py-1 text-xs font-semibold text-status-attention">
                  Hold for backup
                </span>
              </div>

              <div className="mt-5 grid gap-2">
                {exceptionRows.map(([problem, action]) => (
                  <div key={problem} className="grid gap-2 rounded-2xl border border-slate-200 bg-offwhite p-3 sm:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Problem</p>
                      <p className="mt-1 text-sm font-semibold text-navy-950">{problem}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">ClearRun output</p>
                      <p className="mt-1 text-sm font-semibold text-navy-950">{action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                ["Billing", "Knows which tickets should wait before invoicing."],
                ["Dispatch", "Gets the exact driver/vendor follow-up to chase."],
                ["Customer service", "Has cleaner backup when an account asks for proof."],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-card">
                  <p className="text-sm font-semibold text-navy-950">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout>
      <section className="container-editorial section-y grid items-center gap-12 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.04fr)]">
        <div className="stagger">
          <span className="premium-pill">Free route ticket review</span>
          <h1 className="mobile-safe-text mt-7 max-w-3xl font-display text-5xl font-bold leading-[0.92] text-ink sm:text-6xl lg:text-7xl">
            One messy ticket.
            <span className="block text-slate-400">A full backup review.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
            ClearRun checks the pump-out ticket, signed service slip, photos, gallons, and disposal backup so your billing desk knows what is missing before the invoice or customer proof request comes back.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/closeout-check" data-testid="hero-primary-cta">
              <Button size="lg" className="w-full bg-black text-white hover:bg-navy-900 sm:w-auto">
                Review My Route Ticket <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/proof" data-testid="hero-secondary-cta">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">View Proof Packets</Button>
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

      <OperatorWorkflowSection />

      <section className="container-editorial pb-8 pt-4 sm:pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="premium-kicker">What the free review proves</p>
          <h2 className="premium-section-title mt-4">A sample ticket should feel like a real route packet review</h2>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {programs.map((item) => <ProgramCard key={item.title} item={item} />)}
        </div>
      </section>

      <section className="container-editorial section-y">
        <div className="grid gap-8 rounded-premium border border-slate-200 bg-white p-5 shadow-editorial md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:p-8 lg:p-10">
          <div className="rounded-[1.75rem] bg-ink p-6 text-white md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Route packet output</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-none text-white sm:text-5xl">
              Not just a clean or dirty ticket.
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/70">
              One ticket is enough to show whether ClearRun can find backup gaps your dispatch or billing team would otherwise chase later.
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
            ["Disproportionate value", "The first ticket should expose the full workflow: missing backup, billing risk, dispatch follow-up, and proof readiness."],
            ["No sales pressure", "The route ticket review should make the next step obvious without a pitch."],
            ["No approval claims", "ClearRun organizes service records and backup review, not legal certification or inspection approval."],
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
