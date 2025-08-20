const Category = require('../models/Category');
const Product = require('../models/Product');

// Category Controller Functions

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (err) {
        console.error(err.message);
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
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Validate input
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }
        
        // Check if category already exists
        const existingCategory = await Category.findByName(name);
        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }
        
        // Create category
        const category = await Category.create({ name, description });
        res.status(201).json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        // Validate input
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }
        
        // Check if category exists
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        // Check if another category with the same name exists
        const duplicateCategory = await Category.findByName(name);
        if (duplicateCategory && duplicateCategory.id != id) {
            return res.status(400).json({ error: 'Category name already exists' });
        }
        
        // Update category
        const category = await Category.update(id, { name, description });
        res.status(200).json(category);
    } catch (err) {
        console.error(err.message);
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
        
        // Delete category
        const result = await Category.delete(id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Product Controller Functions

// Get all products (com suporte a filtro por category via query param)
const getAllProducts = async (req, res) => {
    try {
        const categoryId = req.query.category;  // Pega o filtro da query string (ex.: ?category=5)
        
        let products;
        if (categoryId) {
            // Valida se categoryId é um número válido
            if (isNaN(parseInt(categoryId))) {
                return res.status(400).json({ error: 'Invalid category ID' });
            }
            console.log(`Fetching products for category ID: ${categoryId}`);  // Log para depuração
            products = await Product.findByCategory(parseInt(categoryId));
        } else {
            console.log('Fetching all products');  // Log para depuração
            products = await Product.findAll();
        }
        
        if (!products || products.length === 0) {
            console.log('No products found');  // Log para depuração
            return res.status(200).json([]);  // Retorna array vazio em vez de erro, para o frontend lidar
        }
        
        console.log('Returning products:', products.length);  // Log para depuração
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(200).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create product
const createProduct = async (req, res) => {
    try {
        const { name, description, category_id, price, cost, stock_quantity, min_stock_level, barcode, supplier_id } = req.body;
        
        // Validate input
        if (!name || !price) {
            return res.status(400).json({ error: 'Product name and price are required' });
        }
        
        // Set default values
        const productData = {
            name,
            description: description || '',
            category_id: category_id || null,
            price: parseFloat(price) || 0,
            cost: cost ? parseFloat(cost) : null,
            stock_quantity: parseInt(stock_quantity) || 0,
            min_stock_level: parseInt(min_stock_level) || 0,
            barcode: barcode || null,
            supplier_id: supplier_id || null
        };
        
        // Check if product with same barcode exists
        if (productData.barcode) {
            const existingProduct = await Product.findByBarcode(productData.barcode);
            if (existingProduct) {
                return res.status(400).json({ error: 'Product with this barcode already exists' });
            }
        }
        
        // Create product
        const product = await Product.create(productData);
        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category_id, price, cost, stock_quantity, min_stock_level, barcode, supplier_id } = req.body;
        
        // Validate input
        if (!name || !price) {
            return res.status(400).json({ error: 'Product name and price are required' });
        }
        
        // Check if product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Set values
        const productData = {
            name,
            description: description || '',
            category_id: category_id || null,
            price: parseFloat(price) || 0,
            cost: cost ? parseFloat(cost) : null,
            stock_quantity: parseInt(stock_quantity) || 0,
            min_stock_level: parseInt(min_stock_level) || 0,
            barcode: barcode || null,
            supplier_id: supplier_id || null
        };
        
        // Check if another product with the same barcode exists
        if (productData.barcode && productData.barcode !== existingProduct.barcode) {
            const duplicateProduct = await Product.findByBarcode(productData.barcode);
            if (duplicateProduct) {
                return res.status(400).json({ error: 'Product with this barcode already exists' });
            }
        }
        
        // Update product
        const product = await Product.update(id, productData);
        res.status(200).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if product has related sales items
        const hasSales = await Product.hasSalesItems(id);
        if (hasSales) {
            return res.status(400).json({
                error: 'Cannot delete product. This product has associated sales records. Please remove or update the sales records first.'
            });
        }

        // Delete product
        const result = await Product.delete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err.message);

        // Handle specific SQLite constraint errors
        if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
            return res.status(400).json({
                error: 'Cannot delete product. This product has associated records in other tables. Please remove or update those records first.'
            });
        }

        res.status(500).json({ error: 'Server error' });
    }
};

// Search products by name
const searchProducts = async (req, res) => {
    try {
        console.log('Search route called');
        console.log('Query parameters:', req.query);
        const { name } = req.query;
        console.log('Search term:', name);
        
        if (!name) {
            return res.status(400).json({ error: 'Product name is required for search' });
        }
        
        console.log(`Searching for products with name: ${name}`);
        const products = await Product.searchByName(name);
        console.log(`Found products:`, products);
        
        if (!products || products.length === 0) {
            console.log(`No products found for search term: ${name}`);
            return res.status(404).json({ error: 'No products found matching the search criteria' });
        }
        
        res.status(200).json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get low stock products
const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.getLowStock();
        res.status(200).json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update product stock
const updateProductStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        
        // Validate input
        if (quantity === undefined) {
            return res.status(400).json({ error: 'Quantity is required' });
        }
        
        // Check if product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Update stock
        const product = await Product.updateStock(id, parseInt(quantity));
        res.status(200).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    // Category functions
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Product functions
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getLowStockProducts,
    updateProductStock
};
