import { Link } from 'react-router-dom'
import LevelBadge from './LevelBadge'
import { useAuth } from '../context/AuthContext'

export default function JobCard({ job, saved, onToggleSave }) {
  const { user } = useAuth()

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  // Skill match: how many of the job's required skills the developer has
  const matchedSkills = user?.role === 'developer' && job.requiredSkills?.length > 0
    ? job.requiredSkills.filter(s => user.skills?.map(sk => sk.toLowerCase()).includes(s.toLowerCase()))
    : []
  const matchPercent = job.requiredSkills?.length > 0
    ? Math.round((matchedSkills.length / job.requiredSkills.length) * 100)
    : null

  const jobTypeColors = {
    'full-time': 'bg-green-100 text-green-700',
    'part-time': 'bg-yellow-100 text-yellow-700',
    'contract': 'bg-purple-100 text-purple-700',
    'internship': 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="card hover:shadow-md transition-shadow relative">
      {/* Save button */}
      {user?.role === 'developer' && onToggleSave && (
        <button
          onClick={(e) => { e.preventDefault(); onToggleSave(job._id) }}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 transition-colors"
          title={saved ? 'Unsave job' : 'Save job'}
        >
          {saved ? (
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </button>
      )}

      <Link to={`/jobs/${job._id}`} className="block">
        <div className="flex items-start gap-3 pr-8">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{job.title}</h3>
            <p className="text-blue-600 font-medium text-sm mb-2">{job.company}</p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <LevelBadge level={job.level} />
              {job.jobType && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${jobTypeColors[job.jobType] || 'bg-gray-100 text-gray-600'}`}>
                  {job.jobType}
                </span>
              )}
              {job.remote && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium">🌍 Remote</span>
              )}
              {job.location && !job.remote && (
                <span className="text-xs text-gray-500">📍 {job.location}</span>
              )}
              {job.location && job.remote && (
                <span className="text-xs text-gray-500">📍 {job.location}</span>
              )}
            </div>

            {/* Salary */}
            {job.salary && (
              <p className="text-sm font-medium text-gray-700 mb-2">💰 {job.salary}</p>
            )}

            {/* Description preview */}
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{job.description}</p>

            {/* Required skills */}
            {job.requiredSkills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {job.requiredSkills.slice(0, 5).map((skill, i) => {
                  const matched = matchedSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                  return (
                    <span
                      key={i}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        matched
                          ? 'bg-green-100 text-green-700 font-medium'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {matched && '✓ '}{skill}
                    </span>
                  )
                })}
                {job.requiredSkills.length > 5 && (
                  <span className="text-xs text-gray-400">+{job.requiredSkills.length - 5} more</span>
                )}
              </div>
            )}

            {/* Skill match bar */}
            {matchPercent !== null && user?.role === 'developer' && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Skill match</span>
                  <span className={matchPercent >= 70 ? 'text-green-600 font-medium' : matchPercent >= 40 ? 'text-yellow-600' : 'text-gray-500'}>
                    {matchPercent}% ({matchedSkills.length}/{job.requiredSkills.length})
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      matchPercent >= 70 ? 'bg-green-500' : matchPercent >= 40 ? 'bg-yellow-400' : 'bg-gray-300'
                    }`}
                    style={{ width: `${matchPercent}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Posted by {job.postedBy?.name}</span>
              <span>•</span>
              <span>{timeAgo(job.createdAt)}</span>
              <span>•</span>
              <span>{job.applicants?.length || 0} applicants</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
