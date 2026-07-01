import React, { useState } from "react";
import { Camera, MapPin, Droplets, CheckCircle2, WifiOff } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Field() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <Layout>
      <section className="container-page py-12 sm:py-16 grid lg:grid-cols-2 gap-10">
        <div>
          <PageHeader
            eyebrow="Field Capture"
            title="Built for techs, not office staff"
            description="A fast, mobile-first way for field technicians to log service details and photo evidence on-site — designed to work even with weak signal."
          />
          <div className="mt-8 flex flex-col gap-4">
            {[
              { icon: WifiOff, title: "Works offline", desc: "Entries save locally and sync once signal returns." },
              { icon: Camera, title: "Photo evidence built in", desc: "Attach photos directly to the service ticket, no separate app." },
              { icon: MapPin, title: "Location-aware", desc: "Each ticket ties to the right customer location automatically." },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900/5 text-navy-900 shrink-0"><f.icon className="h-4 w-4" /></span>
                <div>
                  <p className="font-display font-semibold text-navy-950 text-sm">{f.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-premium p-6 max-w-sm mx-auto w-full">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4 text-center">Field Capture Preview</p>
          {submitted ? (
            <div data-testid="field-submit-success" className="flex flex-col items-center text-center gap-2 py-10">
              <CheckCircle2 className="h-10 w-10 text-status-complete" />
              <p className="font-display font-semibold text-navy-950">Ticket logged</p>
              <p className="text-xs text-slate-500">Synced to ClearRun once signal is available.</p>
            </div>
          ) : (
            <form data-testid="field-capture-form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-3.5">
              <div>
                <Label htmlFor="loc">Customer location</Label>
                <Input id="loc" data-testid="field-location-input" defaultValue="Creekside Grill" required />
              </div>
              <div>
                <Label htmlFor="vol">Volume serviced (gallons)</Label>
                <Input id="vol" type="number" data-testid="field-volume-input" placeholder="e.g. 320" required />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" data-testid="field-notes-input" placeholder="Any observations on-site" />
              </div>
              <button type="button" data-testid="field-attach-photo-btn" className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-4 text-sm text-slate-500 hover:border-navy-800/40">
                <Camera className="h-4 w-4" /> Attach Photo
              </button>
              <Button type="submit" data-testid="field-submit-btn" className="mt-1"><Droplets className="h-4 w-4" /> Log Service Ticket</Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
