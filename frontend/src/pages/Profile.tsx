import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { User, Lock, BookOpen, Award, CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react'

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'

const Profile = () => {
  const navigate = useNavigate()
  const { user, isSignedIn, loading, updateProfile, changePassword, getToken } = useAuth() as any

  const [name, setName] = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameMsg, setNameMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [enrolledCount, setEnrolledCount] = useState<number | null>(null)
  const [certCount, setCertCount] = useState<number | null>(null)

  useEffect(() => {
    if (user) setName(user.name || '')
  }, [user])

  useEffect(() => {
    if (!isSignedIn) return
    const token = getToken()
    const headers = { Authorization: `Bearer ${token}` }
    fetch(`${API_BASE}/api/booking/my`, { headers })
      .then(r => r.json())
      .then(d => setEnrolledCount((d.bookings || []).length))
      .catch(() => {})
    fetch(`${API_BASE}/api/course/quiz/my-results`, { headers })
      .then(r => r.json())
      .then(d => setCertCount((d.results || []).filter((r: any) => r.passed && r.certificateId).length))
      .catch(() => {})
  }, [isSignedIn])

  useEffect(() => {
    if (!loading && !isSignedIn) navigate('/')
  }, [loading, isSignedIn])

  if (loading) return null
  if (!isSignedIn) return null

  const handleNameSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setNameLoading(true); setNameMsg(null)
    try {
      await updateProfile(name.trim())
      setNameMsg({ type: 'success', text: 'Name updated successfully.' })
    } catch (err: any) {
      setNameMsg({ type: 'error', text: err.message || 'Failed to update name.' })
    } finally { setNameLoading(false) }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPw !== confirmPw) { setPwMsg({ type: 'error', text: 'Passwords do not match.' }); return }
    if (newPw.length < 6) { setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); return }
    setPwLoading(true); setPwMsg(null)
    try {
      await changePassword(currentPw, newPw)
      setPwMsg({ type: 'success', text: 'Password changed successfully.' })
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err.message || 'Failed to change password.' })
    } finally { setPwLoading(false) }
  }

  const Msg = ({ msg }: { msg: { type: 'success' | 'error'; text: string } }) => (
    <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg mt-2 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
      {msg.type === 'success' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
      {msg.text}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors">
          <ArrowLeft size={16}/> Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center text-white text-3xl font-black shadow-lg flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-gray-900 truncate">{user?.name}</h1>
            <p className="text-gray-500 text-sm mt-0.5 truncate">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-100 capitalize">{user?.role}</span>
          </div>
          {/* Stats */}
          <div className="hidden sm:flex gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-amber-50 rounded-xl mb-1 mx-auto">
                <BookOpen size={18} className="text-amber-600"/>
              </div>
              <p className="text-xl font-black text-gray-900">{enrolledCount ?? '—'}</p>
              <p className="text-xs text-gray-500">Enrolled</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-50 rounded-xl mb-1 mx-auto">
                <Award size={18} className="text-emerald-600"/>
              </div>
              <p className="text-xl font-black text-gray-900">{certCount ?? '—'}</p>
              <p className="text-xs text-gray-500">Certificates</p>
            </div>
          </div>
        </div>

        {/* Edit Name */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
              <User size={16} className="text-red-600"/>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
          </div>
          <form onSubmit={handleNameSave} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email" value={user?.email || ''} disabled
                className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>
            {nameMsg && <Msg msg={nameMsg}/>}
            <button type="submit" disabled={nameLoading || !name.trim() || name.trim() === user?.name}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold rounded-xl text-sm hover:from-red-700 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {nameLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
              <Lock size={16} className="text-amber-600"/>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { label: 'Current Password', val: currentPw, set: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(p => !p) },
              { label: 'New Password', val: newPw, set: setNewPw, show: showNew, toggle: () => setShowNew(p => !p) },
              { label: 'Confirm New Password', val: confirmPw, set: setConfirmPw, show: showNew, toggle: () => setShowNew(p => !p) },
            ].map(({ label, val, set, show, toggle }) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'} value={val} onChange={e => set(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {show ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>
            ))}
            {pwMsg && <Msg msg={pwMsg}/>}
            <button type="submit" disabled={pwLoading || !currentPw || !newPw || !confirmPw}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold rounded-xl text-sm hover:from-red-700 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {pwLoading ? 'Changing…' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate('/mycourses')}
            className="bg-white rounded-2xl border border-gray-100 p-6 text-left hover:border-red-200 hover:shadow-md transition group">
            <BookOpen size={22} className="text-red-500 mb-3 group-hover:scale-110 transition-transform"/>
            <p className="font-bold text-gray-900 text-sm">My Courses</p>
            <p className="text-xs text-gray-500 mt-0.5">View enrolled courses</p>
          </button>
          <button onClick={() => navigate('/courses')}
            className="bg-white rounded-2xl border border-gray-100 p-6 text-left hover:border-amber-200 hover:shadow-md transition group">
            <Award size={22} className="text-amber-500 mb-3 group-hover:scale-110 transition-transform"/>
            <p className="font-bold text-gray-900 text-sm">Browse Courses</p>
            <p className="text-xs text-gray-500 mt-0.5">Discover new courses</p>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Profile
