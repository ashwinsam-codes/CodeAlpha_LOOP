const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all feed posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username name profilePic')
      .populate('comments.user', 'username name profilePic')
      .limit(50);

    res.json({ posts });
  } catch (error) {
    console.error('Fetch posts error:', error);
    res.status(500).json({ message: 'Server error retrieving feed posts.' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content cannot be empty.' });
    }

    const newPost = new Post({
      user: req.userId,
      content: content.trim(),
      image: image ? image.trim() : ''
    });

    await newPost.save();

    // Populate user details before returning
    const populatedPost = await Post.findById(newPost._id)
      .populate('user', 'username name profilePic')
      .populate('comments.user', 'username name profilePic');

    res.status(201).json({
      message: 'Post created successfully!',
      post: populatedPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: error.message || 'Server error creating post.' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post (by post creator)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized. You can only delete your own posts.' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully.', postId: req.params.id });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error deleting post.' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Toggle like / unlike on a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const currentUserId = req.userId.toString();
    const hasLiked = post.likes.some((id) => id.toString() === currentUserId);

    if (hasLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== currentUserId);
    } else {
      // Like
      post.likes.push(req.userId);
    }

    await post.save();

    res.json({
      message: hasLiked ? 'Post unliked.' : 'Post liked.',
      liked: !hasLiked,
      likesCount: post.likes.length,
      likes: post.likes
    });
  } catch (error) {
    console.error('Like toggle error:', error);
    res.status(500).json({ message: 'Server error updating like status.' });
  }
});

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const comment = {
      user: req.userId,
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    // Re-populate comments with user info
    const updatedPost = await Post.findById(post._id)
      .populate('comments.user', 'username name profilePic');

    const addedComment = updatedPost.comments[updatedPost.comments.length - 1];

    res.status(201).json({
      message: 'Comment added.',
      comment: addedComment,
      commentsCount: updatedPost.comments.length
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error adding comment.' });
  }
});

// @route   DELETE /api/posts/:id/comments/:commentId
// @desc    Delete a comment
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    // Allow deletion if user is author of comment OR author of post
    const isCommentAuthor = comment.user.toString() === req.userId.toString();
    const isPostOwner = post.user.toString() === req.userId.toString();

    if (!isCommentAuthor && !isPostOwner) {
      return res.status(403).json({ message: 'Unauthorized. You cannot delete this comment.' });
    }

    post.comments.pull({ _id: req.params.commentId });
    await post.save();

    res.json({
      message: 'Comment removed.',
      commentId: req.params.commentId,
      commentsCount: post.comments.length
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error removing comment.' });
  }
});

module.exports = router;
