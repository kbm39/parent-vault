import type { Session } from '@supabase/supabase-js'
import { Globe } from 'lucide-react'
import SectionPage from '../shared/SectionPage'

const FIELDS = [
  { key: 'label',             label: 'Account Name',            placeholder: 'e.g. Gmail — Personal' },
  { key: 'platform',          label: 'Platform / Service',      placeholder: 'Google, Apple, Facebook, Amazon…' },
  { key: 'url',               label: 'Website URL',             type: 'url' as const, placeholder: 'https://…' },
  { key: 'username',          label: 'Username / Email',        placeholder: 'Login email or username', isUsername: true },
  { key: 'password',          label: 'Password',                placeholder: 'Account password', isPassword: true },
  { key: 'recovery_email',    label: 'Recovery Email',          type: 'email' as const, placeholder: 'Backup recovery email' },
  { key: 'recovery_phone',    label: 'Recovery Phone',          type: 'tel' as const, placeholder: 'Phone number on account' },
  { key: 'two_factor',        label: '2FA Method',              placeholder: 'Authenticator app, SMS, hardware key…' },
  { key: 'backup_codes',      label: 'Backup / Recovery Codes', placeholder: 'One-time backup codes', isPassword: true },
  { key: 'security_question', label: 'Security Question',       placeholder: 'Security question text' },
  { key: 'security_answer',   label: 'Security Answer',         placeholder: 'Security question answer', isPassword: true },
  { key: 'pin',               label: 'PIN / Passcode',          placeholder: 'Device or account PIN', isPassword: true },
  { key: 'notes',             label: 'Notes',                   type: 'textarea' as const, placeholder: 'Subscription info, linked accounts, crypto keys…' },
]

export default function Digital({ session }: { session: Session }) {
  return (
    <SectionPage
      session={session}
      tableName="digital_records"
      sectionKey="digital"
      icon={Globe}
      iconColor="text-cyan-400"
      groups={[{
        title: 'Digital Accounts & Assets',
        subtitle: 'Email, social media, streaming, crypto, cloud storage, and all online accounts',
        fields: FIELDS,
        emptyMessage: 'Add online accounts, digital credentials, and crypto assets.',
      }]}
    />
  )
}