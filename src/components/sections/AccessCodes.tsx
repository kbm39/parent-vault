import type { Session } from '@supabase/supabase-js'
import { KeyRound } from 'lucide-react'
import SectionPage from '../shared/SectionPage'

const FIELDS = [
  { key: 'label',       label: 'Name / Description',     placeholder: 'e.g. Front Door Alarm, Master Safe' },
  { key: 'code_type',   label: 'Code Type',               placeholder: 'Alarm, Safe, Gate, Garage, PIN, Combo…' },
  { key: 'location',    label: 'Physical Location',       placeholder: 'Where this code is used' },
  { key: 'code',        label: 'Code / Combination',      placeholder: 'Enter code or combination', isPassword: true },
  { key: 'username',    label: 'Account Username',        placeholder: 'Portal or app login username', isUsername: true },
  { key: 'password',    label: 'Account Password',        placeholder: 'Portal or app password', isPassword: true },
  { key: 'provider',    label: 'Security Company',        placeholder: 'ADT, Ring, SimpliSafe, etc.' },
  { key: 'phone',       label: 'Monitoring Phone',        type: 'tel' as const, placeholder: '(800) 000-0000' },
  { key: 'verbal_pw',   label: 'Verbal Password',         placeholder: 'Password spoken to monitoring center', isPassword: true },
  { key: 'reset_date',  label: 'Last Changed Date',       placeholder: 'MM/DD/YYYY' },
  { key: 'notes',       label: 'Notes',                   type: 'textarea' as const, placeholder: 'Entry delay, zones, emergency contacts…' },
]

export default function AccessCodes({ session }: { session: Session }) {
  return (
    <SectionPage
      session={session}
      tableName="access_code_records"
      sectionKey="access-codes"
      icon={KeyRound}
      iconColor="text-red-400"
      groups={[{
        title: 'Access Codes & Combinations',
        subtitle: 'Alarm codes, safe combinations, gate PINs, garage codes, and lock combinations',
        fields: FIELDS,
        emptyMessage: 'Add alarm codes, safe combinations, gate PINs, and other access codes.',
      }]}
    />
  )
}
