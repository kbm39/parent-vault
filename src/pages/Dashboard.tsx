import type { Session } from '@supabase/supabase-js'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Heart, DollarSign, FileText, Home, Shield, Key, Smartphone, Users, Receipt, Download, CheckCircle2, AlertCircle } from 'lucide-react'
import { exportVault } from '../lib/exportVault'

const sections = [
  { label: 'Identity', path: '/identity', icon: User, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Health', path: '/health', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { label: 'Finances', path: '/finances', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
  { label: 'Bills', path: '/bills', icon: Receipt, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { label: 'Legal', path: '/legal', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Deeds', path: '/deeds', icon: Home, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { label: 'Insurance', path: '/insurance', icon: Shield, color: 'text-teal-400', bg: 'bg-teal-400/10' },
  { label: 'Access Codes', path: '/access-codes', icon: Key, color: 'text-red-400', bg: 'bg-red-400/10' },
  { label: 'Digital', path: '/digital', icon: Smartphone, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { label: 'Contacts', path: '/contacts', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
]

export default function Dashboard({ session }: { session: Session }) {
  const email = session.user.email ?? ''
  const [exporting, setExporting] = useState(false)
  const [exportMessage, setExportMessage] = useState('')
  const [exportError, setExportError] = useState('')

  const handleExport = async () => {
    setExporting(true)
    setExportMessage('')
    setExportError('')

    try {
      const payload = await exportVault(session)
      const totalEntries = Object.values(payload.sections).reduce((sum, section) => sum + section.count, 0)
      setExportMessage(`Offline export downloaded with ${totalEntries} saved entr${totalEntries === 1 ? 'y' : 'ies'}.`)
    } catch (error: any) {
      setExportError(error.message || 'Could not export your vault right now.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 bg-white/80 backdrop-blur border border-slate-200 rounded-3xl p-6 shadow-sm shadow-slate-200/70">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-600 text-sm mt-1">{email}</p>
            <p className="text-slate-500 text-sm mt-3 max-w-2xl">Keep your records organized here, then use Export Vault any time you want an offline copy saved to your device.</p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-teal-400 disabled:to-cyan-400 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-lg shadow-teal-500/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting…' : 'Export Vault'}
          </button>
        </div>
        {exportMessage && (
          <div className="flex items-center gap-2 mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700">{exportMessage}</p>
          </div>
        )}
        {exportError && (
          <div className="flex items-center gap-2 mt-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{exportError}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {sections.map(({ label, path, icon: Icon, color, bg }) => (
          <Link
            key={path}
            to={path}
            className="flex flex-col items-center gap-3 p-5 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100/70 transition-all"
          >
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <span className="text-sm font-medium text-slate-700">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
