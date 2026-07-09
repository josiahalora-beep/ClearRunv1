import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  Loader2,
  Mail,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
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
  "No card, signup, or sales call required.",
  "ClearRun never contacts your customers directly.",
  "Your record is not shared publicly without asking.",
  "This is not legal certification or inspection approval.",
];

const snapshotRows = [
  ["Service date", "complete"],
  ["Customer or site", "complete"],
  ["Volume or job detail", "needs review"],
  ["Signature or photo", "missing"],
  ["Disposal confirmation", "needs review"],
];

function SnapshotExample() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-slate-100 bg-navy-950 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Example output</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-white">Proof Snapshot</h2>
      </div>
      <div className="p-5">
        <div className="mb-4 rounded-lg border border-slate-200 bg-offwhite p-4">
          <p className="text-sm font-semibold text-navy-950">Route Cleanup recommendation</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Confirm the missing signature and disposal detail before this record is shared with a customer or reviewer.
          </p>
        </div>
        <div className="space-y-2">
          {snapshotRows.map(([label, status]) => (
            <div key={label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
              <span className="text-sm text-slate-600">{label}</span>
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                status === "complete"
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
        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          Illustrative sample only. ClearRun organizes service proof; it does not certify legal compliance or guarantee inspection outcomes.
        </p>
      </div>
    </div>
  );
}

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
  const [submittedWithFile, setSubmittedWithFile] = useState(false);

  const fileLabel = useMemo(() => {
    if (!sampleFile) return "Optional: choose a local sample file";
    const size = Math.max(sampleFile.size / 1024 / 1024, 0.01).toFixed(2);
    const type = sampleFile.type || "file";
    return `Local ${type} selected (${size} MB)`;
  }, [sampleFile]);

  const handleChange = (e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

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
    if (fileError) return;

    const fileNote = sampleFile
      ? `Local sample file selected by requester. Type: ${sampleFile.type || "unknown"}. Size MB: ${Math.max(sampleFile.size / 1024 / 1024, 0.01).toFixed(2)}. The preview does not upload or store the source file.`
      : "No file selected in the form. Ask requester to email one redacted or sample record to hello@clearrun.io with their business name.";

    const notes = [
      form.notes,
      fileNote,
      "Proof Snapshot request only. Not legal certification, city approval, or inspection guarantee.",
    ].filter(Boolean).join(" ");

    setSubmittedWithFile(Boolean(sampleFile));
    await submit({
      ...form,
      name: form.business_name,
      notes,
      source_file_uploaded: false,
      source_file_storage_connected: false,
      source_file_local_reference: Boolean(sampleFile),
      file_received: false,
      snapshot_status: "Requested",
      consent_status: consent ? "Review consent granted" : "Consent not granted",
      deletion_requested: false,
      current_workflow: "Proof Snapshot request",
    });
  };

  if (status === "success") {
    const message = submittedWithFile
      ? "Request received. This preview did not upload or store your selected file. Please email one redacted/sample record to hello@clearrun.io with your business name so we can prepare the Proof Snapshot."
      : "Request received. Please email one redacted/sample record to hello@clearrun.io with your business name so we can prepare the Proof Snapshot.";

    return <LeadFormSuccess firstName={form.business_name} message={message} />;
  }

  return (
    <form data-testid="proof-snapshot-form" onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-4">
      <HoneypotField value={form.hp_website} onChange={handleChange} />
      <div>
        <Label htmlFor="business_name">Business name</Label>
        <Input
          id="business_name"
          name="business_name"
          data-testid="proof-snapshot-business-input"
          required
          value={form.business_name}
          onChange={handleChange}
          placeholder="Your service company"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            data-testid="proof-snapshot-email-input"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            name="phone"
            data-testid="proof-snapshot-phone-input"
            value={form.phone}
            onChange={handleChange}
            placeholder="555-0100"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="service_type">Service type</Label>
        <Select
          id="service_type"
          name="service_type"
          data-testid="proof-snapshot-service-select"
          required
          value={form.service_type}
          onChange={handleChange}
        >
          {SERVICE_TYPE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="sample_file">Sample record (optional)</Label>
        <label className="flex min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-navy-900/25 bg-slate-50 px-4 py-4 text-sm text-slate-600 transition-colors hover:border-navy-900/50 hover:bg-white">
          <UploadCloud className="h-5 w-5 shrink-0 text-navy-800" />
          <span className="min-w-0">
            <span className="block truncate font-medium text-navy-900">{fileLabel}</span>
            <span className="block text-xs leading-relaxed text-slate-500">
              PDF, CSV, JPG, PNG, or phone camera capture. Max {MAX_FILE_SIZE_MB} MB.
            </span>
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
          The current preview does not upload or store source files. If you do not attach a file here, or if you attach one locally, we will still ask you to email one redacted/sample record to <a className="font-semibold text-navy-800 underline-offset-2 hover:underline" href="mailto:hello@clearrun.io">hello@clearrun.io</a> with your business name.
        </p>
        {fileError && <p data-testid="proof-snapshot-file-error" className="mt-2 text-sm text-status-incomplete">{fileError}</p>}
      </div>
      <div>
        <Label htmlFor="notes">What should we look for? (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          data-testid="proof-snapshot-notes-input"
          value={form.notes}
          onChange={handleChange}
          placeholder="Example: this ticket may be missing a signature, disposal detail, or customer location."
        />
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
        <span>I understand ClearRun may review my sample to prepare a Proof Snapshot and will not share it publicly without asking.</span>
      </label>
      <Button type="submit" size="lg" data-testid="proof-snapshot-submit-btn" disabled={status === "loading"} className="mt-1 w-full">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Get a Free Route Closeout Check
      </Button>
      {status === "error" && (
        <p data-testid="proof-snapshot-error" className="text-sm text-status-incomplete">
          Something went wrong submitting the request. You can also email hello@clearrun.io with your business name.
        </p>
      )}
      <p className="text-xs text-slate-400">No card. No signup. No sales call required.</p>
    </form>
  );
}

export default function ProofSnapshot() {
  return (
    <Layout>
      <section className="container-page grid grid-cols-1 gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.88fr)] lg:gap-12">
        <div className="min-w-0">
          <span className="inline-flex w-fit items-center rounded-full border border-navy-900/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-800">
            Free Proof Snapshot
          </span>
          <h1 className="mobile-safe-text mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-navy-950 sm:text-5xl">
            Send one messy record. See what is missing.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            ClearRun turns one redacted or sample record into a clean Proof Snapshot: what is complete, what is missing, and whether Route Cleanup is worth paying for.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#proof-snapshot-form-panel">
              <Button size="lg" className="w-full sm:w-auto">
                Get a Free Route Closeout Check <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Link to="/proof/PP-10231">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">See Proof Example</Button>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {trustNotes.map((note) => (
              <div key={note} className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-status-complete" />
                <span>{note}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <SnapshotExample />
          </div>
        </div>

        <Card id="proof-snapshot-form-panel" className="form-card h-fit min-w-0 scroll-mt-24">
          <CardContent className="p-5 sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display font-semibold text-navy-950">Request your snapshot</p>
                <p className="text-xs text-slate-500">Most are returned within 2-3 business days</p>
              </div>
            </div>
            <ProofSnapshotForm />
          </CardContent>
        </Card>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container-page grid grid-cols-1 gap-6 py-10 md:grid-cols-3">
          {[
            [ClipboardList, "What to send", "One redacted ticket, manifest, route sheet, photo, CSV, or similar sample record."],
            [FileCheck2, "What you get back", "A Proof Snapshot, missing-field list, and Route Cleanup recommendation."],
            [Mail, "How files are handled", "No public sharing without asking. ClearRun never contacts your customers directly."],
          ].map(([Icon, title, copy]) => (
            <div key={title} className="surface-card p-5">
              <Icon className="h-5 w-5 text-navy-800" />
              <h3 className="mt-4 font-display text-lg font-semibold text-navy-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-10 sm:py-12">
        <DisclaimerBanner
          text="ClearRun helps organize service proof and record visibility. It does not certify legal compliance, verify record accuracy, or guarantee inspection, reviewer, customer, city, state, federal, or agency outcomes."
        />
      </section>
    </Layout>
  );
}
