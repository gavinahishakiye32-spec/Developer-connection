import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import LevelBadge from '../components/LevelBadge'

export default function ManageJobs() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobsAPI.getAll().then(res => {
      const myJobs = res.data.filter(j => j.postedBy?._id === user._id)
      setJobs(myJobs)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-600 text-sm mt-1">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Link to="/post-job" className="btn-primary">+ Post Job</Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💼</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs posted yet</h3>
          <p className="text-gray-500 mb-4">Start hiring by posting your first job.</p>
          <Link to="/post-job" className="btn-primary">Post a Job</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-2">{job.company}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <LevelBadge level={job.level} />
                    <span className="text-sm text-gray-500">{job.applicants?.length || 0} applicants</span>
                  </div>
                </div>
                <Link to={`/jobs/${job._id}`} className="btn-secondary text-sm py-1.5 px-3 flex-shrink-0">
                  View & Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
