const db = require('../config/database');

class Sale {
    // Create a new sale
    static create(saleData) {
        return new Promise((resolve, reject) => {
            const { customer_id, user_id, total_amount, discount = 0, tax = 0, final_amount, payment_method, notes } = saleData;
            const sql = `
                INSERT INTO Sales 
                (customer_id, user_id, total_amount, discount, tax, final_amount, payment_method, notes) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(sql, [customer_id, user_id, total_amount, discount, tax, final_amount, payment_method, notes], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id: this.lastID, 
                        customer_id, 
                        user_id, 
                        total_amount, 
                        discount, 
                        tax, 
                        final_amount, 
                        payment_method, 
                        notes 
                    });
                }
            });
        });
    }
    
    // Find sale by ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT s.*, u.username as user_name, c.first_name as customer_first_name, c.last_name as customer_last_name
                FROM Sales s
                LEFT JOIN Users u ON s.user_id = u.id
                LEFT JOIN Customers c ON s.customer_id = c.id
                WHERE s.id = ?
            `;
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Get all sales
    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT s.*, u.username as user_name, c.first_name as customer_first_name, c.last_name as customer_last_name
                FROM Sales s
                LEFT JOIN Users u ON s.user_id = u.id
                LEFT JOIN Customers c ON s.customer_id = c.id
                ORDER BY s.created_at DESC
            `;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Get sales by customer
    static findByCustomer(customerId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT s.*, u.username as user_name, c.first_name as customer_first_name, c.last_name as customer_last_name
                FROM Sales s
                LEFT JOIN Users u ON s.user_id = u.id
                LEFT JOIN Customers c ON s.customer_id = c.id
                WHERE s.customer_id = ?
                ORDER BY s.created_at DESC
            `;
            db.all(sql, [customerId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Get sales by user
    static findByUser(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT s.*, u.username as user_name, c.first_name as customer_first_name, c.last_name as customer_last_name
                FROM Sales s
                LEFT JOIN Users u ON s.user_id = u.id
                LEFT JOIN Customers c ON s.customer_id = c.id
                WHERE s.user_id = ?
                ORDER BY s.created_at DESC
            `;
            db.all(sql, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Get sales by date range
    static findByDateRange(startDate, endDate) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT s.*, u.username as user_name, c.first_name as customer_first_name, c.last_name as customer_last_name
                FROM Sales s
                LEFT JOIN Users u ON s.user_id = u.id
                LEFT JOIN Customers c ON s.customer_id = c.id
                WHERE s.created_at BETWEEN ? AND ?
                ORDER BY s.created_at DESC
            `;
            db.all(sql, [startDate, endDate], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Update sale
    static update(id, saleData) {
        return new Promise((resolve, reject) => {
            const { customer_id, user_id, total_amount, discount, tax, final_amount, payment_method, notes } = saleData;
            const sql = `
                UPDATE Sales 
                SET customer_id = ?, user_id = ?, total_amount = ?, discount = ?, tax = ?, final_amount = ?, payment_method = ?, notes = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            db.run(sql, [customer_id, user_id, total_amount, discount, tax, final_amount, payment_method, notes, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id, 
                        customer_id, 
                        user_id, 
                        total_amount, 
                        discount, 
                        tax, 
                        final_amount, 
                        payment_method, 
                        notes 
                    });
                }
            });
        });
    }
    
    // Delete sale
    static delete(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Sales WHERE id = ?';
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes > 0 });
                }
            });
        });
    }

    // Delete all sales
    static deleteAll() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Sales';
            db.run(sql, [], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }

    // Get count of sales
    static getCount() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM Sales';
            db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        });
    }
}

module.exports = Sale;
