import {
  CAPTURE_STORAGE_KEY,
  createCapturedRouteIssue,
  getCaptureDefaults,
  readCapturedRouteIssues,
  saveCapturedRouteIssue,
  validateCapture,
} from "./routeIssueCaptureData";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

describe("fast route issue capture", () => {
  test("requires route, site, issue, service result, and note or photo", () => {
    const errors = validateCapture({
      routeId: "",
      customer: "",
      issueOptionId: "",
      serviceResult: "",
      note: "",
      photoCount: 0,
    });

    expect(errors).toEqual({
      routeId: "Choose a route.",
      customer: "Enter the customer or site.",
      issueOptionId: "Choose what happened.",
      serviceResult: "Choose the service result.",
      evidence: "Add a short note or at least one photo.",
    });
  });

  test("prefills truck and driver from the selected route", () => {
    const defaults = getCaptureDefaults("warner-robins-route-b");
    expect(defaults.routeId).toBe("warner-robins-route-b");
    expect(defaults.truck).toBe("Truck 07");
    expect(defaults.driver).toBe("M. Chen");
  });

  test("maps an access problem to dispatch with transparent priority", () => {
    const issue = createCapturedRouteIssue({
      ...getCaptureDefaults("warner-robins-route-b"),
      customer: "Sample Restaurant",
      issueOptionId: "locked-gate",
      serviceResult: "Not completed",
      note: "Gate was locked and no site contact answered.",
      dispatchContacted: "yes",
      customerFollowUp: "yes",
      delayMinutes: "18",
    }, new Date("2026-07-10T14:42:00Z"));

    expect(issue.id).toBe("CAP-1783694520000");
    expect(issue.lane).toBe("active");
    expect(issue.priority).toBe("Resolve Now");
    expect(issue.owner).toBe("Dispatch");
    expect(issue.serviceOutcome).toBe("Not completed");
    expect(issue.closeoutState).toBe("Service Not Completed");
    expect(issue.recordedDelayMinutes).toBe(18);
    expect(issue.evidenceSummary).toBe("driver note");
  });

  test("maps a missing signature to office review", () => {
    const issue = createCapturedRouteIssue({
      ...getCaptureDefaults("macon-route-a"),
      customer: "Sample Cafe",
      issueOptionId: "missing-signature",
      serviceResult: "Completed with missing backup",
      note: "Ticket returned without a customer signature.",
    }, new Date("2026-07-10T15:00:00Z"));

    expect(issue.lane).toBe("closeout");
    expect(issue.priority).toBe("Closeout Blocked");
    expect(issue.owner).toBe("Route desk");
    expect(issue.disposalStatus).toBe("Attached at job level");
    expect(issue.releaseCondition).toContain("Signature attached");
  });

  test("accepts photo evidence without a note", () => {
    const issue = createCapturedRouteIssue({
      ...getCaptureDefaults("perry-route-c"),
      customer: "Sample Kitchen",
      issueOptionId: "unsafe-access",
      serviceResult: "Not completed",
      note: "",
      photoCount: 2,
      photoNames: ["access-1.jpg", "access-2.jpg"],
    }, new Date("2026-07-10T15:30:00Z"));

    expect(issue.evidenceSummary).toBe("2 photos");
    expect(issue.note).toBe("Photo added without a note.");
  });

  test("saves and reads browser-only captured issues", () => {
    const storage = memoryStorage();
    const issue = createCapturedRouteIssue({
      ...getCaptureDefaults("macon-route-a"),
      customer: "Sample Bistro",
      issueOptionId: "missing-photo",
      serviceResult: "Completed with missing backup",
      note: "The stop photo is too dark.",
    }, new Date("2026-07-10T16:00:00Z"));

    saveCapturedRouteIssue(issue, storage);
    const saved = readCapturedRouteIssues(storage);

    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe(issue.id);
    expect(JSON.parse(storage.getItem(CAPTURE_STORAGE_KEY))).toHaveLength(1);
  });
});
