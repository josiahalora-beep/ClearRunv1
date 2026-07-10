import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FilePlus2,
  FileText,
  History,
  MessageSquareText,
  PhoneCall,
  RefreshCcw,
  Route,
  ShieldAlert,
  UserRoundCheck,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { brand } from "@/data/mockData";
import {
  addActivity,
  addEvidenceRecord,
  confirmEvidenceRequirement,
  contactStatusOptions,
  createInitialWorkflow,
  evidenceSourceOptions,
  finalStatusOptions,
  getFollowUpTemplates,
  getWorkflowReadiness,
  loadIssueWorkflow,
  recordResponse,
  reopenWorkflow,
  resolutionReasonOptions,
  resolveWorkflow,
  saveIssueWorkflow,
} from "@/data/issueResolutionWorkflow";

const ownerOptions = ["Dispatch", "Billing", "Route desk", "Customer service", "Operations manager"];

const statusClass = {
  Hold: "border-status-incomplete/30 bg-status-incomplete-bg text-status-incomplete",
  Review: "border-status-attention/30 bg-status-attention-bg text-status-attention",
  "Ready to Close": "border-status-complete/30 bg-status-complete-bg text-status-complete",
  "Follow-Up Complete": "border-status-complete/30 bg-status-complete-bg text-status-complete",
  Rescheduled: "border-status-review/30 bg-status-review-bg text-status-review",
  "Closed Without Service": "border-slate-200 bg-offwhite text-slate-700",
  "Needs Billing Review": "border-status-attention/30 bg-status-attention-bg text-status-attention",
};

function StatusPill({ status }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[status] || statusClass.Review}`}>
      {status}
    </span>
  );
}

function ReadinessRow({ complete, label, detail }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3">
      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${complete ? "text-white" : "text-white/30"}`} aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-white/85">{label}</p>
        <p className="mt-1 text-xs leading-5 text-white/50">{detail}</p>
      </div>
    </div>
  );
}

function DetailCell({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-offwhite p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{value || "Not recorded"}</p>
    </div>
  );
}

