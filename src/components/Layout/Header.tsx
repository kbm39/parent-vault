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
    <header className="h-16 bg-white/75 backdrop-blur border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-slate-900 font-semibold text-base leading-none truncate">{page.label}</h1>
        {page.description && (
          <p className="text-slate-600 text-xs mt-1 truncate">{page.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setSecurityOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white/70 text-slate-700 hover:text-teal-700 hover:border-teal-300 hover:bg-teal-50 transition-colors text-xs font-medium"
        >
          <Shield className="w-3.5 h-3.5" />
          Security
        </button>
        <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow shadow-teal-500/30">
          PV
        </div>
      </div>

      {securityOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setSecurityOpen(false)}
        >
          <div
            className="max-w-2xl mx-auto mt-12 sm:mt-16 rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-400/30"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Security and backup information"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-semibold text-slate-900">Security and Backups</h2>
              </div>
              <button
                onClick={() => setSecurityOpen(false)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Close security dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4 text-sm text-slate-700">
              <section>
                <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">How your information is kept confidential</h3>
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>Your information is private and tied to your account login.</li>
                  <li>We do not sell or publicly share your personal records.</li>
                  <li>Only approved services needed to run the app (such as hosting, authentication, and storage) process your data.</li>
                  <li>Uploaded files are protected and opened with temporary secure links.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Security protocols against hacking</h3>
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>Data is sent over encrypted connections (HTTPS/TLS) between your device and the service.</li>
                  <li>Our hosting providers use industry-standard protections like access controls, infrastructure monitoring, and security patching.</li>
                  <li>Server access is restricted to approved frontend domains and authenticated requests.</li>
                  <li>No online system can promise zero risk, but we use layered protections to reduce risk as much as possible.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-500 mb-2">Backups in simple terms</h3>
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>Your data is stored in managed cloud systems built for durability.</li>
                  <li>You can also use the Hard Save button on each page to keep your own local backup copy.</li>
                  <li>For important records, keep an additional encrypted backup outside the app.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}