import React from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

// V30 copy — updated 2026-07 per V30 copy alignment PR
// Primary CTA: "Get a Free Route Closeout Check"
// Offer: Route Closeout Check (free) → Proof Snapshot (output) → Record Closeout Rescue (paid)
// Pain: missing/weak/scattered proof that prevents closing a route record
const trustItems = [
  "No card",
  "No signup",
  "Redacted samples welcome",
  "No compliance guarantee",
];

const problems = [
  {
    title: "Proof gets scattered",
    copy: "A route sheet, photo, receipt, and spreadsheet row can all describe the same job — in different places.",
  },
  {
    title: "Gaps are hard to spot",
    copy: "Missing signatures, unclear volume, or loose disposal detail are easy to overlook until someone asks.",
  },
  {
    title: "Records stall before closeout",
    copy: "When proof is missing or weak, the office can't confidently close the route record.",
  },
];

const steps = [
  {
    title: "Send one redacted record",
    copy: "Start with a ticket photo, route row, receipt, CSV, or any sample record.",
  },
  {
    title: "Get a free Route Closeout Check",
    copy: "ClearRun reviews what proof is present, flags what is missing or weak, and returns a Proof Snapshot.",
  },
  {
    title: "Decide on Record Closeout Rescue",
    copy: "If the gaps matter, the snapshot makes the paid cleanup path clear.",
  },
];

const messyInputs = [
  { title: "Field ticket photo", note: "volume unclear" },
  { title: "Route sheet row", note: "site found" },
  { title: "Disposal receipt", note: "needs match" },
  { title: "Missing signature", note: "action needed" },
];

const snapshotRows = [
  { label: "Customer/location", status: "found", tone: "complete" },
  { label: "Service date", status: "found", tone: "complete" },
  { label: "Disposal confirmation", status: "needs review", tone: "attention" },
  { label: "Signature", status: "missing", tone: "incomplete" },
];

const statusClasses = {
  complete: "bg-status-complete-bg text-status-complete",
  attention: "bg-status-attention-bg text-status-attention",
  incomplete: "bg-status-incomplete-bg text-status-incomplete",
};

