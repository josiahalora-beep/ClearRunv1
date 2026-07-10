import { routeIntelligenceExceptions } from "./routeIntelligenceData";
import {
  addEvidenceRecord,
  confirmEvidenceRequirement,
  createInitialWorkflow,
  getFollowUpTemplates,
  getWorkflowReadiness,
  loadIssueWorkflow,
  recordResponse,
  reopenWorkflow,
  resolveWorkflow,
  saveIssueWorkflow,
} from "./issueResolutionWorkflow";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

const accessIssue = routeIntelligenceExceptions.find((item) => item.id === "EX-2101");
const receiptIssue = routeIntelligenceExceptions.find((item) => item.id === "EX-2104");

describe("issue follow-up and resolution workflow", () => {
  test("creates issue-specific follow-up templates", () => {
    const accessTemplates = getFollowUpTemplates(accessIssue);
    const receiptTemplates = getFollowUpTemplates(receiptIssue);

    expect(accessTemplates[0].label).toBe("Customer access request");
    expect(accessTemplates[0].text).toContain(accessIssue.customer);
    expect(receiptTemplates[0].label).toBe("Receipt review request");
    expect(receiptTemplates[0].text).toContain(receiptIssue.ticketId);
  });

  test("initial workflow keeps unresolved contact and evidence visible", () => {
    const workflow = createInitialWorkflow(accessIssue);
    const readiness = getWorkflowReadiness(workflow);

    expect(workflow.owner).toBe("Dispatch");
    expect(workflow.dispatchStatus).toBe("Needed");
    expect(workflow.customerStatus).toBe("Needed");
    expect(workflow.evidenceRequirements).toHaveLength(2);
    expect(workflow.evidenceLog[0].label).toBe(accessIssue.evidenceSummary);
    expect(readiness.ready).toBe(false);
    expect(readiness.contactsComplete).toBe(false);
    expect(readiness.evidenceComplete).toBe(false);
  });

  test("confirmed evidence records source and timestamp", () => {
    const initial = createInitialWorkflow(accessIssue);
    const first = initial.evidenceRequirements[0];
    const updated = confirmEvidenceRequirement(initial, first.id, "Driver", true, "July 10, 10:30 AM");
    const requirement = updated.evidenceRequirements[0];

    expect(requirement.confirmed).toBe(true);
    expect(requirement.source).toBe("Driver");
    expect(requirement.confirmedAt).toBe("July 10, 10:30 AM");
    expect(updated.activity[0].label).toContain(first.label);
    expect(updated.activity[0].note).toContain("Driver");
  });

  test("reached contact requires a recorded response before completion", () => {
    let workflow = createInitialWorkflow(accessIssue);
    workflow = {
      ...workflow,
      dispatchStatus: "Reached",
      customerStatus: "Attempted",
      resolutionReason: "Access instructions confirmed",
      finalStatus: "Rescheduled",
    };

    for (const requirement of workflow.evidenceRequirements) {
      workflow = confirmEvidenceRequirement(workflow, requirement.id, "Dispatch", true, "July 10, 10:45 AM");
    }

    expect(getWorkflowReadiness(workflow).responseRequired).toBe(true);
    expect(getWorkflowReadiness(workflow).ready).toBe(false);

    workflow = recordResponse(workflow, "Site manager provided a new gate code and return window.", "July 10, 10:50 AM");
    expect(getWorkflowReadiness(workflow).responseComplete).toBe(true);
    expect(getWorkflowReadiness(workflow).ready).toBe(true);
  });

  test("attempted contact can complete with evidence and a documented outcome", () => {
    let workflow = createInitialWorkflow(accessIssue);
    workflow = {
      ...workflow,
      dispatchStatus: "Attempted",
      customerStatus: "Attempted",
      resolutionReason: "Service rescheduled",
      finalStatus: "Rescheduled",
    };

    for (const requirement of workflow.evidenceRequirements) {
      workflow = confirmEvidenceRequirement(workflow, requirement.id, "Office review", true, "July 10, 11:00 AM");
    }

    const readiness = getWorkflowReadiness(workflow);
    expect(readiness.responseRequired).toBe(false);
    expect(readiness.ready).toBe(true);
  });

  test("adding evidence records source, note, and work history", () => {
    const workflow = createInitialWorkflow(accessIssue);
    const updated = addEvidenceRecord(workflow, {
      label: "Gate photo",
      source: "Driver",
      note: "Photo shows the locked service gate.",
    }, "July 10, 11:10 AM");

    expect(updated.evidenceLog[0].label).toBe("Gate photo");
    expect(updated.evidenceLog[0].source).toBe("Driver");
    expect(updated.evidenceLog[0].addedAt).toBe("July 10, 11:10 AM");
    expect(updated.activity[0].label).toBe("Evidence added");
  });

  test("resolution is blocked until every readiness requirement is complete", () => {
    const initial = createInitialWorkflow(accessIssue);
    const unresolved = resolveWorkflow(initial, "July 10, 11:20 AM");
    expect(unresolved.resolved).toBe(false);

    let ready = {
      ...initial,
      dispatchStatus: "Attempted",
      customerStatus: "Attempted",
      resolutionReason: "Service rescheduled",
      finalStatus: "Rescheduled",
    };
    for (const requirement of ready.evidenceRequirements) {
      ready = confirmEvidenceRequirement(ready, requirement.id, "Dispatch", true, "July 10, 11:21 AM");
    }

    const resolved = resolveWorkflow(ready, "July 10, 11:25 AM");
    expect(resolved.resolved).toBe(true);
    expect(resolved.resolvedAt).toBe("July 10, 11:25 AM");
    expect(resolved.activity[0].label).toBe("Issue completed — Rescheduled");
  });

  test("reopen requires a reason and preserves the prior resolution in history", () => {
    let workflow = createInitialWorkflow(accessIssue);
    workflow = {
      ...workflow,
      dispatchStatus: "Attempted",
      customerStatus: "Attempted",
      resolutionReason: "Service rescheduled",
      finalStatus: "Rescheduled",
    };
    for (const requirement of workflow.evidenceRequirements) {
      workflow = confirmEvidenceRequirement(workflow, requirement.id, "Dispatch", true, "July 10, 11:30 AM");
    }
    workflow = resolveWorkflow(workflow, "July 10, 11:35 AM");

    expect(reopenWorkflow(workflow, "", "July 10, 11:40 AM").resolved).toBe(true);

    const reopened = reopenWorkflow(workflow, "Customer changed the return window.", "July 10, 11:40 AM");
    expect(reopened.resolved).toBe(false);
    expect(reopened.reopenedCount).toBe(1);
    expect(reopened.finalStatus).toBe("");
    expect(reopened.activity[0].label).toBe("Issue reopened");
    expect(reopened.activity[0].note).toContain("Previous status: Rescheduled");
  });

  test("saves versioned workflow state and migrates legacy browser state", () => {
    const storage = memoryStorage();
    const workflow = createInitialWorkflow(accessIssue);
    saveIssueWorkflow(accessIssue.id, workflow, storage);
    expect(loadIssueWorkflow(accessIssue, storage).version).toBe(2);

    storage.setItem(`clearrun-route-issue-${accessIssue.id}`, JSON.stringify({
      owner: "Billing",
      proofChecks: Object.fromEntries(accessIssue.proofNeeded.map((item) => [item, true])),
      followUpText: "Legacy follow-up",
      followUpPrepared: true,
      released: true,
      activity: [{ id: "old", label: "Issue marked complete", note: "Legacy state" }],
    }));

    const migrated = loadIssueWorkflow(accessIssue, storage);
    expect(migrated.version).toBe(2);
    expect(migrated.owner).toBe("Billing");
    expect(migrated.evidenceRequirements.every((item) => item.confirmed)).toBe(true);
    expect(migrated.finalStatus).toBe("Ready to Close");
    expect(migrated.resolved).toBe(true);
  });
});
