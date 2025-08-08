const db = require('../config/database');

class Supplier {
    // Create a new supplier
    static create(supplierData) {
        return new Promise((resolve, reject) => {
            const { name, contact_person, email, phone, address, city, state, zip_code } = supplierData;
            const sql = `
                INSERT INTO Suppliers 
                (name, contact_person, email, phone, address, city, state, zip_code) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(sql, [name, contact_person, email, phone, address, city, state, zip_code], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id: this.lastID, 
                        name, 
                        contact_person, 
                        email, 
                        phone, 
                        address, 
                        city, 
                        state, 
                        zip_code 
                    });
                }
            });
        });
    }
    
    // Find supplier by ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Suppliers WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Find supplier by name
    static findByName(name) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Suppliers WHERE name = ?';
            db.get(sql, [name], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Find supplier by email
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Suppliers WHERE email = ?';
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Get all suppliers
    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Suppliers ORDER BY name';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Search suppliers by name
    static searchByName(searchTerm) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM Suppliers 
                WHERE name LIKE ? OR contact_person LIKE ?
                ORDER BY name
            `;
            const searchPattern = `%${searchTerm}%`;
            db.all(sql, [searchPattern, searchPattern], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Update supplier
    static update(id, supplierData) {
        return new Promise((resolve, reject) => {
            const { name, contact_person, email, phone, address, city, state, zip_code } = supplierData;
            const sql = `
                UPDATE Suppliers 
                SET name = ?, contact_person = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zip_code = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            db.run(sql, [name, contact_person, email, phone, address, city, state, zip_code, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id, 
                        name, 
                        contact_person, 
                        email, 
                        phone, 
                        address, 
                        city, 
                        state, 
                        zip_code 
                    });
                }
            });
        });
    }
    
    // Delete supplier
    static delete(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Suppliers WHERE id = ?';
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes > 0 });
                }
            });
        });
    }

    // Delete all suppliers
    static deleteAll() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Suppliers';
            db.run(sql, [], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }

    // Get count of suppliers
    static getCount() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM Suppliers';
            db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        });
    }

    // Get suppliers with products
    static getSuppliersWithProducts() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT DISTINCT s.id, s.name
                FROM Suppliers s
                INNER JOIN Products p ON s.id = p.supplier_id
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

    // Check if supplier has associated products
    static hasAssociatedProducts(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM Products WHERE supplier_id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count > 0);
                }
            });
        });
    }
}

module.exports = Supplier;
