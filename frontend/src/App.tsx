import React, { useEffect, useState } from 'react'
import  { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Courses from './pages/Courses'
import { ArrowUp } from 'lucide-react'
import CourseDetailPageHome from './pages/CourseDetailPageHome'
import CourseDetailPage from './CourseDetailPage'
import MyCoursePage from './pages/MyCoursePage'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import { useAuth } from './context/AuthContext'

const RedirectCourse = () => {
  const { id } = useParams()
  return <Navigate to={`/course/${id}`} replace />
}

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!isSignedIn) return <Navigate to='/' state={{ from: location }} replace />
  return children
}

const ScrollToTopOnRouteChange = () => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto'})
  }, [location])
}

const ScrollTopButton = ({ threshold = 200, showOnMount = false }) => {
  const [visible, setVisible] = useState(!!showOnMount)
 
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth'})
  }

  if (!visible) return null

  return (
    <button onClick={scrollToTop}
    className={ 'fixed right-6 bottom-6 z-50 p-2 rounded-full focus:outline-none focus:ring-sky-300' +
                'backdrop-blur-sm border border-white/20 shadow-lg cursor-pointer transition-transform'
    }
    >
      <ArrowUp className='w-6 h-6 tect-sky-600 drop-shadow-sm' />
    </button>
  )
}

const App = () => {
  return (
  <>
   <ScrollToTopOnRouteChange />
   <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/courses' element={<Courses />} />
      <Route path='/mycourses' element={<MyCoursePage />} />

      <Route path='/course/:id' element={<ProtectedRoute>
        <CourseDetailPageHome />
      </ProtectedRoute>} />

          <Route path='/course/:id/details' element={<ProtectedRoute>
        <CourseDetailPage />
      </ProtectedRoute>} />
      <Route path='/booking/success' element={<Navigate to='/mycourses' replace />} />
      <Route path='/booking/cancel' element={<Navigate to='/courses' replace />} />
      <Route path='/verify-email' element={<VerifyEmail />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Redirect legacy /courses/:id URLs to /course/:id */}
      <Route path='/courses/:id' element={<RedirectCourse />} />

   </Routes>

   <ScrollTopButton threshold={250} />
  </>
  )
} 

export default App;