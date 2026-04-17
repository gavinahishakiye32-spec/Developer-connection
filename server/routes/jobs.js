const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const { employerOnly } = require('../middleware/roleCheck');

router.post('/', protect, employerOnly, createJob);
router.get('/', protect, getJobs);
router.get('/:id', protect, getJobById);

module.exports = router;
