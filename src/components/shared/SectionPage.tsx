import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { LucideIcon } from 'lucide-react'
import { Loader, AlertCircle, Download, CheckCircle2 } from 'lucide-react'
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
  const [hardSaveMessage, setHardSaveMessage] = useState('')

  const allFields = groups.flatMap(g => g.fields)

  const handleHardSave = () => {
    const payload = {
      section: sectionKey,
      exportedAt: new Date().toISOString(),
      entryCount: entries.length,
      entries,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    a.href = url
    a.download = `${sectionKey}-hard-save-${stamp}.json`
    a.click()
    URL.revokeObjectURL(url)

    setHardSaveMessage(`Hard save downloaded (${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}).`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-6 h-6 text-teal-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm shadow-slate-200/70">
        <div>
          <p className="text-sm font-semibold text-slate-900">Hard Save</p>
          <p className="text-xs text-slate-600">Download a local backup file of this page&apos;s records.</p>
        </div>
        <button
          type="button"
          onClick={handleHardSave}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Hard Save This Page
        </button>
      </div>

      {hardSaveMessage && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-700">{hardSaveMessage}</p>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-5 shadow-sm shadow-slate-200/70">
        <UploadDropZone
          section={sectionKey}
          userId={session.user.id}
          fields={allFields}
          onExtracted={data => setPrefillData(data)}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
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
