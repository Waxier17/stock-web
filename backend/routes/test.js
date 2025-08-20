const express = require('express');
const { adminOnly, userOnly, adminOrUser } = require('../controllers/testController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/test/admin
// @desc    Test route for admin only
// @access  Private (Admin only)
router.get('/admin', authenticate, authorize('admin'), adminOnly);

// @route   GET /api/test/user
// @desc    Test route for user only
// @access  Private (User only)
router.get('/user', authenticate, authorize('user'), userOnly);

// @route   GET /api/test/admin-or-user
// @desc    Test route for admin or user
// @access  Private (Admin or User)
router.get('/admin-or-user', authenticate, authorize(['admin', 'user']), adminOrUser);

module.exports = router;