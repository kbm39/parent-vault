import type { Session } from '@supabase/supabase-js'
import { BookUser } from 'lucide-react'
import SectionPage from '../shared/SectionPage'

const FIELDS = [
  { key: 'label',       label: 'Contact Name',              placeholder: 'e.g. Robert Klein — Estate Attorney' },
  { key: 'role',        label: 'Role / Relationship',       placeholder: 'Attorney, CPA, Doctor, Financial Advisor…' },
  { key: 'firm',        label: 'Firm / Practice / Company', placeholder: 'Organization name' },
  { key: 'phone',       label: 'Phone',                     type: 'tel' as const, placeholder: '(555) 000-0000' },
  { key: 'mobile',      label: 'Mobile / After-Hours',      type: 'tel' as const, placeholder: '(555) 000-0000' },
  { key: 'email',       label: 'Email',                     type: 'email' as const, placeholder: 'contact@example.com' },
  { key: 'address',     label: 'Address',                   placeholder: 'Office or mailing address' },
  { key: 'url',         label: 'Website',                   type: 'url' as const, placeholder: 'https://…' },
  { key: 'username',    label: 'Client Portal Username',    placeholder: 'Portal login username', isUsername: true },
  { key: 'password',    label: 'Client Portal Password',    placeholder: 'Portal login password', isPassword: true },
  { key: 'account_num', label: 'Client / Account Number',  placeholder: 'Your account or matter number' },
  { key: 'notes',       label: 'Notes',                     type: 'textarea' as const, placeholder: 'Services provided, referral source, emergency availability…' },
]

export default function Contacts({ session }: { session: Session }) {
  return (
    <SectionPage
      session={session}
      tableName="contact_records"
      sectionKey="contacts"
      icon={BookUser}
      iconColor="text-pink-400"
      groups={[{
        title: 'Key Contacts',
        subtitle: 'Attorneys, CPAs, doctors, financial advisors, and emergency contacts',
        fields: FIELDS,
        emptyMessage: 'Add attorneys, doctors, financial advisors, and other key contacts.',
      }]}
    />
  )
}