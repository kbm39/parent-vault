import type { Session } from '@supabase/supabase-js'
import { Scale } from 'lucide-react'
import SectionPage from '../shared/SectionPage'

const FIELDS = [
  { key: 'label',         label: 'Document Name',         placeholder: 'e.g. Living Trust — John & Mary' },
  { key: 'doc_type',      label: 'Document Type',          placeholder: 'Will, Trust, POA, Healthcare Directive…' },
  { key: 'date_executed', label: 'Date Executed',          placeholder: 'MM/DD/YYYY' },
  { key: 'attorney',      label: 'Drafting Attorney',      placeholder: 'Attorney name & firm' },
  { key: 'law_firm',      label: 'Law Firm',               placeholder: 'Firm name' },
  { key: 'phone',         label: 'Attorney Phone',         type: 'tel' as const, placeholder: '(555) 000-0000' },
  { key: 'location',      label: 'Document Location',      placeholder: 'Safe, safety deposit box, attorney office…' },
  { key: 'username',      label: 'Portal Username',        placeholder: 'Document portal login', isUsername: true },
  { key: 'password',      label: 'Portal Password',        placeholder: 'Document portal password', isPassword: true },
  { key: 'beneficiaries', label: 'Beneficiaries',          type: 'textarea' as const, placeholder: 'List beneficiaries and shares' },
  { key: 'notes',         label: 'Notes',                  type: 'textarea' as const, placeholder: 'Key provisions, review dates, trustees…' },
]

export default function Legal({ session }: { session: Session }) {
  return (
    <SectionPage
      session={session}
      tableName="legal_records"
      sectionKey="legal"
      icon={Scale}
      iconColor="text-purple-400"
      groups={[{
        title: 'Legal Documents',
        subtitle: 'Wills, trusts, powers of attorney, healthcare directives, court orders',
        fields: FIELDS,
        emptyMessage: 'Add wills, trusts, powers of attorney, and other legal documents.',
      }]}
    />
  )
}