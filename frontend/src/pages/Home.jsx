import React from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  FileCheck2,
  Mail,
  SearchX,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const problems = [
  {
    title: "Records are scattered",
    copy: "Tickets, photos, route sheets, receipts, and spreadsheets rarely live in one clean place.",
  },
  {
    title: "Proof is hard to find",
    copy: "When a customer asks what happened, someone has to dig through folders and message threads.",
  },
  {
    title: "Missing fields slow the next step",
    copy: "A missing date, signature, disposal note, or job detail can delay billing, cleanup, or review.",
  },
];

const steps = [
  {
    icon: Mail,
    title: "Send one redacted record",
    copy: "Use a ticket photo, route sheet, disposal receipt, CSV row, or sample record from a recent job.",
  },
  {
    icon: FileCheck2,
    title: "Get a clean Proof Snapshot",
    copy: "ClearRun organizes the record into a professional proof packet outline and missing-field summary.",
  },
  {
    icon: Wrench,
    title: "Decide if cleanup is worth it",
    copy: "If the gaps matter, ClearRun can recommend a Route Cleanup offer for the next paid step.",
  },
];

const deliverables = [
  {
    title: "Proof Snapshot",
    copy: "A clean view of the service proof you already have.",
  },
  {
    title: "Missing Fields List",
    copy: "A plain-language list of what is complete, unclear, or missing.",
  },
  {
    title: "Route Cleanup Recommendation",
    copy: "A practical next step when the record is worth cleaning up.",
  },
];

function TransformationVisual() {
  const messyItems = [
    ["Ticket photo", "blurred"],
    ["Route sheet", "partial"],
    ["Disposal receipt", "loose"],
    ["CSV row", "missing signature"],
  ];

  const cleanItems = [
    ["Service date", "found"],
    ["Customer/site", "found"],
    ["Volume", "needs review"],
    ["Signature", "missing"],
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-premium sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-slate-500" />
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Messy field record</p>
          </div>
          <div className="space-y-2.5">
            {messyItems.map(([label, status]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                <span className="text-slate-700">{label}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">{status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden h-px w-10 bg-slate-200 lg:block" />
        <div className="flex justify-center lg:hidden">
          <ArrowRight className="h-5 w-5 rotate-90 text-slate-300" />
        </div>

        <div className="overflow-hidden rounded-xl border border-navy-900/10 bg-white">
          <div className="border-b border-slate-100 bg-navy-950 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Proof Snapshot</p>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold text-white">review ready</span>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-4 rounded-lg border border-slate-200 bg-offwhite p-3">
              <p className="text-sm font-semibold text-navy-950">Route Cleanup recommendation</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Clean up the missing signature and confirm disposal details before sharing externally.
              </p>
            </div>
            <div className="space-y-2">
              {cleanItems.map(([label, status]) => (
                <div key={label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
                  <span className="text-sm text-slate-600">{label}</span>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                    status === "found"
                      ? "bg-status-complete-bg text-status-complete"
                      : status === "missing"
                        ? "bg-status-incomplete-bg text-status-incomplete"
                        : "bg-status-attention-bg text-status-attention"
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">Illustrative sample only. No customer logo, endorsement, or certification implied.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout>
      <section className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
        <div className="stagger flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-navy-900/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-800">
            Field-service proof records
          </span>
          <h1 className="mobile-safe-text max-w-3xl text-4xl font-bold leading-[1.03] tracking-tight text-navy-950 sm:text-5xl lg:text-6xl">
            Field proof. Clear records.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            ClearRun turns messy service records into clean Proof Snapshots, missing-field summaries, and practical cleanup recommendations.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/proof-snapshot" data-testid="hero-primary-cta">
              <Button size="lg" className="w-full sm:w-auto">
                Get Free Proof Snapshot <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/proof/PP-10231" data-testid="hero-secondary-cta">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">See Proof Example</Button>
            </Link>
          </div>
          <p className="max-w-lg text-xs leading-relaxed text-slate-500">
            No card. No signup. Start with one redacted or sample record before you commit to a cleanup workflow.
          </p>
        </div>
        <TransformationVisual />
      </section>

      <section className="container-page pb-16" id="problem">
        <div className="mb-8 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wide text-navy-700">The problem</span>
          <h2 className="mt-3 text-3xl font-bold text-navy-950 sm:text-4xl">Service happened. The proof is messy.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {problems.map((item) => (
            <div key={item.title} className="surface-card p-6">
              <SearchX className="h-5 w-5 text-navy-800" />
              <h3 className="mt-4 font-display text-lg font-semibold text-navy-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16" id="how-it-works">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wide text-navy-700">How it works</span>
            <h2 className="mt-3 text-3xl font-bold text-navy-950 sm:text-4xl">One record in. One clear next step out.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
                  <step.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Step {index + 1}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-navy-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-navy-700">What you get</span>
            <h2 className="mt-3 text-3xl font-bold text-navy-950 sm:text-4xl">A useful review before a paid cleanup.</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              The public offer is intentionally simple: prove the artifact is useful, then offer Route Cleanup only when the gaps are clear.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {deliverables.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <FileCheck2 className="h-5 w-5 text-navy-800" />
                <h3 className="mt-4 font-display font-semibold text-navy-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-14" id="trust">
        <div className="container-page grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-offwhite px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" /> Trust posture
            </span>
            <h2 className="mt-4 text-3xl font-bold text-navy-950">Organized proof, without fake guarantees.</h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-offwhite p-5">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-status-attention" />
              <p className="text-sm leading-relaxed text-slate-600">
                ClearRun helps organize service proof and record visibility. It does not certify legal compliance, verify record accuracy, or guarantee inspection, reviewer, customer, city, state, federal, or agency outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="rounded-2xl border border-navy-900/10 bg-navy-950 px-6 py-10 text-center shadow-premium sm:px-10">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">Send one messy record. See the cleanup path.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
            Get a free Proof Snapshot first. If the missing fields matter, ClearRun can recommend the next Route Cleanup step.
          </p>
          <div className="mt-7">
            <Link to="/proof-snapshot" data-testid="home-final-cta">
              <Button size="lg" className="bg-white text-navy-950 hover:bg-slate-100">
                Get Free Proof Snapshot <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
