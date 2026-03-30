import React, { useEffect, useState } from 'react'
import { BookMarked, BookOpenText, Search, ShoppingCart, Users, TrendingUp, Award, BarChart3, ArrowUpRight } from 'lucide-react'

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'

const fmtCurrency = (n) => String(Number(n) || 0)

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statsData, setStatsData] = useState(null)
  const [coursesData, setCoursesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const buildStats = (backendStats) => {
    const totalBookings = backendStats?.totalBookings ?? 0
    const bookingsLast7Days = backendStats?.bookingsLast7Days ?? 0
    const topCourses = backendStats?.topCourses ?? []
    return [
      { title: 'Total Enrollments', value: totalBookings, icon: Users, color: 'red', trend: '+12%' },
      { title: 'Enrollments (7d)', value: bookingsLast7Days, icon: TrendingUp, color: 'amber', trend: '+8%' },
      { title: 'Top Courses', value: topCourses.length || 0, icon: Award, color: 'green', trend: 'Active' },
    ]
  }

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    const fetchStats = () =>
      fetch(`${API_BASE}/api/booking/stats`).then(r => r.json()).then(j => j.success ? j.stats : Promise.reject(j.message))
    const fetchCourses = () =>
      fetch(`${API_BASE}/api/course`).then(r => r.json()).then(j => j.success ? j.courses : Promise.reject(j.message))

    Promise.all([fetchStats(), fetchCourses()])
      .then(([stats, courses]) => {
        if (!mounted) return
        const topLookup = {}
        Array.isArray(stats?.topCourses) && stats.topCourses.forEach(t => {
          if (!t) return
          topLookup[t.courseName || ''] = { purchases: Number(t.count || 0), revenue: Number(t.revenue || 0) }
        })
        const mapped = (courses || []).map(c => {
          const id = c._id ?? c.id ?? ''
          const name = c.name ?? 'Untitled'
          const metrics = topLookup[name] || { purchases: 0, revenue: 0 }
          return {
            id, image: c.image ?? '', name,
            instructor: c.teacher ?? 'Unknown',
            students: metrics.purchases || (c.students ?? 0),
            purchases: metrics.purchases || (c.purchases ?? 0),
            earnings: fmtCurrency(metrics.revenue ?? c.earnings ?? 0),
          }
        })
        setStatsData(buildStats(stats))
        setCoursesData(mapped)
      })
      .catch(err => { if (mounted) setError(String(err)) })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  const stats = statsData || [
    { title: 'Total Enrollments', value: 0, icon: Users, color: 'red', trend: '—' },
    { title: 'Enrollments (7d)', value: 0, icon: TrendingUp, color: 'amber', trend: '—' },
    { title: 'Top Courses', value: 0, icon: Award, color: 'green', trend: '—' },
  ]

  const filteredCourses = coursesData.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.instructor || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statColors = {
    red: { bg: 'from-red-600 to-red-500', light: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
    amber: { bg: 'from-amber-500 to-amber-400', light: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    green: { bg: 'from-emerald-500 to-emerald-400', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  }

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-white via-red-50/20 to-amber-50/10 relative overflow-hidden">

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-0 right-0 w-80 h-80 opacity-[0.04]" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="180" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="10 5"/>
          <circle cx="200" cy="200" r="100" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4"/>
        </svg>
        <div className="absolute top-40 right-20 w-64 h-64 bg-red-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-amber-200/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">

        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 text-base mt-1 font-medium">Welcome back — here's your overview</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-red-100 shadow-sm">
            <BarChart3 size={16} className="text-red-500" />
            <span className="text-sm font-semibold text-gray-700">Live Analytics</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon || Users
            const colors = statColors[stat.color] || statColors.red
            return (
              <div key={stat.title}
                className={`bg-white rounded-2xl p-6 border ${colors.border} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden`}
                style={{ animationDelay: `${index * 100}ms` }}>
                {/* Background decoration */}
                <div className={`absolute top-0 right-0 w-24 h-24 ${colors.light} rounded-full -mr-8 -mt-8 opacity-50`} />
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.title}</p>
                    <p className="text-4xl font-extrabold text-gray-900">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${colors.text}`}>
                      <ArrowUpRight size={12} />
                      {stat.trend}
                    </div>
                  </div>
                  <div className={`p-3 bg-gradient-to-br ${colors.bg} rounded-xl shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Courses table */}
        <div className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-red-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-600 to-amber-500 rounded-xl shadow-md">
                <BookOpenText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Course Performance</h2>
                <p className="text-xs text-gray-500">{filteredCourses.length} courses total</p>
              </div>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search courses..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-red-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-400 w-full sm:w-64 text-sm bg-white text-gray-900 placeholder-gray-400 transition-all" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-red-50 to-amber-50 border-b border-red-100">
                <tr>
                  {['Course', 'Students', 'Purchases', 'Earnings'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-red-50">
                {filteredCourses.map((course, index) => (
                  <tr key={course.id || index} className="hover:bg-red-50/40 transition-colors duration-150 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {course.image ? (
                          <img src={course.image} alt={course.name} className="w-12 h-10 rounded-xl object-cover shadow-md flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-10 rounded-xl bg-gradient-to-br from-red-100 to-amber-100 flex items-center justify-center flex-shrink-0">
                            <BookMarked size={16} className="text-red-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-sm group-hover:text-red-700 transition-colors">{course.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{course.instructor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-red-400" />
                        <span className="font-semibold text-gray-700 text-sm">{course.students}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingCart size={14} className="text-amber-500" />
                        <span className="font-semibold text-gray-700 text-sm">{course.purchases}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-600 text-sm">{course.earnings}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCourses.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8 text-red-300" />
                </div>
                <p className="text-gray-500 text-base">No courses found</p>
                <button onClick={() => setSearchTerm('')} className="mt-2 text-red-600 hover:text-red-700 font-bold text-sm">Clear Search</button>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
