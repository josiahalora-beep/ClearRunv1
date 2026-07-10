// Centralized realistic demo data for ClearRun Records product/demo pages.
// Consistent fictional demo company: hauler "Peach State Grease Services" serving
// grease-trap / FOG and liquid-waste customers across Central Georgia / the Southeast.
// This is illustrative sample data for demo/preview purposes only — not real customer records.

// Lead form dropdown options (used by TryFree, Pilot, ProofMockup, Partners forms)
export const SERVICE_TYPE_OPTIONS = [
  "Grease trap / FOG",
  "Septic pumping",
  "Portable sanitation",
  "Liquid waste",
  "Other regulated service",
];

export const CURRENT_WORKFLOW_OPTIONS = [
  "Paper tickets",
  "Spreadsheet",
  "QuickBooks",
  "ServiceCore",
  "PumpDocket",
  "Tank Track",
  "Other software",
];

export const PARTNER_TYPE_OPTIONS = [
  "Hood cleaning company",
  "Commercial plumber",
  "Restaurant bookkeeper",
  "Restaurant consultant",
  "Grease trap installer",
  "Disposal facility",
  "Food truck commissary",
  "Environmental consultant",
  "Property manager",
  "Other",
];

export const LEAD_STATUS_OPTIONS = ["New", "Reviewed", "Followed Up", "Trial Started", "Not Fit", "Closed"];

export const brand = {
  name: "ClearRun Records",
  tagline: "Field proof. Clear records.",
  disclaimer:
    "ClearRun helps organize service proof and record visibility. It does not certify legal compliance or guarantee inspection outcomes.",
  worksWith:
    "ClearRun works beside spreadsheets, PDFs, paper tickets, QuickBooks, ServiceCore, PumpDocket, Tank Track, and other existing systems through import/export workflows.",
};

// Demo hauler + region used consistently across every page
export const demoHauler = {
  primary: "Peach State Grease Services",
  secondary: "Southern Route Liquid Waste",
  region: "Central Georgia",
  county: "Macon-Bibb County, GA",
  disposalFacility: "Middle Georgia Regional Treatment Facility",
};

// The 10 fictional customer locations served by the demo hauler
export const demoFacilities = [
  { name: "Creekside Grill", address: "412 Riverside Dr, Macon, GA" },
  { name: "Peach Bowl Diner", address: "77 Cherry St, Macon, GA" },
  { name: "Macon Market Cafe", address: "1220 Forsyth Rd, Macon, GA" },
  { name: "Highway 96 Wings", address: "96 Watson Blvd, Warner Robins, GA" },
  { name: "Central Georgia BBQ", address: "540 Houston Rd, Warner Robins, GA" },
  { name: "Robins Family Kitchen", address: "18 Green St, Perry, GA" },
  { name: "Northside Taqueria", address: "301 Northside Dr, Macon, GA" },
  { name: "Victory Bistro", address: "9 Victory Dr, Macon, GA" },
  { name: "Lakeview Seafood", address: "60 Lakeview Rd, Perry, GA" },
  { name: "Southern Spoon", address: "215 Main St, Warner Robins, GA" },
];

