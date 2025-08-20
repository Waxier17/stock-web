// Inventory functionality for Stock Web Application

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login page if not logged in
        window.location.href = '/login.html';
        return;
    }
    
    // Set up logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    // Set up refresh button
    const refreshButton = document.getElementById('refreshProducts');
    if (refreshButton) {
        refreshButton.addEventListener('click', loadProducts);
    }

    // Set up search functionality
    const searchInput = document.getElementById('searchProducts');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchProducts();
        });
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }

    // Set up save product button
    const saveProductBtn = document.getElementById('saveProductBtn');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', saveProduct);
    }
    
    // Load initial data
    loadProducts();
    loadCategories();
    loadSuppliers();
});

// Function to load products
function loadProducts() {
    const token = localStorage.getItem('token');
    
    fetch('/api/inventory/products', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return response.json();
    })
    .then(products => {
        populateProductsTable(products);
    })
    .catch(error => {
        console.error('Error fetching products:', error);
        showAlert('Failed to load products', 'danger');
    });
}

// Function to search products
function searchProducts() {
    const token = localStorage.getItem('token');
    const searchTerm = document.getElementById('searchProducts').value;
    
    if (!searchTerm) {
        loadProducts();
        return;
    }
    
    fetch(`/api/inventory/products/search?name=${encodeURIComponent(searchTerm)}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to search products');
        }
        return response.json();
    })
    .then(products => {
        populateProductsTable(products);
    })
    .catch(error => {
        console.error('Error searching products:', error);
        showAlert('Failed to search products', 'danger');
    });
}

// Function to populate products table
function populateProductsTable(products) {
    const tableBody = document.getElementById('productsTable');
    if (!tableBody) return;

    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="padding: 3rem; color: var(--gray-500);">
                    <i data-lucide="package" style="width: 2rem; height: 2rem;"></i>
                    <br><br>Nenhum produto encontrado
                </td>
            </tr>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        return;
    }

    tableBody.innerHTML = products.map(product => {
        const isLowStock = (product.stock_quantity || product.stock) <= (product.min_stock_level || product.minStock || 10);
        const statusClass = isLowStock ? 'low' : 'normal';
        const statusText = isLowStock ? 'Estoque Baixo' : 'Normal';

        return `
            <tr>
                <td>#${product.id}</td>
                <td><strong>${product.name}</strong></td>
                <td>${product.category_name || product.categoryName || 'Sem categoria'}</td>
                <td>${formatCurrency(product.price || 0)}</td>
                <td>${product.stock_quantity || product.stock || 0} un.</td>
                <td>
                    <span class="stock-status ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td>${product.supplier_name || product.supplierName || 'Não informado'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit edit-product" data-id="${product.id}" title="Editar">
                            <i data-lucide="edit-2" style="width: 1rem; height: 1rem;"></i>
                        </button>
                        <button class="btn-icon btn-delete delete-product" data-id="${product.id}" title="Excluir">
                            <i data-lucide="trash-2" style="width: 1rem; height: 1rem;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            editProduct(productId);
        });
    });

    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
}

// Function to load categories
function loadCategories() {
    const token = localStorage.getItem('token');
    
    fetch('/api/inventory/categories', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return response.json();
    })
    .then(categories => {
        const categorySelect = document.getElementById('productCategory');
        categorySelect.innerHTML = '<option value="">Select a category</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
    });
}

// Function to load suppliers
function loadSuppliers() {
    const token = localStorage.getItem('token');
    
    fetch('/api/suppliers', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch suppliers');
        }
        return response.json();
    })
    .then(suppliers => {
        const supplierSelect = document.getElementById('productSupplier');
        supplierSelect.innerHTML = '<option value="">Select a supplier</option>';
        
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching suppliers:', error);
    });
}

// Function to save product
function saveProduct() {
    const token = localStorage.getItem('token');
    
    // Get form values
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const categoryId = document.getElementById('productCategory').value;
    const price = document.getElementById('productPrice').value;
    const cost = document.getElementById('productCost').value;
    const stockQuantity = document.getElementById('productStock').value;
    const minStockLevel = document.getElementById('productMinStock').value;
    const supplierId = document.getElementById('productSupplier').value;
    
    // Validate required fields
    if (!name || !categoryId || !price || !stockQuantity) {
        showAlert('Please fill in all required fields', 'danger');
        return;
    }
    
    // Create product data object
    const productData = {
        name: name,
        description: description,
        category_id: categoryId,
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : null,
        stock_quantity: parseInt(stockQuantity),
        min_stock_level: minStockLevel ? parseInt(minStockLevel) : null,
        supplier_id: supplierId ? parseInt(supplierId) : null
    };
    
    // Send request to create product
    fetch('/api/inventory/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Failed to create product');
            });
        }
        return response.json();
    })
    .then(product => {
        // Close modal
        const modalBackdrop = document.getElementById('modalBackdrop');
        if (modalBackdrop) {
            modalBackdrop.style.display = 'none';
        }

        // Reset form
        const form = document.getElementById('addProductForm');
        if (form) {
            form.reset();
        }

        // Reload products
        loadProducts();

        // Show success message
        showAlert('Produto criado com sucesso', 'success');
    })
    .catch(error => {
        console.error('Error creating product:', error);
        showAlert(error.message, 'danger');
    });
}

