const express = require('express');
const {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
    getSalesByCustomer,
    getSalesByUser,
    getSalesByDateRange
} = require('../controllers/salesController');

const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/sales
// @desc    Get all sales
// @access  Private (Admin or User)
router.get('/', authenticate, authorize(['admin', 'user']), getAllSales);

// @route   GET /api/sales/:id
// @desc    Get sale by ID
// @access  Private (Admin or User)
router.get('/:id', authenticate, authorize(['admin', 'user']), getSaleById);

// @route   POST /api/sales
// @desc    Create sale
// @access  Private (Admin or User)
router.post('/', authenticate, authorize(['admin', 'user']), createSale);

// @route   PUT /api/sales/:id
// @desc    Update sale
// @access  Private (Admin or User)
router.put('/:id', authenticate, authorize(['admin', 'user']), updateSale);

// @route   DELETE /api/sales/:id
// @desc    Delete sale
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteSale);

// @route   GET /api/sales/customer/:customerId
// @desc    Get sales by customer
// @access  Private (Admin or User)
router.get('/customer/:customerId', authenticate, authorize(['admin', 'user']), getSalesByCustomer);

// @route   GET /api/sales/user/:userId
// @desc    Get sales by user
// @access  Private (Admin or User)
router.get('/user/:userId', authenticate, authorize(['admin', 'user']), getSalesByUser);

// @route   GET /api/sales/date-range
// @desc    Get sales by date range
// @access  Private (Admin or User)
router.get('/date-range', authenticate, authorize(['admin', 'user']), getSalesByDateRange);

module.exports = router;