import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronDown,
  ClipboardPlus,
  Clock3,
  FileText,
  Route,
  Send,
  Truck,
  UserRound,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { brand } from "@/data/mockData";
import { routeDefinitions } from "@/data/routeIntelligenceData";
import {
  createCapturedRouteIssue,
  getCaptureDefaults,
  issueGroups,
  saveCapturedRouteIssue,
  serviceResults,
  validateCapture,
} from "@/data/routeIssueCaptureData";

const quickStatusOptions = [
  { value: "not-yet", label: "Not yet" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const customerFollowUpOptions = [
  { value: "review", label: "Office should review" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

function SectionHeading({ number, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950 text-xs font-semibold text-white">
        {number}
      </span>
      <div>
        <h2 className="font-display text-xl font-semibold text-navy-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function ChoiceButton({ active, title, description, onClick, testId }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-navy-900 bg-navy-950 text-white shadow-card" : "border-slate-200 bg-white text-navy-950 hover:border-slate-300 hover:bg-offwhite"}`}
    >
      <span className="block text-sm font-semibold">{title}</span>
      {description ? (
        <span className={`mt-1 block text-xs leading-5 ${active ? "text-white/65" : "text-slate-500"}`}>{description}</span>
      ) : null}
    </button>
  );
}

function ToggleGroup({ label, value, options, onChange, testId }) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</legend>
      <div className="mt-2 grid grid-cols-3 gap-2" data-testid={testId}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${value === option.value ? "bg-navy-950 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-offwhite"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function CompletionItem({ complete, children }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${complete ? "text-status-complete" : "text-slate-300"}`} aria-hidden="true" />
      <span className={complete ? "font-semibold text-navy-950" : "text-slate-500"}>{children}</span>
    </div>
  );
}

export default function ReportRouteIssue() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(() => getCaptureDefaults(routeId));
  const [selectedGroup, setSelectedGroup] = useState("");
  const [submitError, setSubmitError] = useState("");

  const selectedRoute = routeDefinitions.find((route) => route.id === values.routeId) || routeDefinitions[0];
  const selectedIssue = useMemo(() => {
    for (const group of issueGroups) {
      const option = group.options.find((item) => item.id === values.issueOptionId);
      if (option) return { ...option, groupLabel: group.label };
    }
    return null;
  }, [values.issueOptionId]);

  const errors = validateCapture(values);
  const canSubmit = Object.keys(errors).length === 0;

  const setField = (field, value) => {
    setSubmitError("");
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleRouteChange = (event) => {
    const nextRoute = routeDefinitions.find((route) => route.id === event.target.value) || routeDefinitions[0];
    setSubmitError("");
    setValues((current) => ({
      ...current,
      routeId: nextRoute.id,
      truck: nextRoute.truck,
      driver: nextRoute.leadTechnician,
    }));
  };

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    setValues((current) => ({
      ...current,
      photoCount: files.length,
      photoNames: files.map((file) => file.name),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentErrors = validateCapture(values);
    if (Object.keys(currentErrors).length > 0) {
      setSubmitError(Object.values(currentErrors)[0]);
      return;
    }

    try {
      const issue = createCapturedRouteIssue(values);
      saveCapturedRouteIssue(issue);
      navigate(`/route-review/${issue.routeId}?reported=${issue.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "The issue could not be saved.");
    }
  };

  return (
    <Layout>
      <main className="container-page py-8 sm:py-12" data-testid="route-issue-capture-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to={`/route-review/${selectedRoute.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:underline">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to {selectedRoute.name}
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">Report a route issue</p>
            <h1 className="mobile-safe-text mt-2 max-w-4xl font-display text-4xl font-bold leading-tight text-navy-950 sm:text-5xl">
              What happened at this stop?
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Choose the problem, record the service result, and add a short note or photo. Route and driver details are already filled in.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
            <Clock3 className="h-4 w-4 text-navy-800" aria-hidden="true" /> Fast first report
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(19rem,0.7fr)]">
          <div className="space-y-6">
            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="capture-route-context">
              <SectionHeading number="1" title="Confirm the stop" description="Route, truck, and driver are filled from the selected sample route." />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Route</span>
                  <select value={values.routeId} onChange={handleRouteChange} data-testid="capture-route-select" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100">
                    {routeDefinitions.map((route) => <option key={route.id} value={route.id}>{route.name}</option>)}
                  </select>
                </label>
                <label>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer or site</span>
                  <input value={values.customer} onChange={(event) => setField("customer", event.target.value)} data-testid="capture-customer" placeholder="Example: Creekside Grill" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
                </label>
                <label>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stop or ticket number</span>
                  <input value={values.stopId} onChange={(event) => setField("stopId", event.target.value)} placeholder="Optional" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
                </label>
                <label>
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500"><Truck className="h-3.5 w-3.5" aria-hidden="true" /> Truck</span>
                  <input value={values.truck} onChange={(event) => setField("truck", event.target.value)} data-testid="capture-truck" className="mt-2 w-full rounded-xl border border-slate-200 bg-offwhite px-3 py-3 text-sm font-semibold text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
                </label>
                <label>
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500"><UserRound className="h-3.5 w-3.5" aria-hidden="true" /> Driver</span>
                  <input value={values.driver} onChange={(event) => setField("driver", event.target.value)} data-testid="capture-driver" className="mt-2 w-full rounded-xl border border-slate-200 bg-offwhite px-3 py-3 text-sm font-semibold text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
                </label>
              </div>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="capture-issue-choice">
              <SectionHeading number="2" title="Choose what happened" description="Start with the closest type, then choose the exact issue." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {issueGroups.map((group) => (
                  <ChoiceButton
                    key={group.id}
                    active={selectedGroup === group.id}
                    title={group.label}
                    description={group.description}
                    onClick={() => {
                      setSelectedGroup(group.id);
                      setField("issueOptionId", "");
                    }}
                    testId={`capture-group-${group.id}`}
                  />
                ))}
              </div>

              {selectedGroup ? (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-offwhite p-4" data-testid="capture-specific-issues">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Choose the issue</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {issueGroups.find((group) => group.id === selectedGroup)?.options.map((option) => (
                      <ChoiceButton
                        key={option.id}
                        active={values.issueOptionId === option.id}
                        title={option.label}
                        onClick={() => setField("issueOptionId", option.id)}
                        testId={`capture-issue-${option.id}`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="capture-service-result">
              <SectionHeading number="3" title="Record the service result" description="This is separate from the issue so the office knows whether the stop was completed." />
              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {serviceResults.map((result) => (
                  <ChoiceButton key={result} active={values.serviceResult === result} title={result} onClick={() => setField("serviceResult", result)} testId={`capture-result-${result.toLowerCase().replaceAll(" ", "-")}`} />
                ))}
              </div>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="capture-evidence">
              <SectionHeading number="4" title="Add a note or photo" description="At least one is required. Photo files remain in this browser demo and are not uploaded." />
              <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.55fr)]">
                <label>
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><FileText className="h-4 w-4" aria-hidden="true" /> Short note</span>
                  <textarea value={values.note} onChange={(event) => setField("note", event.target.value)} data-testid="capture-note" rows={5} placeholder="What stopped or changed the service?" className="mt-2 w-full rounded-2xl border border-slate-200 bg-offwhite p-4 text-sm leading-6 text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-offwhite p-5 text-center hover:border-navy-400 hover:bg-white">
                  <Camera className="h-7 w-7 text-navy-800" aria-hidden="true" />
                  <span className="mt-3 text-sm font-semibold text-navy-950">Add stop photos</span>
                  <span className="mt-1 text-xs leading-5 text-slate-500">Images are counted for the sample record but not uploaded or stored.</span>
                  <input type="file" accept="image/*" multiple onChange={handleFiles} data-testid="capture-photos" className="sr-only" />
                  {values.photoCount > 0 ? <span className="mt-3 rounded-full bg-status-complete-bg px-3 py-1 text-xs font-semibold text-status-complete">{values.photoCount} photo{values.photoCount === 1 ? "" : "s"} selected</span> : null}
                </label>
              </div>
            </section>

            <details className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="capture-office-details">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-navy-950">
                Add dispatch and customer details
                <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
              </summary>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <ToggleGroup label="Was dispatch contacted?" value={values.dispatchContacted} options={quickStatusOptions} onChange={(value) => setField("dispatchContacted", value)} testId="capture-dispatch-contacted" />
                <ToggleGroup label="Does the customer need follow-up?" value={values.customerFollowUp} options={customerFollowUpOptions} onChange={(value) => setField("customerFollowUp", value)} testId="capture-customer-followup" />
                <label>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delay logged in minutes</span>
                  <input type="number" min="0" value={values.delayMinutes} onChange={(event) => setField("delayMinutes", event.target.value)} placeholder="Optional" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
                </label>
                <label>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended next step</span>
                  <input value={values.recommendedAction} onChange={(event) => setField("recommendedAction", event.target.value)} placeholder="Optional — ClearRun will suggest one" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
                </label>
              </div>
            </details>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="premium-card-dark" data-testid="capture-review-card">
              <div className="flex items-center gap-2 text-white/60">
                <ClipboardPlus className="h-4 w-4" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">Before you report it</p>
              </div>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white">
                {selectedIssue ? selectedIssue.label : "Choose the issue first."}
              </h2>
              <div className="mt-6 grid gap-3">
                <CompletionItem complete={Boolean(values.customer.trim())}>Customer or site entered</CompletionItem>
                <CompletionItem complete={Boolean(values.issueOptionId)}>Issue selected</CompletionItem>
                <CompletionItem complete={Boolean(values.serviceResult)}>Service result selected</CompletionItem>
                <CompletionItem complete={Boolean(values.note.trim()) || values.photoCount > 0}>Note or photo added</CompletionItem>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Goes to</p>
                <p className="mt-2 text-sm font-semibold text-white">{selectedRoute.name}</p>
                <p className="mt-1 text-xs leading-5 text-white/60">The submitted issue will appear in Route Review and can be opened for follow-up.</p>
              </div>

              {submitError ? <p className="mt-4 rounded-xl bg-status-incomplete-bg px-3 py-2 text-xs font-semibold text-status-incomplete" role="alert">{submitError}</p> : null}

              <Button type="submit" disabled={!canSubmit} data-testid="capture-submit" className="mt-6 w-full bg-white text-navy-950 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
                <Send className="h-4 w-4" aria-hidden="true" /> Report Route Issue
              </Button>
              <p className="mt-3 text-xs leading-5 text-white/50">Sample workflow only. Nothing is sent to a customer, driver, dispatch system, or billing system.</p>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card">
              <div className="flex items-start gap-3">
                <Route className="mt-0.5 h-5 w-5 shrink-0 text-navy-800" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-xl font-semibold text-navy-950">Keep the first report short</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">The office can add follow-up, receipt review, and closeout details after the issue reaches Route Review.</p>
                </div>
              </div>
            </section>
          </aside>
        </form>

        <p className="mt-8 max-w-4xl text-xs leading-5 text-slate-500">
          {brand.disclaimer} This screen uses fictional sample routes and browser-only storage. It does not upload photos, send notifications, track GPS, reroute trucks, confirm disposal, or make final billing decisions.
        </p>
      </main>
    </Layout>
  );
}
