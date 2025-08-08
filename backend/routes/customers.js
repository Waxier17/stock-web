const express = require('express');
const {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers
} = require('../controllers/customersController');

const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/customers
// @desc    Get all customers
// @access  Private (Admin or User)
router.get('/', authenticate, authorize(['admin', 'user']), getAllCustomers);

// @route   GET /api/customers/search
// @desc    Search customers by name
// @access  Private (Admin or User)
router.get('/search', authenticate, authorize(['admin', 'user']), searchCustomers);

// @route   GET /api/customers/:id
// @desc    Get customer by ID
// @access  Private (Admin or User)
router.get('/:id', authenticate, authorize(['admin', 'user']), getCustomerById);

// @route   POST /api/customers
// @desc    Create customer
// @access  Private (Admin or User)
router.post('/', authenticate, authorize(['admin', 'user']), createCustomer);

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private (Admin or User)
router.put('/:id', authenticate, authorize(['admin', 'user']), updateCustomer);

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteCustomer);

module.exports = router;