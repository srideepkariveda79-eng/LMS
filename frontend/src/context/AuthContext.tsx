import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(() => localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) { setLoading(false); return }
        fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
            .then(data => { if (data.success) setUser(data.user); else logout() })
            .catch(() => logout())
            .finally(() => setLoading(false))
    }, [])

    const login = async (email, password) => {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (!data.success) throw Object.assign(new Error(data.message || 'Login failed'), { needsVerification: data.needsVerification })
        localStorage.setItem('token', data.token)
        setToken(data.token); setUser(data.user)
        return data
    }

    const register = async (name, email, password) => {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Registration failed')
        return data
    }

    const updateProfile = async (name: string) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API_BASE}/api/auth/profile`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name })
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Update failed')
        setUser(prev => prev ? { ...prev, name: data.user.name } : data.user)
        return data
    }

    const changePassword = async (currentPassword: string, newPassword: string) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API_BASE}/api/auth/change-password`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ currentPassword, newPassword })
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Failed')
        return data
    }

    const forgotPassword = async (email) => {
        const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Failed')
        return data
    }

    const resendVerification = async (email) => {
        const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        return res.json()
    }

    const logout = () => { localStorage.removeItem('token'); setToken(null); setUser(null) }
    const getToken = () => localStorage.getItem('token')

    return (
        <AuthContext.Provider value={{ user, token, loading, isSignedIn: !!user, login, register, logout, getToken, forgotPassword, resendVerification, updateProfile, changePassword }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
