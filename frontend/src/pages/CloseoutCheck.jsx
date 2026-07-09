import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileQuestion,
  Loader2,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { LeadFormSuccess } from "@/components/LeadFormSuccess";
import { HoneypotField } from "@/components/HoneypotField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { SERVICE_TYPE_OPTIONS } from "@/data/mockData";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const checkItems = [
  "Service date",
  "Customer/site",
  "Service photo",
  "Signature",
  "Gallons/volume",
  "Disposal backup",
  "Invoice-support readiness",
  "Customer/reviewer response readiness",
];

const closeoutStatuses = [
  { label: "Ready to close", cls: "bg-status-complete-bg text-status-complete border-status-complete/30" },
  { label: "Missing proof", cls: "bg-status-incomplete-bg text-status-incomplete border-status-incomplete/30" },
  { label: "Weak backup", cls: "bg-status-attention-bg text-status-attention border-status-attention/30" },
  { label: "Needs review", cls: "bg-status-review-bg text-status-review border-status-review/30" },
  { label: "Office action needed", cls: "bg-status-attention-bg text-status-attention border-status-attention/30" },
];

const recordTypes = [
  "Route ticket",
  "Service photo set",
  "Disposal receipt",
  "Invoice backup",
  "Customer proof request",
  "Mixed screenshots or notes",
];

const trustNotes = [
  "Redacted or sample records are welcome.",
  "No card required.",
  "No sales call required.",
  "ClearRun does not contact your customers.",
  "Not legal certification or inspection approval.",
  "Built for office review, billing support, and customer/reviewer response preparation.",
];

const rescueOutputs = [
  "Missing Proof Queue",
  "Closeout Status Report",
  "Invoice Backup Support Sheet",
  "Next Office Action List",
];

function ExampleReport() {
  return (
    <div id="example-check" className="surface-card overflow-hidden" data-testid="closeout-example-report">
      <div className="border-b border-slate-100 bg-navy-950 px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Example output</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-white">Can This Record Be Closed? Report</h2>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 rounded-xl border border-status-incomplete/20 bg-status-incomplete-bg p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-status-incomplete">Closeout status</p>
            <p className="mt-1 font-display text-2xl font-semibold text-navy-950">Missing Proof</p>
          </div>
          <AlertTriangle className="h-9 w-9 text-status-incomplete" aria-hidden="true" />
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-600">Missing proof</p>
            <p className="mt-1 text-sm font-medium text-navy-950">Signature, service photo</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-600">Weak backup</p>
            <p className="mt-1 text-sm font-medium text-navy-950">Disposal receipt does not clearly match route</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-600">Invoice support</p>
            <p className="mt-1 text-sm font-medium text-navy-950">Not ready</p>
          </div>
          <div className="rounded-lg border border-navy-900/10 bg-offwhite p-4">
            <p className="text-xs font-semibold uppercase text-navy-800">Next office action</p>
            <p className="mt-1 text-sm leading-6 text-navy-950">
              Request missing photo/signature and confirm disposal match before closing this record.
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-600">
          Illustrative sample only. ClearRun helps organize office review and backup readiness. It does not certify legal compliance or guarantee inspection outcomes.
        </p>
      </div>
    </div>
  );
}

