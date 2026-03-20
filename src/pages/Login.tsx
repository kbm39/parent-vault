import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck, FolderHeart, Users } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [successMsg, setSuccessMsg] = useState('')

  const resendVerification = async () => {
    if (!email) {
      setError('Enter your email first, then tap resend verification.')
      return
    }

    setError('')
    setSuccessMsg('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })
      if (error) throw error
      setSuccessMsg('Verification email sent. Check your inbox and spam folder.')
    } catch (err: any) {
      setError(err.message || 'Could not resend verification email')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccessMsg('Account created. Check your email for a confirmation link before signing in.')
      }
    } catch (err: any) {
      const message = err?.message || 'An error occurred'
      if (/email.*not.*confirm/i.test(message)) {
        setError('Your email is not verified yet. Please check your inbox for the confirmation email.')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[34rem] h-[34rem] bg-teal-400/18 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-sky-400/14 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-6xl grid lg:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-8 items-stretch">
        <section className="rounded-[2rem] border border-white/70 bg-white/75 backdrop-blur-xl shadow-[0_30px_80px_rgba(148,163,184,0.22)] p-8 sm:p-10 lg:p-12">
          <img src="/logo-wordmark.svg" alt="Parent Vault" className="h-14 sm:h-16 w-auto" />

          <div className="mt-8 max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-slate-500">Prepared for real life</p>
            <h1 className="mt-4 text-4xl sm:text-5xl leading-tight font-extrabold text-slate-900">
              Keep your family&apos;s most important information safe, organized, and ready when it matters.
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-8 text-slate-600 max-w-xl">
              Parent Vault helps you gather essential records in one logical place so loved ones, caretakers, or anyone you rely on can find what they need quickly during illness, emergencies, or major life changes.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <h2 className="mt-3 text-sm font-semibold text-slate-900">Safeguard essentials</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Store the records your family may need most, from IDs and insurance to passwords and legal documents.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <FolderHeart className="w-5 h-5 text-rose-500" />
              <h2 className="mt-3 text-sm font-semibold text-slate-900">Stay organized</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Everything is arranged in clear sections so information is easy to understand and simple to update.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <Users className="w-5 h-5 text-sky-600" />
              <h2 className="mt-3 text-sm font-semibold text-slate-900">Help others help you</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Make important details easier to access when a spouse, adult child, executor, or caregiver needs them fast.</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-900 text-white p-6 shadow-xl shadow-slate-300/30">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-teal-300">Why people use this</p>
            <p className="mt-3 text-base leading-7 text-slate-200">
              When life becomes stressful, people do not want to hunt through drawers, phones, files, and old emails. This gives them the right information at their fingertips in one organized place.
            </p>
          </div>
        </section>

        <div className="relative">
          <div className="bg-white/88 border border-slate-200 rounded-[2rem] p-8 shadow-[0_30px_80px_rgba(148,163,184,0.24)] backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              {mode === 'signin' ? 'Sign in to your vault' : 'Create your vault'}
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              {mode === 'signin'
                ? 'Pick up where you left off and keep everything in one secure, organized place.'
                : 'Start building a clear record your family can rely on when it matters most.'}
            </p>
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-5">
              <p className="text-teal-700 text-sm">{successMsg}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-teal-400 disabled:to-cyan-400 text-white font-semibold py-3 rounded-xl transition-colors mt-2 text-sm shadow-lg shadow-teal-500/20"
            >
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          <div className="mt-5 text-center">
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccessMsg('') }}
              className="text-sm text-slate-600 hover:text-teal-700 transition-colors"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
            {mode === 'signin' && (
              <button
                type="button"
                onClick={resendVerification}
                disabled={loading}
                className="block w-full mt-2 text-sm text-teal-700 hover:text-teal-800 disabled:text-teal-400 transition-colors"
              >
                Resend verification email
              </button>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}