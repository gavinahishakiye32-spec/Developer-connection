const express = require('express');
const router = express.Router();
const { sendInvitation, getInvitations, respondToInvitation } = require('../controllers/invitationController');
const { protect } = require('../middleware/auth');
const { employerOnly } = require('../middleware/roleCheck');

router.post('/send', protect, employerOnly, sendInvitation);
router.get('/', protect, getInvitations);
router.put('/:id/respond', protect, respondToInvitation);

module.exports = router;
