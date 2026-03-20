import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Session } from '@supabase/supabase-js'
import {
  LayoutDashboard, User, Heart, Wallet, Receipt, Scale,
  Home, Shield, KeyRound, Globe, BookUser, LogOut, Vault, X
} from 'lucide-react'

const NAV_ITEMS = [
  { path: '/',              label: 'Dashboard',    icon: LayoutDashboard, exact: true },
  { path: '/identity',      label: 'Identity',     icon: User },
  { path: '/health',        label: 'Health',       icon: Heart },
  { path: '/finances',      label: 'Finances',     icon: Wallet },
  { path: '/bills',         label: 'Bills',        icon: Receipt },
  { path: '/legal',         label: 'Legal',        icon: Scale },
  { path: '/deeds',         label: 'Deeds',        icon: Home },
  { path: '/insurance',     label: 'Insurance',    icon: Shield },
  { path: '/access-codes',  label: 'Access Codes', icon: KeyRound },
  { path: '/digital',       label: 'Digital',      icon: Globe },
  { path: '/contacts',      label: 'Contacts',     icon: BookUser },
]

interface SidebarProps {
  session: Session
  open: boolean
  onClose: () => void
}

export default function Sidebar({ session, open, onClose }: SidebarProps) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 flex flex-col
        w-64 bg-white/85 backdrop-blur border-r border-slate-200 shadow-xl shadow-slate-300/40
        transition-transform duration-300
        lg:translate-x-0 lg:static lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Vault className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-slate-900 font-bold text-sm tracking-wide leading-none">Parent Vault</p>
              <p className="text-teal-700 text-xs mt-0.5 truncate max-w-[120px]">{session.user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV_ITEMS.map(({ path, label, icon: Icon, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}
              `}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}