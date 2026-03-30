import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Add from './pages/Add'
import List from './pages/List'
import Bookings from './pages/Bookings'
import Edit from './pages/Edit'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import { useAdminAuth } from './context/AdminAuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth()
  const location = useLocation()
  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
    </div>
  )
  if (!isAdmin) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/addcourse" element={<ProtectedRoute><Add /></ProtectedRoute>} />
      <Route path="/listcourse" element={<ProtectedRoute><List /></ProtectedRoute>} />
      <Route path="/editcourse/:id" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App