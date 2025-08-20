const express = require('express');
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryStats,
    searchCategories
} = require('../controllers/categoriesController');

const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Category routes with proper authentication and authorization

// @route   GET /api/categories
// @desc    Get all categories
// @access  Private (Admin or User)
router.get('/', authenticate, authorize(['admin', 'user']), getAllCategories);

// @route   GET /api/categories/stats
// @desc    Get category statistics
// @access  Private (Admin or User)
router.get('/stats', authenticate, authorize(['admin', 'user']), getCategoryStats);

// @route   GET /api/categories/search
// @desc    Search categories by name
// @access  Private (Admin or User)
router.get('/search', authenticate, authorize(['admin', 'user']), searchCategories);

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Private (Admin or User)
router.get('/:id', authenticate, authorize(['admin', 'user']), getCategoryById);

// @route   POST /api/categories
// @desc    Create category
// @access  Private (Admin only)
router.post('/', authenticate, authorize('admin'), createCategory);

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (Admin only)
router.put('/:id', authenticate, authorize('admin'), updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

module.exports = router;
