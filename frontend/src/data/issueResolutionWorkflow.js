export const contactStatusOptions = ["Not Needed", "Needed", "Attempted", "Reached"];

export const evidenceSourceOptions = [
  "Driver",
  "Dispatch",
  "Customer",
  "Route desk",
  "Billing",
  "Disposal receipt",
  "Office review",
];

export const finalStatusOptions = [
  "Ready to Close",
  "Follow-Up Complete",
  "Rescheduled",
  "Closed Without Service",
  "Needs Billing Review",
];

export const resolutionReasonOptions = [
  "Access instructions confirmed",
  "Customer response recorded",
  "Service rescheduled",
  "Remaining service completed",
  "Missing ticket backup received",
  "Missing backup disposition approved",
  "Disposal receipt matched",
  "Billing review completed",
  "Customer dispute resolved",
  "Office approval recorded",
  "Closed without service",
  "Other",
];

function normalizeIssueType(issue) {
  return `${issue.exceptionType || issue.issueGroup || ""} ${issue.blocker || ""}`.toLowerCase();
}

export function getFollowUpTemplates(issue) {
  const type = normalizeIssueType(issue);
  const customer = issue.customer || "the customer";
  const ticket = issue.ticketId || "the service ticket";

  if (type.includes("access") || type.includes("gate") || type.includes("blocked") || type.includes("customer unavailable")) {
    return [
      {
        id: "access-customer",
        label: "Customer access request",
        text: `We could not complete service at ${customer} because the service area was not accessible. Please confirm the access instructions and the best time for our team to return.`,
      },
      {
        id: "access-dispatch",
        label: "Dispatch follow-up",
        text: `Confirm access instructions for ${customer}, document the next service window, and update the route issue before closeout.`,
      },
    ];
  }

  if (type.includes("service") || type.includes("capacity") || type.includes("equipment")) {
    return [
      {
        id: "service-customer",
        label: "Service completion update",
        text: `Service at ${customer} could not be completed as planned. Please confirm the next available service window so the remaining work can be scheduled.`,
      },
      {
        id: "service-dispatch",
        label: "Dispatch completion plan",
        text: `Review the reported service issue for ${customer}, confirm the remaining work, and record the completion plan.`,
      },
    ];
  }

  if (type.includes("receipt") || type.includes("disposal") || type.includes("gallon")) {
    return [
      {
        id: "receipt-office",
        label: "Receipt review request",
        text: `Review ${ticket} against the route/load receipt, reported gallons, and receipt timestamp. Record whether the receipt supports the ticket before closeout.`,
      },
      {
        id: "receipt-driver",
        label: "Driver receipt request",
        text: `Please confirm which disposal receipt supports ${ticket} and provide any missing route/load or gallon details.`,
      },
    ];
  }

  if (type.includes("proof") || type.includes("ticket backup") || type.includes("signature") || type.includes("photo") || type.includes("timestamp")) {
    return [
      {
        id: "backup-driver",
        label: "Missing ticket backup request",
        text: `Please provide the missing backup for ${ticket} at ${customer}, or record why it cannot be recovered.`,
      },
      {
        id: "backup-office",
        label: "Office backup review",
        text: `Review the available backup for ${ticket}, confirm what is still missing, and record the approved closeout disposition.`,
      },
    ];
  }

  if (type.includes("customer") || type.includes("commercial") || type.includes("billing")) {
    return [
      {
        id: "customer-response",
        label: "Customer response",
        text: `We are reviewing the service record for ${customer}. We will confirm the service details and next step after the office review is complete.`,
      },
      {
        id: "billing-review",
        label: "Billing review request",
        text: `Review ${ticket} and its available backup before billing. Record the office decision and any customer follow-up required.`,
      },
    ];
  }

  return [
    {
      id: "general-followup",
      label: "General follow-up",
      text: issue.nextAction || `Review ${ticket}, record the next step, and update the issue before closeout.`,
    },
  ];
}

function getInitialDispatchStatus(issue) {
  const value = `${issue.dispatchContacted || ""}`.toLowerCase();
  if (value === "yes") return "Reached";
  if (value === "no") return "Not Needed";
  if (issue.lane === "active" || issue.owner === "Dispatch") return "Needed";
  return "Not Needed";
}

