const Post = require('../models/Post');
const Comment = require('../models/Comment');

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.create({ user: req.user._id, content });
    await post.populate('user', 'name avatar role level');
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .select('user content likes createdAt') // only what the feed needs
      .populate('user', 'name avatar role level')
      .sort({ createdAt: -1 })
      .limit(50) // cap at 50 posts — prevents loading hundreds at once
      .lean();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select('likes');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user._id);
    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id).select('_id');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({ post: req.params.id, user: req.user._id, text });
    await comment.populate('user', 'name avatar');
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .select('user text createdAt')
      .populate('user', 'name avatar')
      .sort({ createdAt: 1 })
      .lean();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPost, getPosts, likePost, commentOnPost, getPostComments };
