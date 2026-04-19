const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const { role, level, skills } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (level) filter.level = level;
    if (skills) filter.skills = { $in: skills.split(',') };

    const users = await User.find(filter).select('-password -savedJobs');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, bio, skills, level, company, avatar, github, portfolio, location } = req.body;
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
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle save/unsave a job
const toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const jobId = req.params.jobId;
    const idx = user.savedJobs.indexOf(jobId);
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

// Get saved jobs for current user
const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedJobs',
      populate: { path: 'postedBy', select: 'name company' },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, updateUser, toggleSaveJob, getSavedJobs };
