const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, commentOnPost, getPostComments } = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createPost);
router.get('/', protect, getPosts);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentOnPost);
router.get('/:id/comments', protect, getPostComments);

module.exports = router;
