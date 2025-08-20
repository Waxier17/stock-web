const express = require('express');
const db = require('../config/database');

const router = express.Router();

// @route   GET /api/testdb/customers
// @desc    Get all customers directly from database
// @access  Private (Admin only)
router.get('/customers', (req, res) => {
    const sql = 'SELECT * FROM Customers';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching customers:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            console.log('Customers from database:', rows);
            res.status(200).json(rows);
        }
    });
});

// @route   GET /api/testdb/customers/search/:term
// @desc    Search customers directly from database
// @access  Private (Admin only)
router.get('/customers/search/:term', (req, res) => {
    const { term } = req.params;
    console.log('Searching for customers with term:', term);
    const sql = `
        SELECT * FROM Customers 
        WHERE first_name LIKE ? OR last_name LIKE ? OR first_name || ' ' || last_name LIKE ?
        ORDER BY last_name, first_name
    `;
    const searchPattern = `%${term}%`;
    console.log('Search pattern:', searchPattern);
    db.all(sql, [searchPattern, searchPattern, searchPattern], (err, rows) => {
        if (err) {
            console.error('Error searching customers:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            console.log('Found customers:', rows);
            res.status(200).json(rows);
        }
    });
});

module.exports = router;