function ActivityTimeline({ activity }) {
  return (
    <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-exception-activity">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-navy-800" aria-hidden="true" />
        <h2 className="font-display text-xl font-semibold text-navy-950">Work history</h2>
      </div>
      <div className="mt-5 grid gap-5">
        {activity.map((item) => (
          <div key={item.id} className="relative pl-5">
            <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-navy-800" />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <p className="text-sm font-semibold text-navy-950">{item.label}</p>
              <p className="text-[11px] font-semibold text-slate-400">{item.at}</p>
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-500">{item.actor}</p>
            {item.note ? <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function RouteIssueWorkflow({ issue }) {
  const templates = useMemo(() => getFollowUpTemplates(issue), [issue]);
  const [workflow, setWorkflow] = useState(() => loadIssueWorkflow(issue));
  const readiness = getWorkflowReadiness(workflow);
  const currentStatus = workflow.resolved ? workflow.finalStatus : issue.status;

  useEffect(() => {
    saveIssueWorkflow(issue.id, workflow);
  }, [issue.id, workflow]);

  const updateOwner = (event) => {
    const owner = event.target.value;
    setWorkflow((current) => addActivity({ ...current, owner }, {
      label: `Assigned to ${owner}`,
      note: "Assignment updated in this browser sample.",
    }));
  };

  const updateContact = (field, label, value) => {
    setWorkflow((current) => addActivity({ ...current, [field]: value }, {
      label: `${label}: ${value}`,
      note: value === "Reached" ? "A response note is required before completion." : "Contact progress updated.",
    }));
  };

  const updateRequirementSource = (requirementId, source) => {
    setWorkflow((current) => ({
      ...current,
      evidenceRequirements: current.evidenceRequirements.map((item) => item.id === requirementId ? { ...item, source } : item),
    }));
  };

  const toggleRequirement = (requirement) => {
    const source = requirement.source || "Office review";
    setWorkflow((current) => confirmEvidenceRequirement(current, requirement.id, source, !requirement.confirmed));
  };

  const handleAddEvidence = () => {
    setWorkflow((current) => addEvidenceRecord(current, {
      label: current.newEvidenceLabel,
      source: current.newEvidenceSource,
      note: current.newEvidenceNote,
    }));
  };

  const changeTemplate = (templateId) => {
    const template = templates.find((item) => item.id === templateId);
    setWorkflow((current) => ({
      ...current,
      followUpTemplateId: templateId,
      followUpText: template?.text || current.followUpText,
      followUpPrepared: false,
    }));
  };

  const prepareFollowUp = () => {
    if (!workflow.followUpText.trim()) return;
    setWorkflow((current) => addActivity({ ...current, followUpPrepared: true }, {
      label: "Follow-up prepared",
      note: current.followUpText,
    }));
  };

  const handleRecordResponse = () => {
    setWorkflow((current) => recordResponse(current, current.responseNote));
  };

  const handleResolve = () => {
    setWorkflow((current) => resolveWorkflow(current));
  };

  const handleReopen = () => {
    setWorkflow((current) => reopenWorkflow(current, current.reopenReason));
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`clearrun-route-issue-${issue.id}`);
    }
    setWorkflow(createInitialWorkflow(issue));
  };

  return (
    <Layout>
      <main className="container-page py-10 sm:py-14" data-testid="route-exception-detail">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to={`/route-review/${issue.routeId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:underline">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to {issue.routeName}
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-navy-800">Route issue follow-up</p>
            <h1 className="mobile-safe-text mt-2 max-w-4xl font-display text-4xl font-bold leading-tight text-navy-950 sm:text-5xl">
              {issue.ticketId}: {issue.blocker}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Track who was contacted, confirm the ticket backup, record the response, and complete the issue with a clear final status.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={currentStatus} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {issue.ageLabel}
            </span>
            {workflow.reopenedCount > 0 ? (
              <span className="rounded-full border border-status-review/30 bg-status-review-bg px-3 py-1 text-xs font-semibold text-status-review">
                Reopened {workflow.reopenedCount} time{workflow.reopenedCount === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.28fr)_minmax(20rem,0.72fr)]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-premium border border-slate-200 bg-white shadow-editorial">
              <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                <div className="bg-ink p-6 text-white sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">What happened</p>
                  <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white">{issue.blocker}</h2>
                  <p className="mt-4 text-sm leading-6 text-white/65">{issue.impact}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Service result", issue.serviceOutcome],
                      ["Ticket status", issue.closeoutConsequence],
                      ["Delay logged", `${issue.recordedDelayMinutes} minutes`],
                      ["Customer follow-up", issue.customerNotification],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">{label}</p>
                        <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-5 sm:p-6" data-testid="route-exception-context">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Route and ticket details</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">What the office has on hand</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <DetailCell label="Customer or site" value={issue.customer} />
                    <DetailCell label="Route" value={issue.routeName} />
                    <DetailCell label="Truck" value={issue.truck} />
                    <DetailCell label="Driver" value={issue.technician} />
                    <DetailCell label="Reported" value={issue.reportedTime} />
                    <DetailCell label="Disposal receipt" value={issue.disposalStatus} />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-contact-progress">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
                  <PhoneCall className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Contact progress</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">Who has been contacted?</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Attempted contact counts as documented follow-up. Reached contact requires a response note.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <label>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned to</span>
                  <select value={workflow.owner} onChange={updateOwner} data-testid="route-exception-owner" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100">
                    {ownerOptions.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
                  </select>
                </label>
                <label>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dispatch</span>
                  <select value={workflow.dispatchStatus} onChange={(event) => updateContact("dispatchStatus", "Dispatch contact", event.target.value)} data-testid="route-dispatch-status" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100">
                    {contactStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <label>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</span>
                  <select value={workflow.customerStatus} onChange={(event) => updateContact("customerStatus", "Customer contact", event.target.value)} data-testid="route-customer-status" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100">
                    {contactStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
              </div>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="route-evidence-work">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Ticket backup</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">Confirm what supports the closeout</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Each required item records who supplied or reviewed it and when it was confirmed.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {workflow.evidenceRequirements.map((requirement) => (
                  <div key={requirement.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-offwhite p-4 sm:grid-cols-[auto_minmax(0,1fr)_12rem] sm:items-center">
                    <input type="checkbox" checked={requirement.confirmed} onChange={() => toggleRequirement(requirement)} className="h-4 w-4 rounded border-slate-300" aria-label={`Confirm ${requirement.label}`} />
                    <div>
                      <p className="text-sm font-semibold text-navy-950">{requirement.label}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{requirement.confirmed ? `Confirmed ${requirement.confirmedAt}` : "Still needed before completion"}</p>
                    </div>
                    <select value={requirement.source} onChange={(event) => updateRequirementSource(requirement.id, event.target.value)} aria-label={`Source for ${requirement.label}`} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-navy-950">
                      <option value="">Choose source</option>
                      {evidenceSourceOptions.map((source) => <option key={source} value={source}>{source}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <FilePlus2 className="h-4 w-4 text-navy-800" aria-hidden="true" />
                  <h3 className="font-display text-lg font-semibold text-navy-950">Add supporting evidence</h3>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem]">
                  <input value={workflow.newEvidenceLabel} onChange={(event) => setWorkflow((current) => ({ ...current, newEvidenceLabel: event.target.value }))} data-testid="route-new-evidence-label" placeholder="Example: gate photo, signed ticket, receipt image" className="rounded-xl border border-slate-200 bg-offwhite px-3 py-3 text-sm text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
                  <select value={workflow.newEvidenceSource} onChange={(event) => setWorkflow((current) => ({ ...current, newEvidenceSource: event.target.value }))} data-testid="route-new-evidence-source" className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-950">
                    {evidenceSourceOptions.map((source) => <option key={source} value={source}>{source}</option>)}
                  </select>
                </div>
                <textarea value={workflow.newEvidenceNote} onChange={(event) => setWorkflow((current) => ({ ...current, newEvidenceNote: event.target.value }))} rows={2} placeholder="Optional evidence note" className="mt-3 w-full rounded-xl border border-slate-200 bg-offwhite px-3 py-3 text-sm text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
                <Button type="button" variant="secondary" onClick={handleAddEvidence} disabled={!workflow.newEvidenceLabel.trim()} data-testid="route-add-evidence" className="mt-3">Add Evidence</Button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {workflow.evidenceLog.map((record) => (
                  <div key={record.id} className="rounded-2xl border border-slate-200 bg-offwhite p-4">
                    <p className="text-sm font-semibold text-navy-950">{record.label}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-600">Source: {record.source}</p>
                    <p className="mt-1 text-xs text-slate-500">{record.addedAt}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{record.note}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-editorial" data-testid="route-exception-followup">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900">
                  <MessageSquareText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Follow-up</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">Prepare the next message or office note</h2>
                </div>
              </div>
              <label className="mt-5 block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Starting template</span>
                <select value={workflow.followUpTemplateId} onChange={(event) => changeTemplate(event.target.value)} data-testid="route-followup-template" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-navy-950">
                  {templates.map((template) => <option key={template.id} value={template.id}>{template.label}</option>)}
                </select>
              </label>
              <textarea value={workflow.followUpText} onChange={(event) => setWorkflow((current) => ({ ...current, followUpText: event.target.value, followUpPrepared: false }))} rows={5} aria-label="Route issue follow-up" className="mt-3 w-full rounded-2xl border border-slate-200 bg-offwhite p-4 text-sm leading-6 text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">Preparing this text records an office action only. It does not send a real message.</p>
                <Button type="button" onClick={prepareFollowUp} disabled={!workflow.followUpText.trim()} data-testid="route-exception-followup-button">{workflow.followUpPrepared ? "Follow-Up Prepared" : "Prepare Follow-Up"}</Button>
              </div>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card" data-testid="route-response-work">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900"><UserRoundCheck className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Response</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-navy-950">Record what dispatch or the customer said</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">A response note is required when either contact status is Reached.</p>
                </div>
              </div>
              <textarea value={workflow.responseNote} onChange={(event) => setWorkflow((current) => ({ ...current, responseNote: event.target.value, responseRecorded: false }))} rows={4} data-testid="route-response-note" placeholder="Record access instructions, reschedule details, receipt clarification, or the customer response." className="mt-5 w-full rounded-2xl border border-slate-200 bg-offwhite p-4 text-sm leading-6 text-navy-950 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100" />
              <Button type="button" variant="secondary" onClick={handleRecordResponse} disabled={!workflow.responseNote.trim()} data-testid="route-record-response" className="mt-3">{workflow.responseRecorded ? "Response Recorded" : "Record Response"}</Button>
            </section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="premium-card-dark" data-testid="route-resolution-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Ready to complete?</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-white">
                {workflow.resolved ? workflow.finalStatus : readiness.ready ? "Ready for completion." : "More work is needed."}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/65">The final button stays blocked until contact, evidence, response, and resolution requirements are clear.</p>

              <div className="mt-6 grid gap-2">
                <ReadinessRow complete={readiness.ownerComplete} label="Follow-up assigned" detail="An office owner is selected." />
                <ReadinessRow complete={readiness.contactsComplete} label="Contact progress recorded" detail="Dispatch and customer statuses are no longer waiting." />
                <ReadinessRow complete={readiness.evidenceComplete} label="Required backup confirmed" detail="Every required item has a source and timestamp." />
                <ReadinessRow complete={readiness.responseComplete} label="Response requirement met" detail={readiness.responseRequired ? "A reached contact requires a recorded response." : "No reached-contact response is required."} />
                <ReadinessRow complete={readiness.resolutionComplete} label="Final outcome selected" detail="Choose a resolution reason and final ticket status." />
              </div>

              {!workflow.resolved ? (
                <div className="mt-6 grid gap-3">
                  <label>
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/55">Resolution reason</span>
                    <select value={workflow.resolutionReason} onChange={(event) => setWorkflow((current) => ({ ...current, resolutionReason: event.target.value }))} data-testid="route-resolution-reason" className="mt-2 w-full rounded-xl border border-white/15 bg-white px-3 py-3 text-sm font-semibold text-navy-950">
                      <option value="">Choose reason</option>
                      {resolutionReasonOptions.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
                    </select>
                  </label>
                  <label>
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/55">Final ticket status</span>
                    <select value={workflow.finalStatus} onChange={(event) => setWorkflow((current) => ({ ...current, finalStatus: event.target.value }))} data-testid="route-final-status" className="mt-2 w-full rounded-xl border border-white/15 bg-white px-3 py-3 text-sm font-semibold text-navy-950">
                      <option value="">Choose status</option>
                      {finalStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </label>
                  <textarea value={workflow.resolutionNote} onChange={(event) => setWorkflow((current) => ({ ...current, resolutionNote: event.target.value }))} rows={3} placeholder="Optional completion note" className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/40" />
                  <Button type="button" onClick={handleResolve} disabled={!readiness.ready} data-testid="route-exception-release-button" className="w-full bg-white text-navy-950 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">Complete Issue</Button>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-sm font-semibold text-white">Completed {workflow.resolvedAt}</p>
                  <p className="mt-2 text-xs leading-5 text-white/60">{workflow.resolutionReason}{workflow.resolutionNote ? ` · ${workflow.resolutionNote}` : ""}</p>
                  <label className="mt-4 block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/55">Why reopen it?</span>
                    <textarea value={workflow.reopenReason} onChange={(event) => setWorkflow((current) => ({ ...current, reopenReason: event.target.value }))} rows={2} data-testid="route-reopen-reason" className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-white/35" placeholder="Describe what changed or what is missing." />
                  </label>
                  <Button type="button" variant="outline" onClick={handleReopen} disabled={!workflow.reopenReason.trim()} data-testid="route-reopen-button" className="mt-3 w-full border-white/25 text-white hover:bg-white hover:text-navy-950"><RefreshCcw className="h-4 w-4" aria-hidden="true" /> Reopen Issue</Button>
                </div>
              )}

              <button type="button" onClick={handleReset} className="mt-4 w-full text-xs font-semibold text-white/55 hover:text-white">Reset browser sample</button>
            </section>

            <section className="rounded-premium border border-slate-200 bg-white p-5 shadow-card">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-status-attention" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Billing note</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-navy-950">{issue.billingSupport}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">The billing team still makes the final billing decision.</p>
                </div>
              </div>
            </section>

            <ActivityTimeline activity={workflow.activity} />
          </aside>
        </div>

        <p className="mt-8 max-w-4xl text-xs leading-5 text-slate-500">
          {brand.disclaimer} This screen uses fictional sample data and browser-only state. Prepared follow-up is not sent, evidence is not uploaded, and ClearRun does not reroute trucks, confirm disposal, or make final billing decisions.
        </p>
      </main>
    </Layout>
  );
}
