// Centralized realistic demo data for ClearRun Records product/demo pages.
// Consistent fictional demo company: hauler "Peach State Grease Services" serving
// grease-trap / FOG and liquid-waste customers across Central Georgia / the Southeast.
// This is illustrative sample data for demo/preview purposes only — not real customer records.

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
    customer: "Creekside Grill",
    address: "412 Riverside Dr, Macon, GA",
    serviceType: "Grease Trap Pump-Out",
    hauler: "Peach State Grease Services",
    technician: "D. Alvarez",
    serviceDate: "2026-01-28",
    gallons: 320,
    disposalSite: "Middle Georgia Regional Treatment Facility",
    status: "complete",
    photos: 6,
  },
  {
    id: "PP-10232",
    customer: "Peach Bowl Diner",
    address: "77 Cherry St, Macon, GA",
    serviceType: "FOG Interceptor Service",
    hauler: "Peach State Grease Services",
    technician: "M. Chen",
    serviceDate: "2026-01-27",
    gallons: 450,
    disposalSite: "Middle Georgia Regional Treatment Facility",
    status: "review",
    photos: 4,
  },
  {
    id: "PP-10233",
    customer: "Macon Market Cafe",
    address: "1220 Forsyth Rd, Macon, GA",
    serviceType: "Grease Trap Pump-Out",
    hauler: "Southern Route Liquid Waste",
    technician: "T. Okafor",
    serviceDate: "2026-01-25",
    gallons: 275,
    disposalSite: "Pending disposal confirmation",
    status: "attention",
    photos: 2,
  },
  {
    id: "PP-10234",
    customer: "Highway 96 Wings",
    address: "96 Watson Blvd, Warner Robins, GA",
    serviceType: "Grease Trap Pump-Out",
    hauler: "Peach State Grease Services",
    technician: "D. Alvarez",
    serviceDate: "2026-01-22",
    gallons: 300,
    disposalSite: "—",
    status: "incomplete",
    photos: 0,
  },
  {
    id: "PP-10235",
    customer: "Central Georgia BBQ",
    address: "540 Houston Rd, Warner Robins, GA",
    serviceType: "FOG Interceptor Service",
    hauler: "Southern Route Liquid Waste",
    technician: "T. Okafor",
    serviceDate: "2026-01-20",
    gallons: 510,
    disposalSite: "Middle Georgia Regional Treatment Facility",
    status: "complete",
    photos: 7,
  },
  {
    id: "PP-10236",
    customer: "Robins Family Kitchen",
    address: "18 Green St, Perry, GA",
    serviceType: "Grease Trap Pump-Out",
    hauler: "Peach State Grease Services",
    technician: "M. Chen",
    serviceDate: "2026-01-18",
    gallons: 340,
    disposalSite: "Middle Georgia Regional Treatment Facility",
    status: "complete",
    photos: 5,
  },
  {
    id: "PP-10237",
    customer: "Northside Taqueria",
    address: "301 Northside Dr, Macon, GA",
    serviceType: "FOG Interceptor Service",
    hauler: "Southern Route Liquid Waste",
    technician: "D. Alvarez",
    serviceDate: "2026-01-16",
    gallons: 290,
    disposalSite: "Middle Georgia Regional Treatment Facility",
    status: "review",
    photos: 3,
  },
  {
    id: "PP-10238",
    customer: "Victory Bistro",
    address: "9 Victory Dr, Macon, GA",
    serviceType: "Grease Trap Pump-Out",
    hauler: "Peach State Grease Services",
    technician: "T. Okafor",
    serviceDate: "2026-01-14",
    gallons: 260,
    disposalSite: "—",
    status: "incomplete",
    photos: 0,
  },
];

export const requests = [
  { id: "RQ-3391", business: "Creekside Grill", type: "Missing Record Request", status: "complete", sentDate: "2026-01-15", respondedDate: "2026-01-16" },
  { id: "RQ-3392", business: "Macon Market Cafe", type: "Proof of Disposal Request", status: "attention", sentDate: "2026-01-20", respondedDate: null },
  { id: "RQ-3393", business: "Highway 96 Wings", type: "Missing Record Request", status: "incomplete", sentDate: "2026-01-22", respondedDate: null },
  { id: "RQ-3394", business: "Peach Bowl Diner", type: "Proof Packet Re-send", status: "review", sentDate: "2026-01-24", respondedDate: "2026-01-24" },
  { id: "RQ-3395", business: "Victory Bistro", type: "Missing Record Request", status: "incomplete", sentDate: "2026-01-29", respondedDate: null },
];

