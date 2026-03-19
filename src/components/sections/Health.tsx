import type { Session } from '@supabase/supabase-js'
import { Heart } from 'lucide-react'
import SectionPage from '../shared/SectionPage'

const FIELDS = [
  { key: 'label',       label: 'Provider / Facility',    placeholder: 'e.g. Dr. Sarah Johnson' },
  { key: 'specialty',   label: 'Specialty',               placeholder: 'Primary Care, Cardiologist…' },
  { key: 'phone',       label: 'Phone',                   type: 'tel' as const, placeholder: '(555) 000-0000' },
  { key: 'address',     label: 'Address',                 placeholder: 'Office address' },
  { key: 'username',    label: 'Patient Portal Username', placeholder: 'Portal login', isUsername: true },
  { key: 'password',    label: 'Patient Portal Password', placeholder: 'Portal password', isPassword: true },
  { key: 'npi',         label: 'NPI / Provider #',        placeholder: 'National Provider Identifier' },
  { key: 'notes',       label: 'Notes',                   type: 'textarea' as const, placeholder: 'Conditions treated, insurance accepted…' },
]

export default function Health({ session }: { session: Session }) {
  return (
    <SectionPage
      session={session}
      tableName="health_records"
      sectionKey="health"
      icon={Heart}
      iconColor="text-rose-400"
      groups={[{
        title: 'Medical Providers & Prescriptions',
        subtitle: 'Doctors, specialists, hospitals, pharmacies, and medications',
        fields: FIELDS,
        emptyMessage: 'Add medical providers, pharmacies, and prescription records.',
      }]}
    />
  )
}