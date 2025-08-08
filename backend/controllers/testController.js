// Test controller for role-based access control

// Admin only route
const adminOnly = (req, res) => {
    res.status(200).json({
        message: 'Admin only route accessed successfully',
        user: req.user
    });
};

// User only route
const userOnly = (req, res) => {
    res.status(200).json({
        message: 'User only route accessed successfully',
        user: req.user
    });
};

// Admin or user route
const adminOrUser = (req, res) => {
    res.status(200).json({
        message: 'Admin or user route accessed successfully',
        user: req.user
    });
};

module.exports = { adminOnly, userOnly, adminOrUser };