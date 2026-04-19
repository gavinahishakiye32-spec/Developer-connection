const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, oauthCallback } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

// ── GitHub OAuth ──────────────────────────────────────────────────────────────
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  oauthCallback
);

// ── Google OAuth ──────────────────────────────────────────────────────────────
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  oauthCallback
);

module.exports = router;
