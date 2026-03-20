import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ session }: { session: Session }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(45,212,191,0.18),transparent_35%),radial-gradient(circle_at_92%_82%,rgba(59,130,246,0.12),transparent_35%)]" />
      <Sidebar session={session} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}