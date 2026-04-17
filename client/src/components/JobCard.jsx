import { Link } from 'react-router-dom'
import LevelBadge from './LevelBadge'

export default function JobCard({ job }) {
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  return (
    <Link to={`/jobs/${job._id}`} className="card block hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{job.title}</h3>
          <p className="text-blue-600 font-medium text-sm mb-2">{job.company}</p>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{job.description}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <LevelBadge level={job.level} />
            <span className="text-xs text-gray-500">Posted by {job.postedBy?.name}</span>
            <span className="text-xs text-gray-400">• {timeAgo(job.createdAt)}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-xs text-gray-500">{job.applicants?.length || 0} applicants</span>
        </div>
      </div>
    </Link>
  )
}
