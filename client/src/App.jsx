import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CacheProvider } from './context/CacheContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import { postsAPI, jobsAPI } from './services/api'
import { useCache } from './context/CacheContext'

// Lazy-load every page — each becomes its own JS chunk loaded on demand.
// The browser only downloads the code for the page the user actually visits.
const Home            = lazy(() => import('./pages/Home'))
const Login           = lazy(() => import('./pages/Login'))
const Register        = lazy(() => import('./pages/Register'))
const Feed            = lazy(() => import('./pages/Feed'))
const Jobs            = lazy(() => import('./pages/Jobs'))
const JobDetail       = lazy(() => import('./pages/JobDetail'))
const PostJob         = lazy(() => import('./pages/PostJob'))
const ManageJobs      = lazy(() => import('./pages/ManageJobs'))
const Applications    = lazy(() => import('./pages/Applications'))
const Invitations     = lazy(() => import('./pages/Invitations'))
const SearchDevelopers = lazy(() => import('./pages/SearchDevelopers'))
const Notifications   = lazy(() => import('./pages/Notifications'))
const Profile         = lazy(() => import('./pages/Profile'))
const OAuthCallback   = lazy(() => import('./pages/OAuthCallback'))

// Shown while a lazy page chunk is downloading (usually <200ms on fast connections)
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// Full-screen loader shown while the auth cookie is being validated.
// Blocks ALL routing so the URL never flickers during the session check.
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
  const { loading, user } = useAuth()
  const cache = useCache()

  // As soon as auth resolves and user is logged in, prefetch the two most
  // visited pages (Feed + Jobs) in the background — before the user navigates
  useEffect(() => {
    if (!user) return
    if (cache.get('posts') === null) {
      postsAPI.getAll().then(r => cache.set('posts', r.data)).catch(() => {})
    }
    if (cache.get('jobs:all') === null) {
      jobsAPI.getAll().then(r => cache.set('jobs:all', r.data)).catch(() => {})
    }
  }, [user])

  if (loading) return <AppLoader />

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <CacheProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </CacheProvider>
  )
}
