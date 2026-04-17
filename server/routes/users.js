const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.put('/update', protect, updateUser);

module.exports = router;
