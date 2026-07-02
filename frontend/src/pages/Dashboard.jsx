import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileCheck2, SearchX, History, Stamp } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/shared/CTASection";
import { dashboardStats, proofPackets, requests } from "@/data/mockData";

const quickLinks = [
  { to: "/proof", label: "Proof Packets", icon: FileCheck2 },
  { to: "/recovery", label: "Missing-Record Recovery", icon: SearchX },
  { to: "/disposal", label: "Disposal Certificates", icon: Stamp },
  { to: "/audit", label: "Audit Log", icon: History },
];

export default function Dashboard() {
  const needsAttention = proofPackets.filter((p) => p.status === "attention" || p.status === "incomplete");
  const openRequests = requests.filter((r) => r.status !== "complete");
  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <PageHeader
          eyebrow="Owner Dashboard"
          title="Records command center"
          description="A live view of proof packet status, missing records, and requests across every location - demo data shown."
          actions={
            <Link to="/proof" data-testid="dashboard-view-all-proof-btn">
              <Button>View All Proof Packets <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          }
        />

        <div className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="surface-card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Operator focus</p>
            <p className="mt-1 font-display text-lg font-semibold text-navy-950">Close record gaps first</p>
          </div>
          <Link to="/recovery" className="surface-card surface-card-hover p-4" data-testid="dashboard-focus-recovery-link">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Needs attention</p>
            <p className="mt-1 font-display text-lg font-semibold text-navy-950">{needsAttention.length} proof packets</p>
          </Link>
          <Link to="/requests" className="surface-card surface-card-hover p-4" data-testid="dashboard-focus-requests-link">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Open requests</p>
            <p className="mt-1 font-display text-lg font-semibold text-navy-950">{openRequests.length} active follow-ups</p>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="console-card lg:col-span-2">
            <div className="console-card-header">
              <h2 className="font-display font-semibold text-navy-950">Recent proof packets</h2>
              <Link to="/proof" data-testid="dashboard-proof-table-link" className="text-xs font-semibold text-navy-800 hover:underline">View all</Link>
            </div>
            <div className="table-scroll">
              <table data-testid="dashboard-proof-table" className="table-basic">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Service Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {proofPackets.map((p) => (
                    <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70">
                      <td className="px-6 py-3.5">
                        <Link to={`/proof/${p.id}`} data-testid={`dashboard-row-${p.id}`} className="font-medium text-navy-900 hover:underline">{p.customer}</Link>
                        <p className="text-xs text-slate-400">{p.id}</p>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">{p.serviceDate}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="surface-card p-5">
              <h2 className="font-display font-semibold text-navy-950 mb-4">Needs attention</h2>
              <div className="flex flex-col gap-3">
                {needsAttention.map((p) => (
                  <Link key={p.id} to={`/proof/${p.id}`} data-testid={`dashboard-attention-${p.id}`} className="flex items-center justify-between rounded-lg border border-slate-100 px-3.5 py-2.5 hover:bg-slate-50">
                    <div>
                      <p className="text-sm font-medium text-navy-900">{p.customer}</p>
                      <p className="text-xs text-slate-400">{p.id}</p>
                    </div>
                    <StatusBadge status={p.status} dot={false} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="surface-card p-5">
              <h2 className="font-display font-semibold text-navy-950 mb-4">Open requests</h2>
              <div className="flex flex-col gap-3">
                {requests.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-sm">
                    <span className="text-navy-900 font-medium">{r.business}</span>
                    <StatusBadge status={r.status} dot={false} />
                  </div>
                ))}
              </div>
              <Link to="/requests" data-testid="dashboard-requests-link" className="mt-4 inline-block text-xs font-semibold text-navy-800 hover:underline">View all requests</Link>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((q) => (
            <Link key={q.to} to={q.to} data-testid={`dashboard-quicklink-${q.to.replace("/", "")}`} className="surface-card surface-card-hover flex items-center gap-3 p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900"><q.icon className="h-4 w-4" /></span>
              <span className="text-sm font-medium text-navy-900">{q.label}</span>
            </Link>
          ))}
        </div>
      </section>
      <CTASection
        title="This is demo data - see it work with your own records"
        description="Start a free records trial to connect your own service tickets, or request a free proof packet mockup first."
      />
    </Layout>
  );
}
