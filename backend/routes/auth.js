const express = require('express');
const { register, login, getCurrentUser, logout, createDefaultAdmin } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, getCurrentUser);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, logout);

// @route   POST /api/auth/setup-admin
// @desc    Create default admin user (for setup)
// @access  Public (only if no admin exists)
router.post('/setup-admin', createDefaultAdmin);

module.exports = router;
