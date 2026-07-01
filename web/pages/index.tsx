import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-clearrun-900">ClearRun — Field proof. Clear records.</h1>
            <p className="mt-4 text-lg text-slate-700">Verified FOG service volume, hauler-branded proof packets, and municipal visibility — built for trusted grease-trap workflows.</p>
            <div className="mt-6 flex items-center gap-4">
              <Link href="/dashboard"><a className="px-5 py-3 rounded-md bg-clearrun-900 text-white shadow hover:scale-[1.01] transition">Open Demo Dashboard</a></Link>
              <Link href="/pricing"><a className="px-4 py-3 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition">Pricing</a></Link>
            </div>
            <div className="mt-8 text-sm text-slate-600">
              <strong>How to use:</strong> Start at the Owner Dashboard to review potential revenue, proof requests, and verified FOG volume. Use Field Capture to create a service record and generate a premium proof packet.
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-slate-600 text-sm">Top metrics</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded">
                  <div className="text-xs text-slate-500">Potential Revenue</div>
                  <div className="text-xl font-semibold">$42,300</div>
                </div>
                <div className="p-4 bg-slate-50 rounded">
                  <div className="text-xs text-slate-500">Verified FOG volume (30d)</div>
                  <div className="text-xl font-semibold">3,520 gal</div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-slate-600">Why ClearRun?</h3>
              <p className="mt-2 text-slate-700 text-sm">ClearRun protects hauler ownership, creates audit-ready proof packets, and gives municipalities the visibility they need — without exposing pricing or acting as a marketplace.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
