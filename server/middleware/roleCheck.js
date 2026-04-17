const employerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'employer') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Employers only' });
  }
};

const developerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'developer') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Developers only' });
  }
};

module.exports = { employerOnly, developerOnly };
