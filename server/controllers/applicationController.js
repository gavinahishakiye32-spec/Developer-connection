const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).select('level postedBy title applicants').lean();
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.level !== req.user.level) {
      return res.status(400).json({ message: `Level mismatch. This job requires ${job.level} level.` });
    }

    const alreadyApplied = await Application.exists({ job: req.params.id, developer: req.user._id });
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied to this job' });

    const { coverLetter } = req.body;
    const application = await Application.create({ job: req.params.id, developer: req.user._id, coverLetter });

    // Update applicants array and notify employer in parallel
    await Promise.all([
      Job.updateOne({ _id: req.params.id }, { $push: { applicants: req.user._id } }),
      Notification.create({
        user: job.postedBy,
        type: 'application',
        message: `${req.user.name} applied to your job: ${job.title}`,
      }),
    ]);

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ developer: req.user._id })
      .select('job status coverLetter createdAt')
      .populate('job', 'title company level')
      .sort({ createdAt: -1 })
      .lean();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('job', 'title postedBy');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await Promise.all([
      application.save(),
      Notification.create({
        user: application.developer,
        type: 'application_status',
        message: `Your application for ${application.job.title} has been ${status}`,
      }),
    ]);

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).select('postedBy').lean();
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const applications = await Application.find({ job: req.params.id })
      .select('developer status coverLetter createdAt')
      .populate('developer', 'name email level skills bio avatar')
      .sort({ createdAt: -1 })
      .lean();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyToJob, getMyApplications, updateApplicationStatus, getJobApplications };
