const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, toggleSaveJob, getSavedJobs } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUsers);
router.get('/saved-jobs', protect, getSavedJobs);
router.get('/:id', protect, getUserById);
router.put('/update', protect, updateUser);
router.post('/save-job/:jobId', protect, toggleSaveJob);

module.exports = router;
