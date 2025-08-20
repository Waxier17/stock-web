const Sale = require('../models/Sale');
const SaleItem = require('../models/SaleItem');
const Product = require('../models/Product');

// Get all sales
const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.findAll();

        // Enrich sales data with item count and customer name
        const enrichedSales = await Promise.all(sales.map(async (sale) => {
            // Get sale items to count them
            const items = await SaleItem.findBySaleId(sale.id);

            // Format customer name
            const customerName = sale.customer_first_name && sale.customer_last_name
                ? `${sale.customer_first_name} ${sale.customer_last_name}`.trim()
                : null;

            return {
                ...sale,
                itemCount: items.length,
                customerName: customerName,
                totalAmount: sale.final_amount || sale.total_amount,
                date: sale.created_at
            };
        }));

        res.status(200).json(enrichedSales);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get sale by ID
const getSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await Sale.findById(id);
        
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        
        // Get sale items
        const items = await SaleItem.findBySaleId(id);
        sale.items = items;
        
        res.status(200).json(sale);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create sale
const createSale = async (req, res) => {
    try {
        const { customer_id, total_amount, discount = 0, tax = 0, final_amount, payment_method, notes, items } = req.body;
        
        // Validate input
        console.log('Create sale request body:', req.body);
        if (!total_amount || !final_amount || !items || !items.length) {
            console.log('Validation failed:', { total_amount, final_amount, items: items?.length });
            return res.status(400).json({ error: 'Total amount, final amount, and items are required' });
        }
        
        // Validate user from token
        const user_id = req.user.id;
        
        // Create sale
        const saleData = {
            customer_id: customer_id || null,
            user_id,
            total_amount: parseFloat(total_amount),
            discount: parseFloat(discount),
            tax: parseFloat(tax),
            final_amount: parseFloat(final_amount),
            payment_method: payment_method || null,
            notes: notes || null
        };
        
        const sale = await Sale.create(saleData);
        
        // Create sale items
        const saleItems = [];
        for (const item of items) {
            const { product_id, quantity, unit_price, total_price } = item;
            
            // Validate item data
            if (!product_id || !quantity || !unit_price || !total_price) {
                console.log('Item validation failed:', { product_id, quantity, unit_price, total_price });
                // Delete the sale if there's an error with items
                await Sale.delete(sale.id);
                return res.status(400).json({ error: 'Product ID, quantity, unit price, and total price are required for each item' });
            }
            
            // Create sale item
            const saleItemData = {
                sale_id: sale.id,
                product_id: parseInt(product_id),
                quantity: parseInt(quantity),
                unit_price: parseFloat(unit_price),
                total_price: parseFloat(total_price)
            };
            
            const saleItem = await SaleItem.create(saleItemData);
            saleItems.push(saleItem);
            
            // Update product stock
            const product = await Product.findById(product_id);
            if (product) {
                const newStock = product.stock_quantity - quantity;
                await Product.updateStock(product_id, newStock);
            }
        }
        
        // Add items to sale object
        sale.items = saleItems;
        
        res.status(201).json(sale);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update sale
const updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_id, total_amount, discount, tax, final_amount, payment_method, notes, items } = req.body;
        
        // Check if sale exists
        const existingSale = await Sale.findById(id);
        if (!existingSale) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        
        // Update sale
        const saleData = {
            customer_id: customer_id || null,
            user_id: existingSale.user_id, // Keep original user
            total_amount: total_amount ? parseFloat(total_amount) : existingSale.total_amount,
            discount: discount !== undefined ? parseFloat(discount) : existingSale.discount,
            tax: tax !== undefined ? parseFloat(tax) : existingSale.tax,
            final_amount: final_amount ? parseFloat(final_amount) : existingSale.final_amount,
            payment_method: payment_method || existingSale.payment_method,
            notes: notes || existingSale.notes
        };
        
        const sale = await Sale.update(id, saleData);
        
        // Update sale items if provided
        if (items && items.length) {
            // Delete existing items
            await SaleItem.deleteBySaleId(id);
            
            // Create new items
            const saleItems = [];
            for (const item of items) {
                const { product_id, quantity, unit_price, total_price } = item;
                
                // Validate item data
                if (!product_id || !quantity || !unit_price || !total_price) {
                    return res.status(400).json({ error: 'Product ID, quantity, unit price, and total price are required for each item' });
                }
                
                // Create sale item
                const saleItemData = {
                    sale_id: id,
                    product_id: parseInt(product_id),
                    quantity: parseInt(quantity),
                    unit_price: parseFloat(unit_price),
                    total_price: parseFloat(total_price)
                };
                
                const saleItem = await SaleItem.create(saleItemData);
                saleItems.push(saleItem);
            }
            
            sale.items = saleItems;
        } else {
            // Get existing items
            const existingItems = await SaleItem.findBySaleId(id);
            sale.items = existingItems;
        }
        
        res.status(200).json(sale);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete sale
const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if sale exists
        const existingSale = await Sale.findById(id);
        if (!existingSale) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        
        // Delete sale items first
        await SaleItem.deleteBySaleId(id);
        
        // Delete sale
        const result = await Sale.delete(id);
        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get sales by customer
const getSalesByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const sales = await Sale.findByCustomer(customerId);
        res.status(200).json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get sales by user
const getSalesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const sales = await Sale.findByUser(userId);
        res.status(200).json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get sales by date range
const getSalesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        
        const sales = await Sale.findByDateRange(startDate, endDate);
        res.status(200).json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
    getSalesByCustomer,
    getSalesByUser,
    getSalesByDateRange
};
