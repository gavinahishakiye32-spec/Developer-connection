const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.level !== req.user.level) {
      return res.status(400).json({ message: `Level mismatch. This job requires ${job.level} level.` });
    }

    const alreadyApplied = await Application.findOne({ job: req.params.id, developer: req.user._id });
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied to this job' });

    const { coverLetter } = req.body;
    const application = await Application.create({ job: req.params.id, developer: req.user._id, coverLetter });

    job.applicants.push(req.user._id);
    await job.save();

    // Notify employer
    await Notification.create({
      user: job.postedBy,
      type: 'application',
      message: `${req.user.name} applied to your job: ${job.title}`,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ developer: req.user._id })
      .populate('job', 'title company level')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    await Notification.create({
      user: application.developer,
      type: 'application_status',
      message: `Your application for ${application.job.title} has been ${status}`,
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const applications = await Application.find({ job: req.params.id })
      .populate('developer', 'name email level skills bio avatar')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyToJob, getMyApplications, updateApplicationStatus, getJobApplications };
