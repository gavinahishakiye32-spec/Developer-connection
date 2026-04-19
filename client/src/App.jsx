import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
