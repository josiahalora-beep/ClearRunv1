import { getPriorityRank, routeDefinitions } from "./routeIntelligenceData";

export const CAPTURE_STORAGE_KEY = "clearrun-captured-route-issues";

export const issueGroups = [
  {
    id: "access",
    label: "Access problem",
    description: "The driver could not safely or physically reach the service area.",
    options: [
      { id: "locked-gate", label: "Cannot access service area" },
      { id: "customer-unavailable", label: "Customer unavailable" },
      { id: "unsafe-access", label: "Unsafe access condition" },
      { id: "blocked-alley", label: "Alley or service area blocked" },
      { id: "trap-covered", label: "Trap covered or buried" },
    ],
  },
  {
    id: "service",
    label: "Service problem",
    description: "The planned service could not be completed as expected.",
    options: [
      { id: "could-not-finish", label: "Could not finish service" },
      { id: "capacity-needed", label: "More truck capacity needed" },
      { id: "equipment-problem", label: "Equipment problem" },
      { id: "wrong-interceptor", label: "Wrong trap or interceptor" },
      { id: "additional-service", label: "Additional service needed" },
    ],
  },
  {
    id: "ticket-backup",
    label: "Ticket backup problem",
    description: "The service is complete, but the ticket backup is missing or unclear.",
    options: [
      { id: "missing-signature", label: "Missing signature" },
      { id: "missing-photo", label: "Missing or weak photo" },
      { id: "missing-gallons", label: "Gallons missing" },
      { id: "unclear-notes", label: "Service notes unclear" },
      { id: "missing-timestamp", label: "Timestamp missing" },
    ],
  },
  {
    id: "disposal-receipt",
    label: "Disposal receipt problem",
    description: "The receipt is missing, delayed, or does not clearly match the route or load.",
    options: [
      { id: "receipt-missing", label: "Disposal receipt missing" },
      { id: "receipt-unmatched", label: "Receipt needs matching" },
      { id: "disposal-delay", label: "Disposal delay reported" },
      { id: "destination-changed", label: "Disposal destination changed" },
      { id: "quantity-review", label: "Receipt quantity needs review" },
    ],
  },
  {
    id: "customer-billing",
    label: "Customer or billing problem",
    description: "The office needs to resolve a customer, rescheduling, or billing question.",
    options: [
      { id: "customer-dispute", label: "Customer disputes service" },
      { id: "billing-review", label: "Billing review needed" },
      { id: "customer-notification", label: "Customer notification needed" },
      { id: "reschedule-needed", label: "Stop needs rescheduling" },
      { id: "office-approval", label: "Office approval needed" },
    ],
  },
];

export const serviceResults = [
  "Completed",
  "Completed with missing backup",
  "Partially completed",
  "Not completed",
  "Rescheduled",
  "Customer cancelled",
  "Needs office review",
];

