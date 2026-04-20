import { useState, useRef } from 'react'
import { jobsAPI, usersAPI } from '../services/api'
import JobCard from '../components/JobCard'
import { useAuth } from '../context/AuthContext'
import { useCachedFetch } from '../hooks/useCachedFetch'

export default function Jobs() {
  const { user } = useAuth()
  const [levelFilter, setLevelFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const debounceRef = useRef(null)
  const [filterKey, setFilterKey] = useState('jobs:all')

  // Trigger filter change with debounce
  const applyFilter = (level, type, remote) => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const key = `jobs:${level}:${type}:${remote}`
      setFilterKey(key)
    }, 250)
  }

  const setLevel = (v) => { setLevelFilter(v); applyFilter(v, typeFilter, remoteOnly) }
  const setType = (v) => { setTypeFilter(v); applyFilter(levelFilter, v, remoteOnly) }
  const setRemote = (v) => { setRemoteOnly(v); applyFilter(levelFilter, typeFilter, v) }

  const { data: jobs, loading, mutate: mutateJobs } = useCachedFetch(
    filterKey,
    () => {
      const params = {}
      if (levelFilter) params.level = levelFilter
      if (typeFilter) params.jobType = typeFilter
      if (remoteOnly) params.remote = true
      return jobsAPI.getAll(params).then(r => r.data)
    },
    [filterKey]
  )

  const { data: savedJobsData } = useCachedFetch(
    user?.role === 'developer' ? 'saved-jobs' : null,
    () => usersAPI.getSavedJobs().then(r => r.data)
  )
  const savedJobIds = (savedJobsData || []).map(j => j._id)

  const handleToggleSave = async (jobId) => {
    // Optimistic toggle
    const wasSaved = savedJobIds.includes(jobId)
    try {
      await usersAPI.toggleSaveJob(jobId)
    } catch (err) {
      console.error(err)
    }
  }

  const displayedJobs = activeTab === 'saved'
    ? (jobs || []).filter(j => savedJobIds.includes(j._id))
    : (jobs || [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Board</h1>
          <p className="text-gray-600 text-sm mt-1">
            {user?.role === 'developer'
              ? `Your level: ${user.level} — jobs with matching skills are highlighted`
              : 'All posted jobs'}
          </p>
        </div>
      </div>

      {user?.role === 'developer' && (
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
          {['all', 'saved'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {tab === 'saved' ? `🔖 Saved (${savedJobIds.length})` : 'All Jobs'}
            </button>
          ))}
        </div>
      )}

      <div className="card mb-6 space-y-3">
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500 self-center">Level:</span>
          {['', 'beginner', 'intermediate', 'experienced'].map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                levelFilter === l ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}>
              {l === '' ? 'All' : l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs font-medium text-gray-500 self-center">Type:</span>
          {['', 'full-time', 'part-time', 'contract', 'internship'].map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border capitalize ${
                typeFilter === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}>
              {t === '' ? 'All' : t}
            </button>
          ))}
          <label className="flex items-center gap-1.5 ml-2 cursor-pointer">
            <input type="checkbox" checked={remoteOnly} onChange={e => setRemote(e.target.checked)} className="w-3.5 h-3.5 text-blue-600 rounded" />
            <span className="text-xs font-medium text-gray-600">Remote only</span>
          </label>
        </div>
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
      ) : displayedJobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💼</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {activeTab === 'saved' ? 'No saved jobs yet' : 'No jobs found'}
          </h3>
          <p className="text-gray-500">
            {activeTab === 'saved' ? 'Bookmark jobs to find them here later.' : 'Try a different filter or check back later.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedJobs.map(job => (
            <JobCard key={job._id} job={job}
              saved={savedJobIds.includes(job._id)}
              onToggleSave={user?.role === 'developer' ? handleToggleSave : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
