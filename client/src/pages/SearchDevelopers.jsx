import { useState, useEffect } from 'react'
import { usersAPI, jobsAPI, invitationsAPI } from '../services/api'
import DeveloperCard from '../components/DeveloperCard'

export default function SearchDevelopers() {
  const [developers, setDevelopers] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [levelFilter, setLevelFilter] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [inviteModal, setInviteModal] = useState(null) // { developer }
  const [inviteForm, setInviteForm] = useState({ jobId: '', message: '' })
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState('')
  const [inviteError, setInviteError] = useState('')

  useEffect(() => {
    loadDevelopers()
  }, [levelFilter])

  useEffect(() => {
    jobsAPI.getAll().then(res => setJobs(res.data)).catch(console.error)
  }, [])

  const loadDevelopers = async () => {
    setLoading(true)
    try {
      const params = { role: 'developer' }
      if (levelFilter) params.level = levelFilter
      if (skillFilter) params.skills = skillFilter
      const res = await usersAPI.getAll(params)
      setDevelopers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadDevelopers()
  }

  const openInvite = (dev) => {
    setInviteModal(dev)
    setInviteForm({ jobId: '', message: '' })
    setInviteSuccess('')
    setInviteError('')
  }

  const sendInvite = async (e) => {
    e.preventDefault()
    setInviteError('')
    setInviting(true)
    try {
      await invitationsAPI.send({ developerId: inviteModal._id, jobId: inviteForm.jobId, message: inviteForm.message })
      setInviteSuccess(`Invitation sent to ${inviteModal.name}!`)
    } catch (err) {
      setInviteError(err.response?.data?.message || 'Failed to send invitation')
    } finally {
      setInviting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Find Developers</h1>
        <p className="text-gray-600 text-sm mt-1">Search and invite developers to your jobs</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="input-field w-auto"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="experienced">Experienced</option>
          </select>
          <input
            type="text"
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
            placeholder="Filter by skill (e.g. React)"
            className="input-field flex-1 min-w-40"
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse flex gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          ))}
        </div>
      ) : developers.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No developers found</h3>
          <p className="text-gray-500">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {developers.map(dev => (
            <DeveloperCard
              key={dev._id}
              developer={dev}
              action={
                <button onClick={() => openInvite(dev)} className="btn-primary text-sm py-1.5 px-3">
                  Invite
                </button>
              }
            />
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {inviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Invite {inviteModal.name}</h2>
            <p className="text-sm text-gray-500 mb-4">Send a job invitation to this developer</p>

            {inviteSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{inviteSuccess}</div>
            ) : (
              <form onSubmit={sendInvite} className="space-y-4">
                {inviteError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{inviteError}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Job</label>
                  <select
                    required
                    value={inviteForm.jobId}
                    onChange={e => setInviteForm({ ...inviteForm, jobId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Choose a job...</option>
                    {jobs.map(j => (
                      <option key={j._id} value={j._id}>{j.title} ({j.level})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-gray-400">(optional)</span></label>
                  <textarea
                    value={inviteForm.message}
                    onChange={e => setInviteForm({ ...inviteForm, message: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Why are you reaching out to this developer?"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={inviting} className="btn-primary flex-1">
                    {inviting ? 'Sending...' : 'Send Invitation'}
                  </button>
                  <button type="button" onClick={() => setInviteModal(null)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            )}

            {inviteSuccess && (
              <button onClick={() => setInviteModal(null)} className="btn-secondary w-full mt-3">Close</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
