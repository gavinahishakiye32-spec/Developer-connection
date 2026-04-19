const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const { employerOnly } = require('../middleware/roleCheck');

router.post('/', protect, employerOnly, createJob);
router.get('/', protect, getJobs);
router.get('/:id', protect, getJobById);
router.put('/:id', protect, employerOnly, updateJob);
router.delete('/:id', protect, employerOnly, deleteJob);

module.exports = router;
