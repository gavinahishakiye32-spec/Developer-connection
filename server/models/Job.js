const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'experienced'], required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requiredSkills: [{ type: String }],
  salary: { type: String, default: '' },
  location: { type: String, default: '' },
  remote: { type: Boolean, default: false },
  jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], default: 'full-time' },
}, { timestamps: true });

// Indexes for frequently filtered/sorted fields
jobSchema.index({ level: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ remote: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
