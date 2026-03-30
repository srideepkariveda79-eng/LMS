import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'
import arohakLogo from '../assets/Arohak-logo.jpg'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

const Login = () => {
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMsg, setForgotMsg] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setForgotLoading(true)
    setForgotMsg('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, isAdmin: true }),
      })
      const data = await res.json()
      setForgotMsg(data.message || 'Reset link sent if email exists.')
    } catch {
      setForgotMsg('Something went wrong. Please try again.')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/40 to-amber-50/30 flex items-center justify-center px-4">
      {/* subtle background orb */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white border border-red-100 rounded-2xl p-8 shadow-2xl shadow-red-500/5">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <img src={arohakLogo} alt="Arohak" className="h-14 w-auto rounded-xl mb-4 shadow-md" />
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-red-600" />
              <h1 className="text-gray-900 font-bold text-xl">Admin Portal</h1>
            </div>
            <p className="text-gray-500 text-sm">Sign in to manage your platform</p>
          </div>

          {!showForgot ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="admin@arohak.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-red-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500 transition-all text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-red-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500 transition-all text-sm" />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <AlertCircle size={15} className="shrink-0" />{error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 text-sm mt-2 cursor-pointer">
                {loading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <ShieldCheck size={15} />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button type="button" onClick={() => setShowForgot(true)}
                className="w-full text-center text-gray-400 hover:text-red-600 text-xs transition-colors mt-1">
                Forgot password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <h2 className="text-gray-900 font-bold text-base mb-1">Reset Password</h2>
                <p className="text-gray-500 text-sm">Enter your admin email and we'll send a reset link.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Admin Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required
                    placeholder="admin@arohak.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-red-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500 transition-all text-sm" />
                </div>
              </div>
              {forgotMsg && (
                <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">{forgotMsg}</p>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowForgot(false); setForgotMsg('') }}
                  className="flex-1 py-2.5 border border-red-100 text-gray-600 hover:text-gray-900 rounded-xl text-sm font-semibold transition-all">
                  Back
                </button>
                <button type="submit" disabled={forgotLoading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all cursor-pointer">
                  {forgotLoading ? 'Sending...' : 'Send Link'}
                </button>
              </div>
            </form>
          )}
        </div>
        <p className="text-center text-gray-400 text-xs mt-6">Arohak Admin · Restricted Access</p>
      </div>
    </div>
  )
}

export default Login
