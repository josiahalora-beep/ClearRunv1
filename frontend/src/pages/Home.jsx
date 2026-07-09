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

const handoffRows = [
  ["Pump-out ticket", "Backup gap list"],
  ["Signed service slip", "Billing-ready signal"],
  ["Stop photo / site photo", "Missing-photo flag"],
  ["Gallons / volume note", "Volume mismatch note"],
  ["Disposal ticket", "Disposal-match warning"],
  ["Customer proof request", "Ready-to-send backup packet view"],
];

const workflowSteps = [
  ["Route completed", "Driver finishes the stop and the ticket, photo, gallons, and disposal backup start moving back to dispatch."],
  ["Backup reviewed", "ClearRun checks whether the route packet has the signed ticket, photo, gallons, and matching disposal ticket."],
  ["Follow-up sent", "Dispatch or billing gets one clean request instead of chasing missing pieces across calls and texts."],
  ["Billing supported", "The team knows whether the ticket can support the invoice or customer backup request."],
];

const mustHaveTriggers = [
  ["Before the invoice goes out", "Catch missing signatures, photos, gallons, and disposal backup before billing has to defend the ticket."],
  ["Before the customer asks", "Know whether the packet can answer a proof request without rebuilding the record under pressure."],
  ["Before driver memory fades", "Send one clear follow-up while the stop, route, and disposal run are still fresh."],
];

const ticketProblems = [
  ["Driver says it was done", "but the signed ticket or stop photo is not attached."],
  ["Disposal slip exists", "but it does not clearly match the ticket, gallons, or service date."],
  ["Customer asks for proof", "and billing has to rebuild the route packet after the fact."],
];

const programs = [
  {
    number: "01",
    title: "Review one ticket",
    body: "Send one messy pump-out ticket and see the backup gaps ClearRun catches before billing or a customer request.",
    glow: "bg-sageglass-300",
    to: "/closeout-check",
  },
  {
    number: "02",
    title: "See proof packets",
    body: "Open ready, needs-review, and missing-backup packet examples in the dashboard.",
    glow: "bg-grape-300",
    to: "/proof",
  },
  {
    number: "03",
    title: "Clean a batch",
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

function HandoffRow({ input, output }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b border-white/10 py-3 last:border-b-0">
      <p className="text-sm font-semibold text-white">{input}</p>
      <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white/70">to</span>
      <p className="text-sm font-semibold text-sageglass-300">{output}</p>
    </div>
  );
}

function WorkflowStep({ index, title, copy }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-card">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-white">{index}</span>
      <h3 className="mt-5 font-display text-xl font-semibold text-navy-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
    </div>
  );
}

function TriggerCard({ title, copy }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
      <p className="font-display text-2xl font-semibold leading-tight text-white">{title}</p>
      <p className="mt-3 text-sm leading-6 text-white/68">{copy}</p>
    </div>
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

      <section className="container-editorial pb-12 pt-4">
        <div className="grid gap-4 rounded-premium bg-ink p-5 text-white shadow-editorial lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:p-8">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Fits beside your current tools</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-none text-white sm:text-5xl">
              The layer between route completion and billing backup.
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/65">
              Keep your dispatch, routing, invoicing, and accounting system. ClearRun focuses on the paper trail those tools still depend on: tickets, photos, gallons, signatures, and disposal backup.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-black/30 p-5">
            <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
              <span>You send</span>
              <span />
              <span>ClearRun returns</span>
            </div>
            {handoffRows.map(([input, output]) => <HandoffRow key={input} input={input} output={output} />)}
          </div>
        </div>
      </section>

      <section className="container-editorial section-y">
        <div className="mx-auto max-w-3xl text-center">
          <p className="premium-kicker">The real workflow</p>
          <h2 className="premium-section-title mt-4">After the route. Before billing. Before the customer asks.</h2>
          <p className="premium-section-copy">
            ClearRun sits where operators already lose time: the handoff from completed service work to usable billing and customer backup.
          </p>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {workflowSteps.map(([title, copy], index) => <WorkflowStep key={title} index={index + 1} title={title} copy={copy} />)}
        </div>
      </section>

      <section className="container-editorial pb-12">
        <div className="rounded-premium bg-ink p-5 shadow-editorial lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Why operators keep it</p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-none text-white sm:text-5xl">
                It protects the moment when paperwork becomes money.
              </h2>
              <p className="mt-5 text-sm leading-6 text-white/65">
                The must-have angle is not another dashboard. It is fewer billing holds, fewer customer proof chases, and fewer late driver follow-ups.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
              {mustHaveTriggers.map(([title, copy]) => <TriggerCard key={title} title={title} copy={copy} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="container-editorial pb-12">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)]">
          <div className="premium-card-dark">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Common route packet problems</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-none text-white">
              The problems operators already recognize.
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/65">
              Missing backup usually shows up late: when billing needs support, when a customer questions the invoice, or when dispatch has to chase the route after the truck has moved on.
            </p>
          </div>
          <div className="grid gap-3">
            {ticketProblems.map(([title, copy]) => (
              <div key={title} className="premium-card flex items-start gap-4">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-status-attention-bg text-xs font-bold text-status-attention">!</span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-navy-950">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-editorial pb-8 pt-4 sm:pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="premium-kicker">Start small, prove value</p>
          <h2 className="premium-section-title mt-4">One sample ticket should show the paid workflow in miniature</h2>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {programs.map((item) => <ProgramCard key={item.title} item={item} />)}
        </div>
      </section>

      <section className="container-editorial section-y">
        <div className="grid gap-8 rounded-premium border border-slate-200 bg-white p-5 shadow-editorial md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:p-8 lg:p-10">
          <div className="rounded-[1.75rem] bg-ink p-6 text-white md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Route packet output</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-none text-white sm:text-5xl">
              Not just a clean or dirty ticket.
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/65">
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
