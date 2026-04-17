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
      // Update auth context
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
          </div>
        </div>

        {profile.bio && (
          <p className="text-gray-700 mb-4">{profile.bio}</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <input type="text" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className="input-field" placeholder="React, Node.js, Python" />
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
