const db = require('../config/database');

// Get sales report
const getSalesReport = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        // Validate input
        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        
        // Query to get sales data
        const sql = `
            SELECT 
                s.id,
                s.total_amount,
                s.discount,
                s.tax,
                s.final_amount,
                s.payment_method,
                s.created_at,
                u.username as cashier,
                c.first_name || ' ' || c.last_name as customer_name
            FROM Sales s
            LEFT JOIN Users u ON s.user_id = u.id
            LEFT JOIN Customers c ON s.customer_id = c.id
            WHERE s.created_at BETWEEN ? AND ?
            ORDER BY s.created_at DESC
        `;
        
        db.all(sql, [start_date, end_date], (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            
            // Calculate summary statistics
            const totalSales = rows.length;
            const totalRevenue = rows.reduce((sum, sale) => sum + sale.final_amount, 0);
            const totalDiscount = rows.reduce((sum, sale) => sum + sale.discount, 0);
            const totalTax = rows.reduce((sum, sale) => sum + sale.tax, 0);
            
            res.status(200).json({
                summary: {
                    total_sales: totalSales,
                    total_revenue: totalRevenue,
                    total_discount: totalDiscount,
                    total_tax: totalTax,
                    average_sale: totalSales > 0 ? totalRevenue / totalSales : 0
                },
                sales: rows
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get inventory report
const getInventoryReport = async (req, res) => {
    try {
        // Query to get inventory data
        const sql = `
            SELECT 
                p.id,
                p.name,
                p.description,
                p.price,
                p.cost,
                p.stock_quantity,
                p.min_stock_level,
                c.name as category_name
            FROM Products p
            LEFT JOIN Categories c ON p.category_id = c.id
            ORDER BY p.name
        `;
        
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            
            // Calculate summary statistics
            const totalProducts = rows.length;
            const totalStockValue = rows.reduce((sum, product) => sum + (product.cost * product.stock_quantity), 0);
            const lowStockItems = rows.filter(product => product.stock_quantity <= product.min_stock_level).length;
            
            res.status(200).json({
                summary: {
                    total_products: totalProducts,
                    total_stock_value: totalStockValue,
                    low_stock_items: lowStockItems
                },
                products: rows
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get customer report
const getCustomerReport = async (req, res) => {
    try {
        // Query to get customer data
        const sql = `
            SELECT 
                c.id,
                c.first_name,
                c.last_name,
                c.email,
                c.phone,
                c.city,
                c.state,
                COUNT(s.id) as total_purchases,
                SUM(s.final_amount) as total_spent
            FROM Customers c
            LEFT JOIN Sales s ON c.id = s.customer_id
            GROUP BY c.id
            ORDER BY c.last_name, c.first_name
        `;
        
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            
            // Calculate summary statistics
            const totalCustomers = rows.length;
            const totalSpent = rows.reduce((sum, customer) => sum + (customer.total_spent || 0), 0);
            const averageSpent = totalCustomers > 0 ? totalSpent / totalCustomers : 0;
            
            res.status(200).json({
                summary: {
                    total_customers: totalCustomers,
                    total_spent: totalSpent,
                    average_spent_per_customer: averageSpent
                },
                customers: rows
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get supplier report
const getSupplierReport = async (req, res) => {
    try {
        // Query to get supplier data
        const sql = `
            SELECT 
                s.id,
                s.name,
                s.contact_person,
                s.email,
                s.phone,
                s.city,
                s.state,
                COUNT(p.id) as total_products
            FROM Suppliers s
            LEFT JOIN Products p ON s.id = p.supplier_id
            GROUP BY s.id
            ORDER BY s.name
        `;
        
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            
            // Calculate summary statistics
            const totalSuppliers = rows.length;
            const totalProducts = rows.reduce((sum, supplier) => sum + (supplier.total_products || 0), 0);
            const averageProducts = totalSuppliers > 0 ? totalProducts / totalSuppliers : 0;
            
            res.status(200).json({
                summary: {
                    total_suppliers: totalSuppliers,
                    total_products: totalProducts,
                    average_products_per_supplier: averageProducts
                },
                suppliers: rows
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get profit report
const getProfitReport = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        // Validate input
        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        
        console.log('Profit report requested for period:', start_date, 'to', end_date);
        
        // Query to get profit data from sales with product details
        const sql = `
            SELECT 
                s.id as sale_id,
                s.created_at,
                s.final_amount as sale_total,
                s.total_amount,
                si.product_id,
                p.name as product_name,
                p.price as sale_price,
                COALESCE(p.cost, 0) as acquisition_cost,
                si.quantity,
                si.unit_price,
                si.total_price as item_total,
                (si.unit_price - COALESCE(p.cost, 0)) as unit_profit,
                ((si.unit_price - COALESCE(p.cost, 0)) * si.quantity) as total_profit,
                u.username as cashier,
                COALESCE(c.first_name || ' ' || c.last_name, 'Cliente não informado') as customer_name
            FROM Sales s
            INNER JOIN SaleItems si ON s.id = si.sale_id
            INNER JOIN Products p ON si.product_id = p.id
            LEFT JOIN Users u ON s.user_id = u.id
            LEFT JOIN Customers c ON s.customer_id = c.id
            WHERE DATE(s.created_at) BETWEEN DATE(?) AND DATE(?)
            ORDER BY s.created_at DESC, s.id, si.id
        `;
        
        db.all(sql, [start_date, end_date], (err, rows) => {
            if (err) {
                console.error('Database error in profit report:', err.message);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            
            console.log('Profit report query returned', rows.length, 'rows');
            
            // If no data found, return empty report
            if (rows.length === 0) {
                return res.status(200).json({
                    summary: {
                        total_revenue: 0,
                        total_cost: 0,
                        total_profit: 0,
                        profit_margin: 0,
                        total_sales: 0,
                        average_profit_per_sale: 0
                    },
                    sales: [],
                    items: []
                });
            }
            
            // Calculate summary statistics
            const totalRevenue = rows.reduce((sum, item) => sum + (parseFloat(item.item_total) || 0), 0);
            const totalCost = rows.reduce((sum, item) => sum + ((parseFloat(item.acquisition_cost) || 0) * (parseInt(item.quantity) || 0)), 0);
            const totalProfit = rows.reduce((sum, item) => sum + (parseFloat(item.total_profit) || 0), 0);
            const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
            
            console.log('Profit calculations:', {
                totalRevenue,
                totalCost,
                totalProfit,
                profitMargin
            });
            
            // Group by sale for better organization
            const salesMap = new Map();
            rows.forEach(row => {
                if (!salesMap.has(row.sale_id)) {
                    salesMap.set(row.sale_id, {
                        sale_id: row.sale_id,
                        created_at: row.created_at,
                        customer_name: row.customer_name || 'Cliente não informado',
                        cashier: row.cashier || 'Não informado',
                        sale_total: parseFloat(row.sale_total) || 0,
                        items: []
                    });
                }
                salesMap.get(row.sale_id).items.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    sale_price: parseFloat(row.sale_price) || 0,
                    acquisition_cost: parseFloat(row.acquisition_cost) || 0,
                    quantity: parseInt(row.quantity) || 0,
                    unit_price: parseFloat(row.unit_price) || 0,
                    item_total: parseFloat(row.item_total) || 0,
                    unit_profit: parseFloat(row.unit_profit) || 0,
                    total_profit: parseFloat(row.total_profit) || 0
                });
            });
            
            const salesWithProfit = Array.from(salesMap.values()).map(sale => {
                const saleProfit = sale.items.reduce((sum, item) => sum + (item.total_profit || 0), 0);
                const saleCost = sale.items.reduce((sum, item) => sum + ((item.acquisition_cost || 0) * (item.quantity || 0)), 0);
                const saleRevenue = sale.items.reduce((sum, item) => sum + (item.item_total || 0), 0);
                return {
                    ...sale,
                    total_cost: saleCost,
                    total_profit: saleProfit,
                    profit_margin: saleRevenue > 0 ? (saleProfit / saleRevenue) * 100 : 0
                };
            });
            
            const uniqueSales = salesWithProfit.length;
            
            res.status(200).json({
                summary: {
                    total_revenue: Math.round(totalRevenue * 100) / 100,
                    total_cost: Math.round(totalCost * 100) / 100,
                    total_profit: Math.round(totalProfit * 100) / 100,
                    profit_margin: Math.round(profitMargin * 100) / 100,
                    total_sales: uniqueSales,
                    average_profit_per_sale: uniqueSales > 0 ? Math.round((totalProfit / uniqueSales) * 100) / 100 : 0
                },
                sales: salesWithProfit,
                items: rows
            });
        });
    } catch (err) {
        console.error('Server error in profit report:', err.message);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
};

module.exports = {
    getSalesReport,
    getInventoryReport,
    getCustomerReport,
    getSupplierReport,
    getProfitReport
};