const optionRules = {
  "locked-gate": {
    lane: "active",
    type: "Access",
    priority: "Resolve Now",
    owner: "Dispatch",
    nextAction: "Contact the site, confirm access instructions, and decide whether the stop can be completed today.",
    releaseCondition: "Access plan or reschedule decision recorded",
    disposalStatus: "Office review required",
  },
  "customer-unavailable": {
    lane: "active",
    type: "Access",
    priority: "Same-Day Follow-Up",
    owner: "Customer service",
    nextAction: "Contact the customer and confirm access or a replacement service window.",
    releaseCondition: "Customer response and service plan recorded",
    disposalStatus: "Office review required",
  },
  "unsafe-access": {
    lane: "active",
    type: "Access",
    priority: "Resolve Now",
    owner: "Operations manager",
    nextAction: "Review the site condition and confirm a safe service plan before returning.",
    releaseCondition: "Safety follow-up and next service plan recorded",
    disposalStatus: "Office review required",
  },
  "blocked-alley": {
    lane: "active",
    type: "Access",
    priority: "Resolve Now",
    owner: "Dispatch",
    nextAction: "Contact the site and confirm when the service area will be clear.",
    releaseCondition: "Access time or reschedule decision recorded",
    disposalStatus: "Office review required",
  },
  "trap-covered": {
    lane: "active",
    type: "Access",
    priority: "Same-Day Follow-Up",
    owner: "Dispatch",
    nextAction: "Notify the site that the trap must be accessible before service can continue.",
    releaseCondition: "Site preparation or reschedule decision recorded",
    disposalStatus: "Office review required",
  },
  "could-not-finish": {
    lane: "active",
    type: "Service",
    priority: "Same-Day Follow-Up",
    owner: "Dispatch",
    nextAction: "Review the driver note and schedule the remaining service work.",
    releaseCondition: "Completion plan and service disposition recorded",
    disposalStatus: "Office review required",
  },
  "capacity-needed": {
    lane: "active",
    type: "Service",
    priority: "Same-Day Follow-Up",
    owner: "Dispatch",
    nextAction: "Confirm available truck capacity and schedule the remaining volume.",
    releaseCondition: "Capacity plan and completion service recorded",
    disposalStatus: "Attached at route/load level",
  },
  "equipment-problem": {
    lane: "active",
    type: "Service",
    priority: "Resolve Now",
    owner: "Operations manager",
    nextAction: "Confirm the equipment problem and decide whether another truck or return visit is needed.",
    releaseCondition: "Equipment disposition and service plan recorded",
    disposalStatus: "Office review required",
  },
  "wrong-interceptor": {
    lane: "active",
    type: "Service",
    priority: "Same-Day Follow-Up",
    owner: "Route desk",
    nextAction: "Confirm the correct service location and update the site instructions.",
    releaseCondition: "Correct service point and next action recorded",
    disposalStatus: "Office review required",
  },
  "additional-service": {
    lane: "active",
    type: "Service",
    priority: "Same-Day Follow-Up",
    owner: "Customer service",
    nextAction: "Contact the customer and confirm the additional work and service plan.",
    releaseCondition: "Customer approval or service disposition recorded",
    disposalStatus: "Office review required",
  },
  "missing-signature": {
    lane: "closeout",
    type: "Ticket backup",
    priority: "Closeout Blocked",
    owner: "Route desk",
    nextAction: "Ask the driver to recover the signature or record why it is unavailable.",
    releaseCondition: "Signature attached or missing-signature note approved",
    disposalStatus: "Attached at job level",
  },
  "missing-photo": {
    lane: "closeout",
    type: "Ticket backup",
    priority: "Proof Recovery",
    owner: "Route desk",
    nextAction: "Request a usable stop photo or record why a replacement is unavailable.",
    releaseCondition: "Usable photo attached or missing-photo note approved",
    disposalStatus: "Attached at job level",
  },
  "missing-gallons": {
    lane: "closeout",
    type: "Ticket backup",
    priority: "Invoice Support Needed",
    owner: "Billing",
    nextAction: "Ask the driver to confirm the service quantity before billing review.",
    releaseCondition: "Gallons confirmed and recorded",
    disposalStatus: "Office review required",
  },
  "unclear-notes": {
    lane: "closeout",
    type: "Ticket backup",
    priority: "Internal Review",
    owner: "Route desk",
    nextAction: "Clarify what work was completed and update the service note.",
    releaseCondition: "Clear service note recorded",
    disposalStatus: "Attached at job level",
  },
  "missing-timestamp": {
    lane: "closeout",
    type: "Ticket backup",
    priority: "Internal Review",
    owner: "Route desk",
    nextAction: "Confirm the service time from available route records and update the ticket.",
    releaseCondition: "Service time confirmed or missing-time note approved",
    disposalStatus: "Attached at job level",
  },
  "receipt-missing": {
    lane: "closeout",
    type: "Disposal receipt",
    priority: "Closeout Blocked",
    owner: "Billing",
    nextAction: "Locate the route/load receipt or record the approved missing-receipt note.",
    releaseCondition: "Receipt attached or missing-receipt note approved",
    disposalStatus: "Missing",
  },
  "receipt-unmatched": {
    lane: "closeout",
    type: "Disposal receipt",
    priority: "Invoice Support Needed",
    owner: "Billing",
    nextAction: "Compare the receipt time, route/load, and recorded gallons.",
    releaseCondition: "Receipt relationship reviewed and recorded",
    disposalStatus: "Receipt present but unmatched",
  },
  "disposal-delay": {
    lane: "active",
    type: "Disposal receipt",
    priority: "Same-Day Follow-Up",
    owner: "Dispatch",
    nextAction: "Record the reported delay and review the remaining route commitments.",
    releaseCondition: "Delay and route plan recorded",
    disposalStatus: "Office review required",
  },
  "destination-changed": {
    lane: "active",
    type: "Disposal receipt",
    priority: "Same-Day Follow-Up",
    owner: "Dispatch",
    nextAction: "Record the destination change and confirm which receipt should support the load.",
    releaseCondition: "Destination and receipt plan recorded",
    disposalStatus: "Office review required",
  },
  "quantity-review": {
    lane: "closeout",
    type: "Disposal receipt",
    priority: "Invoice Support Needed",
    owner: "Billing",
    nextAction: "Compare the receipt quantity with the route/load and service tickets.",
    releaseCondition: "Quantity relationship reviewed and recorded",
    disposalStatus: "Receipt present but unmatched",
  },
  "customer-dispute": {
    lane: "closeout",
    type: "Customer",
    priority: "Customer Response Needed",
    owner: "Customer service",
    nextAction: "Review the ticket backup and prepare a response for the customer.",
    releaseCondition: "Customer response and office disposition recorded",
    disposalStatus: "Attached at job level",
  },
  "billing-review": {
    lane: "closeout",
    type: "Billing",
    priority: "Invoice Support Needed",
    owner: "Billing",
    nextAction: "Review the ticket backup and confirm whether the record supports billing.",
    releaseCondition: "Billing review disposition recorded",
    disposalStatus: "Office review required",
  },
  "customer-notification": {
    lane: "active",
    type: "Customer",
    priority: "Same-Day Follow-Up",
    owner: "Customer service",
    nextAction: "Contact the customer with the service update and record the response.",
    releaseCondition: "Customer contact and next service step recorded",
    disposalStatus: "Office review required",
  },
  "reschedule-needed": {
    lane: "active",
    type: "Customer",
    priority: "Same-Day Follow-Up",
    owner: "Dispatch",
    nextAction: "Confirm a replacement service window and update the route plan.",
    releaseCondition: "New service window recorded",
    disposalStatus: "Office review required",
  },
  "office-approval": {
    lane: "closeout",
    type: "Billing",
    priority: "Internal Review",
    owner: "Operations manager",
    nextAction: "Review the ticket and record the office approval or required correction.",
    releaseCondition: "Office decision recorded",
    disposalStatus: "Office review required",
  },
};

