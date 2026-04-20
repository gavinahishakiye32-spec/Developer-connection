const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const { role, level, skills } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (level) filter.level = level;
    if (skills) filter.skills = { $in: skills.split(',').map(s => s.trim()) };

    const users = await User.find(filter)
      .select('name email role level skills bio avatar company github portfolio location profileLink createdAt')
      .lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -savedJobs -githubId -googleId')
      .lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, bio, skills, level, company, avatar, github, portfolio, location, profileLink } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (level !== undefined) user.level = level;
    if (company !== undefined) user.company = company;
    if (avatar !== undefined) user.avatar = avatar;
    if (github !== undefined) user.github = github;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (location !== undefined) user.location = location;
    if (profileLink !== undefined) user.profileLink = profileLink;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      bio: updated.bio,
      skills: updated.skills,
      level: updated.level,
      company: updated.company,
      avatar: updated.avatar,
      github: updated.github,
      portfolio: updated.portfolio,
      location: updated.location,
      profileLink: updated.profileLink,
      oauthProvider: updated.oauthProvider,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('savedJobs');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const jobId = req.params.jobId;
    const idx = user.savedJobs.findIndex(id => id.toString() === jobId);
    if (idx === -1) {
      user.savedJobs.push(jobId);
    } else {
      user.savedJobs.splice(idx, 1);
    }
    await user.save();
    res.json({ saved: idx === -1, savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    // Use lean + two-step to avoid nested populate overhead
    const user = await User.findById(req.user._id).select('savedJobs').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const Job = require('../models/Job');
    const jobs = await Job.find({ _id: { $in: user.savedJobs } })
      .select('-applicants')
      .populate('postedBy', 'name company')
      .lean();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, updateUser, toggleSaveJob, getSavedJobs };
