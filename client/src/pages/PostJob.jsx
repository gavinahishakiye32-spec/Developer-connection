import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobsAPI } from '../services/api'

export default function PostJob() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    company: '',
    level: 'beginner',
    jobType: 'full-time',
    location: '',
    remote: false,
    salary: '',
    requiredSkills: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        requiredSkills: form.requiredSkills
          ? form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      }
      await jobsAPI.create(payload)
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
          {/* Title */}
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

          {/* Company */}
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

          {/* Level */}
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

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['full-time', 'part-time', 'contract', 'internship'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, jobType: t })}
                  className={`py-2 rounded-lg border-2 text-sm font-medium transition-colors capitalize ${
                    form.jobType === t
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Location + Remote */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="input-field"
                placeholder="e.g. Lagos, Nigeria"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remote}
                  onChange={e => setForm({ ...form, remote: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Remote / Open to remote</span>
              </label>
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary / Compensation <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={form.salary}
              onChange={e => setForm({ ...form, salary: e.target.value })}
              className="input-field"
              placeholder='e.g. "$2,000 – $4,000/mo" or "Negotiable"'
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Skills <span className="text-gray-400">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={form.requiredSkills}
              onChange={e => setForm({ ...form, requiredSkills: e.target.value })}
              className="input-field"
              placeholder="e.g. React, Node.js, MongoDB"
            />
          </div>

          {/* Description */}
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
