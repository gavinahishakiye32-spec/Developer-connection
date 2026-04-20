const express = require('express');
const router = express.Router();
const { getNotifications, getUnreadCount, markAllRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read', protect, markAllRead);

module.exports = router;
