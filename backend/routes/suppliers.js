const express = require('express');
const {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers
} = require('../controllers/suppliersController');

const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/suppliers
// @desc    Get all suppliers
// @access  Private (Admin or User)
router.get('/', authenticate, authorize(['admin', 'user']), getAllSuppliers);

// @route   GET /api/suppliers/search
// @desc    Search suppliers by name
// @access  Private (Admin or User)
router.get('/search', authenticate, authorize(['admin', 'user']), searchSuppliers);

// @route   GET /api/suppliers/:id
// @desc    Get supplier by ID
// @access  Private (Admin or User)
router.get('/:id', authenticate, authorize(['admin', 'user']), getSupplierById);

// @route   POST /api/suppliers
// @desc    Create supplier
// @access  Private (Admin or User)
router.post('/', authenticate, authorize(['admin', 'user']), createSupplier);

// @route   PUT /api/suppliers/:id
// @desc    Update supplier
// @access  Private (Admin or User)
router.put('/:id', authenticate, authorize(['admin', 'user']), updateSupplier);

// @route   DELETE /api/suppliers/:id
// @desc    Delete supplier
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteSupplier);

module.exports = router;