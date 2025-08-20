const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Database connection
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');
const inventoryRoutes = require('./routes/inventory');
const publicRoutes = require('./routes/public');
const salesRoutes = require('./routes/sales');
const customersRoutes = require('./routes/customers');
const suppliersRoutes = require('./routes/suppliers');
const reportsRoutes = require('./routes/reports');
const testDbRoutes = require('./routes/testDb');
const cleanupRoutes = require('./routes/cleanup');
const inspectRoutes = require('./routes/inspect');
const usersRoutes = require('./routes/users');
const categoriesRoutes = require('./routes/categories');
const seedRoutes = require('./routes/seed');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve login page for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
console.log('Applying auth routes');
app.use('/api/auth', authRoutes);
console.log('Applying test routes');
app.use('/api/test', testRoutes);
console.log('Applying inventory routes');
app.use('/api/inventory', inventoryRoutes);
console.log('Applying public routes');
app.use('/api/public', publicRoutes);
console.log('Applying sales routes');
app.use('/api/sales', salesRoutes);
console.log('Applying customers routes');
app.use('/api/customers', customersRoutes);
console.log('Applying suppliers routes');
app.use('/api/suppliers', suppliersRoutes);
console.log('Applying reports routes');
app.use('/api/reports', reportsRoutes);
console.log('Applying testDb routes');
app.use('/api/testdb', testDbRoutes);
console.log('Applying cleanup routes');
app.use('/api/cleanup', cleanupRoutes);
console.log('Applying inspect routes');
app.use('/api/inspect', inspectRoutes);
console.log('Applying users routes');
app.use('/api/users', usersRoutes);
console.log('Applying categories routes');
app.use('/api/categories', categoriesRoutes);
console.log('Applying seed routes');
app.use('/api/seed', seedRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Stock Web API is running' });
});

// Test database connection
app.get('/api/db-test', (req, res) => {
    db.get('SELECT sqlite_version() as version', (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Database connection failed', details: err.message });
        } else {
            res.status(200).json({ status: 'OK', message: 'Database connection successful', version: row.version });
        }
    });
});

// Serve login page for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Serve frontend app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
    
    // Test database connection on startup
    db.get('SELECT sqlite_version() as version', (err, row) => {
        if (err) {
            console.error('Database connection failed:', err.message);
        } else {
            console.log(`Connected to SQLite database version ${row.version}`);
        }
    });
});

module.exports = app;
