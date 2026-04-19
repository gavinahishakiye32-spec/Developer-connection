const Job = require('../models/Job');

const createJob = async (req, res) => {
  try {
    const { title, description, company, level, requiredSkills, salary, location, remote, jobType } = req.body;
    const job = await Job.create({
      title, description, company, level,
      postedBy: req.user._id,
      requiredSkills: requiredSkills || [],
      salary: salary || '',
      location: location || '',
      remote: remote || false,
      jobType: jobType || 'full-time',
    });
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
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name company')
      .populate('applicants', 'name email level');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const fields = ['title', 'description', 'company', 'level', 'requiredSkills', 'salary', 'location', 'remote', 'jobType'];
    fields.forEach(f => { if (req.body[f] !== undefined) job[f] = req.body[f]; });
    const updated = await job.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