function getInitialCustomerStatus(issue) {
  const value = `${issue.customerNotification || ""}`.toLowerCase();
  if (value.includes("not required")) return "Not Needed";
  if (value.includes("attempted")) return "Attempted";
  if (value.includes("reached") || value.includes("sent")) return "Reached";
  if (value.includes("needed") || value.includes("not sent") || value.includes("review")) return "Needed";
  return issue.lane === "active" ? "Needed" : "Not Needed";
}

function createEvidenceRequirements(issue) {
  return (issue.proofNeeded || []).map((label, index) => ({
    id: `required-${index + 1}`,
    label,
    confirmed: false,
    source: "",
    confirmedAt: "",
  }));
}

function createInitialEvidenceLog(issue) {
  if (!issue.evidenceSummary) return [];
  return [
    {
      id: "initial-report",
      label: issue.evidenceSummary,
      source: "Initial report",
      addedAt: issue.reportedTime || "Reported with issue",
      note: issue.note || "Available when the issue was reported.",
    },
  ];
}

export function createInitialWorkflow(issue) {
  const templates = getFollowUpTemplates(issue);
  return {
    version: 2,
    owner: issue.owner || "Dispatch",
    dispatchStatus: getInitialDispatchStatus(issue),
    customerStatus: getInitialCustomerStatus(issue),
    evidenceRequirements: createEvidenceRequirements(issue),
    evidenceLog: createInitialEvidenceLog(issue),
    newEvidenceLabel: "",
    newEvidenceSource: "Driver",
    newEvidenceNote: "",
    followUpTemplateId: templates[0]?.id || "",
    followUpText: templates[0]?.text || issue.nextAction || "",
    followUpPrepared: false,
    responseNote: "",
    responseRecorded: false,
    resolutionReason: "",
    finalStatus: "",
    resolutionNote: "",
    resolved: false,
    resolvedAt: "",
    reopenedCount: 0,
    reopenReason: "",
    activity: [
      {
        id: "reported",
        at: issue.reportedTime || "Reported",
        actor: issue.technician || "Field team",
        label: "Issue reported",
        note: issue.blocker,
      },
      {
        id: "assigned",
        at: issue.reportedTime || "Reported",
        actor: "ClearRun sample",
        label: `Assigned to ${issue.owner || "Dispatch"}`,
        note: issue.resolutionStatus || "Follow-up is waiting.",
      },
    ],
  };
}

function mergeLegacyState(issue, saved) {
  const initial = createInitialWorkflow(issue);
  if (!saved || typeof saved !== "object") return initial;

  if (saved.version === 2) {
    return {
      ...initial,
      ...saved,
      evidenceRequirements: Array.isArray(saved.evidenceRequirements) ? saved.evidenceRequirements : initial.evidenceRequirements,
      evidenceLog: Array.isArray(saved.evidenceLog) ? saved.evidenceLog : initial.evidenceLog,
      activity: Array.isArray(saved.activity) ? saved.activity : initial.activity,
    };
  }

  const migratedRequirements = initial.evidenceRequirements.map((item) => ({
    ...item,
    confirmed: Boolean(saved.proofChecks?.[item.label]),
    source: saved.proofChecks?.[item.label] ? "Office review" : "",
    confirmedAt: saved.proofChecks?.[item.label] ? "Migrated browser state" : "",
  }));

  return {
    ...initial,
    owner: saved.owner || initial.owner,
    evidenceRequirements: migratedRequirements,
    followUpText: saved.followUpText || initial.followUpText,
    followUpPrepared: Boolean(saved.followUpPrepared),
    resolved: Boolean(saved.released),
    finalStatus: saved.released ? "Ready to Close" : "",
    resolutionReason: saved.released ? "Office approval recorded" : "",
    resolvedAt: saved.released ? "Migrated browser state" : "",
    activity: Array.isArray(saved.activity) ? saved.activity.map((item) => ({
      ...item,
      at: item.at || "Prior browser state",
      actor: item.actor || "Office user",
    })) : initial.activity,
  };
}

export function loadIssueWorkflow(issue, storage = typeof window !== "undefined" ? window.localStorage : null) {
  if (!storage) return createInitialWorkflow(issue);
  try {
    const saved = JSON.parse(storage.getItem(`clearrun-route-issue-${issue.id}`) || "null");
    return mergeLegacyState(issue, saved);
  } catch {
    return createInitialWorkflow(issue);
  }
}

export function saveIssueWorkflow(issueId, workflow, storage = typeof window !== "undefined" ? window.localStorage : null) {
  if (!storage) return workflow;
  storage.setItem(`clearrun-route-issue-${issueId}`, JSON.stringify(workflow));
  return workflow;
}

