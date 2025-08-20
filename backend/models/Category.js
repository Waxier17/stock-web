const db = require('../config/database');

class Category {
    // Create a new category
    static create(categoryData) {
        return new Promise((resolve, reject) => {
            const { name, description } = categoryData;
            const sql = 'INSERT INTO Categories (name, description) VALUES (?, ?)';
            db.run(sql, [name, description], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, name, description });
                }
            });
        });
    }
    
    // Find category by ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Categories WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Find category by name (case insensitive)
    static findByName(name) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Categories WHERE LOWER(name) = LOWER(?)';
            db.get(sql, [name], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Get all categories
    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id, name, description, created_at, updated_at FROM Categories ORDER BY name';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Update category
    static update(id, categoryData) {
        return new Promise((resolve, reject) => {
            const { name, description } = categoryData;
            const sql = 'UPDATE Categories SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            db.run(sql, [name, description, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, name, description });
                }
            });
        });
    }
    
    // Delete category
    static delete(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Categories WHERE id = ?';
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes > 0 });
                }
            });
        });
    }

    // Check if category has products
    static hasProducts(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM Products WHERE category_id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count > 0);
                }
            });
        });
    }

    // Search categories by name
    static searchByName(searchTerm) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Categories WHERE name LIKE ? ORDER BY name';
            db.all(sql, [`%${searchTerm}%`], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get category statistics
    static getStats() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT
                    c.id,
                    c.name,
                    c.description,
                    c.created_at,
                    c.updated_at,
                    COUNT(p.id) as product_count,
                    COALESCE(SUM(p.stock_quantity), 0) as total_stock
                FROM Categories c
                LEFT JOIN Products p ON c.id = p.category_id
                GROUP BY c.id, c.name, c.description, c.created_at, c.updated_at
                ORDER BY c.name
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
    

    // Get count of categories
    static getCount() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM Categories';
            db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        });
    }

    // Delete all categories
    static deleteAll() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Categories';
            db.run(sql, [], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }
}

module.exports = Category;