const activeResults = new Set(["Partially completed", "Not completed", "Rescheduled", "Customer cancelled"]);

function getIssueOption(optionId) {
  for (const group of issueGroups) {
    const option = group.options.find((item) => item.id === optionId);
    if (option) return { ...option, groupId: group.id, groupLabel: group.label };
  }
  return null;
}

export function validateCapture(values) {
  const errors = {};
  if (!values.routeId) errors.routeId = "Choose a route.";
  if (!values.customer?.trim()) errors.customer = "Enter the customer or site.";
  if (!values.issueOptionId) errors.issueOptionId = "Choose what happened.";
  if (!values.serviceResult) errors.serviceResult = "Choose the service result.";
  if (!values.note?.trim() && Number(values.photoCount || 0) < 1) {
    errors.evidence = "Add a short note or at least one photo.";
  }
  return errors;
}

export function createCapturedRouteIssue(values, now = new Date()) {
  const errors = validateCapture(values);
  if (Object.keys(errors).length > 0) {
    throw new Error(Object.values(errors)[0]);
  }

  const route = routeDefinitions.find((item) => item.id === values.routeId) || routeDefinitions[0];
  const option = getIssueOption(values.issueOptionId);
  const rule = optionRules[values.issueOptionId];
  const lane = activeResults.has(values.serviceResult) ? "active" : rule.lane;
  const priority = lane === "active" && rule.priority === "Internal Review" ? "Same-Day Follow-Up" : rule.priority;
  const reportedTime = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const dateStamp = now.toISOString().slice(0, 10);
  const id = `CAP-${now.getTime()}`;
  const evidenceParts = [];
  if (Number(values.photoCount || 0) > 0) evidenceParts.push(`${values.photoCount} photo${Number(values.photoCount) === 1 ? "" : "s"}`);
  if (values.note?.trim()) evidenceParts.push("driver note");

  return {
    id,
    recordId: null,
    stopId: values.stopId?.trim() || `${route.id.toUpperCase().slice(0, 8)}-${now.getTime().toString().slice(-4)}`,
    ticketId: `NEW-${now.getTime().toString().slice(-5)}`,
    customer: values.customer.trim(),
    routeId: route.id,
    routeName: route.name,
    truck: values.truck?.trim() || route.truck,
    technician: values.driver?.trim() || route.leadTechnician,
    serviceType: values.serviceType?.trim() || "FOG / liquid-waste service",
    serviceDate: dateStamp,
    reportedTime,
    lane,
    exceptionType: rule.type,
    issueGroup: option.groupLabel,
    issueOptionId: option.id,
    blocker: option.label,
    priority,
    priorityRank: getPriorityRank(priority),
    status: priority === "Resolve Now" || priority === "Closeout Blocked" ? "Hold" : "Review",
    resolutionStatus: lane === "active" ? "Needs follow-up" : "Needs office review",
    serviceOutcome: values.serviceResult,
    owner: rule.owner,
    ageLabel: "Just now",
    ageHours: 0,
    impact: lane === "active" ? "Route or customer follow-up is still needed" : "Ticket is not ready to close",
    evidenceSummary: evidenceParts.join(" + "),
    note: values.note?.trim() || "Photo added without a note.",
    nextAction: values.recommendedAction?.trim() || rule.nextAction,
    releaseCondition: rule.releaseCondition,
    billingSupport: lane === "active" ? "Review after service decision" : "Office review needed",
    customerProof: lane === "active" ? "Service update may be needed" : "Not ready",
    customerNotification: values.customerFollowUp === "yes" ? "Needed" : values.customerFollowUp === "no" ? "Not required" : "Needs review",
    dispatchContacted: values.dispatchContacted || "not-yet",
    recordedDelayMinutes: Number(values.delayMinutes || 0),
    closeoutConsequence: lane === "active" ? (values.serviceResult === "Not completed" ? "Service Not Completed" : "Follow-Up Needed") : "Needs Review",
    closeoutState: lane === "active" ? (values.serviceResult === "Not completed" ? "Service Not Completed" : "Follow-Up Needed") : "Needs Review",
    potentiallyUnbillable: values.serviceResult === "Not completed",
    disposalStatus: rule.disposalStatus,
    proofNeeded: [rule.releaseCondition],
    estimatedMinutesSaved: 0,
    source: "browser-demo-capture",
  };
}

export function readCapturedRouteIssues(storage = typeof window !== "undefined" ? window.localStorage : null) {
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(CAPTURE_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCapturedRouteIssue(issue, storage = typeof window !== "undefined" ? window.localStorage : null) {
  if (!storage) return [];
  const current = readCapturedRouteIssues(storage);
  const next = [issue, ...current.filter((item) => item.id !== issue.id)].slice(0, 25);
  storage.setItem(CAPTURE_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function getCaptureDefaults(routeId) {
  const route = routeDefinitions.find((item) => item.id === routeId) || routeDefinitions[0];
  return {
    routeId: route.id,
    customer: "",
    truck: route.truck,
    driver: route.leadTechnician,
    serviceType: "Grease trap / FOG service",
    stopId: "",
    issueOptionId: "",
    serviceResult: "",
    note: "",
    photoCount: 0,
    photoNames: [],
    dispatchContacted: "not-yet",
    customerFollowUp: "review",
    delayMinutes: "",
    recommendedAction: "",
  };
}
