import type { Session } from '@supabase/supabase-js'
import { Receipt } from 'lucide-react'
import SectionPage from '../shared/SectionPage'

const FIELDS = [
  { key: 'label',          label: 'Service / Provider',      placeholder: 'e.g. Southern California Gas' },
  { key: 'category',       label: 'Category',                 placeholder: 'Electric, Internet, Cell Phone, Streaming' },
  { key: 'account_number', label: 'Account Number',           placeholder: 'Your account or customer number' },
  { key: 'amount',         label: 'Monthly Amount',           placeholder: '$0.00' },
  { key: 'due_date',       label: 'Due Date',                 placeholder: 'Day of month or specific date' },
  { key: 'autopay',        label: 'Auto-Pay',                 placeholder: 'Yes / No / Card ending in' },
  { key: 'username',       label: 'Account Username',         placeholder: 'Login email or username', isUsername: true },
  { key: 'password',       label: 'Account Password',         placeholder: 'Login password', isPassword: true },
  { key: 'phone',          label: 'Customer Service Phone',   type: 'tel' as const, placeholder: '(800) 000-0000' },
  { key: 'url',            label: 'Website / Portal URL',     type: 'url' as const, placeholder: 'https://' },
  { key: 'notes',          label: 'Notes',                    type: 'textarea' as const, placeholder: 'Payment method, billing cycle' },
]

export default function Bills({ session }: { session: Session }) {
  return (
    <SectionPage
      session={session}
      tableName="bill_records"
      sectionKey="bills"
      icon={Receipt}
      iconColor="text-amber-400"
      groups={[{
        title: 'Bills & Subscriptions',
        subtitle: 'Utilities, streaming services, memberships, and recurring payments',
        fields: FIELDS,
        emptyMessage: 'Add utility bills, subscriptions, and recurring payments.',
      }]}
    />
  )
}