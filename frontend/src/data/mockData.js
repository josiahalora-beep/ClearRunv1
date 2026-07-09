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
