import { useLocation } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'

const TITLES: Record<string, { label: string; description: string }> = {
  '/':             { label: 'Dashboard',      description: 'Your complete family information hub' },
  '/identity':     { label: 'Identity',       description: 'Passports, IDs, Social Security cards' },
  '/health':       { label: 'Health',         description: 'Medical records, providers, prescriptions' },
  '/finances':     { label: 'Finances',       description: 'Bank accounts, investments, retirement' },
  '/bills':        { label: 'Bills',          description: 'Utilities, subscriptions, recurring payments' },
  '/legal':        { label: 'Legal',          description: 'Wills, trusts, powers of attorney' },
  '/deeds':        { label: 'Deeds & Titles', description: 'Property deeds, vehicle titles' },
  '/insurance':    { label: 'Insurance',      description: 'Policies, premiums, coverage details' },
  '/access-codes': { label: 'Access Codes',   description: 'Alarm codes, safe combinations, PINs' },
  '/digital':      { label: 'Digital Assets', description: 'Online accounts, digital credentials' },
  '/contacts':     { label: 'Contacts',       description: 'Attorneys, doctors, advisors, emergency contacts' },
}

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation()
  const page = TITLES[pathname] ?? { label: 'Parent Vault', description: '' }

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-white font-semibold text-base leading-none truncate">{page.label}</h1>
        {page.description && (
          <p className="text-slate-500 text-xs mt-1 truncate">{page.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold shadow shadow-teal-500/30">
          PV
        </div>
      </div>
    </header>
  )
}