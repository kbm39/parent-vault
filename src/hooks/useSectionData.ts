import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'
import type { AccountEntry } from '../components/shared/SectionCard'

export function useSectionData(session: Session, tableName: string) {
  const [entries, setEntries] = useState<AccountEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (err) setError(err.message)
    else setEntries(data as AccountEntry[])
    setLoading(false)
  }, [session.user.id, tableName])

  useEffect(() => { load() }, [load])

  const addEntry = async (entry: Omit<AccountEntry, 'id'>) => {
    const { data, error: err } = await supabase
      .from(tableName)
      .insert({ ...entry, user_id: session.user.id })
      .select()
      .single()

    if (err) { setError(err.message); return }
    setEntries(prev => [data as AccountEntry, ...prev])
  }

  const updateEntry = async (id: string, entry: Partial<AccountEntry>) => {
    const { error: err } = await supabase
      .from(tableName)
      .update(entry)
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (err) { setError(err.message); return }
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...entry } : e))
  }

  const deleteEntry = async (id: string) => {
    const { error: err } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (err) { setError(err.message); return }
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return { entries, loading, error, addEntry, updateEntry, deleteEntry }
}