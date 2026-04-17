const Invitation = require('../models/Invitation');
const Notification = require('../models/Notification');
const User = require('../models/User');

const sendInvitation = async (req, res) => {
  try {
    const { developerId, jobId, message } = req.body;
    const developer = await User.findById(developerId);
    if (!developer || developer.role !== 'developer') {
      return res.status(404).json({ message: 'Developer not found' });
    }

    const existing = await Invitation.findOne({ employer: req.user._id, developer: developerId, job: jobId });
    if (existing) return res.status(400).json({ message: 'Invitation already sent' });

    const invitation = await Invitation.create({ employer: req.user._id, developer: developerId, job: jobId, message });

    await Notification.create({
      user: developerId,
      type: 'invitation',
      message: `${req.user.name} from ${req.user.company} invited you to apply for a job`,
    });

    res.status(201).json(invitation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvitations = async (req, res) => {
  try {
    let invitations;
    if (req.user.role === 'developer') {
      invitations = await Invitation.find({ developer: req.user._id })
        .populate('employer', 'name company avatar')
        .populate('job', 'title level')
        .sort({ createdAt: -1 });
    } else {
      invitations = await Invitation.find({ employer: req.user._id })
        .populate('developer', 'name email level skills avatar')
        .populate('job', 'title level')
        .sort({ createdAt: -1 });
    }
    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToInvitation = async (req, res) => {
  try {
    const { status } = req.body;
    const invitation = await Invitation.findById(req.params.id).populate('job', 'title');
    if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
    if (invitation.developer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    invitation.status = status;
    await invitation.save();

    await Notification.create({
      user: invitation.employer,
      type: 'invitation_response',
      message: `${req.user.name} ${status} your invitation for ${invitation.job.title}`,
    });

    res.json(invitation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendInvitation, getInvitations, respondToInvitation };
