import React, { useEffect, useState } from 'react'
import { Search, Star, User, X, SmilePlus, BookOpen, Clock, Award, Filter, Sparkles, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer, Slide } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../hooks/useWishlist'

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'

const CoursePage = () => {
  const navigate = useNavigate()
  const { isSignedIn, getToken } = useAuth()
  const { toggle: toggleWishlist, isWishlisted } = useWishlist()

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  const [userRatings, setUserRatings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('userCourseRatings') || '{}') } catch { return {} }
  })
  const [hoverRatings, setHoverRatings] = useState({})

  useEffect(() => {
    try { localStorage.setItem('userCourseRatings', JSON.stringify(userRatings)) } catch {}
  }, [userRatings])

  useEffect(() => {
    fetch(`${API_BASE}/api/course/public`)
      .then(async r => {
        if (!r.ok) throw new Error(await r.text() || 'Failed to fetch')
        return r.json()
      })
      .then(json => {
        const raw = json?.items || json?.courses || []
        setCourses(raw.map(c => ({
          id: String(c._id || c.id || ''),
          name: c.name, teacher: c.teacher || '',
          category: c.category || '', level: c.level || 'beginner',
          image: c.image || '',
          avgRating: typeof c.avgRating === 'number' ? c.avgRating : parseFloat(c.rating) || 0,
          totalRatings: c.totalRatings ?? 0,
        })))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const submitRating = async (courseId, rating) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      const token = getToken()
      if (token) headers.Authorization = `Bearer ${token}`
      const res = await fetch(`${API_BASE}/api/course/${courseId}/rate`, {
        method: 'POST', headers, body: JSON.stringify({ rating }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok && !data.success) throw new Error(data.message || `Failed`)
      const avg = data.avgRating ?? data.course?.avgRating
      const total = data.totalRatings ?? data.course?.ratingCount
      setCourses(prev => prev.map(c => c.id === courseId ? {
        ...c,
        avgRating: typeof avg === 'number' ? avg : c.avgRating,
        totalRatings: typeof total === 'number' ? total : c.totalRatings,
      } : c))
      setUserRatings(prev => ({ ...prev, [courseId]: rating }))
      toast.success('Thanks for your rating!')
    } catch (err) {
      toast.error(err.message || 'Failed to submit rating')
    }
  }

  const handleRate = async (e, courseId, rating) => {
    e.stopPropagation()
    if (!isSignedIn) { toast('Please sign in to rate'); return }
    setUserRatings(prev => ({ ...prev, [courseId]: rating }))
    await submitRating(courseId, rating)
  }

  const openCourse = (id) => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login to access this course')
      return
    }
    navigate(`/course/${id}`)
  }

  const filters = ['all', 'beginner', 'intermediate', 'advanced']

  const filtered = courses.filter(c => {
    const q = searchQuery.toLowerCase()
    const matchSearch = c.name?.toLowerCase().includes(q) || c.teacher?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q)
    const matchFilter = activeFilter === 'all' || c.level === activeFilter
    return matchSearch && matchFilter
  })

  const VISIBLE = 8
  const visible = showAll ? filtered : filtered.slice(0, VISIBLE)
  const remaining = Math.max(0, filtered.length - VISIBLE)

  const levelColor = (level) => {
    if (level === 'beginner') return 'bg-green-500 text-white'
    if (level === 'intermediate') return 'bg-amber-500 text-white'
    return 'bg-red-600 text-white'
  }

  const renderStars = (course) => {
    const userRating = userRatings[course.id] || 0
    const hover = hoverRatings[course.id] || 0
    const display = hover || userRating || Math.round(course.avgRating || 0)
    return (
      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
        {Array.from({ length: 5 }).map((_, i) => {
          const idx = i + 1
          const filled = idx <= display
          return (
            <button key={i}
              onClick={e => handleRate(e, course.id, idx)}
              onMouseEnter={() => setHoverRatings(s => ({ ...s, [course.id]: idx }))}
              onMouseLeave={() => setHoverRatings(s => ({ ...s, [course.id]: 0 }))}
              style={{ background: 'transparent', border: 'none', padding: 1, cursor: 'pointer' }}
              aria-label={`Rate ${idx}`}>
              <Star size={13} fill={filled ? '#f59e0b' : 'none'} stroke={filled ? '#f59e0b' : '#d1d5db'} />
            </button>
          )
        })}
        {course.totalRatings > 0 && <span className="text-xs text-gray-400 ml-1">({course.totalRatings})</span>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50/20 to-amber-50/10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-0 right-0 w-96 h-96 opacity-[0.04]" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="180" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="8 8"/>
          <circle cx="200" cy="200" r="120" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6"/>
          <circle cx="200" cy="200" r="60" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 4"/>
        </svg>
        <svg className="absolute bottom-20 left-0 w-64 h-64 opacity-[0.04]" viewBox="0 0 300 300">
          {[0,1,2].map(i => (
            <rect key={i} x={20+i*50} y={20+i*50} width={260-i*100} height={260-i*100} fill="none" stroke="#dc2626" strokeWidth="1.5" rx="8"/>
          ))}
        </svg>
      </div>

      {/* Header */}
      <div className="text-center mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full text-red-700 text-sm font-semibold mb-4">
          <Sparkles size={14} />
          All Courses
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-red-700 via-red-600 to-amber-600 bg-clip-text text-transparent mb-3">
          Let's Learn
        </h1>
        <p className="text-gray-500 text-lg mb-8">Master the skills that matter most</p>

        {/* Search */}
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-amber-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />
          <div className="relative flex items-center bg-white rounded-2xl shadow-md border border-red-100 group-focus-within:border-red-300 px-5 py-3.5 gap-3 transition-all">
            <Search size={18} className="text-red-400 flex-shrink-0" />
            <input type="text" placeholder="Search courses by name, instructor or category"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowAll(false) }}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none" />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setShowAll(false) }} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <Filter size={14} className="text-gray-400" />
          {filters.map(f => (
            <button key={f} onClick={() => { setActiveFilter(f); setShowAll(false) }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-white border border-red-100 text-gray-600 hover:border-red-300 hover:text-red-600'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {searchQuery && (
          <p className="text-sm text-gray-500 mt-3">
            Found <span className="font-semibold text-red-600">{filtered.length}</span> course{filtered.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        )}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-red-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-red-50" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-red-50 rounded w-3/4" />
                  <div className="h-3 bg-red-50 rounded w-1/2" />
                  <div className="h-8 bg-red-50 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <SmilePlus size={36} className="text-red-300" />
            </div>
            <p className="text-gray-500 font-medium text-lg mb-4">No courses found</p>
            <button onClick={() => { setSearchQuery(''); setActiveFilter('all') }}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 text-white rounded-xl text-sm font-semibold hover:from-red-700 hover:to-amber-600 transition-all shadow-md">
              Show All Courses
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visible.map((course, idx) => (
                <div key={course.id}
                  onClick={() => openCourse(course.id)}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 overflow-hidden cursor-pointer border border-red-100 hover:border-red-200 hover:-translate-y-1.5 flex flex-col"
                  style={{animationDelay:`${idx*60}ms`}}>

                  {/* Image */}
                  <div className="relative overflow-hidden h-44 bg-gradient-to-br from-red-50 to-amber-50">
                    {course.image ? (
                      <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={40} className="text-red-200" />
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${levelColor(course.level)}`}>
                      {course.level}
                    </span>
                    <button onClick={e => { e.stopPropagation(); toggleWishlist(course.id) }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform z-10">
                      <Heart size={14} className={isWishlisted(course.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}/>
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
                      {course.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <User size={11} className="text-red-400 flex-shrink-0" />
                      <span className="truncate">{course.teacher}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={10} /> 12h</span>
                      <span className="flex items-center gap-1"><Award size={10} /> Certificate</span>
                    </div>
                    {renderStars(course)}
                    <div className="mt-auto pt-1">
                      <span className="text-lg font-extrabold text-green-600">Free</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!showAll && remaining > 0 && (
              <div className="flex justify-center mt-10">
                <button onClick={() => setShowAll(true)}
                  className="px-8 py-3 bg-white border border-red-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md hover:border-red-400 hover:text-red-600 transition-all duration-200">
                  Show {remaining} more course{remaining !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} transition={Slide} theme="light" />
    </div>
  )
}

export default CoursePage
