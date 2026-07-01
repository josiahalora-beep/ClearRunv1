import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <nav className="w-64 bg-white border-r hidden md:block">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-clearrun-900 rounded flex items-center justify-center text-white font-bold">CR</div>
            <div>
              <div className="font-semibold text-clearrun-900">ClearRun</div>
              <div className="text-xs text-slate-500">Field proof • Clear records</div>
            </div>
          </div>

          <ul className="mt-6 space-y-2 text-sm">
            <li><Link href="/dashboard"><a className="block py-2 px-3 rounded hover:bg-slate-50">Owner Dashboard</a></Link></li>
            <li><Link href="/office"><a className="block py-2 px-3 rounded hover:bg-slate-50">Office Queues</a></Link></li>
            <li><Link href="/field"><a className="block py-2 px-3 rounded hover:bg-slate-50">Field Capture</a></Link></li>
            <li><Link href="/services"><a className="block py-2 px-3 rounded hover:bg-slate-50">Services</a></Link></li>
            <li><Link href="/requests"><a className="block py-2 px-3 rounded hover:bg-slate-50">Proof Requests</a></Link></li>
            <li><Link href="/cityview"><a className="block py-2 px-3 rounded hover:bg-slate-50">CityView</a></Link></li>
            <li><Link href="/audit"><a className="block py-2 px-3 rounded hover:bg-slate-50">Audit Log</a></Link></li>
            <li><Link href="/intelligence"><a className="block py-2 px-3 rounded hover:bg-slate-50">Intelligence</a></Link></li>
            <li><Link href="/settings"><a className="block py-2 px-3 rounded hover:bg-slate-50">Settings</a></Link></li>
          </ul>

        </div>
      </nav>

      <div className="flex-1">
        <header className="bg-slate-50 border-b">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="md:hidden px-2 py-1 bg-white rounded">Menu</button>
              <div className="text-sm text-slate-700">Owner • ClearRun Hauling Co</div>
            </div>
            <div className="flex items-center gap-4">
              <input aria-label="search" placeholder="Search" className="px-3 py-2 border rounded bg-white text-sm" />
              <div className="p-2 rounded-full bg-white">U</div>
            </div>
          </div>
        </header>

        <main>
          {children}
        </main>

        <footer className="mt-12 bg-white border-t">
          <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-slate-600 flex justify-between">
            <div>© {new Date().getFullYear()} ClearRun — Field proof. Clear records.</div>
            <div className="space-x-4">
              <a className="hover:underline" href="#">Docs</a>
              <a className="hover:underline" href="#">Security</a>
              <a className="hover:underline" href="#">Privacy</a>
              <a className="hover:underline" href="#">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
