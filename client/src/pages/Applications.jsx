import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationsAPI } from '../services/api'
import LevelBadge from '../components/LevelBadge'

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    applicationsAPI.getMy().then(res => setApplications(res.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const statusStyle = {
    pending: 'badge-yellow',
    accepted: 'badge-green',
    rejected: 'badge-red',
  }

  const timeAgo = (date) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 text-sm mt-1">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No applications yet</h3>
          <p className="text-gray-500 mb-4">Browse jobs and apply to get started.</p>
          <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link to={`/jobs/${app.job?._id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-lg">
                    {app.job?.title}
                  </Link>
                  <p className="text-blue-600 text-sm font-medium mt-0.5">{app.job?.company}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {app.job?.level && <LevelBadge level={app.job.level} />}
                    <span className="text-xs text-gray-500">Applied {timeAgo(app.createdAt)}</span>
                  </div>
                  {app.coverLetter && (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded p-2 line-clamp-2">{app.coverLetter}</p>
                  )}
                </div>
                <span className={`badge ${statusStyle[app.status]} capitalize flex-shrink-0`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
