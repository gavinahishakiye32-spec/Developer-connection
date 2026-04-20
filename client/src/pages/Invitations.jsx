import { invitationsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useCachedFetch } from '../hooks/useCachedFetch'
import Avatar from '../components/Avatar'
import LevelBadge from '../components/LevelBadge'

const statusStyle = { pending: 'badge-yellow', accepted: 'badge-green', declined: 'badge-red' }

const timeAgo = (date) => {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export default function Invitations() {
  const { user } = useAuth()

  const { data: invitations, loading, mutate } = useCachedFetch(
    'invitations',
    () => invitationsAPI.getAll().then(r => r.data)
  )

  const respond = async (id, status) => {
    // Optimistic update — change status instantly
    mutate(prev => (prev || []).map(inv => inv._id === id ? { ...inv, status } : inv))
    try {
      await invitationsAPI.respond(id, { status })
    } catch (err) {
      // Rollback
      mutate(prev => (prev || []).map(inv => inv._id === id ? { ...inv, status: 'pending' } : inv))
      console.error(err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === 'developer' ? 'My Invitations' : 'Sent Invitations'}
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          {(invitations || []).length} invitation{(invitations || []).length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (invitations || []).length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📨</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No invitations yet</h3>
          <p className="text-gray-500">
            {user?.role === 'developer'
              ? 'Employers will send you invitations when they find your profile.'
              : 'Search for developers and send them invitations.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(invitations || []).map(inv => (
            <div key={inv._id} className="card">
              <div className="flex items-start gap-4">
                {user?.role === 'developer'
                  ? <Avatar name={inv.employer?.name} avatar={inv.employer?.avatar} size="lg" />
                  : <Avatar name={inv.developer?.name} avatar={inv.developer?.avatar} size="lg" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {user?.role === 'developer' ? (
                        <>
                          <p className="font-semibold text-gray-900">{inv.employer?.name}</p>
                          <p className="text-sm text-blue-600">{inv.employer?.company}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-gray-900">{inv.developer?.name}</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {inv.developer?.level && <LevelBadge level={inv.developer.level} />}
                            {inv.developer?.skills?.slice(0, 3).map((s, i) => (
                              <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <span className={`badge ${statusStyle[inv.status]} capitalize flex-shrink-0`}>{inv.status}</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Job: <span className="font-medium">{inv.job?.title}</span>
                      {inv.job?.level && <span className="ml-2"><LevelBadge level={inv.job.level} /></span>}
                    </p>
                  </div>
                  {inv.message && <p className="text-sm text-gray-600 bg-gray-50 rounded p-2 mt-2">{inv.message}</p>}
                  <p className="text-xs text-gray-400 mt-2">{timeAgo(inv.createdAt)}</p>
                  {user?.role === 'developer' && inv.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => respond(inv._id, 'accepted')} className="btn-success text-sm py-1.5 px-4">Accept</button>
                      <button onClick={() => respond(inv._id, 'declined')} className="btn-danger text-sm py-1.5 px-4">Decline</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
