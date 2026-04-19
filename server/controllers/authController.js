const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Shape the user object returned to the client consistently
const userPayload = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  level: user.level,
  avatar: user.avatar,
  skills: user.skills,
  company: user.company,
  bio: user.bio,
  github: user.github,
  portfolio: user.portfolio,
  location: user.location,
  profileLink: user.profileLink,
  oauthProvider: user.oauthProvider,
  token,
});

const register = async (req, res) => {
  try {
    const { name, email, password, role, bio, skills, level, company } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role, bio, skills, level, company });
    res.status(201).json(userPayload(user, generateToken(user._id)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    // OAuth-only account — no password set
    if (!user.password) {
      return res.status(401).json({
        message: `This account uses ${user.oauthProvider || 'social'} sign-in. Please use that instead.`,
      });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json(userPayload(user, generateToken(user._id)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Called after passport OAuth callback succeeds
// Redirects to frontend with JWT in query param
const oauthCallback = (req, res) => {
  const token = generateToken(req.user._id);
  const clientUrl = process.env.CLIENT_URL?.split(',')[0] || 'http://localhost:5173';

  // Send minimal user data as base64 so the frontend can store it
  const userData = Buffer.from(
    JSON.stringify(userPayload(req.user, token))
  ).toString('base64');

  res.redirect(`${clientUrl}/oauth-callback?data=${userData}`);
};

module.exports = { register, login, oauthCallback };
