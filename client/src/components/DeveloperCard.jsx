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
      </div>
    </div>
  )
}
