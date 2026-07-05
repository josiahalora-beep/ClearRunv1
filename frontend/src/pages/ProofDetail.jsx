import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Copy, Check, Camera, MapPin, Truck, Droplets, ArrowLeft, FolderOutput } from "lucide-react";
import { Layout } from "@/components/Layout";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { CTASection } from "@/components/shared/CTASection";
import { proofPackets, auditLog } from "@/data/mockData";

export default function ProofDetail() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const packet = proofPackets.find((p) => p.id === id) || proofPackets[0];
  const relatedAudit = auditLog.filter((a) => a.target === packet.id);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch (err) {
      // Fallback for environments without clipboard permission
      try {
        const textarea = document.createElement("textarea");
        textarea.value = window.location.href;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch (fallbackErr) {
        console.warn("Copy to clipboard failed:", fallbackErr);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!packet) {
    return (
      <Layout>
        <section className="container-page py-20">
          <EmptyState title="Proof packet not found" description="This proof packet ID doesn't exist in this demo dataset." />
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-page py-10 sm:py-14">
        <Link to="/proof" data-testid="proof-detail-back-link" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Proof Packets
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-white"><ShieldCheck className="h-5 w-5" /></span>
            <div>
              <h1 className="font-display font-bold text-2xl text-navy-950">Proof Packet {packet.id}</h1>
              <p className="text-sm text-slate-500">{packet.customer}</p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
            <StatusBadge status={packet.status} />
            <Button variant="secondary" size="sm" data-testid="proof-detail-copy-link-btn" onClick={handleCopy} className="w-full sm:w-auto">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Link Copied" : "Copy Proof Link"}
            </Button>
            <Link to="/export" data-testid="proof-detail-export-link" className="w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto"><FolderOutput className="h-3.5 w-3.5" /> Export</Button>
            </Link>
          </div>
        </div>

        {/* Report-grade document card */}
        <div data-testid="proof-report-card" className="max-w-4xl overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-premium">
          <div className="flex flex-col gap-3 bg-navy-950 px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-200">ClearRun Records: Proof of Service</p>
              <h2 className="font-display font-bold text-xl mt-1">{packet.serviceType}</h2>
            </div>
            <span className="text-left text-xs text-slate-200 sm:text-right">Packet ID<br /><span className="font-mono text-white">{packet.id}</span></span>
          </div>

          <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2 sm:p-7">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-navy-800 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Customer & Location</p>
                <p className="font-medium text-navy-900">{packet.customer}</p>
                <p className="text-sm text-slate-500">{packet.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="h-4 w-4 text-navy-800 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Hauler & Technician</p>
                <p className="font-medium text-navy-900">{packet.hauler}</p>
                <p className="text-sm text-slate-500">Tech: {packet.technician}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Droplets className="h-4 w-4 text-navy-800 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Volume Serviced</p>
                <p className="font-medium text-navy-900">{packet.gallons} gallons</p>
                <p className="text-sm text-slate-500">Service date: {packet.serviceDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-navy-800 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Disposal Confirmation</p>
                <p className="font-medium text-navy-900">{packet.disposalSite}</p>
                <Link to="/disposal" data-testid="proof-detail-disposal-link" className="text-xs text-navy-800 font-semibold hover:underline">View disposal certificate</Link>
              </div>
            </div>
          </div>

          <div className="px-7 pb-7">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Photo Evidence ({packet.photos})</p>
            {packet.photos > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {Array.from({ length: packet.photos }).map((_, i) => (
                  <div key={i} data-testid={`proof-photo-thumb-${i}`} className="aspect-square rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-500">
                    <Camera className="h-5 w-5" />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Camera} title="No photo evidence attached" description="This ticket was flagged as incomplete. Request photos from the field technician." className="py-8" />
            )}
          </div>

          <div className="px-7 py-5 border-t border-slate-100 bg-slate-100/60">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Record History</p>
            <div className="flex flex-col gap-1.5">
              {relatedAudit.length > 0 ? relatedAudit.map((a) => (
                <p key={a.id} className="text-xs text-slate-500"><span className="text-slate-400">{a.timestamp}</span> - {a.actor}: {a.action}</p>
              )) : <p className="text-xs text-slate-400">No history recorded for this packet yet.</p>}
            </div>
          </div>
        </div>

        <DisclaimerBanner className="max-w-4xl mt-6" />
      </section>
      <CTASection
        title="See this with your own service records"
        description="This is a demo proof packet. Start a free records trial or request a free mockup built from your own tickets."
      />
    </Layout>
  );
}