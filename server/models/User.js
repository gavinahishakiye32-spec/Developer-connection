const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6, default: null }, // null for OAuth users
  role: { type: String, enum: ['developer', 'employer'], required: true },
  // OAuth
  githubId: { type: String, default: null },
  googleId: { type: String, default: null },
  oauthProvider: { type: String, default: null }, // 'github' | 'google'
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  level: { type: String, enum: ['beginner', 'intermediate', 'experienced'], default: 'beginner' },
  company: { type: String, default: '' },          // current company (both roles)
  avatar: { type: String, default: '' },           // Cloudinary URL
  github: { type: String, default: '' },           // github username or URL
  portfolio: { type: String, default: '' },        // portfolio URL
  location: { type: String, default: '' },
  profileLink: { type: String, default: '' },      // custom shareable link / personal URL
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
