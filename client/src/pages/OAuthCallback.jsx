import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// This page handles the redirect from the server after OAuth login.
// The server encodes user+token as base64 in ?data=...
export default function OAuthCallback() {
  const [params] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const data = params.get('data')
    if (!data) {
      navigate('/login?error=oauth_failed')
      return
    }
    try {
      const user = JSON.parse(atob(data))
      login(user)
      // New OAuth users have no level/role set properly yet — send them to profile
      navigate('/feed')
    } catch {
      navigate('/login?error=oauth_failed')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  )
}
