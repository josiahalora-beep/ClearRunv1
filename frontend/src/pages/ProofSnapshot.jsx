import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3, FileText, Loader2, ShieldCheck, UploadCloud } from "lucide-react";
import { Layout } from "@/components/Layout";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { LeadFormSuccess } from "@/components/LeadFormSuccess";
import { HoneypotField } from "@/components/HoneypotField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { SERVICE_TYPE_OPTIONS } from "@/data/mockData";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const trustNotes = [
  "Redacted or sample records are welcome.",
  "ClearRun never contacts your customers directly.",
  "Your record is not shared publicly without asking.",
  "You can request deletion at any time.",
];

const snapshotRows = [
  ["Service date", "Found"],
  ["Customer/location", "Found"],
  ["Volume or job detail", "Needs review"],
  ["Photo or signature", "Missing"],
  ["Disposal confirmation", "Needs review"],
];

function ProofSnapshotForm() {
  const { status, submit } = useLeadSubmit("proof_snapshot", "/proof-snapshot");
  const [form, setForm] = useState({
    business_name: "",
    email: "",
    phone: "",
    service_type: SERVICE_TYPE_OPTIONS[0],
    notes: "",
    hp_website: "",
  });
  const [sampleFile, setSampleFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const [fileError, setFileError] = useState("");

  const fileLabel = useMemo(() => {
    if (!sampleFile) return "Choose a PDF, CSV, or photo";
    return `${sampleFile.name} (${Math.max(sampleFile.size / 1024 / 1024, 0.01).toFixed(2)} MB)`;
  }, [sampleFile]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFileError("");
    if (!file) {
      setSampleFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setSampleFile(null);
      setFileError(`Please choose a file under ${MAX_FILE_SIZE_MB} MB.`);
      e.target.value = "";
      return;
    }
    setSampleFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sampleFile) {
      setFileError("Please choose one record so we can prepare the snapshot request.");
      return;
    }
    const notes = [
      form.notes,
      `Selected sample file: ${sampleFile.name}`,
      "Preview limitation: source file storage must be connected before live customer records are accepted.",
    ].filter(Boolean).join(" ");

    await submit({
      ...form,
      name: form.business_name,
      notes,
      sample_file_name: sampleFile.name,
      sample_file_type: sampleFile.type || "unknown",
      file_received: true,
      snapshot_status: "Requested",
      consent_status: consent ? "Review consent granted" : "Consent not granted",
      deletion_requested: false,
      current_workflow: "Proof Snapshot intake",
    });
  };

  if (status === "success") {
    return (
      <LeadFormSuccess
        firstName={form.business_name}
        message="Request received. Most Proof Snapshots are returned within 2-3 business days. We will only use the selected record details to prepare your ClearRun proof example."
      />
    );
  }

  return (
    <form data-testid="proof-snapshot-form" onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-4">
      <HoneypotField value={form.hp_website} onChange={handleChange} />
      <div>
        <Label htmlFor="business_name">Business name</Label>
        <Input id="business_name" name="business_name" data-testid="proof-snapshot-business-input" required value={form.business_name} onChange={handleChange} placeholder="Peach State Grease Services" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" name="email" data-testid="proof-snapshot-email-input" required value={form.email} onChange={handleChange} placeholder="you@company.com" />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" data-testid="proof-snapshot-phone-input" value={form.phone} onChange={handleChange} placeholder="555-0100" />
        </div>
      </div>
      <div>
        <Label htmlFor="service_type">Service type</Label>
        <Select id="service_type" name="service_type" data-testid="proof-snapshot-service-select" required value={form.service_type} onChange={handleChange}>
          {SERVICE_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="sample_file">One record to review</Label>
        <label className="flex min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-navy-900/25 bg-slate-50 px-4 py-4 text-sm text-slate-600 transition-colors hover:border-navy-900/50 hover:bg-white">
          <UploadCloud className="h-5 w-5 shrink-0 text-navy-800" />
          <span className="min-w-0">
            <span className="block truncate font-medium text-navy-900">{fileLabel}</span>
            <span className="block text-xs text-slate-500">PDF, CSV, JPG, PNG, or phone camera capture. Max {MAX_FILE_SIZE_MB} MB.</span>
          </span>
          <input
            id="sample_file"
            type="file"
            data-testid="proof-snapshot-file-input"
            className="sr-only"
            accept=".pdf,.csv,image/*"
            capture="environment"
            onChange={handleFileChange}
          />
        </label>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          This preview records the selected file name and request details only. Connect secure private storage before accepting live customer records.
        </p>
        {fileError && <p data-testid="proof-snapshot-file-error" className="mt-2 text-sm text-status-incomplete">{fileError}</p>}
      </div>
      <div>
        <Label htmlFor="notes">Anything we should know? (optional)</Label>
        <Textarea id="notes" name="notes" data-testid="proof-snapshot-notes-input" value={form.notes} onChange={handleChange} placeholder="Example: this ticket is missing a signature, or this CSV came from our dispatch system." />
      </div>
      <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-600">
        <input
          type="checkbox"
          data-testid="proof-snapshot-consent-checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-navy-900 focus:ring-navy-800"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        <span>I understand ClearRun may review this sample to prepare my Proof Snapshot and will not reuse it publicly without asking.</span>
      </label>
      <Button type="submit" size="lg" data-testid="proof-snapshot-submit-btn" disabled={status === "loading"} className="mt-1 w-full">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Get My Free Proof Snapshot
      </Button>
      {status === "error" && (
        <p data-testid="proof-snapshot-error" className="text-sm text-status-incomplete">
          Something went wrong submitting the request. Please try again.
        </p>
      )}
      <p className="text-xs text-slate-400">No card, no signup, no sales call required.</p>
    </form>
  );
}

export default function ProofSnapshot() {
  return (
    <Layout>
      <section className="container-page grid grid-cols-1 gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:gap-12">
        <div className="min-w-0">
          <span className="inline-flex w-fit items-center rounded-full border border-navy-900/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-800">
            Free Proof Snapshot
          </span>
          <h1 className="mobile-safe-text mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-navy-950 sm:text-5xl">
            See what your own records could look like - free.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Send one ticket, manifest, or photo. Get back a clean proof packet and a plain list of what is missing. No signup, no card, no call.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#proof-snapshot-form-panel">
              <Button size="lg" className="w-full sm:w-auto">
                Get My Free Proof Snapshot <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Link to="/proof">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">See Proof Packets</Button>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["Under 90 seconds", "One record, one email, one service type."],
              ["Plain-language gaps", "Know what is missing before a customer asks."],
              ["Operator-safe", "No public sharing, no customer contact."],
            ].map(([title, copy]) => (
              <div key={title} className="surface-card p-4">
                <p className="text-sm font-semibold text-navy-950">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="surface-card min-w-0 overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Before</p>
              </div>
              <div className="space-y-3 p-5">
                {["Paper ticket photo", "Partial CSV row", "Loose disposal receipt"].map((item) => (
                  <div key={item} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    <span className="text-slate-600">{item}</span>
                    <span className="rounded-full bg-status-attention-bg px-2 py-1 text-xs font-medium text-status-attention">unclear</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="surface-card min-w-0 overflow-hidden">
              <div className="border-b border-slate-100 bg-navy-950 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">After</p>
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-navy-950">
                  <FileText className="h-4 w-4" /> Proof Snapshot example
                </div>
                <div className="space-y-2">
                  {snapshotRows.map(([label, statusText]) => (
                    <div key={label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
                      <span className="text-sm text-slate-600">{label}</span>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusText === "Found" ? "bg-status-complete-bg text-status-complete" : "bg-status-attention-bg text-status-attention"}`}>
                        {statusText}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-400">Example only - not a real customer.</p>
              </div>
            </div>
          </div>
        </div>

        <Card id="proof-snapshot-form-panel" className="form-card h-fit min-w-0 scroll-mt-24">
          <CardContent className="p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white"><ShieldCheck className="h-4 w-4" /></span>
              <div>
                <p className="font-display font-semibold text-navy-950">Get your snapshot</p>
                <p className="text-xs text-slate-500">Most are returned within 2-3 business days</p>
              </div>
            </div>
            <ProofSnapshotForm />
          </CardContent>
        </Card>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container-page grid grid-cols-1 gap-6 py-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Trust posture</p>
            <h2 className="mt-2 max-w-md font-display text-2xl font-semibold text-navy-950">Useful without overpromising.</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {trustNotes.map((note) => (
              <div key={note} className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-status-complete" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            [Clock3, "What you get back", "A cleaned proof packet example, a missing-field list, and a simple recommendation for the next record workflow."],
            [UploadCloud, "What to send", "One redacted ticket, manifest, route sheet, photo, CSV, or similar record from a recent job."],
            [ShieldCheck, "What it is not", "It is not a legal certification, inspection guarantee, or city approval claim."],
          ].map(([Icon, title, copy]) => (
            <div key={title} className="surface-card p-5">
              <Icon className="h-5 w-5 text-navy-800" />
              <h3 className="mt-4 font-display text-lg font-semibold text-navy-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{copy}</p>
            </div>
          ))}
        </div>
        <DisclaimerBanner
          className="mt-8"
          text="ClearRun helps organize service proof and record visibility. It does not certify legal compliance, verify record accuracy, or guarantee inspection, reviewer, customer, city, state, federal, or agency outcomes."
        />
      </section>
    </Layout>
  );
}
