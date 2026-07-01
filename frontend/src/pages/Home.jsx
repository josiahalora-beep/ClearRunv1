import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, FileCheck2, SearchX, FolderInput, FolderOutput, Stamp, History,
  Users, Camera, ShieldCheck, LineChart, Waves,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { CTASection } from "@/components/shared/CTASection";
import { RoadmapCard } from "@/components/shared/RoadmapCard";
import { proofPackets, compatibilityList } from "@/data/mockData";

const features = [
  { icon: FileCheck2, title: "Proof Packets", desc: "Branded, report-grade proof of every service — ready to share.", to: "/proof" },
  { icon: SearchX, title: "Missing-Record Recovery", desc: "Automatically flag and request gaps before anyone else finds them.", to: "/recovery" },
  { icon: FolderInput, title: "Import", desc: "Bring in spreadsheets, PDFs, and paper tickets you already have.", to: "/import" },
  { icon: FolderOutput, title: "Export", desc: "Billing-ready exports mapped for accounting and city requests.", to: "/export" },
  { icon: Stamp, title: "Disposal Certificates", desc: "Track disposal confirmations tied to every service record.", to: "/disposal" },
  { icon: History, title: "Audit Log", desc: "See who touched a record, and when, at every step.", to: "/audit" },
];

const steps = [
  { icon: Camera, title: "Field capture", desc: "Techs log service details and photos on-site, even offline." },
  { icon: FileCheck2, title: "Auto-organized proof packet", desc: "ClearRun assembles a branded, report-grade packet automatically." },
  { icon: Users, title: "Customer-ready proof link", desc: "Share a clean, branded link — no more digging through folders." },
  { icon: FolderOutput, title: "Billing-ready export", desc: "Export for accounting, haulers, or a municipal records request." },
];

export default function Home() {
  const packet = proofPackets[0];
  return (
    <Layout>
      <section className="container-page pt-16 sm:pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 stagger">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-navy-900/5 border border-navy-900/10 px-3 py-1 text-xs font-semibold tracking-wide text-navy-800 uppercase">
            Field-Proof Records Platform
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-navy-950">
            Field proof. <br className="hidden sm:block" /> Clear records.
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-lg leading-relaxed">
            ClearRun Records turns messy field service records into branded proof packets, missing-record reports,
            billing-ready exports, and customer-ready proof links.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/try-free" data-testid="hero-primary-cta">
              <Button size="lg" className="w-full sm:w-auto">Start Free Records Trial <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/proof-mockup" data-testid="hero-secondary-cta">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">Get a Free Proof Packet Mockup</Button>
            </Link>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            No credit card required. Built for grease-trap / FOG and liquid-waste service records today — expanding beyond.
          </p>
        </div>

        <div className="relative animate-fade-in-up">
          <div className="absolute -inset-4 bg-gradient-to-tr from-navy-900/5 to-transparent rounded-3xl -z-10" />
          <div data-testid="hero-proof-preview" className="rounded-2xl border border-slate-200 bg-white shadow-premium p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-navy-900" />
                <span className="font-display font-semibold text-sm text-navy-950">Proof Packet {packet.id}</span>
              </div>
              <StatusBadge status={packet.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-400 text-xs">Customer</p><p className="font-medium text-navy-900">{packet.customer}</p></div>
              <div><p className="text-slate-400 text-xs">Service Date</p><p className="font-medium text-navy-900">{packet.serviceDate}</p></div>
              <div><p className="text-slate-400 text-xs">Service Type</p><p className="font-medium text-navy-900">{packet.serviceType}</p></div>
              <div><p className="text-slate-400 text-xs">Volume</p><p className="font-medium text-navy-900">{packet.gallons} gal</p></div>
              <div><p className="text-slate-400 text-xs">Hauler</p><p className="font-medium text-navy-900">{packet.hauler}</p></div>
              <div><p className="text-slate-400 text-xs">Disposal Site</p><p className="font-medium text-navy-900">{packet.disposalSite}</p></div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{packet.photos} photos attached</span>
              <Link to="/proof/PP-10231" className="text-navy-800 font-medium hover:underline" data-testid="hero-view-proof-link">View full proof packet →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-slate-500">
          <span className="flex items-center gap-2"><Waves className="h-4 w-4 text-navy-800" /> Grease Trap / FOG</span>
          <span className="flex items-center gap-2"><Waves className="h-4 w-4 text-navy-800" /> Liquid Waste</span>
          <span className="flex items-center gap-2 text-slate-400"><Waves className="h-4 w-4" /> Septic (planned)</span>
          <span className="flex items-center gap-2 text-slate-400"><Waves className="h-4 w-4" /> Portable Sanitation (planned)</span>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-wide text-status-incomplete">The problem</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-950 mt-3">Records go missing. Inspections get harder.</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: "Scattered across tools", desc: "Service history lives in spreadsheets, PDFs, paper tickets, and hauler systems that don't talk to each other." },
            { title: "No proof when it counts", desc: "When a restaurant or inspector asks for proof of service, someone spends hours digging for it." },
            { title: "Gaps go unnoticed", desc: "Missing records aren't caught until an inspection or billing dispute forces the issue." },
          ].map((p) => (
            <div key={p.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="font-display font-semibold text-navy-950 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 py-20">
        <div className="container-page">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wide text-navy-700">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-950 mt-3">From field ticket to proof-ready record</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="relative flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white shrink-0">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-semibold text-slate-300">Step {i + 1}</span>
                </div>
                <h3 className="font-display font-semibold text-navy-950">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wide text-navy-700">Everything in one place</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-950 mt-3">Built around proof, not paperwork</h2>
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
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
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
          <p className="text-xs text-slate-400 mt-5">
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
