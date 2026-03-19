import type { Session } from '@supabase/supabase-js'
import { Wallet } from 'lucide-react'
import SectionPage from '../shared/SectionPage'

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

export default function Finances({ session }: { session: Session }) {
  return (
    <SectionPage
      session={session}
      tableName="finance_records"
      sectionKey="finances"
      icon={Wallet}
      iconColor="text-emerald-400"
      groups={[{
        title: 'Financial Accounts',
        subtitle: 'Bank accounts, investments, retirement accounts, credit cards',
        fields: FIELDS,
        emptyMessage: 'Add bank accounts, investment accounts, and retirement funds.',
      }]}
    />
  )
}