export const routeExceptionQueue = [
  {
    id: "EX-1048",
    recordId: "PP-10234",
    ticketId: "GT-1048",
    customer: "Perry Route C — Missing Proof",
    routeName: "Perry Route C",
    serviceType: "Grease Trap Pump-Out",
    serviceDate: "2026-01-22",
    blocker: "Missing signed ticket and stop photo",
    status: "Hold",
    severity: "incomplete",
    owner: "Dispatch",
    ageLabel: "2d",
    ageHours: 48,
    impact: "Hold before invoice support",
    nextAction: "Ask the driver for the signed service ticket and stop photo for GT-1048.",
    releaseCondition: "Signed ticket + stop photo attached",
    billingSupport: "Hold",
    customerProof: "Not ready",
    proofNeeded: ["Signed service ticket", "Stop photo"],
    estimatedMinutesSaved: 10,
  },
  {
    id: "EX-1052",
    recordId: "PP-10232",
    ticketId: "GT-1052",
    customer: "Warner Robins Route B — Needs Review",
    routeName: "Warner Robins Route B",
    serviceType: "FOG Interceptor Service",
    serviceDate: "2026-01-27",
    blocker: "Disposal ticket does not clearly match gallons",
    status: "Review",
    severity: "attention",
    owner: "Billing",
    ageLabel: "1d",
    ageHours: 24,
    impact: "Needs review before closeout",
    nextAction: "Compare gallons and disposal ticket date before releasing the record.",
    releaseCondition: "Disposal backup matched at job or route/load level",
    billingSupport: "Needs review",
    customerProof: "Partial",
    proofNeeded: ["Disposal ticket match", "Gallons note"],
    estimatedMinutesSaved: 8,
  },
  {
    id: "EX-1061",
    recordId: "PP-10237",
    ticketId: "GT-1061",
    customer: "Macon Route B — Customer Question",
    routeName: "Macon Route B",
    serviceType: "Grease Trap Pump-Out",
    serviceDate: "2026-01-26",
    blocker: "Customer asked for backup, packet not assembled",
    status: "Packet",
    severity: "review",
    owner: "Customer service",
    ageLabel: "4h",
    ageHours: 4,
    impact: "Customer response waiting on packet",
    nextAction: "Prepare customer-safe proof view without internal notes.",
    releaseCondition: "Customer-safe proof packet assembled",
    billingSupport: "Supported",
    customerProof: "Prepare packet",
    proofNeeded: ["Customer-safe summary", "Selected proof items"],
    estimatedMinutesSaved: 12,
  },
  {
    id: "EX-1067",
    recordId: "PP-10238",
    ticketId: "GT-1067",
    customer: "Macon Route A — Photo Gap",
    routeName: "Macon Route A",
    serviceType: "Grease Trap Pump-Out",
    serviceDate: "2026-01-25",
    blocker: "Photo evidence missing from route packet",
    status: "Hold",
    severity: "incomplete",
    owner: "Route desk",
    ageLabel: "18h",
    ageHours: 18,
    impact: "Weak support if customer asks for proof",
    nextAction: "Request the stop photo before the record is closed.",
    releaseCondition: "Stop photo attached or marked not available",
    billingSupport: "Hold",
    customerProof: "Not ready",
    proofNeeded: ["Stop photo"],
    estimatedMinutesSaved: 7,
  },
];

export const dashboardStats = [
  { label: "Proof Packets This Month", value: "184", delta: "+12% vs last month", status: "complete" },
  { label: "Missing Records Flagged", value: "9", delta: "3 resolved this week", status: "attention" },
  { label: "Review-Ready Exports", value: "27", delta: "Ready for customer send", status: "review" },
  { label: "Incomplete Service Tickets", value: "4", delta: "Needs field follow-up", status: "incomplete" },
];

