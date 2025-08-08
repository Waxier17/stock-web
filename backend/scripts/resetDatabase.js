const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Path to database file
const dbPath = path.join(__dirname, '../database/stockweb.db');

console.log('🗑️  Resetting database...');

// Check if database file exists
if (fs.existsSync(dbPath)) {
    console.log('📁 Database file exists, deleting...');
    fs.unlinkSync(dbPath);
    console.log('✅ Database file deleted');
} else {
    console.log('📁 Database file does not exist');
}

// Create new database connection and recreate tables
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error creating database:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Connected to new SQLite database');
        initializeTables();
    }
});

// Function to initialize tables (copied from init.js)
function initializeTables() {
    console.log('📋 Creating tables...');
    
    // Create Users table
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating Users table:', err.message);
        } else {
            console.log('✅ Users table created successfully');
        }
    });

    // Create Categories table
    db.run(`CREATE TABLE IF NOT EXISTS Categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating Categories table:', err.message);
        } else {
            console.log('✅ Categories table created successfully');
        }
    });

    // Create Products table
    db.run(`CREATE TABLE IF NOT EXISTS Products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        category_id INTEGER,
        price REAL NOT NULL,
        cost REAL,
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        min_stock_level INTEGER DEFAULT 0,
        barcode TEXT UNIQUE,
        supplier_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES Categories (id),
        FOREIGN KEY (supplier_id) REFERENCES Suppliers (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating Products table:', err.message);
        } else {
            console.log('✅ Products table created successfully');
        }
    });

    // Create Customers table
    db.run(`CREATE TABLE IF NOT EXISTS Customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zip_code TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating Customers table:', err.message);
        } else {
            console.log('✅ Customers table created successfully');
        }
    });

    // Create Suppliers table
    db.run(`CREATE TABLE IF NOT EXISTS Suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact_person TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zip_code TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating Suppliers table:', err.message);
        } else {
            console.log('✅ Suppliers table created successfully');
        }
    });

    // Create Sales table
    db.run(`CREATE TABLE IF NOT EXISTS Sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        user_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        discount REAL DEFAULT 0,
        tax REAL DEFAULT 0,
        final_amount REAL NOT NULL,
        payment_method TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES Customers (id),
        FOREIGN KEY (user_id) REFERENCES Users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating Sales table:', err.message);
        } else {
            console.log('✅ Sales table created successfully');
        }
    });

    // Create SaleItems table
    db.run(`CREATE TABLE IF NOT EXISTS SaleItems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        total_price REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sale_id) REFERENCES Sales (id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES Products (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Error creating SaleItems table:', err.message);
        } else {
            console.log('✅ SaleItems table created successfully');
            
            // Close database connection after all tables are created
            db.close((err) => {
                if (err) {
                    console.error('❌ Error closing database:', err.message);
                    process.exit(1);
                } else {
                    console.log('✅ Database reset completed successfully');
                    console.log('🎉 Fresh database ready for use!');
                    process.exit(0);
                }
            });
        }
    });
}
