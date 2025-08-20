const User = require('../models/User');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        console.log('Getting all users - called by:', req.user?.username);
        const users = await User.findAll();
        console.log('Found users:', users.length);

        // Remove passwords from response
        const usersWithoutPasswords = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        console.log('Returning users without passwords:', usersWithoutPasswords.length);
        res.status(200).json(usersWithoutPasswords);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (err) {
        console.error('Error fetching user:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create new user (admin only)
const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }
        
        // Validate role
        const validRoles = ['admin', 'user'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be admin or user' });
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
        const user = await User.create({ username, email, password, role: role || 'user' });
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update user (admin only)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Validate role if provided
        if (role) {
            const validRoles = ['admin', 'user'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ error: 'Invalid role. Must be admin or user' });
            }
        }
        
        // Check if username is already taken by another user
        if (username && username !== existingUser.username) {
            const duplicateUser = await User.findByUsername(username);
            if (duplicateUser) {
                return res.status(400).json({ error: 'Username already exists' });
            }
        }
        
        // Check if email is already taken by another user
        if (email && email !== existingUser.email) {
            const duplicateEmail = await User.findByEmail(email);
            if (duplicateEmail) {
                return res.status(400).json({ error: 'Email already exists' });
            }
        }
        
        // Prepare update data
        const updateData = {
            username: username || existingUser.username,
            email: email || existingUser.email,
            role: role || existingUser.role
        };
        
        // Only update password if provided
        if (password) {
            updateData.password = password;
        }
        
        // Update user
        const updatedUser = await User.update(id, updateData);
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = updatedUser;
        res.status(200).json(userWithoutPassword);
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if user exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Prevent deletion of the last admin user
        if (existingUser.role === 'admin') {
            const allAdmins = await User.findByRole('admin');
            if (allAdmins.length <= 1) {
                return res.status(400).json({ error: 'Cannot delete the last admin user' });
            }
        }
        
        // Delete user
        await User.delete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Change user password (admin can change any user's password)
const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        
        if (!newPassword) {
            return res.status(400).json({ error: 'New password is required' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        
        // Check if user exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Update password
        await User.changePassword(id, newPassword);
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error changing password:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword
};
