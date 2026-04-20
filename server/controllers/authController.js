const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isProd = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,                  // JS cannot read this cookie — blocks XSS token theft
  secure: isProd,                  // HTTPS only in production
  sameSite: isProd ? 'none' : 'lax', // 'none' needed for cross-origin (Vercel → Render)
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  path: '/',
};

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Shape the user profile returned to the client — NO token included
const userPayload = (user) => ({
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
});

const register = async (req, res) => {
  try {
    const { name, email, password, role, bio, skills, level, company } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role, bio, skills, level, company });
    const token = generateToken(user._id);

    res.cookie('devcon_token', token, COOKIE_OPTIONS);
    res.status(201).json(userPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.password) {
      return res.status(401).json({
        message: `This account uses ${user.oauthProvider || 'social'} sign-in. Please use that instead.`,
      });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.cookie('devcon_token', token, COOKIE_OPTIONS);
    res.json(userPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Restore session from cookie — called on every app load
const getMe = async (req, res) => {
  try {
    const token = req.cookies?.devcon_token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    res.json(userPayload(user));
  } catch {
    res.status(401).json({ message: 'Invalid or expired session' });
  }
};

// Clear the cookie on logout
const logout = (req, res) => {
  res.clearCookie('devcon_token', { ...COOKIE_OPTIONS, maxAge: 0 });
  res.json({ message: 'Logged out' });
};

// Called after passport OAuth callback — sets cookie then redirects cleanly
const oauthCallback = (req, res) => {
  const token = generateToken(req.user._id);
  const clientUrl = process.env.CLIENT_URL?.split(',')[0] || 'http://localhost:5173';

  res.cookie('devcon_token', token, COOKIE_OPTIONS);
  // Redirect to /oauth-callback with NO token in the URL
  res.redirect(`${clientUrl}/oauth-callback`);
};

module.exports = { register, login, getMe, logout, oauthCallback };
