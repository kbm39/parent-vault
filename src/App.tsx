import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { clearRecoveryMfaMarker, hasRecoveryMfaMarker } from './lib/recoveryCodes'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Identity from './components/sections/Identity'
import Health from './components/sections/Health'
import Finances from './components/sections/Finances'
import Bills from './components/sections/Bills'
import Legal from './components/sections/Legal'
import Deeds from './components/sections/Deeds'
import Insurance from './components/sections/Insurance'
import AccessCodes from './components/sections/AccessCodes'
import Digital from './components/sections/Digital'
import Contacts from './components/sections/Contacts'

function isEmailVerified(session: Session | null) {
  if (!session) return false
  return Boolean(session.user.email_confirmed_at ?? session.user.confirmed_at)
}

function ProtectedRoute({
  session,
  mfaSatisfied,
  children,
}: {
  session: Session | null
  mfaSatisfied: boolean
  children: React.ReactNode
}) {
  if (!session) return <Navigate to="/login" replace />
  if (!isEmailVerified(session)) return <Navigate to="/login?verify=1" replace />
  if (!mfaSatisfied) return <Navigate to="/login?mfa=1" replace />

  return <>{children}</>
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [mfaSatisfied, setMfaSatisfied] = useState(false)
  const emailVerified = isEmailVerified(session)

  const refreshMfaState = async (nextSession: Session | null) => {
    if (!nextSession) {
      setMfaSatisfied(false)
      clearRecoveryMfaMarker()
      return
    }

    const recoverySatisfied = hasRecoveryMfaMarker(nextSession.user.id)

    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (error) {
      setMfaSatisfied(recoverySatisfied)
      return
    }

    setMfaSatisfied(data.currentLevel === 'aal2' || recoverySatisfied)
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      await refreshMfaState(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      await refreshMfaState(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-teal-400 font-medium tracking-wide text-sm uppercase">Loading Parent Vault…</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={session && emailVerified && mfaSatisfied ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={
          <ProtectedRoute session={session} mfaSatisfied={mfaSatisfied}>
            <Layout session={session!} />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard session={session!} />} />
          <Route path="identity" element={<Identity session={session!} />} />
          <Route path="health" element={<Health session={session!} />} />
          <Route path="finances" element={<Finances session={session!} />} />
          <Route path="bills" element={<Bills session={session!} />} />
          <Route path="legal" element={<Legal session={session!} />} />
          <Route path="deeds" element={<Deeds session={session!} />} />
          <Route path="insurance" element={<Insurance session={session!} />} />
          <Route path="access-codes" element={<AccessCodes session={session!} />} />
          <Route path="digital" element={<Digital session={session!} />} />
          <Route path="contacts" element={<Contacts session={session!} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}