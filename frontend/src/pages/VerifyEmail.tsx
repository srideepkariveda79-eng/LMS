import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || 'http://localhost:4000'

const VerifyEmail = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) { setStatus('error'); setMessage('No verification token found.'); return }

    fetch(`${API_BASE}/api/auth/verify-email?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          if (data.token) {
            localStorage.setItem('token', data.token)
            // use navigate so we stay on the correct frontend origin
            setStatus('success')
            setMessage('Email verified! You are now signed in.')
            setTimeout(() => navigate('/'), 1500)
          } else {
            setStatus('success')
            setMessage('Email verified! You can now sign in.')
          }
        } else {
          setStatus('error')
          setMessage(data.message || 'Verification failed.')
        }
      })
      .catch(() => { setStatus('error'); setMessage('Something went wrong. Please try again.') })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-red-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-red-100">
        {status === 'loading' && (
          <>
            <Loader size={48} className="text-red-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Verifying your email...</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white rounded-xl font-semibold transition-colors cursor-pointer">
              Go to Home
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white rounded-xl font-semibold transition-colors cursor-pointer">
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
