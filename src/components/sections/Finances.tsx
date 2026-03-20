import type { Session } from '@supabase/supabase-js'
import { Download, Wallet } from 'lucide-react'
import SectionPage from '../shared/SectionPage'
import type { AccountEntry } from '../shared/SectionCard'

const FIELDS = [
  { key: 'label',           label: 'Account Name',           placeholder: 'e.g. Chase Checking' },
  { key: 'institution',     label: 'Financial Institution',   placeholder: 'Bank, brokerage, credit union…' },
  { key: 'account_type',    label: 'Account Type',            placeholder: 'Checking, Savings, IRA, 401k…' },
  { key: 'account_number',  label: 'Account Number',          placeholder: 'Last 4 digits or masked number' },
  { key: 'routing_number',  label: 'Routing Number',          placeholder: 'ABA routing number' },
  { key: 'balance',         label: 'Balance',                  placeholder: '$0.00' },
  { key: 'username',        label: 'Online Banking Username',  placeholder: 'Login username', isUsername: true },
  { key: 'password',        label: 'Online Banking Password',  placeholder: 'Login password', isPassword: true },
  { key: 'pin',             label: 'PIN / Security Code',     placeholder: 'ATM PIN or security code', isPassword: true },
  { key: 'phone',           label: 'Customer Service Phone',  type: 'tel' as const, placeholder: '(800) 000-0000' },
  { key: 'advisor',         label: 'Financial Advisor',       placeholder: 'Advisor name & contact' },
  { key: 'notes',           label: 'Notes',                   type: 'textarea' as const, placeholder: 'Beneficiaries, account details…' },
]

const LIABILITY_KEYWORDS = ['loan', 'mortgage', 'credit', 'debt', 'line of credit', 'payable']

function toAmount(value?: string) {
  if (!value) return 0
  const cleaned = value.replace(/[^0-9().-]/g, '')
  if (!cleaned) return 0

  if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
    const number = Number(cleaned.slice(1, -1))
    return Number.isFinite(number) ? -number : 0
  }

  const number = Number(cleaned)
  return Number.isFinite(number) ? number : 0
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function isLikelyLiability(entry: AccountEntry) {
  const accountType = (entry.account_type || '').toLowerCase()
  return LIABILITY_KEYWORDS.some((word) => accountType.includes(word))
}

function buildBalanceSheet(entries: AccountEntry[]) {
  const assets = entries
    .filter((entry) => {
      const amount = toAmount(entry.balance)
      return amount >= 0 && !isLikelyLiability(entry)
    })
    .map((entry) => ({
      label: entry.label || 'Unnamed account',
      institution: entry.institution || '',
      amount: toAmount(entry.balance),
    }))

  const liabilities = entries
    .filter((entry) => {
      const amount = toAmount(entry.balance)
      return amount < 0 || isLikelyLiability(entry)
    })
    .map((entry) => ({
      label: entry.label || 'Unnamed liability',
      institution: entry.institution || '',
      amount: Math.abs(toAmount(entry.balance)),
    }))

  const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0)
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0)
  const netWorth = totalAssets - totalLiabilities

  return { assets, liabilities, totalAssets, totalLiabilities, netWorth }
}

function downloadBalanceSheet(entries: AccountEntry[]) {
  const sheet = buildBalanceSheet(entries)
  const payload = {
    generatedAt: new Date().toISOString(),
    totals: {
      assets: sheet.totalAssets,
      liabilities: sheet.totalLiabilities,
      netWorth: sheet.netWorth,
    },
    assets: sheet.assets,
    liabilities: sheet.liabilities,
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  a.href = url
  a.download = `balance-sheet-${stamp}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Finances({ session }: { session: Session }) {
  return (
    <SectionPage
      session={session}
      tableName="finance_records"
      sectionKey="finances"
      icon={Wallet}
      iconColor="text-emerald-400"
      renderSummary={(entries) => {
        const sheet = buildBalanceSheet(entries)

        return (
          <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-5 shadow-sm shadow-slate-200/70">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Balance Sheet Snapshot</p>
                <p className="text-xs text-slate-600">Auto-calculated from your financial entries. This does not change saved records.</p>
              </div>
              <button
                type="button"
                onClick={() => downloadBalanceSheet(entries)}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export Balance Sheet
              </button>
            </div>

            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Total Assets</p>
                <p className="mt-1 text-lg font-semibold text-emerald-900">{formatCurrency(sheet.totalAssets)}</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Total Liabilities</p>
                <p className="mt-1 text-lg font-semibold text-amber-900">{formatCurrency(sheet.totalLiabilities)}</p>
              </div>
              <div className="rounded-xl border border-sky-200 bg-sky-50 p-3">
                <p className="text-xs font-medium text-sky-700 uppercase tracking-wide">Net Worth</p>
                <p className="mt-1 text-lg font-semibold text-sky-900">{formatCurrency(sheet.netWorth)}</p>
              </div>
            </div>
          </div>
        )
      }}
      groups={[{
        title: 'Financial Accounts',
        subtitle: 'Bank accounts, investments, retirement accounts, credit cards',
        fields: FIELDS,
        emptyMessage: 'Add bank accounts, investment accounts, and retirement funds.',
      }]}
    />
  )
}