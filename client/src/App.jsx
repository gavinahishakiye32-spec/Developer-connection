import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import PostJob from './pages/PostJob'
import ManageJobs from './pages/ManageJobs'
import Applications from './pages/Applications'
import Invitations from './pages/Invitations'
import SearchDevelopers from './pages/SearchDevelopers'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import OAuthCallback from './pages/OAuthCallback'

// Full-screen loader shown while the auth cookie is being validated.
// Rendered BEFORE any routing so the URL never flickers or redirects
// during the initial session check.
function AppLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-lg">DC</span>
      </div>
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function AppRoutes() {
  const { loading } = useAuth()

  // Block ALL rendering (and therefore all routing/redirects) until
  // the /auth/me check completes. This prevents the URL from changing
  // while the session is being validated.
  if (loading) return <AppLoader />

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />

          {/* Protected - All authenticated users */}
          <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/invitations" element={<ProtectedRoute><Invitations /></ProtectedRoute>} />

          {/* Developer only */}
          <Route path="/applications" element={<ProtectedRoute role="developer"><Applications /></ProtectedRoute>} />

          {/* Employer only */}
          <Route path="/post-job" element={<ProtectedRoute role="employer"><PostJob /></ProtectedRoute>} />
          <Route path="/manage-jobs" element={<ProtectedRoute role="employer"><ManageJobs /></ProtectedRoute>} />
          <Route path="/search-developers" element={<ProtectedRoute role="employer"><SearchDevelopers /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
