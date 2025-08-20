const db = require('../config/database');

class SaleItem {
    // Create a new sale item
    static create(saleItemData) {
        return new Promise((resolve, reject) => {
            const { sale_id, product_id, quantity, unit_price, total_price } = saleItemData;
            const sql = `
                INSERT INTO SaleItems 
                (sale_id, product_id, quantity, unit_price, total_price) 
                VALUES (?, ?, ?, ?, ?)
            `;
            db.run(sql, [sale_id, product_id, quantity, unit_price, total_price], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id: this.lastID, 
                        sale_id, 
                        product_id, 
                        quantity, 
                        unit_price, 
                        total_price 
                    });
                }
            });
        });
    }
    
    // Find sale items by sale ID
    static findBySaleId(saleId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT si.*, p.name as product_name
                FROM SaleItems si
                LEFT JOIN Products p ON si.product_id = p.id
                WHERE si.sale_id = ?
                ORDER BY si.id
            `;
            db.all(sql, [saleId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Find sale item by ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT si.*, p.name as product_name
                FROM SaleItems si
                LEFT JOIN Products p ON si.product_id = p.id
                WHERE si.id = ?
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
    
    // Get all sale items
    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT si.*, p.name as product_name
                FROM SaleItems si
                LEFT JOIN Products p ON si.product_id = p.id
                ORDER BY si.sale_id, si.id
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
    
    // Update sale item
    static update(id, saleItemData) {
        return new Promise((resolve, reject) => {
            const { sale_id, product_id, quantity, unit_price, total_price } = saleItemData;
            const sql = `
                UPDATE SaleItems 
                SET sale_id = ?, product_id = ?, quantity = ?, unit_price = ?, total_price = ?
                WHERE id = ?
            `;
            db.run(sql, [sale_id, product_id, quantity, unit_price, total_price, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id, 
                        sale_id, 
                        product_id, 
                        quantity, 
                        unit_price, 
                        total_price 
                    });
                }
            });
        });
    }
    
    // Delete sale item
    static delete(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SaleItems WHERE id = ?';
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes > 0 });
                }
            });
        });
    }
    
    // Delete all sale items for a sale
    static deleteBySaleId(saleId) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SaleItems WHERE sale_id = ?';
            db.run(sql, [saleId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }

    // Delete all sale items
    static deleteAll() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM SaleItems';
            db.run(sql, [], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }

    // Get count of sale items
    static getCount() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM SaleItems';
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

module.exports = SaleItem;
