import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { notificationsAPI } from '../services/api'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [unread, setUnread] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (user) {
      notificationsAPI.getAll().then(res => {
        setUnread(res.data.filter(n => !n.read).length)
      }).catch(() => {})
    }
  }, [user, location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DC</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">DevConnect</span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/feed" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/feed') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                Feed
              </Link>
              <Link to="/jobs" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/jobs') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                Jobs
              </Link>
              {user.role === 'developer' && (
                <>
                  <Link to="/applications" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/applications') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                    Applications
                  </Link>
                  <Link to="/invitations" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/invitations') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                    Invitations
                  </Link>
                </>
              )}
              {user.role === 'employer' && (
                <>
                  <Link to="/post-job" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/post-job') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                    Post Job
                  </Link>
                  <Link to="/manage-jobs" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/manage-jobs') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                    Manage Jobs
                  </Link>
                  <Link to="/search-developers" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/search-developers') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                    Find Devs
                  </Link>
                  <Link to="/invitations" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/invitations') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                    Invitations
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                      <hr className="my-1" />
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-1.5 px-3">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-3">Sign Up</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        {user && (
          <div className="md:hidden flex gap-1 pb-2 overflow-x-auto">
            <Link to="/feed" className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isActive('/feed') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>Feed</Link>
            <Link to="/jobs" className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isActive('/jobs') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>Jobs</Link>
            {user.role === 'developer' && (
              <>
                <Link to="/applications" className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isActive('/applications') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>Applications</Link>
                <Link to="/invitations" className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isActive('/invitations') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>Invitations</Link>
              </>
            )}
            {user.role === 'employer' && (
              <>
                <Link to="/post-job" className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isActive('/post-job') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>Post Job</Link>
                <Link to="/manage-jobs" className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isActive('/manage-jobs') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>Manage</Link>
                <Link to="/search-developers" className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isActive('/search-developers') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>Find Devs</Link>
                <Link to="/invitations" className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isActive('/invitations') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>Invitations</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
