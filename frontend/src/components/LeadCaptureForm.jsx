import React, { useState } from "react";
import axios from "axios";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * Reusable lead-capture form used by /try-free, /proof-mockup, /pilot, /partners, /objections(contact).
 */
export function LeadCaptureForm({ leadType, submitLabel, showMessage = true, messageLabel = "Anything else we should know?" }) {
  const [form, setForm] = useState({ name: "", business_name: "", email: "", phone: "", service_type: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await axios.post(`${API}/leads`, { ...form, lead_type: leadType });
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div data-testid="lead-form-success" className="flex flex-col items-center text-center gap-3 py-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-status-complete-bg text-status-complete">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h3 className="font-display font-semibold text-lg text-navy-950">You're on the list</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Thanks, {form.name.split(" ")[0] || "there"} — our team will reach out shortly with next steps.
        </p>
      </div>
    );
  }

  return (
    <form data-testid={`lead-form-${leadType}`} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" data-testid="lead-form-name-input" required value={form.name} onChange={handleChange} placeholder="Jordan Reyes" />
        </div>
        <div>
          <Label htmlFor="business_name">Business name</Label>
          <Input id="business_name" name="business_name" data-testid="lead-form-business-input" value={form.business_name} onChange={handleChange} placeholder="Peach State Grease Services" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" name="email" data-testid="lead-form-email-input" required value={form.email} onChange={handleChange} placeholder="you@company.com" />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" data-testid="lead-form-phone-input" value={form.phone} onChange={handleChange} placeholder="(555) 555-0100" />
        </div>
      </div>
      <div>
        <Label htmlFor="service_type">Service type</Label>
        <Input id="service_type" name="service_type" data-testid="lead-form-service-input" value={form.service_type} onChange={handleChange} placeholder="Grease trap / FOG, septic, portable sanitation…" />
      </div>
      {showMessage && (
        <div>
          <Label htmlFor="message">{messageLabel}</Label>
          <Textarea id="message" name="message" data-testid="lead-form-message-input" value={form.message} onChange={handleChange} placeholder="Optional" />
        </div>
      )}
      <Button type="submit" size="lg" data-testid="lead-form-submit-btn" disabled={status === "loading"} className="mt-1">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitLabel}
      </Button>
      {status === "error" && (
        <p data-testid="lead-form-error" className="text-sm text-status-incomplete">
          Something went wrong submitting the form. Please try again.
        </p>
      )}
      <p className="text-xs text-slate-400">
        No spam. We'll only contact you about your ClearRun trial or request.
      </p>
    </form>
  );
}
