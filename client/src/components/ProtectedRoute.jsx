import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// By the time this renders, loading is always false (App.jsx blocks routing until then).
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/feed" replace />

  return children
}
