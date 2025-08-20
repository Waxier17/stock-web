const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret key for JWT (in production, use environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'stockweb_secret_key';

// Authentication middleware
const authenticate = async (req, res, next) => {
    console.log('Authentication middleware called for route:', req.originalUrl);
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        
        // Check if token exists
        if (!authHeader) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }
        
        // Check if token is in Bearer format
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Invalid token format' });
        }
        
        // Extract token
        const token = authHeader.substring(7);
        
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Add user to request object
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

// Authorization middleware for role-based access control
const authorize = (roles = []) => {
    // If roles is a string, convert to array
    if (typeof roles === 'string') {
        roles = [roles];
    }
    
    return async (req, res, next) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            
            // Get user from database
            const user = await User.findById(req.user.id);
            
            // Check if user exists
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }
            
            // Check if user role is authorized
            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
            }
            
            // Add user to request object
            req.user = user;
            next();
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    };
};

module.exports = { authenticate, authorize };