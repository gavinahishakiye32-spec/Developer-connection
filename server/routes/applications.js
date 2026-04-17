const express = require('express');
const router = express.Router();
const { applyToJob, getMyApplications, updateApplicationStatus, getJobApplications } = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { developerOnly, employerOnly } = require('../middleware/roleCheck');

router.post('/jobs/:id/apply', protect, developerOnly, applyToJob);
router.get('/my', protect, developerOnly, getMyApplications);
router.get('/job/:id', protect, employerOnly, getJobApplications);
router.put('/:id/status', protect, employerOnly, updateApplicationStatus);

module.exports = router;