export const auditLog = [
  { id: "AL-1", timestamp: "2026-01-28 09:14", actor: "D. Alvarez (Field)", action: "Uploaded service ticket + 6 photos", target: "PP-10231" },
  { id: "AL-2", timestamp: "2026-01-28 09:20", actor: "System", action: "Generated branded proof packet", target: "PP-10231" },
  { id: "AL-3", timestamp: "2026-01-27 14:02", actor: "M. Chen (Field)", action: "Marked disposal confirmation as review-ready", target: "PP-10232" },
  { id: "AL-4", timestamp: "2026-01-25 11:47", actor: "Office — J. Reyes", action: "Sent missing-record request to hauler", target: "PP-10233" },
  { id: "AL-5", timestamp: "2026-01-22 08:30", actor: "Office — J. Reyes", action: "Flagged ticket as incomplete (no photos)", target: "PP-10234" },
];

export const disposalCertificates = [
  { id: "DC-771", facility: "Middle Georgia Regional Treatment Facility", date: "2026-01-28", relatedPacket: "PP-10231", volume: "320 gal", status: "complete" },
  { id: "DC-772", facility: "Middle Georgia Regional Treatment Facility", date: "2026-01-20", relatedPacket: "PP-10235", volume: "510 gal", status: "complete" },
  { id: "DC-773", facility: "Middle Georgia Regional Treatment Facility", date: "2026-01-18", relatedPacket: "PP-10236", volume: "340 gal", status: "complete" },
  { id: "DC-774", facility: "Pending", date: "—", relatedPacket: "PP-10233", volume: "275 gal", status: "attention" },
];

export const restaurants = [
  { id: "CU-01", name: "Creekside Grill", lastService: "2026-01-28", status: "complete", nextDue: "2026-04-28" },
  { id: "CU-02", name: "Peach Bowl Diner", lastService: "2026-01-27", status: "review", nextDue: "2026-04-27" },
  { id: "CU-03", name: "Macon Market Cafe", lastService: "2026-01-25", status: "attention", nextDue: "2026-04-25" },
  { id: "CU-04", name: "Highway 96 Wings", lastService: "2026-01-22", status: "incomplete", nextDue: "2026-04-22" },
  { id: "CU-05", name: "Central Georgia BBQ", lastService: "2026-01-20", status: "complete", nextDue: "2026-04-20" },
];

export const compatibilityList = [
  { name: "QuickBooks", type: "Accounting export", note: "CSV export mapped to standard QuickBooks fields" },
  { name: "ServiceCore", type: "Field service platform", note: "Import service tickets via CSV/PDF" },
  { name: "PumpDocket", type: "Hauler dispatch software", note: "Import route + service records" },
  { name: "Tank Track", type: "Tank monitoring", note: "Import service history via CSV" },
  { name: "Spreadsheets (Excel/Sheets)", type: "Manual records", note: "Bulk CSV import/export" },
  { name: "Paper tickets & PDFs", type: "Legacy records", note: "Scan/upload to attach to proof packets" },
];

export const objections = [
  {
    q: "We already track this in spreadsheets — why change?",
    a: "ClearRun doesn't replace your spreadsheet, it organizes what's already scattered across it, PDFs, and paper tickets into one branded, exportable record set — so nothing falls through the cracks when a restaurant or inspector asks for proof.",
  },
  {
    q: "Will this force us to change haulers or software?",
    a: "No. ClearRun is designed to work beside your existing tools through import and export, not replace them.",
  },
  {
    q: "Does ClearRun guarantee we'll pass inspection?",
    a: "No platform can guarantee inspection outcomes. ClearRun helps you organize service proof and record visibility so you're prepared — it does not certify legal compliance.",
  },
  {
    q: "Is our data secure?",
    a: "Records are stored with access controls and are only shared through links you generate. We do not claim any third-party security certification we haven't independently obtained.",
  },
  {
    q: "What if a service record is missing?",
    a: "ClearRun flags missing records automatically and generates a request you can send to the hauler or field tech to close the gap.",
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
    features: ["Up to 300 proof packets/mo", "Missing-record automation", "Disposal certificate tracking", "Priority support", "Audit log access"],
    cta: "Start Free Records Trial",
    highlighted: true,
  },
  {
    name: "Fleet",
    price: "Custom",
    period: "",
    description: "For haulers and regional operators at scale.",
    features: ["Unlimited proof packets", "Municipal export tools", "Dedicated onboarding", "Custom reporting", "Volume pricing"],
    cta: "Get a Free Proof Packet Mockup",
    highlighted: false,
  },
];

