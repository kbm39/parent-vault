import type { Session } from '@supabase/supabase-js'
import { Link } from 'react-router-dom'
import { User, Heart, DollarSign, FileText, Home, Shield, Key, Smartphone, Users, Receipt } from 'lucide-react'

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-slate-600 text-sm mt-1">{email}</p>
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
