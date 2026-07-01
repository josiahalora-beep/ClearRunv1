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
  return (
    <Layout>
      <section className="container-page py-12 sm:py-16">
        <PageHeader
          eyebrow="Owner Dashboard"
          title="Records command center"
          description="A live view of proof packet status, missing records, and requests across every location — demo data shown."
          actions={
            <Link to="/proof" data-testid="dashboard-view-all-proof-btn">
              <Button>View All Proof Packets <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          }
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {dashboardStats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-display font-semibold text-navy-950">Recent proof packets</h2>
              <Link to="/proof" data-testid="dashboard-proof-table-link" className="text-xs font-semibold text-navy-800 hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table data-testid="dashboard-proof-table" className="w-full text-sm">
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
            <div className="rounded-xl border border-slate-200 bg-white shadow-card p-6">
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

            <div className="rounded-xl border border-slate-200 bg-white shadow-card p-6">
              <h2 className="font-display font-semibold text-navy-950 mb-4">Open requests</h2>
              <div className="flex flex-col gap-3">
                {requests.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-sm">
                    <span className="text-navy-900 font-medium">{r.business}</span>
                    <StatusBadge status={r.status} dot={false} />
                  </div>
                ))}
              </div>
              <Link to="/requests" data-testid="dashboard-requests-link" className="text-xs font-semibold text-navy-800 hover:underline mt-4 inline-block">View all requests →</Link>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {quickLinks.map((q) => (
            <Link key={q.to} to={q.to} data-testid={`dashboard-quicklink-${q.to.replace("/", "")}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card hover:shadow-card-hover transition-shadow">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900"><q.icon className="h-4 w-4" /></span>
              <span className="text-sm font-medium text-navy-900">{q.label}</span>
            </Link>
          ))}
        </div>
      </section>
      <CTASection
        title="This is demo data — see it work with your own records"
        description="Start a free records trial to connect your own service tickets, or request a free proof packet mockup first."
      />
    </Layout>
  );
}
