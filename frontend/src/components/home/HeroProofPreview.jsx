import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { proofPackets } from "@/data/mockData";

export default function HeroProofPreview() {
  const packet = proofPackets[0];

  return (
    <div className="relative animate-fade-in-up">
      <div className="absolute -inset-4 bg-gradient-to-tr from-navy-900/5 to-transparent rounded-3xl -z-10" />
      <div data-testid="hero-proof-preview" className="rounded-2xl border border-slate-200 bg-white shadow-premium p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-navy-900" aria-hidden="true" />
            <span className="font-display font-semibold text-sm text-navy-950">Proof Packet {packet.id}</span>
          </div>
          <StatusBadge status={packet.status} />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-slate-500 text-xs">Customer</p><p className="font-medium text-navy-900">{packet.customer}</p></div>
          <div><p className="text-slate-500 text-xs">Service Date</p><p className="font-medium text-navy-900">{packet.serviceDate}</p></div>
          <div><p className="text-slate-500 text-xs">Service Type</p><p className="font-medium text-navy-900">{packet.serviceType}</p></div>
          <div><p className="text-slate-500 text-xs">Volume</p><p className="font-medium text-navy-900">{packet.gallons} gal</p></div>
          <div><p className="text-slate-500 text-xs">Hauler</p><p className="font-medium text-navy-900">{packet.hauler}</p></div>
          <div><p className="text-slate-500 text-xs">Disposal Site</p><p className="font-medium text-navy-900">{packet.disposalSite}</p></div>
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>{packet.photos} photos attached</span>
          <Link to="/proof/PP-10231" className="text-navy-800 font-medium hover:underline" data-testid="hero-view-proof-link">View full proof packet →</Link>
        </div>
      </div>
    </div>
  );
}
