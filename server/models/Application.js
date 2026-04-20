const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  developer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

// Indexes for the two most common query patterns
applicationSchema.index({ developer: 1, createdAt: -1 });
applicationSchema.index({ job: 1, createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
