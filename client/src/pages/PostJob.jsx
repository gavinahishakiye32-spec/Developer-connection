import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobsAPI } from '../services/api'

export default function PostJob() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', company: '', level: 'beginner' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await jobsAPI.create(form)
      navigate('/manage-jobs')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Post a Job</h1>
        <p className="text-gray-600 mt-1">Find the right developer for your team</p>
      </div>

      <div className="card">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="input-field"
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              required
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
              className="input-field"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['beginner', 'intermediate', 'experienced'].map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setForm({ ...form, level: l })}
                  className={`py-2.5 rounded-lg border-2 text-sm font-medium transition-colors capitalize ${
                    form.level === l
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea
              required
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="input-field resize-none"
              rows={6}
              placeholder="Describe the role, responsibilities, requirements..."
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Posting...' : 'Post Job'}
            </button>
            <button type="button" onClick={() => navigate('/manage-jobs')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
