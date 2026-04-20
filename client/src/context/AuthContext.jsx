import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

const USER_KEY = 'devcon_user'

// Read cached user synchronously — this runs before the first render
// so returning users see the app instantly with no loading screen.
const readCachedUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage — no loading flash for returning users
  const [user, setUser] = useState(readCachedUser)
  // Only show the full-screen loader if there is NO cached user at all
  const [loading, setLoading] = useState(!readCachedUser())

  useEffect(() => {
    // Always validate the cookie in the background.
    // If cached user exists: this runs silently and updates if anything changed.
    // If no cached user: this is the first visit, loading=true until resolved.
    api.get('/auth/me')
      .then((res) => {
        setUser(res.data)
        localStorage.setItem(USER_KEY, JSON.stringify(res.data))
      })
      .catch(() => {
        // Cookie invalid or expired — clear everything
        setUser(null)
        localStorage.removeItem(USER_KEY)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch { /* ignore */ }
    setUser(null)
    localStorage.removeItem(USER_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
