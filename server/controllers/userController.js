const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const { role, level, skills } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (level) filter.level = level;
    if (skills) filter.skills = { $in: skills.split(',') };

    const users = await User.find(filter).select('-password');
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
    const { name, bio, skills, level, company, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.skills = skills || user.skills;
    user.level = level || user.level;
    user.company = company || user.company;
    user.avatar = avatar || user.avatar;

    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, bio: updated.bio, skills: updated.skills, level: updated.level, company: updated.company, avatar: updated.avatar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, updateUser };
