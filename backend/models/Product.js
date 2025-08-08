const db = require('../config/database');

class Product {
    // Create a new product
    static create(productData) {
        return new Promise((resolve, reject) => {
            const { name, description, category_id, price, cost, stock_quantity, min_stock_level, barcode, supplier_id } = productData;
            const sql = 'INSERT INTO Products (name, description, category_id, price, cost, stock_quantity, min_stock_level, barcode, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.run(sql, [name, description, category_id, price, cost, stock_quantity, min_stock_level, barcode, supplier_id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Return the created product with category and supplier names
                    Product.findById(this.lastID)
                        .then(product => resolve(product))
                        .catch(error => reject(error));
                }
            });
        });
    }
    
    // Find product by ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.*, c.name as category_name, s.name as supplier_name
                FROM Products p
                LEFT JOIN Categories c ON p.category_id = c.id
                LEFT JOIN Suppliers s ON p.supplier_id = s.id
                WHERE p.id = ?
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
    
    // Find product by barcode
    static findByBarcode(barcode) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Products WHERE barcode = ?';
            db.get(sql, [barcode], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Find products by category
    static findByCategory(categoryId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.*, c.name as category_name, s.name as supplier_name
                FROM Products p
                LEFT JOIN Categories c ON p.category_id = c.id
                LEFT JOIN Suppliers s ON p.supplier_id = s.id
                WHERE p.category_id = ?
                ORDER BY p.name
            `;
            db.all(sql, [categoryId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Get all products
    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.*, c.name as category_name, s.name as supplier_name
                FROM Products p
                LEFT JOIN Categories c ON p.category_id = c.id
                LEFT JOIN Suppliers s ON p.supplier_id = s.id
                ORDER BY p.name
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
    
    // Search products by name
    static searchByName(name) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.*, c.name as category_name, s.name as supplier_name
                FROM Products p
                LEFT JOIN Categories c ON p.category_id = c.id
                LEFT JOIN Suppliers s ON p.supplier_id = s.id
                WHERE p.name LIKE ?
                ORDER BY p.name
            `;
            db.all(sql, [`%${name}%`], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Update product
    static update(id, productData) {
        return new Promise((resolve, reject) => {
            const { name, description, category_id, price, cost, stock_quantity, min_stock_level, barcode, supplier_id } = productData;
            const sql = 'UPDATE Products SET name = ?, description = ?, category_id = ?, price = ?, cost = ?, stock_quantity = ?, min_stock_level = ?, barcode = ?, supplier_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            db.run(sql, [name, description, category_id, price, cost, stock_quantity, min_stock_level, barcode, supplier_id, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Return the updated product with category and supplier names
                    Product.findById(id)
                        .then(product => resolve(product))
                        .catch(error => reject(error));
                }
            });
        });
    }
    
    // Check if product has sales items
    static hasSalesItems(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM SaleItems WHERE product_id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count > 0);
                }
            });
        });
    }

    // Delete product
    static delete(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Products WHERE id = ?';
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes > 0 });
                }
            });
        });
    }
    
    // Update stock quantity
    static updateStock(id, quantity) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE Products SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            db.run(sql, [quantity, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, stock_quantity: quantity });
                }
            });
        });
    }
    
    // Get low stock products
    static getLowStock() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.*, c.name as category_name, s.name as supplier_name
                FROM Products p
                LEFT JOIN Categories c ON p.category_id = c.id
                LEFT JOIN Suppliers s ON p.supplier_id = s.id
                WHERE p.stock_quantity <= p.min_stock_level
                ORDER BY p.stock_quantity
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

    // Delete all products
    static deleteAll() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Products';
            db.run(sql, [], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }

    // Get count of products
    static getCount() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM Products';
            db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        });
    }

    // Get products with sales
    static getProductsWithSales() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT DISTINCT p.id, p.name
                FROM Products p
                INNER JOIN SaleItems si ON p.id = si.product_id
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
}

module.exports = Product;