// Function to edit product
function editProduct(productId) {
    const token = localStorage.getItem('token');
    
    // Fetch product details
    fetch(`/api/inventory/products/${productId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }
        return response.json();
    })
    .then(product => {
        // Populate form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productCategory').value = product.category_id || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCost').value = product.cost || '';
        document.getElementById('productStock').value = product.stock_quantity;
        document.getElementById('productMinStock').value = product.min_stock_level || '';
        document.getElementById('productSupplier').value = product.supplier_id || '';
        
        // Change modal title and button text
        const modalTitle = document.querySelector('#addProductModal .modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Editar Produto';
        }

        const saveBtn = document.getElementById('saveProductBtn');
        if (saveBtn) {
            const btnText = saveBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = 'Atualizar Produto';
            } else {
                saveBtn.textContent = 'Atualizar Produto';
            }

            // Store productId in a data attribute on the save button
            saveBtn.setAttribute('data-product-id', productId);

            // Change save button event listener to updateProduct function
            saveBtn.removeEventListener('click', saveProduct);
            saveBtn.addEventListener('click', updateProduct);
        }

        // Show modal
        const modalBackdrop = document.getElementById('modalBackdrop');
        if (modalBackdrop) {
            modalBackdrop.style.display = 'flex';
        }
    })
    .catch(error => {
        console.error('Error fetching product details:', error);
        showAlert('Failed to load product details', 'danger');
    });
}

// Function to update product
function updateProduct() {
    const token = localStorage.getItem('token');
    const productId = document.getElementById('saveProductBtn').getAttribute('data-product-id');
    
    // Get form values
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const categoryId = document.getElementById('productCategory').value;
    const price = document.getElementById('productPrice').value;
    const cost = document.getElementById('productCost').value;
    const stockQuantity = document.getElementById('productStock').value;
    const minStockLevel = document.getElementById('productMinStock').value;
    const supplierId = document.getElementById('productSupplier').value;
    
    // Validate required fields
    if (!name || !categoryId || !price || !stockQuantity) {
        showAlert('Por favor, preencha todos os campos obrigatórios', 'danger');
        return;
    }
    
    // Create product data object
    const productData = {
        name: name,
        description: description,
        category_id: categoryId,
        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : null,
        stock_quantity: parseInt(stockQuantity),
        min_stock_level: minStockLevel ? parseInt(minStockLevel) : null,
        supplier_id: supplierId ? parseInt(supplierId) : null
    };
    
    // Send request to update product
    fetch(`/api/inventory/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Failed to update product');
            });
        }
        return response.json();
    })
    .then(product => {
        // Close modal
        const modalBackdrop = document.getElementById('modalBackdrop');
        if (modalBackdrop) {
            modalBackdrop.style.display = 'none';
        }

        // Reset form
        const form = document.getElementById('addProductForm');
        if (form) {
            form.reset();
        }

        // Reset modal title and button text
        const modalTitle = document.querySelector('#addProductModal .modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Adicionar Novo Produto';
        }

        const saveBtn = document.getElementById('saveProductBtn');
        if (saveBtn) {
            const btnText = saveBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = 'Salvar Produto';
            } else {
                saveBtn.textContent = 'Salvar Produto';
            }

            // Reset save button event listener to saveProduct function
            saveBtn.removeEventListener('click', updateProduct);
            saveBtn.addEventListener('click', saveProduct);

            // Remove productId data attribute
            saveBtn.removeAttribute('data-product-id');
        }

        // Reload products
        loadProducts();

        // Show success message
        showAlert('Produto atualizado com sucesso', 'success');
    })
    .catch(error => {
        console.error('Error updating product:', error);
        showAlert(error.message, 'danger');
    });
}

// Function to delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    fetch(`/api/inventory/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(async response => {
        if (!response.ok) {
            let errorMessage = 'Failed to delete product';
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                }
            } catch (parseError) {
                console.warn('Could not parse error response:', parseError);
            }
            throw new Error(errorMessage);
        }

        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
        } catch (parseError) {
            console.log('No JSON content in DELETE response (this is normal)');
        }

        return { success: true };
    })
    .then(data => {
        // Reload products
        loadProducts();
        
        // Show success message
        showAlert('Product deleted successfully', 'success');
    })
    .catch(error => {
        console.error('Error deleting product:', error);
        showAlert(error.message, 'danger');
    });
}

// Function to logout
function logout() {
    // Remove token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/login.html';
}

// Function to show alert messages
function showAlert(message, type = 'info') {
    // Use the modern toast system if available
    if (window.App && window.App.showToast) {
        const toastType = type === 'danger' ? 'error' : type;
        window.App.showToast(message, toastType);
        return;
    }

    // Fallback to simple alert
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}
