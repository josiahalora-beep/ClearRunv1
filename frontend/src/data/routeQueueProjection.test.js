import { routeIntelligenceExceptions } from "./routeIntelligenceData";
import {
  createCapturedRouteIssue,
  saveCapturedRouteIssue,
} from "./routeIssueCaptureData";
import {
  confirmEvidenceRequirement,
  createInitialWorkflow,
  reopenWorkflow,
  resolveWorkflow,
  saveIssueWorkflow,
} from "./issueResolutionWorkflow";
import {
  filterProjectedIssues,
  getRouteQueueProjection,
  isFinalStatusReadyToClose,
  projectRouteIssue,
} from "./routeQueueProjection";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
  };
}

function completeWorkflow(issue, finalStatus, resolutionReason, storage, at = "July 10, 2026, 1:00 PM") {
  let workflow = createInitialWorkflow(issue);
  workflow = {
    ...workflow,
    dispatchStatus: workflow.dispatchStatus === "Needed" ? "Attempted" : workflow.dispatchStatus,
    customerStatus: workflow.customerStatus === "Needed" ? "Attempted" : workflow.customerStatus,
    finalStatus,
    resolutionReason,
  };

  for (const requirement of workflow.evidenceRequirements) {
    workflow = confirmEvidenceRequirement(workflow, requirement.id, "Office review", true, at);
  }

  workflow = resolveWorkflow(workflow, at);
  saveIssueWorkflow(issue.id, workflow, storage);
  return workflow;
}

const routeId = "warner-robins-route-b";
const signatureIssue = routeIntelligenceExceptions.find((issue) => issue.id === "EX-2103");
const rescheduleIssue = routeIntelligenceExceptions.find((issue) => issue.id === "EX-2102");
const receiptIssue = routeIntelligenceExceptions.find((issue) => issue.id === "EX-2104");

