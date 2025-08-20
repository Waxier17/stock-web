const express = require('express');
const { searchProducts } = require('../controllers/inventoryController');

const router = express.Router();

// @route   GET /api/public/products/search
// @desc    Search products by name
// @access  Public
router.get('/products/search', searchProducts);

module.exports = router;