export function getWorkflowReadiness(workflow) {
  const ownerComplete = Boolean(workflow.owner);
  const dispatchComplete = ["Not Needed", "Attempted", "Reached"].includes(workflow.dispatchStatus);
  const customerComplete = ["Not Needed", "Attempted", "Reached"].includes(workflow.customerStatus);
  const evidenceComplete = workflow.evidenceRequirements.every((item) => item.confirmed && item.source && item.confirmedAt);
  const responseRequired = workflow.dispatchStatus === "Reached" || workflow.customerStatus === "Reached";
  const responseComplete = !responseRequired || workflow.responseRecorded;
  const resolutionComplete = Boolean(workflow.resolutionReason && workflow.finalStatus);

  return {
    ownerComplete,
    dispatchComplete,
    customerComplete,
    contactsComplete: dispatchComplete && customerComplete,
    evidenceComplete,
    responseRequired,
    responseComplete,
    resolutionComplete,
    ready: ownerComplete && dispatchComplete && customerComplete && evidenceComplete && responseComplete && resolutionComplete && !workflow.resolved,
  };
}

export function addActivity(workflow, event) {
  return {
    ...workflow,
    activity: [
      {
        id: event.id || `${Date.now()}-${event.label}`,
        at: event.at || new Date().toLocaleString(),
        actor: event.actor || "Office user",
        label: event.label,
        note: event.note || "",
      },
      ...workflow.activity,
    ],
  };
}

export function confirmEvidenceRequirement(workflow, requirementId, source, confirmed, at = new Date().toLocaleString()) {
  const requirement = workflow.evidenceRequirements.find((item) => item.id === requirementId);
  const next = {
    ...workflow,
    evidenceRequirements: workflow.evidenceRequirements.map((item) => item.id === requirementId ? {
      ...item,
      confirmed,
      source: confirmed ? source : "",
      confirmedAt: confirmed ? at : "",
    } : item),
  };

  if (!requirement) return next;
  return addActivity(next, {
    at,
    label: confirmed ? `${requirement.label} confirmed` : `${requirement.label} reopened`,
    note: confirmed ? `Source: ${source}.` : "This closeout item needs review again.",
  });
}

export function addEvidenceRecord(workflow, record, at = new Date().toLocaleString()) {
  if (!record.label?.trim() || !record.source?.trim()) return workflow;
  const evidence = {
    id: `evidence-${Date.now()}`,
    label: record.label.trim(),
    source: record.source.trim(),
    note: record.note?.trim() || "No additional note.",
    addedAt: at,
  };
  return addActivity({
    ...workflow,
    evidenceLog: [evidence, ...workflow.evidenceLog],
    newEvidenceLabel: "",
    newEvidenceNote: "",
  }, {
    at,
    label: "Evidence added",
    note: `${evidence.label} · Source: ${evidence.source}`,
  });
}

export function recordResponse(workflow, note, at = new Date().toLocaleString()) {
  if (!note?.trim()) return workflow;
  return addActivity({
    ...workflow,
    responseNote: note.trim(),
    responseRecorded: true,
  }, {
    at,
    label: "Response recorded",
    note: note.trim(),
  });
}

export function resolveWorkflow(workflow, at = new Date().toLocaleString()) {
  const readiness = getWorkflowReadiness(workflow);
  if (!readiness.ready) return workflow;
  return addActivity({
    ...workflow,
    resolved: true,
    resolvedAt: at,
    reopenReason: "",
  }, {
    at,
    label: `Issue completed — ${workflow.finalStatus}`,
    note: `${workflow.resolutionReason}${workflow.resolutionNote ? ` · ${workflow.resolutionNote}` : ""}`,
  });
}

export function reopenWorkflow(workflow, reason, at = new Date().toLocaleString()) {
  if (!workflow.resolved || !reason?.trim()) return workflow;
  const previousStatus = workflow.finalStatus;
  return addActivity({
    ...workflow,
    resolved: false,
    resolvedAt: "",
    reopenedCount: Number(workflow.reopenedCount || 0) + 1,
    reopenReason: "",
    finalStatus: "",
    resolutionReason: "",
    resolutionNote: "",
    responseRecorded: false,
    responseNote: "",
  }, {
    at,
    label: "Issue reopened",
    note: `${reason.trim()} · Previous status: ${previousStatus}`,
  });
}
