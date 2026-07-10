import {
  getPriorityRank,
  getRecurringPattern,
  getRouteExceptions,
  getRouteSummary,
  routeDefinitions,
  routeIntelligenceGuardrails,
} from "./routeIntelligenceData";
import { readCapturedRouteIssues } from "./routeIssueCaptureData";
import {
  finalStatusOptions,
  getWorkflowReadiness,
  loadIssueWorkflow,
} from "./issueResolutionWorkflow";

export const queueStateOptions = ["open", "completed", "reopened", "all"];
export const contactProgressOptions = ["Needs contact", "Attempted", "Reached", "Not needed"];
export const evidenceProgressOptions = ["Needed", "Partial", "Ready"];

const FINAL_STATUS_TO_CLOSEOUT_STATE = {
  "Ready to Close": "Ready to Close",
  "Follow-Up Complete": "Needs Review",
  Rescheduled: "Follow-Up Needed",
  "Closed Without Service": "Ready to Close",
  "Needs Billing Review": "Needs Review",
};

const READY_FINAL_STATUSES = new Set(["Ready to Close", "Closed Without Service"]);

function workflowStorageKey(issueId) {
  return `clearrun-route-issue-${issueId}`;
}

function hasSavedWorkflow(issueId, storage) {
  if (!storage) return false;
  try {
    return Boolean(storage.getItem(workflowStorageKey(issueId)));
  } catch {
    return false;
  }
}

function getContactProgress(workflow) {
  const statuses = [workflow.dispatchStatus, workflow.customerStatus];
  if (statuses.includes("Needed")) return "Needs contact";
  if (statuses.includes("Reached")) return "Reached";
  if (statuses.includes("Attempted")) return "Attempted";
  return "Not needed";
}

function getEvidenceProgress(workflow) {
  const requirements = workflow.evidenceRequirements || [];
  const confirmed = requirements.filter((item) => item.confirmed && item.source && item.confirmedAt).length;
  if (requirements.length === 0 || confirmed === requirements.length) return "Ready";
  if (confirmed > 0) return "Partial";
  return "Needed";
}

function getLatestActivity(workflow, label) {
  return (workflow.activity || []).find((item) => item.label === label) || null;
}

function resolveQueueState(workflow) {
  if (workflow.resolved) return "completed";
  if (Number(workflow.reopenedCount || 0) > 0) return "reopened";
  return "open";
}

function projectDisposalStatus(issue, workflow) {
  if (workflow.resolved && workflow.resolutionReason === "Disposal receipt matched") {
    return "Attached at route/load level";
  }
  return issue.disposalStatus;
}

function projectCloseoutState(issue, workflow) {
  if (!workflow.resolved) return issue.closeoutState;
  return FINAL_STATUS_TO_CLOSEOUT_STATE[workflow.finalStatus] || "Needs Review";
}

function projectPotentialBillingReview(issue, workflow) {
  if (!workflow.resolved) return Boolean(issue.potentiallyUnbillable);
  return workflow.finalStatus === "Needs Billing Review";
}

