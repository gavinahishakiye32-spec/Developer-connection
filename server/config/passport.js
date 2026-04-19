const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// ── GitHub ────────────────────────────────────────────────────────────────────
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/github/callback`,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value ||
          `${profile.username}@github.noemail`;

        // Find by githubId first, then by email
        let user = await User.findOne({ githubId: profile.id });
        if (!user) user = await User.findOne({ email });

        if (user) {
          // Link githubId if not already linked
          if (!user.githubId) {
            user.githubId = profile.id;
            user.oauthProvider = user.oauthProvider || 'github';
          }
          // Update avatar from GitHub if user has none
          if (!user.avatar && profile.photos?.[0]?.value) {
            user.avatar = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }

        // New user — role defaults to 'developer', they can change it later
        user = await User.create({
          name: profile.displayName || profile.username,
          email,
          role: 'developer',
          githubId: profile.id,
          oauthProvider: 'github',
          avatar: profile.photos?.[0]?.value || '',
          github: profile.username || '',
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ── Google ────────────────────────────────────────────────────────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Google'), null);

        let user = await User.findOne({ googleId: profile.id });
        if (!user) user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.oauthProvider = user.oauthProvider || 'google';
          }
          if (!user.avatar && profile.photos?.[0]?.value) {
            user.avatar = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          name: profile.displayName,
          email,
          role: 'developer',
          googleId: profile.id,
          oauthProvider: 'google',
          avatar: profile.photos?.[0]?.value || '',
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
