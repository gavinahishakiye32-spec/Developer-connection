import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Token is kept in sessionStorage (not persisted to disk, not accessible cross-tab)
// User profile (no token) is kept in localStorage for UX persistence across refreshes
const TOKEN_KEY = 'devcon_token'
const USER_KEY = 'devcon_user'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY)
    const storedToken = sessionStorage.getItem(TOKEN_KEY)
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    } else {
      // Clear stale data if either piece is missing
      localStorage.removeItem(USER_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    const { token, ...profile } = userData
    setUser(profile)
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
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
