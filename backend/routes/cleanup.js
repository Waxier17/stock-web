const express = require('express');
const {
    clearAllDemoData,
    clearProducts,
    clearCustomers,
    clearSuppliers,
    getDemoDataCounts,
    resetDatabase
} = require('../controllers/cleanupController');

const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All cleanup routes require admin authentication

// @route   GET /api/cleanup/counts
// @desc    Get counts of all demo data
// @access  Private (Admin only)
router.get('/counts', authenticate, authorize('admin'), getDemoDataCounts);

// @route   DELETE /api/cleanup/all
// @desc    Clear all demo data
// @access  Private (Admin only)
router.delete('/all', authenticate, authorize('admin'), clearAllDemoData);

// @route   DELETE /api/cleanup/products
// @desc    Clear only products
// @access  Private (Admin only)
router.delete('/products', authenticate, authorize('admin'), clearProducts);

// @route   DELETE /api/cleanup/customers
// @desc    Clear only customers
// @access  Private (Admin only)
router.delete('/customers', authenticate, authorize('admin'), clearCustomers);

// @route   DELETE /api/cleanup/suppliers
// @desc    Clear only suppliers
// @access  Private (Admin only)
router.delete('/suppliers', authenticate, authorize('admin'), clearSuppliers);

// @route   POST /api/cleanup/reset-database
// @desc    Reset entire database (DROP and CREATE all tables)
// @access  Private (Admin only)
router.post('/reset-database', authenticate, authorize('admin'), resetDatabase);

module.exports = router;
