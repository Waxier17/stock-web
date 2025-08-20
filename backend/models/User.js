const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    // Create a new user
    static async create(userData) {
        const { username, email, password, role = 'user' } = userData;
        
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)';
            db.run(sql, [username, email, hashedPassword, role], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, username, email, role });
                }
            });
        });
    }
    
    // Find user by ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Users WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Find user by username
    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Users WHERE username = ?';
            db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Find user by email
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Users WHERE email = ?';
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    // Compare password with hashed password
    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
    
    // Update user
    static async update(id, userData) {
        const { username, email, role, password } = userData;

        let sql, params;

        if (password) {
            // Hash the new password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            sql = 'UPDATE Users SET username = ?, email = ?, role = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            params = [username, email, role, hashedPassword, id];
        } else {
            sql = 'UPDATE Users SET username = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            params = [username, email, role, id];
        }

        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, username, email, role });
                }
            });
        });
    }
    
    // Delete user
    static delete(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Users WHERE id = ?';
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes > 0 });
                }
            });
        });
    }
    
    // Get all users
    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id, username, email, role, created_at, updated_at FROM Users ORDER BY created_at DESC';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Find users by role
    static findByRole(role) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id, username, email, role, created_at, updated_at FROM Users WHERE role = ?';
            db.all(sql, [role], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Change password
    static async changePassword(id, newPassword) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        return new Promise((resolve, reject) => {
            const sql = 'UPDATE Users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            db.run(sql, [hashedPassword, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ updated: this.changes > 0 });
                }
            });
        });
    }

    // Get user count
    static getCount() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM Users';
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

module.exports = User;
