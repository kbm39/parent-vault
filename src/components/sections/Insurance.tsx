import type { Session } from '@supabase/supabase-js'
import { Shield } from 'lucide-react'
import SectionPage from '../shared/SectionPage'

const FIELDS = [
  { key: 'label',           label: 'Policy Name',              placeholder: 'e.g. State Farm Home Insurance' },
  { key: 'policy_type',     label: 'Policy Type',              placeholder: 'Home, Auto, Life, Health, Umbrella…' },
  { key: 'insurer',         label: 'Insurance Company',        placeholder: 'Company name' },
  { key: 'policy_number',   label: 'Policy Number',            placeholder: 'Policy or certificate number' },
  { key: 'group_number',    label: 'Group Number',             placeholder: 'Group or plan number (if applicable)' },
  { key: 'insured',         label: 'Named Insured',            placeholder: 'Who is covered' },
  { key: 'coverage',        label: 'Coverage Amount',          placeholder: '$0.00' },
  { key: 'premium',         label: 'Premium',                  placeholder: '$0.00 / month or year' },
  { key: 'renewal_date',    label: 'Renewal Date',             placeholder: 'MM/DD/YYYY' },
  { key: 'agent_name',      label: 'Agent Name',               placeholder: 'Your agent\'s name' },
  { key: 'agent_phone',     label: 'Agent Phone',              type: 'tel' as const, placeholder: '(555) 000-0000' },
  { key: 'claims_phone',    label: 'Claims Phone',             type: 'tel' as const, placeholder: '(800) 000-0000' },
  { key: 'username',        label: 'Portal Username',          placeholder: 'Online account username', isUsername: true },
  { key: 'password',        label: 'Portal Password',          placeholder: 'Online account password', isPassword: true },
  { key: 'notes',           label: 'Notes',                    type: 'textarea' as const, placeholder: 'Deductibles, exclusions, beneficiaries…' },
]

export default function Insurance({ session }: { session: Session }) {
  return (
    <SectionPage
      session={session}
      tableName="insurance_records"
      sectionKey="insurance"
      icon={Shield}
      iconColor="text-teal-400"
      groups={[{
        title: 'Insurance Policies',
        subtitle: 'Home, auto, life, health, umbrella, and specialty coverage',
        fields: FIELDS,
        emptyMessage: 'Add insurance policies and coverage details.',
      }]}
    />
  )
}