describe("route queue projection", () => {
  test("baseline route totals reconcile before workflow changes", () => {
    const projection = getRouteQueueProjection(routeId, memoryStorage());
    const closeoutTotal = Object.values(projection.closeoutCounts).reduce((total, count) => total + count, 0);
    const receiptTotal = projection.disposalMatrix.reduce((total, row) => total + row.count, 0);

    expect(projection.scheduledStops).toBe(14);
    expect(projection.completedWithoutException).toBe(10);
    expect(projection.openIssueCount).toBe(4);
    expect(projection.completedIssueCount).toBe(0);
    expect(projection.reopenedIssueCount).toBe(0);
    expect(projection.recordsNotReady).toBe(4);
    expect(closeoutTotal).toBe(projection.scheduledStops);
    expect(receiptTotal).toBe(projection.scheduledStops);
  });

  test("ready-to-close completion leaves the open queue and changes route closeout totals", () => {
    const storage = memoryStorage();
    completeWorkflow(signatureIssue, "Ready to Close", "Missing ticket backup received", storage);

    const projection = getRouteQueueProjection(routeId, storage);
    const completed = projection.completedIssues[0];

    expect(projection.openIssueCount).toBe(3);
    expect(projection.officeIssues).toHaveLength(1);
    expect(projection.completedIssueCount).toBe(1);
    expect(projection.recordsNotReady).toBe(3);
    expect(projection.closeoutCounts["Ready to Close"]).toBe(11);
    expect(completed.id).toBe("EX-2103");
    expect(completed.queueState).toBe("completed");
    expect(completed.finalStatus).toBe("Ready to Close");
    expect(completed.priority).toBe("Resolved");
  });

  test("rescheduled completion leaves open work but does not make the ticket ready", () => {
    const storage = memoryStorage();
    completeWorkflow(rescheduleIssue, "Rescheduled", "Service rescheduled", storage);

    const projection = getRouteQueueProjection(routeId, storage);

    expect(projection.openIssueCount).toBe(3);
    expect(projection.completedIssueCount).toBe(1);
    expect(projection.recordsNotReady).toBe(4);
    expect(projection.closeoutCounts["Follow-Up Needed"]).toBe(1);
    expect(projection.completedIssues[0].finalStatus).toBe("Rescheduled");
  });

  test("reopened issue returns to unresolved work with prior evidence preserved", () => {
    const storage = memoryStorage();
    const completed = completeWorkflow(signatureIssue, "Ready to Close", "Missing ticket backup received", storage);
    const reopened = reopenWorkflow(completed, "The recovered signature was unreadable.", "July 10, 2026, 1:20 PM");
    saveIssueWorkflow(signatureIssue.id, reopened, storage);

    const projection = getRouteQueueProjection(routeId, storage);
    const issue = projection.reopenedIssues[0];

    expect(projection.openIssueCount).toBe(4);
    expect(projection.completedIssueCount).toBe(0);
    expect(projection.reopenedIssueCount).toBe(1);
    expect(projection.officeIssues.map((item) => item.id)).toContain("EX-2103");
    expect(issue.queueState).toBe("reopened");
    expect(issue.reopenedCount).toBe(1);
    expect(issue.evidenceReady).toBe(true);
    expect(issue.finalStatus).toBe("");
    expect(projection.recordsNotReady).toBe(4);
  });

  test("browser report replaces a clean record instead of inflating scheduled stops", () => {
    const storage = memoryStorage();
    const captured = createCapturedRouteIssue({
      routeId,
      customer: "Sample Restaurant",
      truck: "Truck 07",
      driver: "M. Chen",
      serviceType: "Grease trap service",
      stopId: "WRB-09",
      issueOptionId: "locked-gate",
      serviceResult: "Not completed",
      note: "Gate was locked.",
      photoCount: 0,
      dispatchContacted: "not-yet",
      customerFollowUp: "yes",
      delayMinutes: "15",
      recommendedAction: "",
    }, new Date("2026-07-10T13:30:00Z"));
    saveCapturedRouteIssue(captured, storage);

    const projection = getRouteQueueProjection(routeId, storage);

    expect(projection.scheduledStops).toBe(14);
    expect(projection.completedWithoutException).toBe(9);
    expect(projection.openIssueCount).toBe(5);
    expect(projection.capturedIssueCount).toBe(1);
    expect(projection.completedWithoutException + projection.issues.length).toBe(projection.scheduledStops);
  });

  test("matched receipt updates the receipt projection without a disposal verification claim", () => {
    const storage = memoryStorage();
    completeWorkflow(receiptIssue, "Ready to Close", "Disposal receipt matched", storage);

    const projection = getRouteQueueProjection(routeId, storage);
    const matched = projection.issues.find((issue) => issue.id === receiptIssue.id);

    expect(matched.disposalStatus).toBe("Attached at route/load level");
    expect(projection.disposalMatrix.find((row) => row.status === "Receipt present but unmatched")).toBeUndefined();
    expect(projection.disposalMatrix.find((row) => row.status === "Attached at route/load level").count).toBe(5);
  });

  test("combined queue filters use projected owner, contact, evidence, and outcome state", () => {
    const storage = memoryStorage();
    completeWorkflow(signatureIssue, "Ready to Close", "Missing ticket backup received", storage);
    const projection = getRouteQueueProjection(routeId, storage);

    expect(filterProjectedIssues(projection.issues, { queueState: "completed" }).map((issue) => issue.id)).toEqual(["EX-2103"]);
    expect(filterProjectedIssues(projection.issues, { queueState: "open", lane: "active" })).toHaveLength(2);
    expect(filterProjectedIssues(projection.issues, { owner: "Dispatch", contactProgress: "Needs contact" }).map((issue) => issue.id)).toEqual(["EX-2101"]);
    expect(filterProjectedIssues(projection.issues, { evidenceProgress: "Ready", finalStatus: "Ready to Close" }).map((issue) => issue.id)).toEqual(["EX-2103"]);
  });

  test("projected issue exposes transparent state labels", () => {
    const storage = memoryStorage();
    const projected = projectRouteIssue(signatureIssue, storage);

    expect(projected.queueStateLabel).toBe("Open");
    expect(projected.contactProgress).toBe("Not needed");
    expect(projected.evidenceProgress).toBe("Needed");
    expect(isFinalStatusReadyToClose("Ready to Close")).toBe(true);
    expect(isFinalStatusReadyToClose("Closed Without Service")).toBe(true);
    expect(isFinalStatusReadyToClose("Rescheduled")).toBe(false);
  });
});
