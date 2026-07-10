import {
  getDisposalMatrix,
  getPriorityRank,
  getRecurringPattern,
  getRouteExceptions,
  getRouteSummary,
  meetsRecurringThreshold,
  routeDefinitions,
} from "./routeIntelligenceData";

describe("route intelligence aggregation", () => {
  test.each(routeDefinitions.map((route) => [route.name, route.id]))(
    "%s reconciles scheduled stops, closeout states, and disposal statuses",
    (_name, routeId) => {
      const summary = getRouteSummary(routeId);
      const closeoutTotal = Object.values(summary.closeoutCounts).reduce((total, count) => total + count, 0);
      const disposalTotal = getDisposalMatrix(routeId).reduce((total, row) => total + row.count, 0);

      expect(summary.scheduledStops).toBe(summary.stops.length);
      expect(summary.completedWithoutException + summary.exceptions.length).toBe(summary.scheduledStops);
      expect(closeoutTotal).toBe(summary.scheduledStops);
      expect(disposalTotal).toBe(summary.scheduledStops);
      expect(summary.recordsNotReady).toBe(summary.scheduledStops - summary.closeoutCounts["Ready to Close"]);
    }
  );

  test("transparent priority order places Resolve Now before closeout work", () => {
    expect(getPriorityRank("Resolve Now")).toBeLessThan(getPriorityRank("Same-Day Follow-Up"));
    expect(getPriorityRank("Same-Day Follow-Up")).toBeLessThan(getPriorityRank("Closeout Blocked"));
    expect(getRouteSummary("warner-robins-route-b").primaryException.priority).toBe("Resolve Now");
    expect(getRouteSummary("macon-route-a").primaryException.priority).toBe("Same-Day Follow-Up");
  });

  test("recurring pattern requires at least 3 occurrences and 20 percent of the sample", () => {
    expect(meetsRecurringThreshold({ occurrences: 3, denominator: 15 })).toBe(true);
    expect(meetsRecurringThreshold({ occurrences: 2, denominator: 8 })).toBe(false);
    expect(meetsRecurringThreshold({ occurrences: 3, denominator: 16 })).toBe(false);
    expect(meetsRecurringThreshold({ occurrences: 0, denominator: 0 })).toBe(false);
  });

  test("route pattern exposes numerator, denominator, and percentage", () => {
    const pattern = getRecurringPattern("warner-robins-route-b");
    expect(pattern.label).toBe("Blocked access");
    expect(pattern.occurrences).toBe(3);
    expect(pattern.denominator).toBe(11);
    expect(pattern.percentage).toBe(27);
  });

  test("disposal status filters only matching route exceptions", () => {
    const filtered = getRouteExceptions("warner-robins-route-b", {
      disposalStatus: "Receipt present but unmatched",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("EX-2104");
  });
});
