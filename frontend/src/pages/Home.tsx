import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  BookOpen, ArrowRight, GraduationCap, Award, ChevronRight,
  CheckCircle, Users, Clock, Star, Zap, Heart,
  Play, TrendingUp, Target, BarChart2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import { toast, ToastContainer, Slide } from 'react-toastify'
import { useWishlist } from '../hooks/useWishlist'

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'

const levelBadge = (level: string) => {
  if (level === 'beginner') return 'bg-emerald-100 text-emerald-700'
  if (level === 'intermediate') return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

// ── Logged-out landing page ───────────────────────────────────────────────────
const LandingPage = ({ setShowModal, courses, coursesLoading, openCourse, toggleWishlist, isWishlisted, navigate }) => (
  <>
    {/* HERO */}
    <section className="relative min-h-[92vh] flex items-center pt-16 bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs><pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0L0 0 0 40" fill="none" stroke="#dc2626" strokeWidth="1"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-red-50 to-transparent rounded-full -mr-64 -mt-64 opacity-60"/>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full text-red-700 text-sm font-semibold mb-8">
            <span className="w-2 h-2 bg-red-500 rounded-full"/> Professional IT Training by Arohak
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
            Build Skills That<br/>
            <span className="bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent">Matter in Tech</span>
          </h1>
          <p className="text-gray-500 text-xl leading-relaxed max-w-2xl mb-10">
            Arohak offers industry-aligned courses designed by IT professionals. Learn at your own pace, earn certificates, and advance your career.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-amber-600 transition-all duration-200 text-base">
              Get Started Free <ArrowRight size={18}/>
            </button>
            <button onClick={() => navigate('/about')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-md transition-all duration-200 text-base">
              About Arohak <ChevronRight size={18}/>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-gray-100">
            {[{ icon: CheckCircle, text: 'Industry-aligned curriculum' }, { icon: Award, text: 'Completion certificates' }, { icon: Clock, text: 'Learn at your own pace' }]
              .map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-500">
                  <Icon size={16} className="text-red-500 flex-shrink-0"/> {text}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>

    {/* WHY AROHAK */}
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-red-50 border border-red-100 rounded-full text-red-700 text-sm font-semibold mb-4">Why Choose Us</span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Learning built for <span className="bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent">real outcomes</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: GraduationCap, title: 'Expert Instructors', desc: "Learn from Arohak's own IT professionals with real-world project experience.", color: 'from-red-600 to-red-500' },
            { icon: Zap, title: 'Self-Paced Learning', desc: 'Access course materials anytime. Study on your schedule, from any device.', color: 'from-amber-500 to-amber-400' },
            { icon: Award, title: 'Earn Certificates', desc: 'Receive a certificate upon course completion to showcase your achievement.', color: 'from-emerald-500 to-emerald-400' },
            { icon: BookOpen, title: 'Structured Curriculum', desc: 'Well-organized lectures and chapters that take you from basics to advanced.', color: 'from-red-700 to-amber-600' },
            { icon: CheckCircle, title: 'Quizzes & Assessments', desc: 'Test your understanding with built-in quizzes at the end of each course.', color: 'from-amber-600 to-red-500' },
            { icon: Users, title: 'Free Enrollment', desc: 'All courses are free to enroll. No hidden fees, no subscriptions required.', color: 'from-red-500 to-amber-500' },
          ].map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-200 group">
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform duration-200`}>
                  <Icon size={22} className="text-white"/>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>

    {/* COURSES */}
    <CoursesGrid courses={courses} loading={coursesLoading} openCourse={openCourse} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} navigate={navigate} />

    {/* HOW IT WORKS */}
    <section className="py-24 bg-gradient-to-br from-red-700 via-red-600 to-amber-600 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Three steps to get started</h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto">No credit card. No subscription. Just sign up and start learning.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{ num: '01', title: 'Create an Account', desc: 'Sign up for free in seconds. No payment required.' },
            { num: '02', title: 'Enroll in a Course', desc: 'Browse our catalog and enroll in any course instantly.' },
            { num: '03', title: 'Learn & Certify', desc: 'Complete the course, pass the quiz, and earn your certificate.' }]
            .map((step) => (
              <div key={step.num} className="text-center group">
                <div className="w-20 h-20 bg-white/15 border-2 border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-white/25 transition-colors duration-200">
                  <span className="text-3xl font-black text-white">{step.num}</span>
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3">{step.title}</h3>
                <p className="text-white/75 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
        </div>
        <div className="text-center mt-14">
          <button onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-700 font-bold rounded-xl shadow-xl hover:bg-red-50 transition-all duration-200 text-base">
            Get Started Free <ArrowRight size={18}/>
          </button>
        </div>
      </div>
    </section>
  </>
)

// ── Shared courses grid ───────────────────────────────────────────────────────
const CoursesGrid = ({ courses, loading, openCourse, toggleWishlist, isWishlisted, navigate, title = 'Explore Courses', subtitle = 'Start learning today' }) => (
  <section className="py-24 bg-white">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
        <div>
          <span className="inline-block px-4 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-sm font-semibold mb-3">Our Courses</span>
          <h2 className="text-4xl font-black text-gray-900">{title} <span className="bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent">{subtitle}</span></h2>
        </div>
        <button onClick={() => navigate('/courses')}
          className="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-700 transition-colors group flex-shrink-0">
          View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
        </button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden animate-pulse border border-gray-100">
              <div className="h-44 bg-gray-100"/><div className="p-4 space-y-3"><div className="h-4 bg-gray-100 rounded w-3/4"/><div className="h-3 bg-gray-100 rounded w-1/2"/></div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30"/>
          <p className="text-lg font-medium">No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} onClick={() => openCourse(course.id)}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-red-200 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer flex flex-col">
              <div className="relative h-44 bg-gradient-to-br from-red-50 to-amber-50 overflow-hidden">
                {course.image ? <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  : <div className="w-full h-full flex items-center justify-center"><BookOpen size={36} className="text-red-200"/></div>}
                <span className={`absolute top-3 left-3 text-xs font-bold uppercase px-2.5 py-1 rounded-full shadow-sm ${levelBadge(course.level)}`}>{course.level}</span>
                <button onClick={e => { e.stopPropagation(); toggleWishlist(course.id) }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                  <Heart size={14} className={isWishlisted(course.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}/>
                </button>
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">{course.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <GraduationCap size={11} className="text-red-400 flex-shrink-0"/><span className="truncate">{course.teacher}</span>
                </div>
                {course.avgRating > 0 && (
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < Math.round(course.avgRating) ? '#f59e0b' : 'none'} stroke={i < Math.round(course.avgRating) ? '#f59e0b' : '#d1d5db'}/>)}
                    <span className="text-xs text-gray-400 ml-1">{course.avgRating.toFixed(1)}</span>
                  </div>
                )}
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-emerald-600">Free</span>
                  <span className="text-xs text-red-600 font-semibold group-hover:underline">Enroll now →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
)

// ── Logged-in dashboard ───────────────────────────────────────────────────────
const Dashboard = ({ user, enrolledCourses, enrolledLoading, allCourses, allLoading, openCourse, toggleWishlist, isWishlisted, navigate }) => {
  const firstName = user?.name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      {/* WELCOME BANNER */}
      <section className="pt-24 pb-10 bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
            <defs><pattern id="dgrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0L0 0 0 40" fill="none" stroke="#dc2626" strokeWidth="1"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#dgrid)"/>
          </svg>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-red-50 to-transparent rounded-full -mr-48 -mt-48 opacity-70"/>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full text-red-700 text-xs font-semibold mb-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/> {greeting}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">Welcome back, {firstName}!</h1>
              <p className="text-gray-500 text-sm">Ready to continue your learning journey?</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
            {[
              { icon: BookOpen, label: 'Enrolled', value: enrolledLoading ? '…' : enrolledCourses.length, color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: Award, label: 'Certificates', value: enrolledLoading ? '…' : enrolledCourses.filter((c: any) => c.completed).length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: TrendingUp, label: 'In Progress', value: enrolledLoading ? '…' : enrolledCourses.filter((c: any) => !c.completed && c.progress > 0).length, color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={18} className={color}/>
                </div>
                <p className="text-2xl font-black text-gray-900">{value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTINUE LEARNING */}
      {!enrolledLoading && enrolledCourses.length > 0 && (
        <section className="py-12 bg-gray-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Continue Learning</h2>
                <p className="text-gray-500 text-sm mt-0.5">Pick up where you left off</p>
              </div>
              <button onClick={() => navigate('/mycourses')}
                className="text-sm text-red-600 font-bold hover:text-red-700 flex items-center gap-1 group">
                View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {enrolledCourses.slice(0, 3).map((c: any) => (
                <div key={c.id} onClick={() => navigate(`/course/${c.id}`)}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-red-200 hover:shadow-lg transition-all cursor-pointer flex flex-col">
                  <div className="relative h-36 bg-gradient-to-br from-red-50 to-amber-50 overflow-hidden">
                    {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      : <div className="w-full h-full flex items-center justify-center"><BookOpen size={32} className="text-red-200"/></div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all" style={{ width: `${c.progress || 0}%` }}/>
                      </div>
                      <p className="text-white text-xs mt-1 font-semibold">{c.progress || 0}% complete</p>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-red-700 transition-colors mb-1">{c.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{c.teacher}</p>
                    <div className="mt-auto pt-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 group-hover:gap-2 transition-all">
                        <Play size={11} fill="currentColor"/> Continue
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EXPLORE MORE COURSES */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Explore All Courses</h2>
              <p className="text-gray-500 text-sm mt-0.5">Discover something new to learn</p>
            </div>
            <button onClick={() => navigate('/courses')}
              className="text-sm text-red-600 font-bold hover:text-red-700 flex items-center gap-1 group">
              Browse all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
          {allLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-gray-100">
                  <div className="h-40 bg-gray-100"/><div className="p-4 space-y-2"><div className="h-4 bg-gray-100 rounded w-3/4"/><div className="h-3 bg-gray-100 rounded w-1/2"/></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allCourses.slice(0, 6).map((course: any) => (
                <div key={course.id} onClick={() => openCourse(course.id)}
                  className="group bg-white rounded-2xl border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 overflow-hidden cursor-pointer flex flex-col">
                  <div className="relative h-40 bg-gradient-to-br from-red-50 to-amber-50 overflow-hidden">
                    {course.image ? <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      : <div className="w-full h-full flex items-center justify-center"><BookOpen size={32} className="text-red-200"/></div>}
                    <span className={`absolute top-3 left-3 text-xs font-bold uppercase px-2 py-0.5 rounded-full ${levelBadge(course.level)}`}>{course.level}</span>
                    <button onClick={e => { e.stopPropagation(); toggleWishlist(course.id) }}
                      className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                      <Heart size={12} className={isWishlisted(course.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}/>
                    </button>
                  </div>
                  <div className="p-4 flex flex-col gap-1.5 flex-1">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-red-700 transition-colors">{course.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <GraduationCap size={10} className="text-red-400"/><span className="truncate">{course.teacher}</span>
                    </div>
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-emerald-600">Free</span>
                      <span className="text-xs text-red-600 font-semibold">Enroll →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

// ── Main Home component ───────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate()
  const { isSignedIn, user, getToken } = useAuth() as any
  const [showModal, setShowModal] = useState(false)
  const { toggle: toggleWishlist, isWishlisted } = useWishlist()

  // Public courses (for landing page)
  const [courses, setCourses] = useState<any[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)

  // Dashboard data
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [enrolledLoading, setEnrolledLoading] = useState(true)
  const [allCourses, setAllCourses] = useState<any[]>([])
  const [allLoading, setAllLoading] = useState(true)

  // Load public courses for landing
  useEffect(() => {
    if (isSignedIn) return
    fetch(`${API_BASE}/api/course/public?home=true&limit=6`)
      .then(r => r.json())
      .then(j => setCourses((j?.items || j?.courses || []).slice(0, 6).map((c: any) => ({
        id: String(c._id || c.id || ''), name: c.name, teacher: c.teacher || '',
        level: c.level || 'beginner', image: c.image || '',
        avgRating: typeof c.avgRating === 'number' ? c.avgRating : 0,
        totalRatings: c.totalRatings || 0,
      }))))
      .catch(() => {})
      .finally(() => setCoursesLoading(false))
  }, [isSignedIn])

  // Load dashboard data when signed in
  useEffect(() => {
    if (!isSignedIn) return
    const token = getToken()
    const headers = { Authorization: `Bearer ${token}` }

    // Enrolled courses with progress
    fetch(`${API_BASE}/api/booking/my`, { headers })
      .then(r => r.json())
      .then(async d => {
        const bookings = d.bookings || []
        const withCourses = await Promise.all(bookings.map(async (b: any) => {
          const courseId = b.course || b.courseId
          if (!courseId) return null
          try {
            const [courseRes, progressRes] = await Promise.all([
              fetch(`${API_BASE}/api/course/${courseId}`, { headers }),
              fetch(`${API_BASE}/api/booking/progress?courseId=${courseId}`, { headers }),
            ])
            const courseData = await courseRes.json()
            const progressData = await progressRes.json()
            const course = courseData.course
            if (!course) return null
            const totalChapters = (course.lectures || []).reduce((s: number, l: any) =>
              s + (Array.isArray(l.chapters) ? l.chapters.length : 1), 0)
            const completedChapters = (progressData.completedChapters || []).length
            const progress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0
            return {
              id: String(course._id || course.id || courseId),
              name: course.name, teacher: course.teacher || '',
              image: course.image || '', level: course.level || 'beginner',
              progress, completed: progress === 100,
            }
          } catch { return null }
        }))
        setEnrolledCourses(withCourses.filter(Boolean))
      })
      .catch(() => {})
      .finally(() => setEnrolledLoading(false))

    // All courses
    fetch(`${API_BASE}/api/course/public?limit=6`, { headers })
      .then(r => r.json())
      .then(j => setAllCourses((j?.items || j?.courses || []).map((c: any) => ({
        id: String(c._id || c.id || ''), name: c.name, teacher: c.teacher || '',
        level: c.level || 'beginner', image: c.image || '',
        avgRating: typeof c.avgRating === 'number' ? c.avgRating : 0,
      }))))
      .catch(() => {})
      .finally(() => setAllLoading(false))
  }, [isSignedIn])

  const openCourse = (id: string) => navigate(`/course/${id}`)

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}

      {isSignedIn ? (
        <Dashboard
          user={user}
          enrolledCourses={enrolledCourses}
          enrolledLoading={enrolledLoading}
          allCourses={allCourses}
          allLoading={allLoading}
          openCourse={openCourse}
          toggleWishlist={toggleWishlist}
          isWishlisted={isWishlisted}
          navigate={navigate}
        />
      ) : (
        <LandingPage
          setShowModal={setShowModal}
          courses={courses}
          coursesLoading={coursesLoading}
          openCourse={openCourse}
          toggleWishlist={toggleWishlist}
          isWishlisted={isWishlisted}
          navigate={navigate}
        />
      )}

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} transition={Slide} theme="light"/>
    </div>
  )
}

export default Home
