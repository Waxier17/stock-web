const Customer = require('../models/Customer');

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.status(200).json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);
        
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        
        res.status(200).json(customer);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create customer
const createCustomer = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, address, city, state, zip_code } = req.body;
        
        // Validate input
        if (!first_name || !last_name) {
            return res.status(400).json({ error: 'First name and last name are required' });
        }
        
        // Check if customer already exists
        if (email) {
            const existingCustomer = await Customer.findByEmail(email);
            if (existingCustomer) {
                return res.status(400).json({ error: 'Customer with this email already exists' });
            }
        }
        
        if (phone) {
            const existingCustomer = await Customer.findByPhone(phone);
            if (existingCustomer) {
                return res.status(400).json({ error: 'Customer with this phone already exists' });
            }
        }
        
        // Create customer
        const customerData = {
            first_name,
            last_name,
            email: email || null,
            phone: phone || null,
            address: address || null,
            city: city || null,
            state: state || null,
            zip_code: zip_code || null
        };
        
        const customer = await Customer.create(customerData);
        res.status(201).json(customer);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update customer
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, phone, address, city, state, zip_code } = req.body;
        
        // Check if customer exists
        const existingCustomer = await Customer.findById(id);
        if (!existingCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        
        // Check if another customer already exists with the same email
        if (email && email !== existingCustomer.email) {
            const existingCustomer = await Customer.findByEmail(email);
            if (existingCustomer) {
                return res.status(400).json({ error: 'Customer with this email already exists' });
            }
        }
        
        // Check if another customer already exists with the same phone
        if (phone && phone !== existingCustomer.phone) {
            const existingCustomer = await Customer.findByPhone(phone);
            if (existingCustomer) {
                return res.status(400).json({ error: 'Customer with this phone already exists' });
            }
        }
        
        // Update customer
        const customerData = {
            first_name: first_name || existingCustomer.first_name,
            last_name: last_name || existingCustomer.last_name,
            email: email || existingCustomer.email,
            phone: phone || existingCustomer.phone,
            address: address || existingCustomer.address,
            city: city || existingCustomer.city,
            state: state || existingCustomer.state,
            zip_code: zip_code || existingCustomer.zip_code
        };
        
        const customer = await Customer.update(id, customerData);
        res.status(200).json(customer);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if customer exists
        const existingCustomer = await Customer.findById(id);
        if (!existingCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        
        // Delete customer
        const result = await Customer.delete(id);
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Search customers by name
const searchCustomers = async (req, res) => {
    try {
        const { name } = req.query;
        console.log('Search request received with name:', name);
        
        if (!name) {
            console.log('No name provided for search');
            return res.status(400).json({ error: 'Customer name is required for search' });
        }
        
        console.log('Calling Customer.searchByName with name:', name);
        const customers = await Customer.searchByName(name);
        console.log('Customers found:', customers);
        
        if (!customers || customers.length === 0) {
            console.log('No customers found for search term:', name);
            return res.status(404).json({ error: 'No customers found matching the search criteria' });
        }
        
        console.log('Returning customers:', customers);
        res.status(200).json(customers);
    } catch (err) {
        console.error('Error in searchCustomers:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers
};