function StatusPill({ tone = "attention", children }) {
  return (
    <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${statusClasses[tone]}`}>
      {children}
    </span>
  );
}

function FieldPhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[11.5rem] rounded-lg border border-slate-300 bg-navy-950 p-2 shadow-premium sm:max-w-[13rem]">
      <div className="rounded-md bg-slate-100 p-2">
        <div className="mb-2 flex items-center justify-between">
          <span className="h-1.5 w-10 rounded-full bg-slate-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-status-attention" />
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <div className="mb-3 h-16 rounded-md border border-slate-200 bg-slate-50 sm:h-20">
            <div className="flex h-full flex-col justify-end gap-1 p-2">
              <span className="h-2 w-20 rounded bg-slate-300" />
              <span className="h-2 w-28 rounded bg-slate-200" />
              <span className="h-2 w-16 rounded bg-slate-300" />
            </div>
          </div>
          <p className="text-[11px] font-semibold text-navy-950">Ticket photo</p>
          <div className="mt-2 space-y-1">
            <span className="block h-1.5 w-full rounded bg-slate-200" />
            <span className="block h-1.5 w-4/5 rounded bg-slate-200" />
            <span className="hidden h-1.5 w-2/3 rounded bg-status-attention/30 sm:block" />
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] font-semibold text-white/50">Field capture mockup</p>
    </div>
  );
}

function ProofTransformationPreview() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-navy-900/10 bg-white shadow-premium">
      <div className="border-b border-slate-200 bg-navy-950 px-5 py-4 text-white sm:px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold uppercase text-white/60">Scattered record to closeout-ready snapshot</p>
          <p className="text-xs text-white/50">Illustrative sample interface</p>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.94fr_0.12fr_1.05fr]">
        <div className="bg-offwhite p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Messy inputs</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-navy-950">Field record stack</h3>
            </div>
            <StatusPill>unorganized</StatusPill>
          </div>

          <div className="grid gap-4 sm:grid-cols-[0.78fr_1fr] sm:items-start lg:block">
            <FieldPhoneMockup />

            <div className="space-y-2 lg:mt-4">
              {messyInputs.map((item) => (
              <div key={item.title} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2.5">
                <span className="text-sm font-medium text-navy-900">{item.title}</span>
                <span className="text-xs text-slate-500">{item.note}</span>
              </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden items-center justify-center bg-white lg:flex">
          <div className="flex h-full w-full items-center justify-center border-x border-slate-200">
            <div className="relative h-72 w-px bg-slate-200">
              <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-900 shadow-card">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Clean output</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-navy-950">Proof Snapshot</h3>
            </div>
            <StatusPill tone="complete">proof organized</StatusPill>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-navy-950">Record completeness</p>
                <span className="text-xs font-semibold text-status-incomplete">2 missing fields</span>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {snapshotRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-sm text-slate-600">{row.label}</span>
                  <StatusPill tone={row.tone}>{row.status}</StatusPill>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-status-attention/25 bg-status-attention-bg p-4">
            <p className="text-sm font-semibold text-navy-950">Record Closeout Rescue recommended</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Confirm disposal detail and capture the missing signature before the route record can be closed.
            </p>
          </div>

          <div className="mt-4 hidden grid-cols-2 gap-2 sm:grid">
            <div className="rounded-md border border-slate-200 bg-offwhite p-3">
              <p className="text-[11px] font-semibold uppercase text-slate-500">Proof Snapshot</p>
              <p className="mt-1 text-sm font-semibold text-navy-950">Proof organized</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-offwhite p-3">
              <p className="text-[11px] font-semibold uppercase text-slate-500">Next step</p>
              <p className="mt-1 text-sm font-semibold text-navy-950">Closeout Rescue offer</p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Sample visual only. No real customer, logo, endorsement, certification, or inspection outcome is implied.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReportPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Proof Snapshot</p>
          <p className="mt-1 font-display text-lg font-semibold text-navy-950">What you get back</p>
        </div>
        <StatusPill tone="complete">clear next step</StatusPill>
      </div>
      <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-slate-100 p-5 md:border-b-0 md:border-r">
          <p className="text-sm font-semibold text-navy-950">Snapshot contents</p>
          <div className="mt-4 space-y-3">
            {["Proof items organized", "Missing and weak fields flagged", "Record Closeout Rescue path (if gaps matter)"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-status-complete" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm font-semibold text-navy-950">Operator decision</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            See whether the record is clean enough to close internally, or whether the missing fields justify
            a paid Record Closeout Rescue.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout>
      <section className="container-page pb-12 pt-10 sm:pb-14 sm:pt-12" id="hero">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight text-navy-950 sm:text-5xl">
            Find the missing proof before the route record becomes a problem.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">
            ClearRun is the missing-proof closeout layer for FOG and liquid-waste operators.
            Send one record. Get a free Route Closeout Check. See exactly what proof is missing, weak, or scattered.
          </p>
          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link to="/proof-snapshot" data-testid="home-hero-cta">
              <Button size="lg">
                Get a Free Route Closeout Check <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <div className="grid max-w-xl grid-cols-2 gap-2 text-xs text-slate-500 sm:flex sm:flex-wrap">
              {trustItems.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-status-complete" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <ProofTransformationPreview />
        </div>
      </section>

      <section className="container-page pb-14 sm:pb-16" id="problem">
        <div className="grid gap-8 border-y border-slate-200 py-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <span className="text-xs font-semibold uppercase text-navy-700">Why route records stall</span>
            <h2 className="mt-3 max-w-md text-3xl font-bold text-navy-950 sm:text-4xl">Service happened. The proof is still missing.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {problems.map((item) => (
              <div key={item.title} className="border-l border-slate-200 pl-4">
                <h3 className="font-display text-lg font-semibold text-navy-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16" id="how-it-works">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <span className="text-xs font-semibold uppercase text-navy-700">How the Route Closeout Check works</span>
            <h2 className="mt-3 text-3xl font-bold text-navy-950 sm:text-4xl">One record in. One clear closeout path out.</h2>
          </div>
          <div className="grid gap-0 overflow-hidden rounded-lg border border-slate-200 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="border-b border-slate-200 bg-white p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                <p className="text-xs font-semibold uppercase text-slate-400">Step {index + 1}</p>
                <h3 className="mt-3 font-display text-lg font-semibold text-navy-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase text-navy-700">What you get back</span>
            <h2 className="mt-3 text-3xl font-bold text-navy-950 sm:text-4xl">A Proof Snapshot before a paid closeout rescue.</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500">
              The Route Closeout Check is free. The Proof Snapshot shows what proof is present, missing, or weak.
              If the gaps matter, the snapshot makes the paid Record Closeout Rescue obvious.
            </p>
          </div>
          <ReportPreview />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-12" id="trust">
        <div className="container-page grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-offwhite px-3 py-1 text-xs font-semibold uppercase text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" /> Trust posture
            </span>
            <h2 className="mt-4 text-3xl font-bold text-navy-950">Organized proof, without fake guarantees.</h2>
          </div>
          <div className="rounded-lg border border-slate-200 bg-offwhite p-5">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-status-attention" />
              <p className="text-sm leading-relaxed text-slate-600">
                ClearRun helps organize service proof and record visibility. It does not certify legal compliance, verify record accuracy, or guarantee inspection, reviewer, customer, city, state, federal, or agency outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-16">
        <div className="rounded-lg border border-navy-900/10 bg-navy-950 px-6 py-10 text-center shadow-premium sm:px-10">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">Send one messy record. See the closeout path.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
            Get a free Route Closeout Check first. The Proof Snapshot shows exactly what is missing or weak.
            If the gaps matter, ClearRun can walk through the Record Closeout Rescue path.
          </p>
          <div className="mt-7">
            <Link to="/proof-snapshot" data-testid="home-final-cta">
              <Button size="lg" className="bg-white text-navy-950 hover:bg-slate-100">
                Get a Free Route Closeout Check <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
