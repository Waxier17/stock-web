const express = require('express');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword
} = require('../controllers/usersController');

const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All user management routes require admin authentication

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', authenticate, authorize('admin'), getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin only)
router.get('/:id', authenticate, authorize('admin'), getUserById);

// @route   POST /api/users
// @desc    Create new user
// @access  Private (Admin only)
router.post('/', authenticate, authorize('admin'), createUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/:id', authenticate, authorize('admin'), updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

// @route   PUT /api/users/:id/password
// @desc    Change user password
// @access  Private (Admin only)
router.put('/:id/password', authenticate, authorize('admin'), changePassword);

module.exports = router;
