const express = require('express');
const {
    getSalesReport,
    getInventoryReport,
    getCustomerReport,
    getSupplierReport,
    getProfitReport
} = require('../controllers/reportsController');

const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reports/sales
// @desc    Get sales report
// @access  Private (Admin or User)
router.get('/sales', authenticate, authorize(['admin', 'user']), getSalesReport);

// @route   GET /api/reports/inventory
// @desc    Get inventory report
// @access  Private (Admin or User)
router.get('/inventory', authenticate, authorize(['admin', 'user']), getInventoryReport);

// @route   GET /api/reports/customers
// @desc    Get customer report
// @access  Private (Admin or User)
router.get('/customers', authenticate, authorize(['admin', 'user']), getCustomerReport);

// @route   GET /api/reports/suppliers
// @desc    Get supplier report
// @access  Private (Admin or User)
router.get('/suppliers', authenticate, authorize(['admin', 'user']), getSupplierReport);

// @route   GET /api/reports/profit
// @desc    Get profit report
// @access  Private (Admin or User)
router.get('/profit', authenticate, authorize(['admin', 'user']), getProfitReport);

module.exports = router;