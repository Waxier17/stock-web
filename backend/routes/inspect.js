const express = require('express');
const db = require('../config/database');

const router = express.Router();

// @route   GET /api/inspect/tables
// @desc    Get all table names and row counts
// @access  Public (temporary)
router.get('/tables', (req, res) => {
    const sql = "SELECT name FROM sqlite_master WHERE type='table'";
    db.all(sql, [], (err, tables) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        const tablePromises = tables.map(table => {
            return new Promise((resolve, reject) => {
                const countSql = `SELECT COUNT(*) as count FROM ${table.name}`;
                db.get(countSql, [], (err, result) => {
                    if (err) {
                        resolve({ table: table.name, count: 'error', error: err.message });
                    } else {
                        resolve({ table: table.name, count: result.count });
                    }
                });
            });
        });
        
        Promise.all(tablePromises).then(results => {
            res.json(results);
        });
    });
});

// @route   GET /api/inspect/:table
// @desc    Get all data from a specific table
// @access  Public (temporary)
router.get('/:table', (req, res) => {
    const tableName = req.params.table;
    const sql = `SELECT * FROM ${tableName}`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ table: tableName, data: rows });
        }
    });
});

module.exports = router;
