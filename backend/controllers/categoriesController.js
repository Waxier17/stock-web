const Category = require('../models/Category');

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.status(200).json(category);
    } catch (err) {
        console.error('Error fetching category:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Validate input
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Category name is required' });
        }
        
        // Trim whitespace
        const trimmedName = name.trim();
        const trimmedDescription = description ? description.trim() : '';
        
        // Check if category already exists (case insensitive)
        const existingCategory = await Category.findByName(trimmedName);
        if (existingCategory) {
            return res.status(400).json({ error: 'Category with this name already exists' });
        }
        
        // Create category
        const category = await Category.create({ 
            name: trimmedName, 
            description: trimmedDescription 
        });
        
        res.status(201).json(category);
    } catch (err) {
        console.error('Error creating category:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        // Validate input
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Category name is required' });
        }
        
        // Trim whitespace
        const trimmedName = name.trim();
        const trimmedDescription = description ? description.trim() : '';
        
        // Check if category exists
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // Check if another category with the same name exists
        const duplicateCategory = await Category.findByName(trimmedName);
        if (duplicateCategory && duplicateCategory.id != id) {
            return res.status(400).json({ error: 'Category with this name already exists' });
        }
        
        // Update category
        const category = await Category.update(id, { 
            name: trimmedName, 
            description: trimmedDescription 
        });
        
        res.status(200).json(category);
    } catch (err) {
        console.error('Error updating category:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if category exists
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // Check if category has products
        const hasProducts = await Category.hasProducts(id);
        if (hasProducts) {
            return res.status(400).json({ 
                error: 'Cannot delete category. This category has associated products. Please remove or reassign the products first.' 
            });
        }
        
        // Delete category
        await Category.delete(id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error deleting category:', err.message);
        
        // Handle specific SQLite constraint errors
        if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
            return res.status(400).json({ 
                error: 'Cannot delete category. This category has associated products. Please remove or reassign the products first.' 
            });
        }
        
        res.status(500).json({ error: 'Server error' });
    }
};

// Get category statistics
const getCategoryStats = async (req, res) => {
    try {
        const stats = await Category.getStats();
        res.status(200).json(stats);
    } catch (err) {
        console.error('Error fetching category stats:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Search categories by name
const searchCategories = async (req, res) => {
    try {
        const { name } = req.query;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Search term is required' });
        }
        
        const categories = await Category.searchByName(name.trim());
        res.status(200).json(categories);
    } catch (err) {
        console.error('Error searching categories:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryStats,
    searchCategories
};
