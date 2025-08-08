const Supplier = require('../models/Supplier');

// Get all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.status(200).json(suppliers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get supplier by ID
const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findById(id);
        
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        
        res.status(200).json(supplier);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create supplier
const createSupplier = async (req, res) => {
    try {
        const { name, contact_person, email, phone, address, city, state, zip_code } = req.body;
        
        // Validate input
        if (!name) {
            return res.status(400).json({ error: 'Supplier name is required' });
        }
        
        // Check if supplier already exists
        const existingSupplier = await Supplier.findByName(name);
        if (existingSupplier) {
            return res.status(400).json({ error: 'Supplier with this name already exists' });
        }
        
        if (email) {
            const existingSupplier = await Supplier.findByEmail(email);
            if (existingSupplier) {
                return res.status(400).json({ error: 'Supplier with this email already exists' });
            }
        }
        
        // Create supplier
        const supplierData = {
            name,
            contact_person: contact_person || null,
            email: email || null,
            phone: phone || null,
            address: address || null,
            city: city || null,
            state: state || null,
            zip_code: zip_code || null
        };
        
        const supplier = await Supplier.create(supplierData);
        res.status(201).json(supplier);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update supplier
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contact_person, email, phone, address, city, state, zip_code } = req.body;
        
        // Check if supplier exists
        const existingSupplier = await Supplier.findById(id);
        if (!existingSupplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        
        // Check if another supplier already exists with the same name
        if (name && name !== existingSupplier.name) {
            const existingSupplier = await Supplier.findByName(name);
            if (existingSupplier) {
                return res.status(400).json({ error: 'Supplier with this name already exists' });
            }
        }
        
        // Check if another supplier already exists with the same email
        if (email && email !== existingSupplier.email) {
            const existingSupplier = await Supplier.findByEmail(email);
            if (existingSupplier) {
                return res.status(400).json({ error: 'Supplier with this email already exists' });
            }
        }
        
        // Update supplier
        const supplierData = {
            name: name || existingSupplier.name,
            contact_person: contact_person || existingSupplier.contact_person,
            email: email || existingSupplier.email,
            phone: phone || existingSupplier.phone,
            address: address || existingSupplier.address,
            city: city || existingSupplier.city,
            state: state || existingSupplier.state,
            zip_code: zip_code || existingSupplier.zip_code
        };
        
        const supplier = await Supplier.update(id, supplierData);
        res.status(200).json(supplier);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if supplier exists
        const existingSupplier = await Supplier.findById(id);
        if (!existingSupplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        // Check if supplier has associated products
        const hasProducts = await Supplier.hasAssociatedProducts(id);
        if (hasProducts) {
            return res.status(400).json({
                error: 'Cannot delete supplier because it has associated products. Please reassign or delete the products first.'
            });
        }

        // Delete supplier
        const result = await Supplier.delete(id);
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (err) {
        console.error('Error deleting supplier:', err.message);

        // Check if it's a foreign key constraint error
        if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
            return res.status(400).json({
                error: 'Cannot delete supplier because it has associated products. Please reassign or delete the products first.'
            });
        }

        res.status(500).json({ error: 'Server error' });
    }
};

// Search suppliers by name
const searchSuppliers = async (req, res) => {
    try {
        const { name } = req.query;
        
        if (!name) {
            return res.status(400).json({ error: 'Supplier name is required for search' });
        }
        
        const suppliers = await Supplier.searchByName(name);
        
        if (!suppliers || suppliers.length === 0) {
            return res.status(404).json({ error: 'No suppliers found matching the search criteria' });
        }
        
        res.status(200).json(suppliers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers
};
