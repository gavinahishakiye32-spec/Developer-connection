import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { usersAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'
import LevelBadge from '../components/LevelBadge'

export default function Profile() {
  const { id } = useParams()
  const { user, login } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isOwn = !id || id === user?._id

  useEffect(() => {
    const targetId = id || user?._id
    if (targetId) {
      usersAPI.getById(targetId).then(res => {
        setProfile(res.data)
        setForm({
          name: res.data.name,
          bio: res.data.bio || '',
          skills: res.data.skills?.join(', ') || '',
          level: res.data.level || 'beginner',
          company: res.data.company || '',
          avatar: res.data.avatar || '',
          github: res.data.github || '',
          portfolio: res.data.portfolio || '',
          location: res.data.location || '',
        })
      }).catch(console.error).finally(() => setLoading(false))
    }
  }, [id, user?._id])

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      }
      const res = await usersAPI.update(payload)
      setProfile(res.data)
      login({ ...user, name: res.data.name, level: res.data.level })
      setEditing(false)
      setSuccess('Profile updated!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="card animate-pulse">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return <div className="text-center py-16 text-gray-500">User not found</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Card */}
      <div className="card">
        <div className="flex items-start gap-4 mb-4">
          <Avatar name={profile.name} avatar={profile.avatar} size="xl" />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {profile.role === 'developer' && profile.level && <LevelBadge level={profile.level} />}
                  <span className={`badge ${profile.role === 'employer' ? 'badge-blue' : 'badge-purple'} capitalize`}>
                    {profile.role}
                  </span>
                </div>
              </div>
              {isOwn && !editing && (
                <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-1.5 px-3">
                  Edit Profile
                </button>
              )}
            </div>
            {profile.company && (
              <p className="text-blue-600 font-medium mt-1">{profile.company}</p>
            )}
            {profile.location && (
              <p className="text-sm text-gray-500 mt-1">📍 {profile.location}</p>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="text-gray-700 mb-4">{profile.bio}</p>
        )}

        {/* Links */}
        {(profile.github || profile.portfolio) && (
          <div className="flex flex-wrap gap-3 mb-4">
            {profile.github && (
              <a
                href={profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                </svg>
                GitHub
              </a>
            )}
            {profile.portfolio && (
              <a
                href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Portfolio
              </a>
            )}
          </div>
        )}

        {profile.role === 'developer' && profile.skills?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Edit Form */}
      {editing && isOwn && (
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Edit Profile</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field resize-none" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-gray-400">(optional)</span></label>
              <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="e.g. Lagos, Nigeria" />
            </div>
            {profile.role === 'developer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['beginner', 'intermediate', 'experienced'].map(l => (
                      <button key={l} type="button" onClick={() => setForm({ ...form, level: l })}
                        className={`py-2 rounded-lg border-2 text-sm font-medium transition-colors capitalize ${form.level === l ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills <span className="text-gray-400">(comma-separated)</span></label>
                  <input type="text" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className="input-field" placeholder="React, Node.js, Python" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub <span className="text-gray-400">(username or URL)</span></label>
                  <input type="text" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} className="input-field" placeholder="yourusername or https://github.com/you" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL <span className="text-gray-400">(optional)</span></label>
                  <input type="text" value={form.portfolio} onChange={e => setForm({ ...form, portfolio: e.target.value })} className="input-field" placeholder="https://yoursite.com" />
                </div>
              </>
            )}
            {profile.role === 'employer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="input-field" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL <span className="text-gray-400">(optional)</span></label>
              <input type="url" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Changes'}</button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
