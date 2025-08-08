const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const Sale = require('../models/Sale');
const SaleItem = require('../models/SaleItem');
const fs = require('fs');
const path = require('path');
const db = require('../config/database');

// Clear all demo/sample data (preserves admin users)
const clearAllDemoData = async (req, res) => {
    try {
        console.log('Starting demo data cleanup (preserving admin users)...');

        // Delete in the correct order to respect foreign key constraints
        // First delete SaleItems (they reference Products and Sales)
        await SaleItem.deleteAll();
        console.log('Deleted all sale items');

        // Then delete Sales (they reference Customers)
        await Sale.deleteAll();
        console.log('Deleted all sales');

        // Then delete Products (they reference Categories and Suppliers)
        await Product.deleteAll();
        console.log('Deleted all products');

        // Delete Customers
        await Customer.deleteAll();
        console.log('Deleted all customers');

        // Delete Suppliers
        await Supplier.deleteAll();
        console.log('Deleted all suppliers');

        // Note: We deliberately preserve Users (including admin) for security

        console.log('Demo data cleanup completed successfully (admin users preserved)');

        res.status(200).json({
            message: 'All demo data cleared successfully (admin users preserved)',
            cleared: {
                saleItems: true,
                sales: true,
                products: true,
                customers: true,
                suppliers: true,
                users: false // Preserved
            }
        });
    } catch (err) {
        console.error('Error during demo data cleanup:', err.message);
        res.status(500).json({ error: 'Error clearing demo data: ' + err.message });
    }
};

// Clear only products
const clearProducts = async (req, res) => {
    try {
        // First check if products have sales
        const productsWithSales = await Product.getProductsWithSales();
        if (productsWithSales && productsWithSales.length > 0) {
            return res.status(400).json({
                error: 'Some products have associated sales. Please clear sales data first or use the full cleanup option.'
            });
        }

        await Product.deleteAll();
        res.status(200).json({ message: 'All products cleared successfully' });
    } catch (err) {
        console.error('Error clearing products:', err.message);
        res.status(500).json({ error: 'Error clearing products: ' + err.message });
    }
};

// Clear only customers
const clearCustomers = async (req, res) => {
    try {
        // First check if customers have sales
        const customersWithSales = await Customer.getCustomersWithSales();
        if (customersWithSales && customersWithSales.length > 0) {
            return res.status(400).json({
                error: 'Some customers have associated sales. Please clear sales data first or use the full cleanup option.'
            });
        }

        await Customer.deleteAll();
        res.status(200).json({ message: 'All customers cleared successfully' });
    } catch (err) {
        console.error('Error clearing customers:', err.message);
        res.status(500).json({ error: 'Error clearing customers: ' + err.message });
    }
};

// Clear only suppliers
const clearSuppliers = async (req, res) => {
    try {
        // First check if suppliers have products
        const suppliersWithProducts = await Supplier.getSuppliersWithProducts();
        if (suppliersWithProducts && suppliersWithProducts.length > 0) {
            return res.status(400).json({
                error: 'Some suppliers have associated products. Please clear products first or use the full cleanup option.'
            });
        }

        await Supplier.deleteAll();
        res.status(200).json({ message: 'All suppliers cleared successfully' });
    } catch (err) {
        console.error('Error clearing suppliers:', err.message);
        res.status(500).json({ error: 'Error clearing suppliers: ' + err.message });
    }
};

// Get counts of all demo data
const getDemoDataCounts = async (req, res) => {
    try {
        const counts = {
            products: await Product.getCount(),
            customers: await Customer.getCount(),
            suppliers: await Supplier.getCount(),
            sales: await Sale.getCount(),
            saleItems: await SaleItem.getCount()
        };

        res.status(200).json(counts);
    } catch (err) {
        console.error('Error getting demo data counts:', err.message);
        res.status(500).json({ error: 'Error getting data counts: ' + err.message });
    }
};

// Reset database completely but preserve admin users
const resetDatabase = async (req, res) => {
    try {
        console.log('Starting database reset (preserving admin users)...');

        // First backup admin users
        const adminUsers = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM Users WHERE role = "admin"', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        console.log(`Found ${adminUsers.length} admin users to preserve`);

        // Drop all tables except Users table (we'll clear it manually)
        const dropQueries = [
            'DROP TABLE IF EXISTS SaleItems',
            'DROP TABLE IF EXISTS Sales',
            'DROP TABLE IF EXISTS Products',
            'DROP TABLE IF EXISTS Customers',
            'DROP TABLE IF EXISTS Suppliers',
            'DROP TABLE IF EXISTS Categories'
        ];

        // Execute drop queries (excluding Users)
        for (const query of dropQueries) {
            await new Promise((resolve, reject) => {
                db.run(query, (err) => {
                    if (err) {
                        console.error(`Error executing ${query}:`, err);
                        reject(err);
                    } else {
                        console.log(`Executed: ${query}`);
                        resolve();
                    }
                });
            });
        }

        // Clear non-admin users from Users table (preserve admin)
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM Users WHERE role != "admin"', (err) => {
                if (err) {
                    console.error('Error clearing non-admin users:', err);
                    reject(err);
                } else {
                    console.log('Cleared non-admin users');
                    resolve();
                }
            });
        });

        // Recreate all tables (except Users which already exists)
        const createQueries = [
            `CREATE TABLE Categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE Suppliers (
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
            )`,
            `CREATE TABLE Customers (
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
            )`,
            `CREATE TABLE Products (
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
            )`,
            `CREATE TABLE Sales (
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
            )`,
            `CREATE TABLE SaleItems (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sale_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price REAL NOT NULL,
                total_price REAL NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sale_id) REFERENCES Sales (id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES Products (id)
            )`
        ];

        // Execute create queries
        for (const query of createQueries) {
            await new Promise((resolve, reject) => {
                db.run(query, (err) => {
                    if (err) {
                        console.error(`Error creating table:`, err);
                        reject(err);
                    } else {
                        console.log(`Created table successfully`);
                        resolve();
                    }
                });
            });
        }

        console.log('Database reset completed successfully (admin users preserved)');

        res.status(200).json({
            message: 'Database reset completed successfully (admin users preserved)',
            status: 'All tables recreated with empty data, admin users preserved',
            preservedAdmins: adminUsers.length
        });
    } catch (err) {
        console.error('Error during database reset:', err.message);
        res.status(500).json({ error: 'Error resetting database: ' + err.message });
    }
};

module.exports = {
    clearAllDemoData,
    clearProducts,
    clearCustomers,
    clearSuppliers,
    getDemoDataCounts,
    resetDatabase
};
