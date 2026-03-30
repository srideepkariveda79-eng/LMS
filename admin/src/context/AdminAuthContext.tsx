import React, { createContext, useContext, useEffect, useState } from 'react'

const AdminAuthContext = createContext(null)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { setLoading(false); return }
    fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(data => {
        if (data.success && data.user?.role === 'admin') setAdmin(data.user)
        else logout()
      })
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/admin/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok && res.headers.get('content-type')?.includes('text/html')) {
      throw new Error('Cannot reach server. Is the backend running?')
    }
    const data = await res.json()
    if (!data.success) throw new Error(data.message || 'Login failed')
    localStorage.setItem('adminToken', data.token)
    setToken(data.token); setAdmin(data.user)
    return data
  }

  const logout = () => { localStorage.removeItem('adminToken'); setToken(null); setAdmin(null) }
  const getToken = () => localStorage.getItem('adminToken')

  return (
    <AdminAuthContext.Provider value={{ admin, token, loading, isAdmin: !!admin, login, logout, getToken }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return ctx
}