export const proofPackets = [
  {
    id: "PP-10231",
    demoType: "ready",
    customer: "Macon Route A — Ready",
    address: "Macon, GA route record",
    serviceType: "Grease Trap Pump-Out",
    hauler: "Peach State Grease Services",
    technician: "D. Alvarez",
    serviceDate: "2026-01-28",
    gallons: 320,
    disposalSite: "Middle Georgia Regional Treatment Facility",
    status: "complete",
    closeoutStatus: "Ready to Close",
    invoiceSupport: "Invoice support ready",
    responseReadiness: "Customer/reviewer response ready",
    missingProofCount: 0,
    weakBackupCount: 0,
    photos: 6,
    summary:
      "Clean demo packet with date, site, photos, signature, volume, and disposal backup present. This shows the ideal record after ClearRun organizes it.",
    nextOfficeAction: "Ready to close and share if requested.",
    presentProof: ["Service date", "Customer/site", "Service photo", "Signature", "Gallons/volume", "Disposal backup"],
    missingProof: [],
    weakBackup: [],
  },
  {
    id: "PP-10232",
    demoType: "review",
    customer: "Warner Robins Route B — Needs Review",
    address: "Warner Robins, GA route record",
    serviceType: "FOG Interceptor Service",
    hauler: "Peach State Grease Services",
    technician: "M. Chen",
    serviceDate: "2026-01-27",
    gallons: 450,
    disposalSite: "Middle Georgia Regional Treatment Facility",
    status: "review",
    closeoutStatus: "Needs Review",
    invoiceSupport: "Invoice support not fully ready",
    responseReadiness: "Customer/reviewer response needs office review",
    missingProofCount: 0,
    weakBackupCount: 1,
    photos: 4,
    summary:
      "Most proof exists, but the disposal backup does not clearly match the route record. This is where ClearRun prevents a record from being closed too early.",
    nextOfficeAction: "Confirm disposal match before closing.",
    presentProof: ["Service date", "Customer/site", "Service photo", "Signature", "Gallons/volume"],
    missingProof: [],
    weakBackup: ["Disposal backup match unclear"],
  },
  {
    id: "PP-10234",
    demoType: "missing",
    customer: "Perry Route C — Missing Proof",
    address: "Perry, GA route record",
    serviceType: "Grease Trap Pump-Out",
    hauler: "Southern Route Liquid Waste",
    technician: "T. Okafor",
    serviceDate: "2026-01-22",
    gallons: 300,
    disposalSite: "Pending disposal backup",
    status: "incomplete",
    closeoutStatus: "Missing Proof",
    invoiceSupport: "Invoice support not ready",
    responseReadiness: "Customer/reviewer response not ready",
    missingProofCount: 3,
    weakBackupCount: 1,
    photos: 0,
    summary:
      "Signature, service photo, and disposal backup are missing or unclear. This shows the practical office follow-up ClearRun creates before closeout.",
    nextOfficeAction: "Request missing photo/signature and confirm backup before closing.",
    presentProof: ["Service date", "Customer/site", "Gallons/volume"],
    missingProof: ["Service photo", "Signature", "Disposal backup"],
    weakBackup: ["Invoice support not ready"],
  },
];

export const requests = [
  { id: "RQ-3391", business: "Macon Route A — Ready", type: "Proof Packet Demo", status: "complete", sentDate: "2026-01-28", respondedDate: "2026-01-28" },
  { id: "RQ-3392", business: "Warner Robins Route B — Needs Review", type: "Disposal Match Review", status: "review", sentDate: "2026-01-27", respondedDate: null },
  { id: "RQ-3393", business: "Perry Route C — Missing Proof", type: "Missing Proof Follow-Up", status: "incomplete", sentDate: "2026-01-22", respondedDate: null },
];

export const auditLog = [
  { id: "AL-1", timestamp: "2026-01-28 09:14", actor: "D. Alvarez (Field)", action: "Uploaded service ticket + 6 photos", target: "PP-10231" },
  { id: "AL-2", timestamp: "2026-01-28 09:20", actor: "System", action: "Prepared ready-to-close proof packet", target: "PP-10231" },
  { id: "AL-3", timestamp: "2026-01-27 14:02", actor: "M. Chen (Field)", action: "Marked disposal backup as needing office review", target: "PP-10232" },
  { id: "AL-4", timestamp: "2026-01-22 08:30", actor: "Office — J. Reyes", action: "Flagged missing photo, signature, and disposal backup", target: "PP-10234" },
];

export const disposalCertificates = [
  { id: "DC-771", facility: "Middle Georgia Regional Treatment Facility", date: "2026-01-28", relatedPacket: "PP-10231", volume: "320 gal", status: "complete" },
  { id: "DC-772", facility: "Middle Georgia Regional Treatment Facility", date: "2026-01-27", relatedPacket: "PP-10232", volume: "450 gal", status: "review" },
  { id: "DC-774", facility: "Pending", date: "—", relatedPacket: "PP-10234", volume: "300 gal", status: "incomplete" },
];

