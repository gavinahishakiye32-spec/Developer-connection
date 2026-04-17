const Job = require('../models/Job');

const createJob = async (req, res) => {
  try {
    const { title, description, company, level } = req.body;
    const job = await Job.create({ title, description, company, level, postedBy: req.user._id });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const { level } = req.query;
    const filter = {};
    if (level) filter.level = level;
    const jobs = await Job.find(filter).populate('postedBy', 'name company').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company').populate('applicants', 'name email level');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJob, getJobs, getJobById };
