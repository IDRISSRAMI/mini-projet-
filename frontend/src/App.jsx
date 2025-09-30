import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import AuthProvider, { useAuth } from './context/AuthProvider.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './page/Home.jsx'
import Login from './page/Login.jsx'
import Register from './page/Register.jsx'
import Profile from './page/Profile.jsx'
import Tickets from './page/Tickets.jsx'
import Dashboard from './page/Dashboard.jsx'

function Navigation() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  if (isAuthPage) return null

  return (
    <nav className="bg-white/90 backdrop-blur shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-[#3D5681] hover:text-[#4299E1] transition"
            >
              TicketApp
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-[#3D5681] hover:text-[#4299E1] transition px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </button>
                { !user.isAdmin && (
                <button
                  onClick={() => navigate('/tickets')}
                  className="text-[#3D5681] hover:text-[#4299E1] transition px-3 py-2 rounded-md text-sm font-medium"
                  >
                  Tickets
                  </button>

                )}
                <button
                  onClick={() => navigate('/profile')}
                  className="text-[#3D5681] hover:text-[#4299E1] transition px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#3D5681] hover:text-[#4299E1] transition px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-[#4299E1] hover:bg-[#377fc2] text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function AppContent() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App