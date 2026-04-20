import { notificationsAPI } from '../services/api'
import { useCachedFetch } from '../hooks/useCachedFetch'

const typeIcon = {
  application: '📋',
  application_status: '✅',
  invitation: '📨',
  invitation_response: '🔔',
}

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Notifications() {
  const { data: notifications, loading, mutate } = useCachedFetch(
    'notifications',
    () => notificationsAPI.getAll().then(r => r.data)
  )

  const markAllRead = async () => {
    // Optimistic — mark all read instantly
    mutate(prev => (prev || []).map(n => ({ ...n, read: true })))
    try {
      await notificationsAPI.markRead()
    } catch (err) {
      console.error(err)
    }
  }

  const unreadCount = (notifications || []).filter(n => !n.read).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-blue-600 mt-1">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm">Mark all read</button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card animate-pulse flex gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (notifications || []).length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No notifications yet</h3>
          <p className="text-gray-500">You'll be notified about applications, invitations, and updates.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {(notifications || []).map(n => (
            <div key={n._id}
              className={`card flex items-start gap-3 transition-colors ${!n.read ? 'border-blue-200 bg-blue-50/30' : ''}`}>
              <span className="text-xl flex-shrink-0">{typeIcon[n.type] || '🔔'}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
