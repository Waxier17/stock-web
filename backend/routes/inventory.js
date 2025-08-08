const express = require('express');
const {
    // Category routes
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Product routes
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getLowStockProducts,
    updateProductStock
} = require('../controllers/inventoryController');

const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Category Routes
// All category routes require authentication
// Admin can perform all operations, users can only view

// @route   GET /api/inventory/categories
// @desc    Get all categories
// @access  Private (Admin or User)
router.get('/categories', authenticate, authorize(['admin', 'user']), getAllCategories);

// @route   GET /api/inventory/categories/:id
// @desc    Get category by ID
// @access  Private (Admin or User)
router.get('/categories/:id', authenticate, authorize(['admin', 'user']), getCategoryById);

// @route   POST /api/inventory/categories
// @desc    Create category
// @access  Private (Admin only)
router.post('/categories', authenticate, authorize('admin'), createCategory);

// @route   PUT /api/inventory/categories/:id
// @desc    Update category
// @access  Private (Admin only)
router.put('/categories/:id', authenticate, authorize('admin'), updateCategory);

// @route   DELETE /api/inventory/categories/:id
// @desc    Delete category
// @access  Private (Admin only)
router.delete('/categories/:id', authenticate, authorize('admin'), deleteCategory);

// Product Routes
// All product routes require authentication
// Admin can perform all operations, users can only view

// @route   GET /api/inventory/products
// @desc    Get all products
// @access  Private (Admin or User)
router.get('/products', authenticate, authorize(['admin', 'user']), getAllProducts);

// @route   GET /api/inventory/products/:id
// @desc    Get product by ID
// @access  Private (Admin or User)
router.get('/products/:id', authenticate, authorize(['admin', 'user']), getProductById);

// @route   POST /api/inventory/products
// @desc    Create product
// @access  Private (Admin only)
router.post('/products', authenticate, authorize('admin'), createProduct);

// @route   PUT /api/inventory/products/:id
// @desc    Update product
// @access  Private (Admin only)
router.put('/products/:id', authenticate, authorize('admin'), updateProduct);

// @route   DELETE /api/inventory/products/:id
// @desc    Delete product
// @access  Private (Admin only)
router.delete('/products/:id', authenticate, authorize('admin'), deleteProduct);

// @route   GET /api/inventory/products/low-stock
// @desc    Get low stock products
// @access  Private (Admin or User)
router.get('/products/low-stock', authenticate, authorize(['admin', 'user']), getLowStockProducts);

// @route   PUT /api/inventory/products/:id/stock
// @desc    Update product stock
// @access  Private (Admin only)
router.put('/products/:id/stock', authenticate, authorize('admin'), updateProductStock);

// Test route
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Test route working' });
});

module.exports = router;