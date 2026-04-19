const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'experienced'], required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Enriched fields
  requiredSkills: [{ type: String }],
  salary: { type: String, default: '' },          // e.g. "$3,000 – $5,000/mo" or "Negotiable"
  location: { type: String, default: '' },         // e.g. "Lagos, Nigeria" or "Remote"
  remote: { type: Boolean, default: false },
  jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], default: 'full-time' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
