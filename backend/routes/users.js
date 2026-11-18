const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/suggestions
// @desc    Get suggested users to follow
router.get('/suggestions', auth, async (req, res) => {
  try {
    const currentUserId = req.userId;
    const currentUser = await User.findById(currentUserId);

    // Find users who are not the current user and not already followed
    let suggestions = await User.find({
      _id: { $ne: currentUserId, $nin: currentUser.following }
    })
      .select('username name profilePic bio followers')
      .limit(6);

    // If suggestions are fewer than 4, include users even if followed so the UI looks active
    if (suggestions.length < 3) {
      suggestions = await User.find({ _id: { $ne: currentUserId } })
        .select('username name profilePic bio followers')
        .limit(6);
    }

    res.json({ suggestions });
  } catch (error) {
    console.error('Fetch suggestions error:', error);
    res.status(500).json({ message: 'Server error retrieving suggestions.' });
  }
});

// @route   GET /api/users/search
// @desc    Search users by username or name
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.json({ users: [] });
    }

    const regex = new RegExp(q.trim(), 'i');
    const users = await User.find({
      $or: [{ username: regex }, { name: regex }]
    })
      .select('username name profilePic bio followers following')
      .limit(10);

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error during user search.' });
  }
});

// @route   GET /api/users/:username
// @desc    Get user profile and their posts
router.get('/:username', async (req, res) => {
  try {
    const targetUsername = req.params.username.toLowerCase();
    const user = await User.findOne({ username: targetUsername })
      .populate('followers', 'username name profilePic')
      .populate('following', 'username name profilePic');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get posts by this user
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'username name profilePic')
      .populate('comments.user', 'username name profilePic');

    res.json({
      user,
      posts,
      postsCount: posts.length
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error retrieving user profile.' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile (name, bio, profilePic)
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, profilePic } = req.body;
    const updateData = {};

    if (name && name.trim()) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (profilePic && profilePic.trim()) updateData.profilePic = profilePic.trim();

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('followers', 'username name profilePic')
      .populate('following', 'username name profilePic');

    res.json({
      message: 'Profile updated successfully!',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
});

// @route   POST /api/users/:id/follow
// @desc    Follow / Unfollow user toggle
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.userId;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found to follow.' });
    }

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === targetUserId
    );

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
      await currentUser.save();
      await targetUser.save();

      return res.json({
        message: `Unfollowed @${targetUser.username}`,
        following: false,
        followersCount: targetUser.followers.length
      });
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      await currentUser.save();
      await targetUser.save();

      return res.json({
        message: `Now following @${targetUser.username}`,
        following: true,
        followersCount: targetUser.followers.length
      });
    }
  } catch (error) {
    console.error('Follow/unfollow error:', error);
    res.status(500).json({ message: 'Server error processing follow request.' });
  }
});

module.exports = router;