export const restaurants = [
  { id: "CU-01", name: "Macon Route A — Ready", lastService: "2026-01-28", status: "complete", nextDue: "2026-04-28" },
  { id: "CU-02", name: "Warner Robins Route B — Needs Review", lastService: "2026-01-27", status: "review", nextDue: "2026-04-27" },
  { id: "CU-03", name: "Perry Route C — Missing Proof", lastService: "2026-01-22", status: "incomplete", nextDue: "2026-04-22" },
];

export const compatibilityList = [
  { name: "QuickBooks", type: "Accounting export", note: "CSV export mapped to standard QuickBooks fields" },
  { name: "ServiceCore", type: "Field service platform", note: "Import service tickets via CSV/PDF" },
  { name: "PumpDocket", type: "Hauler dispatch software", note: "Import route + service records" },
  { name: "Tank Track", type: "Liquid-waste operations", note: "Import disposal and route backup where available" },
  { name: "PDF / paper tickets", type: "Manual records", note: "Organize scanned or photographed record sets" },
];

export const objections = [
  {
    q: "We already track this in spreadsheets — why change?",
    a: "ClearRun does not replace your spreadsheet. It organizes what is already scattered across spreadsheets, PDFs, and paper tickets into one review-friendly record set so nothing falls through the cracks when a customer or reviewer asks for backup.",
  },
  {
    q: "Will this force us to change haulers or software?",
    a: "No. ClearRun is designed to work beside your existing tools through import and export, not replace them.",
  },
  {
    q: "Does ClearRun guarantee outcomes?",
    a: "No platform can guarantee outcomes. ClearRun helps organize service proof and record visibility for office review. It does not certify legal compliance.",
  },
  {
    q: "Is our data secure?",
    a: "Records are stored with access controls and are only shared through links you generate. We do not claim any third-party security certification we have not independently obtained.",
  },
  {
    q: "What if a service record is missing?",
    a: "ClearRun flags missing records and creates a clear follow-up item the office can send to the hauler or field tech to close the gap.",
  },
  {
    q: "Is this only for grease traps?",
    a: "Grease-trap / FOG and liquid-waste records are where ClearRun starts. The same proof-packet, missing-record, and export workflows are built to extend into septic, portable sanitation, and other regulated field-service records over time.",
  },
];

export const pricingTiers = [
  {
    name: "Starter",
    price: "$149",
    period: "/mo",
    description: "For a single hauler or route getting records organized.",
    features: ["Up to 50 proof packets/mo", "Branded proof links", "CSV import/export", "Email support"],
    cta: "Start Free Records Trial",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$349",
    period: "/mo",
    description: "For multi-location haulers and regional operators.",
    features: ["Up to 300 proof packets/mo", "Missing-record queue", "Disposal backup tracking", "Priority support", "Audit log access"],
    cta: "Start Free Records Trial",
    highlighted: true,
  },
  {
    name: "Fleet",
    price: "Custom",
    period: "",
    description: "For haulers and regional operators at scale.",
    features: ["Unlimited proof packets", "Reviewer-friendly export tools", "Dedicated onboarding", "Custom reporting", "Volume pricing"],
    cta: "Get a Free Proof Packet Mockup",
    highlighted: false,
  },
];

export const checklistItems = [
  { item: "Service date documented for every location", risk: "high" },
  { item: "Photo evidence attached to each service ticket", risk: "high" },
  { item: "Disposal backup linked where available", risk: "high" },
  { item: "Gallons/volume recorded per service", risk: "medium" },
  { item: "Branded, shareable proof packet for each customer", risk: "medium" },
  { item: "Missing-record alerts before a records request", risk: "high" },
  { item: "Exportable billing-ready records for accounting", risk: "medium" },
  { item: "Central log of who touched each record and when", risk: "low" },
];

export const comparisonRows = [
  { capability: "Central proof packet per service", oldWay: "Scattered PDFs/photos", clearRun: "One organized packet" },
  { capability: "Disposal backup visibility", oldWay: "Buried receipt folders", clearRun: "Attached where available" },
  { capability: "Missing record follow-up", oldWay: "Manual calls/texts", clearRun: "Tracked request queue" },
  { capability: "Review-friendly export", oldWay: "Manual bundle", clearRun: "Structured packet" },
];
