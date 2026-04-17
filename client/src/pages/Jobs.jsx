import { useState, useEffect } from 'react'
import { jobsAPI } from '../services/api'
import JobCard from '../components/JobCard'
import { useAuth } from '../context/AuthContext'

export default function Jobs() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [levelFilter, setLevelFilter] = useState('')

  useEffect(() => {
    loadJobs()
  }, [levelFilter])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const params = {}
      if (levelFilter) params.level = levelFilter
      const res = await jobsAPI.getAll(params)
      setJobs(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Board</h1>
          <p className="text-gray-600 text-sm mt-1">
            {user?.role === 'developer' ? `Showing jobs for your level: ${user.level}` : 'All posted jobs'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'beginner', 'intermediate', 'experienced'].map(l => (
          <button
            key={l}
            onClick={() => setLevelFilter(l)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              levelFilter === l
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
            }`}
          >
            {l === '' ? 'All Levels' : l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💼</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs found</h3>
          <p className="text-gray-500">Try a different filter or check back later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
