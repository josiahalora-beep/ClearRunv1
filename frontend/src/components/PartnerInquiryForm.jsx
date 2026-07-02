import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { LeadFormSuccess } from "@/components/LeadFormSuccess";
import { HoneypotField } from "@/components/HoneypotField";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { PARTNER_TYPE_OPTIONS } from "@/data/mockData";

/** Form for the Partner inquiry page (/partners). */
export function PartnerInquiryForm({ leadType = "partner", sourcePage, submitLabel }) {
  const { status, submit } = useLeadSubmit(leadType, sourcePage);
  const [form, setForm] = useState({
    business_name: "", name: "", email: "",
    partner_type: PARTNER_TYPE_OPTIONS[0], service_area: "", notes: "", hp_website: "",
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit(form);
  };

  if (status === "success") {
    return <LeadFormSuccess firstName={form.name.split(" ")[0]} />;
  }

  return (
    <form data-testid={`lead-form-${leadType}`} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <HoneypotField value={form.hp_website} onChange={handleChange} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="business_name">Organization name</Label>
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
          <Label htmlFor="partner_type">Partner type</Label>
          <Select id="partner_type" name="partner_type" data-testid="lead-form-partner-type-select" required value={form.partner_type} onChange={handleChange}>
            {PARTNER_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
        </div>
        <div>
          <Label htmlFor="service_area">Service area</Label>
          <Input id="service_area" name="service_area" data-testid="lead-form-service-area-input" required value={form.service_area} onChange={handleChange} placeholder="e.g. Central Georgia" />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Tell us about your business (optional)</Label>
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
      <p className="text-xs text-slate-400">No spam. We'll only contact you about your ClearRun partnership.</p>
    </form>
  );
}
