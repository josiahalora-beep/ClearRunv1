import React, { useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { DisclaimerBanner } from "@/components/shared/DisclaimerBanner";
import { LeadFormSuccess } from "@/components/LeadFormSuccess";
import { HoneypotField } from "@/components/HoneypotField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";

// V30 — Missing Proof Review Intake Form
// Offer: Free Route Closeout Check (intake surface)
// Output: Proof Snapshot (returned by ClearRun team)
// Required: email, record (file or text), redaction confirmation
// Optional: record type, pain type, disposal backup, context flags

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const RECORD_TYPE_OPTIONS = [
  "Grease trap / FOG",
  "Septic pumping",
  "Hydro-vac / liquid waste",
  "Other regulated service",
];

const PAIN_TYPE_OPTIONS = [
  "Missing signature or photo",
  "Volume or gallons unclear",
  "Disposal backup missing or loose",
  "Customer is asking about the record",
  "Reviewer or inspector flagged the record",
  "Something else",
];

const trustNotes = [
  "No card, signup, or sales call required.",
  "Redacted or sample records are welcome.",
  "ClearRun never contacts your customers directly.",
  "Your record is not shared publicly without asking.",
  "This is not legal certification or compliance approval.",
];

export default function MissingProofIntakeForm() {
  const fileInputRef = useRef(null);
  const { status, submit } = useLeadSubmit("route_closeout_check", "missing-proof-intake");

  // Required fields
  const [email, setEmail] = useState("");
  const [recordText, setRecordText] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [redactionConfirmed, setRedactionConfirmed] = useState(false);

  // Optional fields
  const [recordType, setRecordType] = useState("");
  const [routeContext, setRouteContext] = useState("");
  const [painType, setPainType] = useState("");
  const [whatIsMissing, setWhatIsMissing] = useState("");
  const [disposalBackup, setDisposalBackup] = useState("");
  const [flagInvoice, setFlagInvoice] = useState(false);
  const [flagCustomer, setFlagCustomer] = useState(false);
  const [flagReviewer, setFlagReviewer] = useState(false);

  // Honeypot
  const [honeypot, setHoneypot] = useState("");

  const hasRecord = file !== null || recordText.trim().length > 0;
  const canSubmit =
    email.trim().length > 0 &&
    email.includes("@") &&
    hasRecord &&
    redactionConfirmed &&
    status !== "loading";

  function handleFileChange(e) {
    const selected = e.target.files?.[0] ?? null;
    if (!selected) { setFile(null); setFileError(""); return; }
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File is too large. Max size is ${MAX_FILE_SIZE_MB} MB.`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFileError("");
    setFile(selected);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || honeypot) return;

    const contextFlags = [
      flagInvoice && "invoice",
      flagCustomer && "customer_question",
      flagReviewer && "reviewer_question",
    ].filter(Boolean);

    await submit({
      email: email.trim(),
      has_file: file !== null,
      file_name: file?.name ?? null,
      record_text: recordText.trim() || null,
      record_type: recordType || null,
      route_context: routeContext.trim() || null,
      pain_type: painType || null,
      what_is_missing: whatIsMissing.trim() || null,
      disposal_backup: disposalBackup || null,
      context_flags: contextFlags.length > 0 ? contextFlags : null,
      redaction_confirmed: true,
    });
  }

  if (status === "success") {
    return (
      <Layout>
        <LeadFormSuccess
          email={email}
          heading="We have your record."
          body="You will receive your free Route Closeout Check by email. ClearRun will review what proof is present, flag what is missing or weak, and return a Proof Snapshot."
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <DisclaimerBanner />

      <section className="container-page py-10 sm:py-12">
        <div className="mx-auto max-w-2xl">

          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase text-navy-700">Free Route Closeout Check</span>
            <h1 className="mt-2 text-3xl font-bold text-navy-950 sm:text-4xl">
              Send a record. Find the missing proof.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              ClearRun reviews the proof present in your record, flags what is missing or weak, and returns
              a Proof Snapshot. No card, signup, or sales call required.
            </p>
          </div>

          {/* Trust notes */}
          <div className="mb-8 rounded-lg border border-slate-200 bg-offwhite p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-navy-700" />
              <p className="text-xs font-semibold uppercase text-slate-500">How this works</p>
            </div>
            <ul className="space-y-2">
              {trustNotes.map((note) => (
                <li key={note} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-status-complete" />
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <HoneypotField value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />

            {/* ── REQUIRED: Email ── */}
            <div className="space-y-1.5">
              <Label htmlFor="email">
                Your email address <span className="text-status-incomplete">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-slate-400">We will send your Proof Snapshot to this address.</p>
            </div>

            {/* ── REQUIRED: Record ── */}
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-navy-950">
                Your record <span className="text-status-incomplete">*</span>
              </legend>

              {/* Redaction notice — shown before upload */}
              <div className="flex gap-2 rounded-md border border-status-attention/30 bg-status-attention-bg p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-attention" />
                <p className="text-xs leading-relaxed text-slate-600">
                  <span className="font-semibold">Redact before sending.</span> Remove or black out customer names,
                  addresses, phone numbers, and any field that could identify a real person or business. Redacted
                  and sample records are welcome.
                </p>
              </div>

              {/* File upload */}
              <div>
                <label
                  htmlFor="record-file"
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-offwhite px-4 py-6 text-center transition-colors hover:border-navy-700 hover:bg-white"
                >
                  <UploadCloud className="h-6 w-6 text-slate-400" />
                  <span className="text-sm font-medium text-navy-950">
                    {file ? file.name : "Upload a record file"}
                  </span>
                  <span className="text-xs text-slate-400">
                    PDF, image, CSV, or spreadsheet — max {MAX_FILE_SIZE_MB} MB
                  </span>
                  <input
                    id="record-file"
                    ref={fileInputRef}
                    type="file"
                    className="sr-only"
                    accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.csv,.xlsx,.xls,.txt"
                    onChange={handleFileChange}
                  />
                </label>
                {file && (
                  <button
                    type="button"
                    onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="mt-1 text-xs text-slate-400 hover:text-status-incomplete"
                  >
                    Remove file
                  </button>
                )}
                {fileError && <p className="mt-1 text-xs text-status-incomplete">{fileError}</p>}
              </div>

              {/* Text paste — alternative to upload */}
              <div className="space-y-1.5">
                <Label htmlFor="record-text" className="text-xs text-slate-500">
                  Or paste a record excerpt
                </Label>
                <Textarea
                  id="record-text"
                  rows={4}
                  placeholder="Paste a route row, ticket note, or any record excerpt here (already redacted)."
                  value={recordText}
                  onChange={(e) => setRecordText(e.target.value)}
                />
              </div>
            </fieldset>

            {/* ── REQUIRED: Redaction confirmation ── */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-offwhite p-4">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-navy-950"
                checked={redactionConfirmed}
                onChange={(e) => setRedactionConfirmed(e.target.checked)}
                required
              />
              <span className="text-sm leading-relaxed text-slate-600">
                <span className="font-semibold text-navy-950">I confirm this record has been redacted.</span>{" "}
                No real customer names, addresses, or personally identifiable information is included.
              </span>
            </label>

            {/* ── OPTIONAL: Record type ── */}
            <div className="space-y-1.5">
              <Label htmlFor="record-type" className="text-slate-500">
                Record type <span className="text-xs font-normal">(optional)</span>
              </Label>
              <select
                id="record-type"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-700"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
              >
                <option value="">Select record type…</option>
                {RECORD_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* ── OPTIONAL: Route / job context ── */}
            <div className="space-y-1.5">
              <Label htmlFor="route-context" className="text-slate-500">
                Route or job context <span className="text-xs font-normal">(optional)</span>
              </Label>
              <Input
                id="route-context"
                type="text"
                placeholder="e.g. Macon Route A, Load 14 — grease trap, Jan 2026"
                value={routeContext}
                onChange={(e) => setRouteContext(e.target.value)}
              />
            </div>

            {/* ── OPTIONAL: Pain type ── */}
            <div className="space-y-1.5">
              <Label htmlFor="pain-type" className="text-slate-500">
                What caused the record problem? <span className="text-xs font-normal">(optional)</span>
              </Label>
              <select
                id="pain-type"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-700"
                value={painType}
                onChange={(e) => setPainType(e.target.value)}
              >
                <option value="">Select…</option>
                {PAIN_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* ── OPTIONAL: What is missing ── */}
            <div className="space-y-1.5">
              <Label htmlFor="what-missing" className="text-slate-500">
                What do you think is missing or unclear? <span className="text-xs font-normal">(optional)</span>
              </Label>
              <Textarea
                id="what-missing"
                rows={3}
                placeholder="Describe the gap — e.g. no disposal receipt, signature on wrong date, volume doesn't match route sheet."
                value={whatIsMissing}
                onChange={(e) => setWhatIsMissing(e.target.value)}
              />
            </div>

            {/* ── OPTIONAL: Disposal backup ── */}
            <div className="space-y-1.5">
              <Label htmlFor="disposal-backup" className="text-slate-500">
                Is disposal backup included in what you are sending? <span className="text-xs font-normal">(optional)</span>
              </Label>
              <select
                id="disposal-backup"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-700"
                value={disposalBackup}
                onChange={(e) => setDisposalBackup(e.target.value)}
              >
                <option value="">Select…</option>
                <option value="yes">Yes — disposal backup included</option>
                <option value="no">No — disposal backup is missing</option>
                <option value="not_sure">Not sure</option>
              </select>
            </div>

            {/* ── OPTIONAL: Context flags ── */}
            <fieldset className="space-y-2">
              <legend className="text-sm text-slate-500">
                Context flags <span className="text-xs font-normal">(optional — check all that apply)</span>
              </legend>
              {[
                { id: "flag-invoice", label: "This record may need invoice backup support", state: flagInvoice, setter: setFlagInvoice },
                { id: "flag-customer", label: "A customer has asked about this record", state: flagCustomer, setter: setFlagCustomer },
                { id: "flag-reviewer", label: "A reviewer or inspector has flagged this record", state: flagReviewer, setter: setFlagReviewer },
              ].map(({ id, label, state, setter }) => (
                <label key={id} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0 accent-navy-950"
                    checked={state}
                    onChange={(e) => setter(e.target.checked)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>

            {/* ── Submit ── */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!canSubmit}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Get a Free Route Closeout Check
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              {!canSubmit && (email || recordText || file) && (
                <p className="mt-2 text-center text-xs text-slate-400">
                  {!email.includes("@") ? "Add a valid email. " : ""}
                  {!hasRecord ? "Attach a file or paste a record excerpt. " : ""}
                  {!redactionConfirmed ? "Confirm you have redacted the record." : ""}
                </p>
              )}
              {status === "error" && (
                <p className="mt-3 text-center text-xs text-status-incomplete">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
            </div>

            {/* Legal disclaimer */}
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-400">
              <p>
                ClearRun does not certify compliance, verify disposal, or represent the legal sufficiency of any
                record. The Route Closeout Check is an organizational review only. This form submits a record
                for internal review by the ClearRun team — it is not a compliance filing, city or government
                submission, or inspection approval of any kind.
              </p>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
