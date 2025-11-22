const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/user/me
// @desc    Get current user profile with stats and progress
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      businessName: user.businessName,
      niche: user.niche,
      niche: user.niche,
      description: user.description,
      bio: user.bio,
      currentDay: user.currentDay,
      completedDays: user.completedDays,
      stats: user.stats,
      badges: user.badges,
      generatedBios: user.generatedBios,
      savedCaptions: user.savedCaptions,
      day4Result: user.day4Result,
      day6Result: user.day6Result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/user/progress
// @desc    Update user progress and unlock next day
// @access  Private
router.put('/progress', protect, async (req, res) => {
  try {
    const { dayCompleted } = req.body;

    if (!dayCompleted || typeof dayCompleted !== 'number') {
      return res.status(400).json({ message: 'Please provide a valid day number' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add to completed days if not already completed
    if (!user.completedDays.includes(dayCompleted)) {
      user.completedDays.push(dayCompleted);
    }

    // Update current day to next day
    if (dayCompleted >= user.currentDay) {
      user.currentDay = dayCompleted + 1;
    }

    // Simulate growth - randomly increment stats as reward
    const followerGrowth = Math.floor(Math.random() * 41) + 10; // 10-50
    const viewGrowth = Math.floor(Math.random() * 101) + 50; // 50-150
    const likeGrowth = Math.floor(Math.random() * 31) + 10; // 10-40

    user.stats.followers += followerGrowth;
    user.stats.views += viewGrowth;
    user.stats.likes += likeGrowth;

    // Add special badge if Day 7 is completed
    if (dayCompleted === 7 && !user.badges.includes('7-Day Champion')) {
      user.badges.push('7-Day Champion');
    }

    // Add milestone badges
    if (dayCompleted === 3 && !user.badges.includes('Halfway Hero')) {
      user.badges.push('Halfway Hero');
    }

    if (dayCompleted === 1 && !user.badges.includes('First Step')) {
      user.badges.push('First Step');
    }

    await user.save();

    res.json({
      message: `Day ${dayCompleted} completed successfully!`,
      currentDay: user.currentDay,
      completedDays: user.completedDays,
      stats: user.stats,
      badges: user.badges,
      growth: {
        followers: followerGrowth,
        views: viewGrowth,
        likes: likeGrowth,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/user/update
// @desc    Update user business profile
// @access  Private
router.put('/update', protect, async (req, res) => {
  try {
    const { businessName, niche, description, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (businessName !== undefined) user.businessName = businessName;
    if (niche !== undefined) user.niche = niche;
    if (description !== undefined) user.description = description;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      businessName: user.businessName,
      niche: user.niche,
      description: user.description,
      bio: user.bio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