export function projectRouteIssue(issue, storage = typeof window !== "undefined" ? window.localStorage : null) {
  const workflow = loadIssueWorkflow(issue, storage);
  const readiness = getWorkflowReadiness(workflow);
  const queueState = resolveQueueState(workflow);
  const evidenceRequirements = workflow.evidenceRequirements || [];
  const evidenceConfirmedCount = evidenceRequirements.filter((item) => item.confirmed && item.source && item.confirmedAt).length;
  const reopenedActivity = getLatestActivity(workflow, "Issue reopened");

  return {
    ...issue,
    owner: workflow.owner || issue.owner,
    dispatchStatus: workflow.dispatchStatus,
    customerStatus: workflow.customerStatus,
    contactProgress: getContactProgress(workflow),
    evidenceProgress: getEvidenceProgress(workflow),
    evidenceConfirmedCount,
    evidenceRequirementCount: evidenceRequirements.length,
    evidenceReady: readiness.evidenceComplete,
    queueState,
    queueStateLabel: queueState === "completed" ? "Completed" : queueState === "reopened" ? "Reopened" : "Open",
    finalStatus: workflow.finalStatus || "",
    resolutionReason: workflow.resolutionReason || "",
    resolutionNote: workflow.resolutionNote || "",
    resolvedAt: workflow.resolvedAt || "",
    reopenedAt: reopenedActivity?.at || "",
    reopenedCount: Number(workflow.reopenedCount || 0),
    responseRecorded: Boolean(workflow.responseRecorded),
    workflowSaved: hasSavedWorkflow(issue.id, storage),
    workflow,
    priority: queueState === "completed" ? "Resolved" : issue.priority,
    status: queueState === "completed" ? "Completed" : queueState === "reopened" ? "Reopened" : issue.status,
    resolutionStatus: queueState === "completed"
      ? workflow.finalStatus
      : queueState === "reopened"
        ? "Reopened for follow-up"
        : issue.resolutionStatus,
    closeoutState: projectCloseoutState(issue, workflow),
    closeoutConsequence: projectCloseoutState(issue, workflow),
    disposalStatus: projectDisposalStatus(issue, workflow),
    potentiallyUnbillable: projectPotentialBillingReview(issue, workflow),
    nextAction: queueState === "completed"
      ? `${workflow.finalStatus}${workflow.resolutionReason ? ` · ${workflow.resolutionReason}` : ""}`
      : issue.nextAction,
  };
}

function compareProjectedIssues(a, b) {
  if (a.queueState !== b.queueState) {
    if (a.queueState === "reopened") return -1;
    if (b.queueState === "reopened") return 1;
    if (a.queueState === "completed") return 1;
    if (b.queueState === "completed") return -1;
  }

  if (a.queueState === "completed" && b.queueState === "completed") {
    const aTime = Date.parse(a.resolvedAt) || 0;
    const bTime = Date.parse(b.resolvedAt) || 0;
    if (aTime !== bTime) return bTime - aTime;
  }

  return getPriorityRank(a.priority) - getPriorityRank(b.priority) || Number(b.ageHours || 0) - Number(a.ageHours || 0);
}

function buildDisposalMatrix(route, completedWithoutException, issues) {
  const cleanStatuses = [...(route.readyDisposalStatuses || [])];
  while (cleanStatuses.length < completedWithoutException) cleanStatuses.push("Attached at job level");
  const statuses = [
    ...cleanStatuses.slice(0, completedWithoutException),
    ...issues.map((issue) => issue.disposalStatus),
  ];

  return routeIntelligenceGuardrails.disposalStatusOrder
    .map((status) => ({ status, count: statuses.filter((value) => value === status).length }))
    .filter((row) => row.count > 0);
}

function buildCloseoutCounts(completedWithoutException, issues) {
  const counts = Object.fromEntries(routeIntelligenceGuardrails.closeoutStateOrder.map((state) => [state, 0]));
  counts["Ready to Close"] = completedWithoutException;
  for (const issue of issues) {
    const state = issue.closeoutState || "Needs Review";
    counts[state] = Number(counts[state] || 0) + 1;
  }
  return counts;
}

function buildOutcomeCounts(completedIssues) {
  return Object.fromEntries(finalStatusOptions.map((status) => [
    status,
    completedIssues.filter((issue) => issue.finalStatus === status).length,
  ]));
}

function uniqueIssues(issues) {
  const byId = new Map();
  for (const issue of issues) byId.set(issue.id, issue);
  return [...byId.values()];
}

