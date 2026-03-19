import type { Session } from '@supabase/supabase-js'
import { User } from 'lucide-react'
import SectionPage from '../shared/SectionPage'

const FIELDS = [
  { key: 'label',          label: 'Name / Description',   placeholder: 'e.g. Mom\'s Passport' },
  { key: 'doc_type',       label: 'Document Type',         placeholder: 'Passport, Driver\'s License, SSN…' },
  { key: 'id_number',      label: 'ID / Document Number',  placeholder: 'Document number' },
  { key: 'issuing_agency', label: 'Issuing Agency/State',  placeholder: 'e.g. California DMV' },
  { key: 'issue_date',     label: 'Issue Date',            placeholder: 'MM/DD/YYYY' },
  { key: 'expiry_date',    label: 'Expiration Date',       placeholder: 'MM/DD/YYYY' },
  { key: 'username',       label: 'Account Username',      placeholder: 'Online portal username', isUsername: true },
  { key: 'password',       label: 'Account Password',      placeholder: 'Online portal password', isPassword: true },
  { key: 'notes',          label: 'Notes',                 type: 'textarea' as const, placeholder: 'Storage location, renewal info…' },
]

export default function Identity({ session }: { session: Session }) {
  return (
    <SectionPage
      session={session}
      tableName="identity_records"
      sectionKey="identity"
      icon={User}
      iconColor="text-blue-400"
      groups={[{
        title: 'Identity Documents',
        subtitle: 'Passports, driver\'s licenses, Social Security cards, birth certificates',
        fields: FIELDS,
        emptyMessage: 'Add identity documents for each family member.',
      }]}
    />
  )
}