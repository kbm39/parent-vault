import { useState, useEffect } from 'react'
import { Plus, ChevronDown, ChevronUp, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react'

export interface AccountEntry {
  id: string
  label: string
  username?: string
  password?: string
  notes?: string
  [key: string]: string | undefined
}

interface FieldDef {
  key: string
  label: string
  type?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'textarea'
  placeholder?: string
  isUsername?: boolean
  isPassword?: boolean
}

interface SectionCardProps {
  title: string
  subtitle?: string
  entries: AccountEntry[]
  fields: FieldDef[]
  onAdd: (entry: Omit<AccountEntry, 'id'>) => Promise<void>
  onUpdate: (id: string, entry: Partial<AccountEntry>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  emptyMessage?: string
  prefillData?: Record<string, string> | null
  onPrefillDone?: () => void
}

function EntryRow({
  entry, fields, onUpdate, onDelete
}: {
  entry: AccountEntry
  fields: FieldDef[]
  onUpdate: (id: string, data: Partial<AccountEntry>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map(f => [f.key, entry[f.key] ?? '']))
  )
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)

  const togglePw = (key: string) => setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }))

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(entry.id, form)
    setSaving(false)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (confirm('Delete this entry?')) await onDelete(entry.id)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm shadow-slate-200/70">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => { if (!editing) setExpanded(!expanded) }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{entry.label || 'Untitled'}</p>
          {entry.username && (
            <p className="text-xs text-slate-500 truncate mt-0.5">{entry.username}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={e => { e.stopPropagation(); setEditing(!editing); setExpanded(true) }}
            className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); handleDelete() }}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-slate-500" />
            : <ChevronDown className="w-4 h-4 text-slate-500" />
          }
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-200 px-4 py-4 space-y-3">
          {editing ? (
            <>
              {fields.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={form[f.key] ?? ''}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      rows={3}
                      placeholder={f.placeholder}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 resize-none"
                    />
                  ) : f.isPassword ? (
                    <div className="relative">
                      <input
                        type={showPasswords[f.key] ? 'text' : 'password'}
                        value={form[f.key] ?? ''}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 pr-9 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-mono"
                      />
                      <button type="button" onClick={() => togglePw(f.key)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900">
                        {showPasswords[f.key] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ) : (
                    <input
                      type={f.type ?? 'text'}
                      value={form[f.key] ?? ''}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                  <Save className="w-3.5 h-3.5" />{saving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5" />Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              {fields.filter(f => entry[f.key]).map(f => (
                <div key={f.key} className="flex items-start gap-2">
                  <span className="text-xs text-slate-500 w-28 shrink-0 mt-0.5">{f.label}</span>
                  {f.isPassword ? (
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="text-xs text-slate-900 font-mono flex-1 truncate">
                        {showPasswords[f.key] ? entry[f.key] : '••••••••••••'}
                      </span>
                      <button onClick={() => togglePw(f.key)} className="text-slate-500 hover:text-slate-900 shrink-0">
                        {showPasswords[f.key] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-700 flex-1 break-all">{entry[f.key]}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AddEntryForm({ fields, onAdd, onClose, initialData }: {
  fields: FieldDef[]
  onAdd: (data: Omit<AccountEntry, 'id'>) => Promise<void>
  onClose: () => void
  initialData?: Record<string, string> | null
}) {
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(fields.map(f => [f.key, initialData?.[f.key] ?? '']))
  )

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm(Object.fromEntries(fields.map(f => [f.key, initialData[f.key] ?? ''])))
    }
  }, [initialData])
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)

  const togglePw = (key: string) => setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.label) return
    setSaving(true)
    await onAdd(form)
    setSaving(false)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-teal-50/60 border border-teal-200 rounded-xl p-5 space-y-3">
      <h4 className="text-sm font-semibold text-teal-700 mb-4">New Entry</h4>
      {fields.map(f => (
        <div key={f.key}>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            {f.label}{f.key === 'label' && <span className="text-red-400 ml-0.5">*</span>}
          </label>
          {f.type === 'textarea' ? (
            <textarea
              value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              rows={3}
              placeholder={f.placeholder}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 resize-none"
            />
          ) : f.isPassword ? (
            <div className="relative">
              <input
                type={showPasswords[f.key] ? 'text' : 'password'}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 pr-9 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-mono"
              />
              <button type="button" onClick={() => togglePw(f.key)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900">
                {showPasswords[f.key] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : (
            <input
              type={f.type ?? 'text'}
              value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              required={f.key === 'label'}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          )}
        </div>
      ))}
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={saving} className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          <Save className="w-3.5 h-3.5" />{saving ? 'Saving…' : 'Add Entry'}
        </button>
        <button type="button" onClick={onClose} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium px-4 py-2 rounded-lg transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function SectionCard({
  title, subtitle, entries, fields, onAdd, onUpdate, onDelete, emptyMessage, prefillData, onPrefillDone
}: SectionCardProps) {
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    if (prefillData) setShowAdd(true)
  }, [prefillData])

  return (
    <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-5 shadow-sm shadow-slate-200/70">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />Add
        </button>
      </div>

      {showAdd && (
        <div className="mb-4">
          <AddEntryForm
            fields={fields}
            onAdd={onAdd}
            initialData={prefillData}
            onClose={() => { setShowAdd(false); onPrefillDone?.() }}
          />
        </div>
      )}

      {entries.length === 0 && !showAdd ? (
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm">{emptyMessage ?? 'No entries yet. Add one above.'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(entry => (
            <EntryRow key={entry.id} entry={entry} fields={fields} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}