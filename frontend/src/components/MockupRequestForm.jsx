import React, { useState } from "react";
import { Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { LeadFormSuccess } from "@/components/LeadFormSuccess";
import { HoneypotField } from "@/components/HoneypotField";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { SERVICE_TYPE_OPTIONS, CURRENT_WORKFLOW_OPTIONS } from "@/data/mockData";

/** Form for the Free Proof Packet Mockup request (/proof-mockup). */
export function MockupRequestForm({ leadType = "mockup", sourcePage, submitLabel }) {
  const { status, submit } = useLeadSubmit(leadType, sourcePage);
  const [form, setForm] = useState({
    business_name: "", name: "", email: "",
    service_type: SERVICE_TYPE_OPTIONS[0], current_workflow: CURRENT_WORKFLOW_OPTIONS[0],
    notes: "", hp_website: "",
  });
  const [sampleFile, setSampleFile] = useState(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const notes = sampleFile
      ? `${form.notes}${form.notes ? " " : ""}[Sample record referenced: ${sampleFile} — not uploaded in this demo]`
      : form.notes;
    await submit({ ...form, notes });
  };

  if (status === "success") {
    return <LeadFormSuccess firstName={form.name.split(" ")[0]} />;
  }

  return (
    <form data-testid={`lead-form-${leadType}`} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <HoneypotField value={form.hp_website} onChange={handleChange} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="business_name">Business name</Label>
          <Input id="business_name" name="business_name" data-testid="lead-form-business-input" required value={form.business_name} onChange={handleChange} placeholder="Peach State Grease Services" />
        </div>
        <div>
          <Label htmlFor="name">Contact name</Label>
          <Input id="name" name="name" data-testid="lead-form-name-input" required value={form.name} onChange={handleChange} placeholder="Jordan Reyes" />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Work email</Label>
        <Input id="email" type="email" name="email" data-testid="lead-form-email-input" required value={form.email} onChange={handleChange} placeholder="you@company.com" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="service_type">Service type</Label>
          <Select id="service_type" name="service_type" data-testid="lead-form-service-select" required value={form.service_type} onChange={handleChange}>
            {SERVICE_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="current_workflow">Current software/workflow</Label>
          <Select id="current_workflow" name="current_workflow" data-testid="lead-form-workflow-select" required value={form.current_workflow} onChange={handleChange}>
            {CURRENT_WORKFLOW_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="sample_file">Sample record — upload or describe below (optional)</Label>
        <label className="flex items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 cursor-pointer hover:border-navy-800/40">
          <Paperclip className="h-4 w-4 shrink-0" />
          <span className="truncate">{sampleFile || "Choose a file — not uploaded in this demo"}</span>
          <input id="sample_file" type="file" data-testid="lead-form-sample-file-input" className="hidden" onChange={(e) => setSampleFile(e.target.files?.[0]?.name || null)} />
        </label>
      </div>
      <div>
        <Label htmlFor="notes">Describe a recent service ticket (optional)</Label>
        <Textarea id="notes" name="notes" data-testid="lead-form-notes-input" value={form.notes} onChange={handleChange} placeholder="Optional" />
      </div>
      <Button type="submit" size="lg" data-testid="lead-form-submit-btn" disabled={status === "loading"} className="mt-1">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitLabel}
      </Button>
      {status === "error" && (
        <p data-testid="lead-form-error" className="text-sm text-status-incomplete">
          Something went wrong submitting the form. Please try again.
        </p>
      )}
      <p className="text-xs text-slate-400">No spam. We'll only contact you about your ClearRun trial or request.</p>
    </form>
  );
}
