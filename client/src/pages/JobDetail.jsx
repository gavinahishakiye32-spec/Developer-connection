import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobsAPI, applicationsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import LevelBadge from '../components/LevelBadge'
import Avatar from '../components/Avatar'

export default function JobDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [applications, setApplications] = useState([])
  const [showApps, setShowApps] = useState(false)

  useEffect(() => {
    loadJob()
  }, [id])

  const loadJob = async () => {
    try {
      const res = await jobsAPI.getById(id)
      setJob(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    setError('')
    setApplying(true)
    try {
      await applicationsAPI.apply(id, { coverLetter })
      setApplied(true)
      setSuccess('Application submitted successfully!')
      loadJob()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  const loadApplications = async () => {
    try {
      const res = await applicationsAPI.getForJob(id)
      setApplications(res.data)
      setShowApps(true)
    } catch (err) {
      console.error(err)
    }
  }

  const updateStatus = async (appId, status) => {
    try {
      await applicationsAPI.updateStatus(appId, { status })
      setApplications(applications.map(a => a._id === appId ? { ...a, status } : a))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="card animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-64 mb-3"></div>
          <div className="h-5 bg-gray-200 rounded w-40 mb-6"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) return <div className="text-center py-16 text-gray-500">Job not found</div>

  const isOwner = user?.role === 'employer' && job.postedBy?._id === user._id
  const levelMatch = user?.role === 'developer' && user.level === job.level

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Job Header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
            <p className="text-blue-600 font-semibold text-lg">{job.company}</p>
          </div>
          <LevelBadge level={job.level} />
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm">
          {job.jobType && (
            <span className="inline-flex items-center gap-1 text-gray-600 capitalize">
              🗂 {job.jobType}
            </span>
          )}
          {job.location && (
            <span className="inline-flex items-center gap-1 text-gray-600">
              📍 {job.location}
            </span>
          )}
          {job.remote && (
            <span className="inline-flex items-center gap-1 text-teal-600 font-medium">
              🌍 Remote
            </span>
          )}
          {job.salary && (
            <span className="inline-flex items-center gap-1 text-gray-700 font-medium">
              💰 {job.salary}
            </span>
          )}
        </div>

        {/* Required skills */}
        {job.requiredSkills?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {job.requiredSkills.map((skill, i) => {
                const matched = user?.skills?.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                return (
                  <span
                    key={i}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      matched ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {matched && '✓ '}{skill}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        <p className="text-gray-700 whitespace-pre-wrap mb-4">{job.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
          <span>Posted by <strong>{job.postedBy?.name}</strong></span>
          <span>•</span>
          <span>{job.applicants?.length || 0} applicants</span>
        </div>
      </div>

      {/* Apply Section (Developer) */}
      {user?.role === 'developer' && !isOwner && (
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3">Apply for this Job</h2>
          {!levelMatch && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4 text-sm">
              ⚠️ This job requires <strong>{job.level}</strong> level. Your level is <strong>{user.level}</strong>. You cannot apply.
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>
          )}
          {!applied && levelMatch && (
            <form onSubmit={handleApply} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter <span className="text-gray-400">(optional)</span></label>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Tell the employer why you're a great fit..."
                />
              </div>
              <button type="submit" disabled={applying} className="btn-primary">
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
          {applied && (
            <p className="text-green-600 font-medium">✓ Application submitted</p>
          )}
        </div>
      )}

      {/* Employer: View Applications */}
      {isOwner && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Applications ({job.applicants?.length || 0})</h2>
            {!showApps && (
              <button onClick={loadApplications} className="btn-secondary text-sm">View Applications</button>
            )}
          </div>
          {showApps && (
            <div className="space-y-4">
              {applications.length === 0 ? (
                <p className="text-gray-500 text-sm">No applications yet.</p>
              ) : (
                applications.map(app => (
                  <div key={app._id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar name={app.developer?.name} avatar={app.developer?.avatar} size="md" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{app.developer?.name}</p>
                        <p className="text-sm text-gray-500">{app.developer?.email}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <LevelBadge level={app.developer?.level} />
                          {app.developer?.skills?.slice(0, 3).map((s, i) => (
                            <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      </div>
                      <span className={`badge ${app.status === 'pending' ? 'badge-yellow' : app.status === 'accepted' ? 'badge-green' : 'badge-red'} capitalize`}>
                        {app.status}
                      </span>
                    </div>
                    {app.coverLetter && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded p-3 mb-3">{app.coverLetter}</p>
                    )}
                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(app._id, 'accepted')} className="btn-success text-sm py-1.5 px-3">Accept</button>
                        <button onClick={() => updateStatus(app._id, 'rejected')} className="btn-danger text-sm py-1.5 px-3">Reject</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
