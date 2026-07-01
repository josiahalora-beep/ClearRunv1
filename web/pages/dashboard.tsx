export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-clearrun-900">Owner Command Center</h1>
            <p className="text-slate-600 mt-1">Command center for haulers — revenue, proof requests, and field pipeline in one place.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">What's happening</div>
            <div className="mt-2 font-medium">3 Proof Requests need action · 12 Records ready for export</div>
          </div>
        </header>

        <section className="mt-8 grid lg:grid-cols-4 gap-6">
          <div className="col-span-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded shadow">
                <div className="text-xs text-slate-500">Total Potential Revenue</div>
                <div className="text-2xl font-semibold">$42,300</div>
                <div className="mt-2 text-sm text-slate-600">Sum of due/overdue facilities and convertable requests.</div>
              </div>
              <div className="p-4 bg-white rounded shadow">
                <div className="text-xs text-slate-500">Overdue Accounts</div>
                <div className="text-2xl font-semibold">8</div>
                <button className="mt-3 px-3 py-1 text-sm rounded border border-slate-200">Open Revenue Board</button>
              </div>
              <div className="p-4 bg-white rounded shadow">
                <div className="text-xs text-slate-500">Proof Requests Pending</div>
                <div className="text-2xl font-semibold">3</div>
                <button className="mt-3 px-3 py-1 text-sm rounded bg-clearrun-900 text-white">Review Now</button>
              </div>
            </div>

            <div className="mt-6 bg-white rounded shadow p-4">
              <h3 className="font-semibold">Recoverable Revenue Pipeline</h3>
              <p className="text-sm text-slate-500 mt-1">Kanban-style view of facilities that may convert to billable work.</p>
              <div className="mt-4 grid grid-cols-5 gap-3 text-sm">
                <div className="p-3 bg-slate-50 rounded">Due Soon<br/><span className="font-medium">6</span></div>
                <div className="p-3 bg-slate-50 rounded">Overdue<br/><span className="font-medium">8</span></div>
                <div className="p-3 bg-slate-50 rounded">Proof Requested<br/><span className="font-medium">3</span></div>
                <div className="p-3 bg-slate-50 rounded">Ready to Bill<br/><span className="font-medium">12</span></div>
                <div className="p-3 bg-slate-50 rounded">Exported<br/><span className="font-medium">4</span></div>
              </div>
            </div>

          </div>

          <aside className="space-y-4">
            <div className="p-4 bg-white rounded shadow">
              <h4 className="font-semibold">Proof Request Inbox</h4>
              <div className="mt-3 text-sm text-slate-600">3 requests · 1 unassigned</div>
              <button className="mt-3 px-3 py-1 rounded bg-clearrun-900 text-white">Open Inbox</button>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h4 className="font-semibold">Verified FOG Volume</h4>
              <div className="mt-2 text-2xl font-semibold">3,520 gal</div>
              <div className="text-sm text-slate-500 mt-1">Last 30 days</div>
            </div>
          </aside>
        </section>

      </div>
    </div>
  )
}
