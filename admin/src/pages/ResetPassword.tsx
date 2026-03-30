import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

const ResetPassword = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })
      const data = await res.json()
      if (!data.success) { setError(data.message || 'Reset failed'); return }
      setDone(true)
    } catch { setError('Something went wrong.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/40 to-amber-50/30 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white border border-red-100 rounded-2xl p-8 shadow-2xl shadow-red-500/5">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={20} className="text-red-600" />
            <h1 className="text-gray-900 font-bold text-xl">Admin Password Reset</h1>
          </div>

          {!token ? (
            <div className="text-center space-y-4">
              <AlertCircle size={40} className="text-red-500 mx-auto" />
              <p className="text-gray-500">Invalid or missing reset link.</p>
              <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white rounded-xl font-semibold text-sm transition-all cursor-pointer">
                Back to Login
              </button>
            </div>
          ) : done ? (
            <div className="text-center space-y-4">
              <CheckCircle size={40} className="text-emerald-500 mx-auto" />
              <div>
                <h2 className="text-gray-900 font-bold text-lg">Password Updated</h2>
                <p className="text-gray-500 text-sm mt-1">You can now sign in with your new password.</p>
              </div>
              <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white rounded-xl font-semibold text-sm transition-all cursor-pointer">
                Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-500 text-sm">Enter your new admin password below.</p>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">New Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" minLength={6} required
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-red-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500 transition-all text-sm" />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-red-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500 transition-all text-sm" />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <AlertCircle size={14} className="shrink-0" />{error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all text-sm cursor-pointer">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Lock size={14} />}
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
