const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  developer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
}, { timestamps: true });

invitationSchema.index({ developer: 1, createdAt: -1 });
invitationSchema.index({ employer: 1, createdAt: -1 });

module.exports = mongoose.model('Invitation', invitationSchema);
