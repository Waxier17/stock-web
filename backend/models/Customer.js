const db = require('../config/database');

class Customer {
    // Create a new customer
    static create(customerData) {
        return new Promise((resolve, reject) => {
            const { first_name, last_name, email, phone, address, city, state, zip_code } = customerData;
            const sql = `
                INSERT INTO Customers 
                (first_name, last_name, email, phone, address, city, state, zip_code) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(sql, [first_name, last_name, email, phone, address, city, state, zip_code], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id: this.lastID, 
                        first_name, 
                        last_name, 
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
    
    // Find customer by ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Customers WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Find customer by email
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Customers WHERE email = ?';
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Find customer by phone
    static findByPhone(phone) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Customers WHERE phone = ?';
            db.get(sql, [phone], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Get all customers
    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Customers ORDER BY last_name, first_name';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    // Search customers by name
    static searchByName(searchTerm) {
        return new Promise((resolve, reject) => {
            console.log('Searching for customers with term:', searchTerm);
            const sql = `
                SELECT * FROM Customers
                WHERE first_name LIKE ? OR last_name LIKE ? OR first_name || ' ' || last_name LIKE ?
                ORDER BY last_name, first_name
            `;
            const searchPattern = `%${searchTerm}%`;
            console.log('Search pattern:', searchPattern);
            db.all(sql, [searchPattern, searchPattern, searchPattern], (err, rows) => {
                if (err) {
                    console.error('Error searching customers:', err);
                    reject(err);
                } else {
                    console.log('Found customers:', rows);
                    resolve(rows);
                }
            });
        });
    }
    
    // Update customer
    static update(id, customerData) {
        return new Promise((resolve, reject) => {
            const { first_name, last_name, email, phone, address, city, state, zip_code } = customerData;
            const sql = `
                UPDATE Customers 
                SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zip_code = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            db.run(sql, [first_name, last_name, email, phone, address, city, state, zip_code, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id, 
                        first_name, 
                        last_name, 
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
    
    // Delete customer
    static delete(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Customers WHERE id = ?';
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes > 0 });
                }
            });
        });
    }

    // Delete all customers
    static deleteAll() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Customers';
            db.run(sql, [], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }

    // Get count of customers
    static getCount() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM Customers';
            db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        });
    }

    // Get customers with sales
    static getCustomersWithSales() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT DISTINCT c.id, c.first_name, c.last_name
                FROM Customers c
                INNER JOIN Sales s ON c.id = s.customer_id
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

module.exports = Customer;
