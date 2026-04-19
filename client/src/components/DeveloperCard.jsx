import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import LevelBadge from './LevelBadge'

export default function DeveloperCard({ developer, action }) {
  return (
    <div className="card flex items-start gap-4">
      <Link to={`/profile/${developer._id}`}>
        <Avatar name={developer.name} avatar={developer.avatar} size="lg" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/profile/${developer._id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {developer.name}
            </Link>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <LevelBadge level={developer.level} />
              {developer.location && (
                <span className="text-xs text-gray-500">📍 {developer.location}</span>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>

        {developer.bio && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{developer.bio}</p>
        )}

        {developer.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {developer.skills.slice(0, 5).map((skill, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
            {developer.skills.length > 5 && (
              <span className="text-xs text-gray-500">+{developer.skills.length - 5} more</span>
            )}
          </div>
        )}

        {/* Links */}
        {(developer.github || developer.portfolio) && (
          <div className="flex gap-3 mt-2">
            {developer.github && (
              <a
                href={developer.github.startsWith('http') ? developer.github : `https://github.com/${developer.github}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                </svg>
                GitHub
              </a>
            )}
            {developer.portfolio && (
              <a
                href={developer.portfolio.startsWith('http') ? developer.portfolio : `https://${developer.portfolio}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Portfolio
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