function CloseoutCheckForm() {
  const { status, submit } = useLeadSubmit("route_closeout_check", "/closeout-check");
  const [form, setForm] = useState({
    business_name: "",
    email: "",
    phone: "",
    service_type: SERVICE_TYPE_OPTIONS[0],
    record_type: recordTypes[0],
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

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setFileError("");
    if (!file) {
      setSampleFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setSampleFile(null);
      setFileError(`Please choose a file under ${MAX_FILE_SIZE_MB} MB.`);
      event.target.value = "";
      return;
    }
    setSampleFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (fileError) return;

    const fileNote = sampleFile
      ? `Local sample file selected by requester. Type: ${sampleFile.type || "unknown"}. Size MB: ${Math.max(sampleFile.size / 1024 / 1024, 0.01).toFixed(2)}. This preview does not upload or store the source file.`
      : "No file selected in the form. Ask requester to email one redacted or sample record to hello@clearrun.io with their business name.";

    const notes = [
      form.notes,
      fileNote,
      "Free Route Closeout Check only. Not legal certification, city approval, EPA approval, or inspection guarantee.",
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
      closeout_check_status: "Requested",
      consent_status: consent ? "Review consent granted" : "Consent not granted",
      requested_output: "Can This Record Be Closed? Report",
    });
  };

  if (status === "success") {
    const message = submittedWithFile
      ? "Request received. This preview did not upload or store your selected file. Please email one redacted/sample record to hello@clearrun.io with your business name so we can prepare the closeout check."
      : "Request received. Please email one redacted/sample record to hello@clearrun.io with your business name so we can prepare the closeout check.";

    return <LeadFormSuccess firstName={form.business_name} message={message} />;
  }

  return (
    <form id="closeout-check-form" data-testid="closeout-check-form" onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-4">
      <HoneypotField value={form.hp_website} onChange={handleChange} />
      <div>
        <Label htmlFor="business_name">Business name</Label>
        <Input id="business_name" name="business_name" data-testid="closeout-business-input" required value={form.business_name} onChange={handleChange} placeholder="Your service company" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" name="email" data-testid="closeout-email-input" required value={form.email} onChange={handleChange} placeholder="you@company.com" />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" data-testid="closeout-phone-input" value={form.phone} onChange={handleChange} placeholder="555-0100" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="service_type">Service type</Label>
          <Select id="service_type" name="service_type" data-testid="closeout-service-select" required value={form.service_type} onChange={handleChange}>
            {SERVICE_TYPE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="record_type">What type of record are you checking?</Label>
          <Select id="record_type" name="record_type" data-testid="closeout-record-type-select" required value={form.record_type} onChange={handleChange}>
            {recordTypes.map((option) => <option key={option} value={option}>{option}</option>)}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="sample_file">Sample record (optional)</Label>
        <label className="flex min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-navy-900/25 bg-slate-50 px-4 py-4 text-sm text-slate-700 transition-colors hover:border-navy-900/50 hover:bg-white">
          <UploadCloud className="h-5 w-5 shrink-0 text-navy-800" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block truncate font-medium text-navy-900">{fileLabel}</span>
            <span className="block text-xs leading-relaxed text-slate-600">PDF, CSV, JPG, PNG, or phone camera capture. Max {MAX_FILE_SIZE_MB} MB.</span>
          </span>
          <input id="sample_file" type="file" data-testid="closeout-file-input" className="sr-only" accept=".pdf,.csv,image/*" capture="environment" onChange={handleFileChange} />
        </label>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          This preview does not upload or store source files. After this request, email one redacted/sample record to <a className="font-semibold text-navy-800 underline-offset-2 hover:underline" href="mailto:hello@clearrun.io">hello@clearrun.io</a> with your business name.
        </p>
        {fileError && <p data-testid="closeout-file-error" className="mt-2 text-sm text-status-incomplete">{fileError}</p>}
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" data-testid="closeout-notes-input" value={form.notes} onChange={handleChange} placeholder="Example: this ticket may be missing a signature, service photo, disposal receipt match, or volume backup." />
      </div>
      <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700">
        <input type="checkbox" data-testid="closeout-consent-checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-navy-900 focus:ring-navy-800" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
        <span>I understand ClearRun may review my sample to prepare a closeout check and will not share it publicly without asking.</span>
      </label>
      <Button type="submit" size="lg" data-testid="closeout-submit-btn" disabled={status === "loading"} className="mt-1 w-full">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Get Free Route Closeout Check
      </Button>
      {status === "error" && <p data-testid="closeout-error" className="text-sm text-status-incomplete">Something went wrong submitting the request. You can also email hello@clearrun.io with your business name.</p>}
      <p className="text-xs text-slate-600">No card. No signup. No sales call required.</p>
    </form>
  );
}

export default function CloseoutCheck() {
  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-offwhite via-white to-slate-100">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-navy-900/5 blur-3xl" aria-hidden="true" />
        <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(23rem,0.86fr)] lg:items-center">
          <div className="min-w-0">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-navy-900/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-800">
              <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" /> Free Route Closeout Check
            </span>
            <h1 className="mobile-safe-text mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.04] tracking-tight text-navy-950 sm:text-6xl">
              Can this record be closed?
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Send one redacted or sample route record. ClearRun returns a simple closeout check showing what is complete, missing, weak, or needs office review before billing support, customer questions, or reviewer requests create more work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#closeout-check-form">
                <Button size="lg" className="w-full sm:w-auto">Get Free Route Closeout Check <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
              </a>
              <a href="#example-check">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">See Example Check</Button>
              </a>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["1 record", "Start with one messy ticket or proof request."],
                ["Plain answer", "Ready, missing, weak, or needs review."],
                ["Next action", "Exactly what the office should chase next."],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-card">
                  <p className="font-display text-lg font-semibold text-navy-950">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>
          <ExampleReport />
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-navy-700">What ClearRun checks</span>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-bold text-navy-950 sm:text-4xl">A clean office answer before the record gets closed.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
              The output is intentionally simple: what proof exists, what is missing, what is weak, and what needs a human office review. No compliance promises. No fake approvals.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {checkItems.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-status-complete" aria-hidden="true" />
                <span className="text-sm font-semibold text-navy-950">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {closeoutStatuses.map((status) => (
            <span key={status.label} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${status.cls}`}>
              {status.label}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(23rem,0.86fr)] lg:items-start">
          <div className="rounded-2xl border border-navy-900/10 bg-navy-950 p-6 text-white shadow-premium sm:p-8">
            <ShieldCheck className="h-10 w-10 text-white" aria-hidden="true" />
            <h2 className="mt-4 font-display text-3xl font-bold text-white">Trust first. Hype never.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This page is designed to convert serious operators without pretending ClearRun is a regulator, city system, legal verifier, or upload/storage platform.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {trustNotes.map((note) => (
                <div key={note} className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-100" aria-hidden="true" />
                  <p className="text-xs leading-5 text-slate-200">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="form-card p-5 sm:p-6" data-testid="closeout-check-form-panel">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-700">Start here</p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">Get the free check</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">One record is enough to see whether the pain is real.</p>
            </div>
            <CloseoutCheckForm />
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-status-attention">Paid next step</span>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-bold text-navy-950 sm:text-4xl">If one record is messy, a batch may be costing office time.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
              Record Closeout Rescue is the first paid offer after the free check. It reviews a small batch and returns a practical office action list. No payment processing is added in this PR.
            </p>
            <Link to="/pricing" className="mt-6 inline-flex">
              <Button variant="secondary">Review pricing direction <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {rescueOutputs.map((output) => (
              <div key={output} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                <FileQuestion className="h-6 w-6 text-navy-800" aria-hidden="true" />
                <p className="mt-3 font-display text-base font-semibold text-navy-950">{output}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
