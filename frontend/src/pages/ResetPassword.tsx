import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

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
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-red-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-red-100">
        <p className="text-red-600 font-semibold">Invalid reset link.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 text-white rounded-xl font-semibold">Back to Home</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-red-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full border border-red-100">
        {done ? (
          <div className="text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Password Reset!</h2>
            <p className="text-gray-500 mb-6">Your password has been updated. You can now sign in.</p>
            <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white rounded-xl font-semibold transition-colors cursor-pointer">
              Sign In
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Reset Password</h2>
            <p className="text-sm text-gray-500 mb-7">Enter your new password below.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" minLength={6} required
                    className="w-full pl-10 pr-10 py-2.5 border border-red-100 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-400 transition-all" />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full pl-10 pr-4 py-2.5 border border-red-100 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-400 transition-all" />
                </div>
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-60 cursor-pointer">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
