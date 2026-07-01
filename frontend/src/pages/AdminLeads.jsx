import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AlertTriangle, Search, Download, Inbox, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LeadStatusBadge } from "@/components/LeadStatusBadge";
import { SERVICE_TYPE_OPTIONS, CURRENT_WORKFLOW_OPTIONS, LEAD_STATUS_OPTIONS } from "@/data/mockData";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LEAD_TYPE_LABELS = { trial: "Try Free", mockup: "Proof Mockup", pilot: "Pilot", partner: "Partner" };

function toCsvValue(v) {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/"/g, '""');
  return `"${s}"`;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ lead_type: "all", service_type: "all", current_workflow: "all", status: "all" });
  const [updatingId, setUpdatingId] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get(`${API}/admin/leads`);
      setLeads(res.data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingId(leadId);
    try {
      await axios.patch(`${API}/admin/leads/${leadId}/status`, { status: newStatus });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
    } catch (e) {
      // Silently ignore for this internal demo view - a full retry/error UI is out of scope.
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filters.lead_type !== "all" && l.lead_type !== filters.lead_type) return false;
      if (filters.service_type !== "all" && l.service_type !== filters.service_type) return false;
      if (filters.current_workflow !== "all" && l.current_workflow !== filters.current_workflow) return false;
      if (filters.status !== "all" && l.status !== filters.status) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${l.business_name || ""} ${l.email || ""} ${l.name || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [leads, filters, search]);

  const handleExportCsv = () => {
    const headers = [
      "Lead Type", "Business/Organization", "Contact Name", "Email", "Phone", "Service Type",
      "Current Workflow", "Trucks", "Active Accounts", "Partner Type", "Service Area", "Notes",
      "Status", "Source Page", "Created At",
    ];
    const rows = filtered.map((l) => [
      LEAD_TYPE_LABELS[l.lead_type] || l.lead_type, l.business_name, l.name, l.email, l.phone,
      l.service_type, l.current_workflow, l.number_of_trucks, l.active_customer_accounts,
      l.partner_type, l.service_area, l.notes, l.status, l.source_page, l.created_at,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(toCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clearrun-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <section className="container-page py-10 sm:py-14">
        <div data-testid="admin-internal-warning" className="flex items-start gap-2.5 rounded-lg border border-status-attention/30 bg-status-attention-bg px-4 py-3 text-sm text-status-attention mb-8">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <p><strong>Internal demo view</strong> — protect before production launch. No authentication is applied to this page yet.</p>
        </div>

        <PageHeader
          eyebrow="Admin"
          title="Lead Inbox"
          description="Every Try Free, Proof Mockup, Pilot, and Partner submission in one place."
          actions={
            <Button variant="secondary" size="sm" data-testid="admin-export-csv-btn" onClick={handleExportCsv} disabled={filtered.length === 0}>
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
          }
        />

        <div className="mt-8 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input data-testid="admin-search-input" placeholder="Search business, email, or contact…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select data-testid="admin-filter-lead-type" value={filters.lead_type} onChange={(e) => setFilters((f) => ({ ...f, lead_type: e.target.value }))} className="lg:w-48">
            <option value="all">All lead types</option>
            {Object.entries(LEAD_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
          <Select data-testid="admin-filter-service-type" value={filters.service_type} onChange={(e) => setFilters((f) => ({ ...f, service_type: e.target.value }))} className="lg:w-48">
            <option value="all">All service types</option>
            {SERVICE_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select data-testid="admin-filter-workflow" value={filters.current_workflow} onChange={(e) => setFilters((f) => ({ ...f, current_workflow: e.target.value }))} className="lg:w-48">
            <option value="all">All workflows</option>
            {CURRENT_WORKFLOW_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select data-testid="admin-filter-status" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="lg:w-44">
            <option value="all">All statuses</option>
            {LEAD_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-slate-400 py-16">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading leads…
            </div>
          ) : error ? (
            <EmptyState icon={AlertTriangle} title="Couldn't load leads" description="Something went wrong reaching the admin leads API. Try refreshing." />
          ) : filtered.length === 0 ? (
            <EmptyState icon={Inbox} title="No leads match" description="Try clearing your search or filters, or check back once a form is submitted." />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table data-testid="admin-leads-table" className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 border-b border-slate-100 whitespace-nowrap">
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Business</th>
                      <th className="px-4 py-3 font-medium">Contact</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Phone</th>
                      <th className="px-4 py-3 font-medium">Service Type</th>
                      <th className="px-4 py-3 font-medium">Workflow</th>
                      <th className="px-4 py-3 font-medium">Trucks</th>
                      <th className="px-4 py-3 font-medium">Accounts</th>
                      <th className="px-4 py-3 font-medium">Partner Type</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                      <th className="px-4 py-3 font-medium">Source</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((l) => (
                      <tr key={l.id} data-testid={`admin-lead-row-${l.id}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 whitespace-nowrap">
                        <td className="px-4 py-3 font-medium text-navy-900">{LEAD_TYPE_LABELS[l.lead_type] || l.lead_type}</td>
                        <td className="px-4 py-3 text-navy-900">{l.business_name || "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{l.name}</td>
                        <td className="px-4 py-3 text-slate-600">{l.email}</td>
                        <td className="px-4 py-3 text-slate-500">{l.phone || "—"}</td>
                        <td className="px-4 py-3 text-slate-500">{l.service_type || "—"}</td>
                        <td className="px-4 py-3 text-slate-500">{l.current_workflow || "—"}</td>
                        <td className="px-4 py-3 text-slate-500">{l.number_of_trucks || "—"}</td>
                        <td className="px-4 py-3 text-slate-500">{l.active_customer_accounts || "—"}</td>
                        <td className="px-4 py-3 text-slate-500">{l.partner_type || "—"}</td>
                        <td className="px-4 py-3 text-slate-500">{new Date(l.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-slate-500">{l.source_page || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <LeadStatusBadge status={l.status} />
                            <Select
                              data-testid={`admin-status-select-${l.id}`}
                              value={l.status}
                              disabled={updatingId === l.id}
                              onChange={(e) => handleStatusChange(l.id, e.target.value)}
                              className="!h-8 !py-1 !text-xs w-32"
                            >
                              {LEAD_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                            </Select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
