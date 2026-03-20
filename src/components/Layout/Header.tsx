import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Bell, Shield, X } from 'lucide-react'

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
  const [securityOpen, setSecurityOpen] = useState(false)
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
        <button
          onClick={() => setSecurityOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 hover:text-white hover:border-teal-500/60 hover:bg-slate-800 transition-colors text-xs font-medium"
        >
          <Shield className="w-3.5 h-3.5" />
          Security
        </button>
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold shadow shadow-teal-500/30">
          PV
        </div>
      </div>

      {securityOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setSecurityOpen(false)}
        >
          <div
            className="max-w-2xl mx-auto mt-12 sm:mt-16 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Security and backup information"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-400" />
                <h2 className="text-sm font-semibold text-white">Security and Backups</h2>
              </div>
              <button
                onClick={() => setSecurityOpen(false)}
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Close security dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4 text-sm text-slate-300">
              <section>
                <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2">How your information is kept confidential</h3>
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>You sign in through Supabase authentication and requests are tied to your account.</li>
                  <li>Document parsing runs through a server proxy, so API keys are kept on the server and not exposed in your browser.</li>
                  <li>Uploaded files are stored in your Supabase storage bucket and viewed with time-limited signed links.</li>
                  <li>Cross-origin access is restricted to approved frontend domains only.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2">How data is backed up</h3>
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>Primary storage and backup durability are provided by your configured cloud providers (Supabase and Railway).</li>
                  <li>For critical records, keep your own secondary backup copy outside this app (for example encrypted external storage).</li>
                  <li>Review provider backup and retention settings regularly from your provider dashboards.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}