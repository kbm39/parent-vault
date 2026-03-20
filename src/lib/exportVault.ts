import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

const EXPORT_SECTIONS = [
  { key: 'identity', label: 'Identity', tableName: 'identity_records' },
  { key: 'health', label: 'Health', tableName: 'health_records' },
  { key: 'finances', label: 'Finances', tableName: 'finance_records' },
  { key: 'bills', label: 'Bills', tableName: 'bill_records' },
  { key: 'legal', label: 'Legal', tableName: 'legal_records' },
  { key: 'insurance', label: 'Insurance', tableName: 'insurance_records' },
  { key: 'accessCodes', label: 'Access Codes', tableName: 'access_code_records' },
  { key: 'digital', label: 'Digital', tableName: 'digital_records' },
  { key: 'contacts', label: 'Contacts', tableName: 'contact_records' },
] as const

export async function exportVault(session: Session) {
  const sections = await Promise.all(
    EXPORT_SECTIONS.map(async ({ key, label, tableName }) => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Could not export ${label.toLowerCase()}: ${error.message}`)
      }

      return [key, { label, count: data.length, entries: data }] as const
    }),
  )

  const payload = {
    app: 'Parent Vault',
    exportedAt: new Date().toISOString(),
    account: {
      userId: session.user.id,
      email: session.user.email ?? '',
    },
    sections: Object.fromEntries(sections),
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  link.href = url
  link.download = `parent-vault-export-${stamp}.json`
  link.click()
  URL.revokeObjectURL(url)

  return payload
}