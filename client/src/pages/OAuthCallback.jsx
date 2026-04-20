import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

// The server sets an httpOnly cookie during the OAuth redirect.
// This page just calls /auth/me to fetch the user profile from that cookie.
// No token ever appears in the URL.
export default function OAuthCallback() {
  const [params] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (params.get('error') === 'oauth_failed') {
      navigate('/login?error=oauth_failed')
      return
    }

    api.get('/auth/me')
      .then((res) => {
        login(res.data)
        navigate('/feed')
      })
      .catch(() => {
        navigate('/login?error=oauth_failed')
      })
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