export function getRouteQueueProjection(routeId, storage = typeof window !== "undefined" ? window.localStorage : null) {
  const route = routeDefinitions.find((item) => item.id === routeId);
  if (!route) return null;

  const baseSummary = getRouteSummary(route.id);
  const staticIssues = getRouteExceptions(route.id);
  const capturedIssues = readCapturedRouteIssues(storage).filter((issue) => issue.routeId === route.id);
  const issues = uniqueIssues([...staticIssues, ...capturedIssues])
    .map((issue) => projectRouteIssue(issue, storage))
    .sort(compareProjectedIssues);

  const completedIssues = issues.filter((issue) => issue.queueState === "completed");
  const reopenedIssues = issues.filter((issue) => issue.queueState === "reopened");
  const unresolvedIssues = issues.filter((issue) => issue.queueState !== "completed");
  const openIssues = issues.filter((issue) => issue.queueState === "open");
  const dispatchIssues = unresolvedIssues.filter((issue) => issue.lane === "active");
  const officeIssues = unresolvedIssues.filter((issue) => issue.lane === "closeout");
  const scheduledStops = Math.max(baseSummary.scheduledStops, issues.length);
  const completedWithoutException = Math.max(0, scheduledStops - issues.length);
  const closeoutCounts = buildCloseoutCounts(completedWithoutException, issues);
  const readyToCloseRecords = Number(closeoutCounts["Ready to Close"] || 0);
  const recordsNotReady = scheduledStops - readyToCloseRecords;
  const recordedDelayMinutes = issues.reduce((total, issue) => total + Number(issue.recordedDelayMinutes || 0), 0);
  const potentiallyUnbillableStops = issues.filter((issue) => issue.potentiallyUnbillable).length;
  const primaryException = unresolvedIssues[0] || null;
  const outcomeCounts = buildOutcomeCounts(completedIssues);

  return {
    ...route,
    baseSummary,
    issues,
    openIssues,
    unresolvedIssues,
    completedIssues,
    reopenedIssues,
    dispatchIssues,
    officeIssues,
    primaryException,
    scheduledStops,
    completedWithoutException,
    completedIssueCount: completedIssues.length,
    openIssueCount: unresolvedIssues.length,
    freshOpenIssueCount: openIssues.length,
    reopenedIssueCount: reopenedIssues.length,
    capturedIssueCount: capturedIssues.length,
    readyIssueCount: completedIssues.filter((issue) => READY_FINAL_STATUSES.has(issue.finalStatus)).length,
    stopsRequiringFollowUp: dispatchIssues.length,
    recordsNotReady,
    recordedDelayMinutes,
    potentiallyUnbillableStops,
    closeoutCounts,
    outcomeCounts,
    recurringPattern: getRecurringPattern(route.id),
    disposalMatrix: buildDisposalMatrix(route, completedWithoutException, issues),
    currentRouteStatus:
      primaryException?.priority === "Resolve Now" || potentiallyUnbillableStops > 0
        ? "At Risk"
        : unresolvedIssues.length > 0 || recordsNotReady > 0
          ? "Needs Attention"
          : "Ready to Close",
  };
}

export function filterProjectedIssues(issues, filters = {}) {
  return issues
    .filter((issue) => {
      if (!filters.queueState || filters.queueState === "all") return true;
      if (filters.queueState === "open") return issue.queueState !== "completed";
      return issue.queueState === filters.queueState;
    })
    .filter((issue) => !filters.lane || filters.lane === "all" || issue.lane === filters.lane)
    .filter((issue) => !filters.owner || issue.owner === filters.owner)
    .filter((issue) => !filters.contactProgress || issue.contactProgress === filters.contactProgress)
    .filter((issue) => !filters.evidenceProgress || issue.evidenceProgress === filters.evidenceProgress)
    .filter((issue) => !filters.finalStatus || issue.finalStatus === filters.finalStatus)
    .filter((issue) => !filters.disposalStatus || issue.disposalStatus === filters.disposalStatus)
    .sort(compareProjectedIssues);
}

export function getRouteQueueOwners(issues) {
  return [...new Set(issues.map((issue) => issue.owner).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function isFinalStatusReadyToClose(finalStatus) {
  return READY_FINAL_STATUSES.has(finalStatus);
}
