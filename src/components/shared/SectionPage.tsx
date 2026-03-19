import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { LucideIcon } from 'lucide-react'
import { Loader, AlertCircle } from 'lucide-react'
import UploadDropZone from './UploadDropZone'
import SectionCard from './SectionCard'
import { useSectionData } from '../../hooks/useSectionData'

interface FieldDef {
  key: string
  label: string
  type?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'textarea'
  placeholder?: string
  isUsername?: boolean
  isPassword?: boolean
}

interface CardGroup {
  title: string
  subtitle?: string
  fields: FieldDef[]
  emptyMessage?: string
}

interface SectionPageProps {
  session: Session
  tableName: string
  sectionKey: string
  icon: LucideIcon
  iconColor: string
  groups: CardGroup[]
}

export default function SectionPage({
  session, tableName, sectionKey, groups
}: SectionPageProps) {
  const { entries, loading, error, addEntry, updateEntry, deleteEntry } = useSectionData(session, tableName)
  const [prefillData, setPrefillData] = useState<Record<string, string> | null>(null)

  const allFields = groups.flatMap(g => g.fields)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-6 h-6 text-teal-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <UploadDropZone
          section={sectionKey}
          userId={session.user.id}
          fields={allFields}
          onExtracted={data => setPrefillData(data)}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {groups.map((group, i) => (
        <SectionCard
          key={i}
          title={group.title}
          subtitle={group.subtitle}
          entries={entries}
          fields={group.fields}
          onAdd={addEntry}
          onUpdate={updateEntry}
          onDelete={deleteEntry}
          emptyMessage={group.emptyMessage}
          prefillData={i === 0 ? prefillData : null}
          onPrefillDone={() => setPrefillData(null)}
        />
      ))}
    </div>
  )
}
