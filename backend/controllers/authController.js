const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret key for JWT (in production, use environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'stockweb_secret_key';

// User registration
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide username, email, and password' });
        }
        
        // Check if user already exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        // Create user
        const user = await User.create({ username, email, password, role });
        
        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        };
        
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// User login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Please provide username and password' });
        }
        
        // Check if user exists
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        };
        
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        // Get user from database
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Logout (client-side operation, but we can provide a response)
const logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};

// Create default admin user (for development/setup)
const createDefaultAdmin = async (req, res) => {
    try {
        // Check if admin user already exists
        const existingAdmin = await User.findByUsername('admin');
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        // Create default admin user
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@stockweb.com',
            password: 'password123',
            role: 'admin'
        });

        res.status(201).json({
            message: 'Default admin user created successfully',
            user: {
                id: adminUser.id,
                username: adminUser.username,
                email: adminUser.email,
                role: adminUser.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { register, login, getCurrentUser, logout, createDefaultAdmin };