export const checklistItems = [
  { item: "Service date documented for every location", risk: "high" },
  { item: "Photo evidence attached to each service ticket", risk: "high" },
  { item: "Disposal confirmation linked to each pump-out", risk: "high" },
  { item: "Gallons/volume recorded per service", risk: "medium" },
  { item: "Branded, shareable proof packet for each customer", risk: "medium" },
  { item: "Missing-record alerts before an inspection request", risk: "high" },
  { item: "Exportable billing-ready records for accounting", risk: "medium" },
  { item: "Central log of who touched each record and when", risk: "low" },
];

export const comparisonRows = [
  { capability: "Central proof packet per service", spreadsheets: false, paper: false, clearrun: true },
  { capability: "Missing-record detection", spreadsheets: false, paper: false, clearrun: true },
  { capability: "Branded customer-ready proof link", spreadsheets: false, paper: false, clearrun: true },
  { capability: "Billing-ready export", spreadsheets: "partial", paper: false, clearrun: true },
  { capability: "Works with your existing tools", spreadsheets: true, paper: true, clearrun: true },
  { capability: "Audit trail of record changes", spreadsheets: false, paper: false, clearrun: true },
];

export const importSources = ["CSV", "Excel spreadsheet", "PDF service tickets", "Scanned paper tickets", "ServiceCore export", "PumpDocket export", "Tank Track export"];

export const exportFormats = ["Billing-ready CSV (QuickBooks-compatible)", "Branded PDF proof packet", "Bulk ZIP of proof packets", "County/municipal summary export"];

export const cityExportRecords = [
  { id: "CE-01", business: "Creekside Grill", lastPumpOut: "2026-01-28", status: "complete" },
  { id: "CE-02", business: "Peach Bowl Diner", lastPumpOut: "2026-01-27", status: "review" },
  { id: "CE-03", business: "Macon Market Cafe", lastPumpOut: "2026-01-25", status: "attention" },
  { id: "CE-04", business: "Highway 96 Wings", lastPumpOut: "2026-01-22", status: "incomplete" },
  { id: "CE-05", business: "Central Georgia BBQ", lastPumpOut: "2026-01-20", status: "complete" },
  { id: "CE-06", business: "Robins Family Kitchen", lastPumpOut: "2026-01-18", status: "complete" },
  { id: "CE-07", business: "Northside Taqueria", lastPumpOut: "2026-01-16", status: "review" },
  { id: "CE-08", business: "Victory Bistro", lastPumpOut: "2026-01-14", status: "incomplete" },
  { id: "CE-09", business: "Lakeview Seafood", lastPumpOut: "2026-01-12", status: "complete" },
  { id: "CE-10", business: "Southern Spoon", lastPumpOut: "2026-01-10", status: "complete" },
];

export const partners = [
  { type: "Hauling Companies", desc: "Give your customers branded proof packets automatically after every service." },
  { type: "Pumping & Septic Providers", desc: "Extend record-keeping beyond FOG into septic and liquid waste services." },
  { type: "Accountants & Billing Partners", desc: "Receive billing-ready exports mapped to your accounting workflow." },
  { type: "Referral Partners", desc: "Refer regulated service businesses and share in program benefits." },
];

export const resources = [
  { title: "The Missing-Record Problem in FOG Compliance", type: "Guide", readTime: "6 min read" },
  { title: "What Inspectors Actually Ask For", type: "Guide", readTime: "5 min read" },
  { title: "Grease Trap Service Checklist (Printable)", type: "Checklist", readTime: "2 min read" },
  { title: "Spreadsheets vs. Proof Packets", type: "Comparison", readTime: "4 min read" },
  { title: "Preparing for a Municipal Records Request", type: "Guide", readTime: "7 min read" },
];
