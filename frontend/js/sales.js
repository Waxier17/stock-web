// Sales functionality for Stock Web Application

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
    const logoutLink = document.getElementById('logoutLink');
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // Set up refresh button
    const refreshButton = document.getElementById('refreshSales');
    refreshButton.addEventListener('click', loadSales);
    
    // Set up search functionality
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', searchSales);
    
    const searchInput = document.getElementById('searchSales');
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchSales();
        }
    });
    
    // Set up add item button
    const addItemBtn = document.getElementById('addItemBtn');
    addItemBtn.addEventListener('click', addItemToSale);
    
    // Set up save sale button
    const saveSaleBtn = document.getElementById('saveSaleBtn');
    saveSaleBtn.addEventListener('click', saveSale);
    
    // Load initial data
    loadSales();
    loadCustomers();
    loadProducts();
});

// Function to load sales
function loadSales() {
    const token = localStorage.getItem('token');
    
    fetch('/api/sales', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch sales');
        }
        return response.json();
    })
    .then(sales => {
        populateSalesTable(sales);
    })
    .catch(error => {
        console.error('Error fetching sales:', error);
        showAlert('Failed to load sales', 'danger');
    });
}

// Function to search sales
function searchSales() {
    // For now, we'll just reload all sales
    // In a real application, this would search the sales
    loadSales();
}

// Function to populate sales table
function populateSalesTable(sales) {
    const tableBody = document.getElementById('salesTable');
    tableBody.innerHTML = '';
    
    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${sale.customer_name || 'N/A'}</td>
            <td>${formatDate(sale.created_at)}</td>
            <td>${formatCurrency(sale.final_amount)}</td>
            <td>${sale.payment_method || 'N/A'}</td>
            <td><span class="badge bg-success">Completed</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit view-sale" data-id="${sale.id}" title="Ver detalhes">
                        <i data-lucide="eye" style="width: 1rem; height: 1rem;"></i>
                    </button>
                    <button class="btn-icon btn-delete delete-sale" data-id="${sale.id}" title="Excluir">
                        <i data-lucide="trash-2" style="width: 1rem; height: 1rem;"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Add event listeners to view and delete buttons
    document.querySelectorAll('.view-sale').forEach(button => {
        button.addEventListener('click', function() {
            const saleId = this.getAttribute('data-id');
            viewSale(saleId);
        });
    });
    
    document.querySelectorAll('.delete-sale').forEach(button => {
        button.addEventListener('click', function() {
            const saleId = this.getAttribute('data-id');
            deleteSale(saleId);
        });
    });
}

// Function to load customers
function loadCustomers() {
    const token = localStorage.getItem('token');
    
    fetch('/api/customers', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        return response.json();
    })
    .then(customers => {
        const customerSelect = document.getElementById('saleCustomer');
        customerSelect.innerHTML = '<option value="">Select a customer</option>';
        
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = `${customer.first_name} ${customer.last_name}`;
            customerSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching customers:', error);
    });
}

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
        // Store products in a global variable for use in addItemToSale
        window.products = products;
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });
}

// Function to add item to sale
function addItemToSale() {
    const itemsTable = document.getElementById('saleItemsTable');
    const row = document.createElement('tr');
    
    // Create product select dropdown
    let productOptions = '<option value="">Select a product</option>';
    if (window.products) {
        window.products.forEach(product => {
            productOptions += `<option value="${product.id}" data-price="${product.price}">${product.name}</option>`;
        });
    }
    
    row.innerHTML = `
        <td>
            <select class="form-select product-select">
                ${productOptions}
            </select>
        </td>
        <td>
            <input type="number" class="form-control price-input" step="0.01" readonly>
        </td>
        <td>
            <input type="number" class="form-control quantity-input" value="1" min="1">
        </td>
        <td>
            <input type="text" class="form-control total-input" readonly>
        </td>
        <td>
            <button class="btn btn-sm btn-outline-danger remove-item">
                <i data-lucide="x" style="width: 1rem; height: 1rem;"></i>
            </button>
        </td>
    `;

    itemsTable.appendChild(row);

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Add event listeners for the new row
    const productSelect = row.querySelector('.product-select');
    const priceInput = row.querySelector('.price-input');
    const quantityInput = row.querySelector('.quantity-input');
    const totalInput = row.querySelector('.total-input');
    const removeButton = row.querySelector('.remove-item');
    
    // Set price when product is selected
    productSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const price = selectedOption.getAttribute('data-price');
        priceInput.value = price || '';
        calculateItemTotal(row);
        calculateSaleTotal();
    });
    
    // Recalculate total when quantity changes
    quantityInput.addEventListener('input', function() {
        calculateItemTotal(row);
        calculateSaleTotal();
    });
    
    // Remove item
    removeButton.addEventListener('click', function() {
        row.remove();
        calculateSaleTotal();
    });
}

// Function to calculate item total
function calculateItemTotal(row) {
    const priceInput = row.querySelector('.price-input');
    const quantityInput = row.querySelector('.quantity-input');
    const totalInput = row.querySelector('.total-input');
    
    const price = parseFloat(priceInput.value) || 0;
    const quantity = parseInt(quantityInput.value) || 0;
    const total = price * quantity;
    
    totalInput.value = total.toFixed(2);
}

// Function to calculate sale total
function calculateSaleTotal() {
    const rows = document.querySelectorAll('#saleItemsTable tr');
    let subtotal = 0;
    
    rows.forEach(row => {
        const totalInput = row.querySelector('.total-input');
        const total = parseFloat(totalInput.value) || 0;
        subtotal += total;
    });
    
    const discountInput = document.getElementById('saleDiscount');
    const taxInput = document.getElementById('saleTax');
    const totalInput = document.getElementById('saleTotal');
    
    const discount = parseFloat(discountInput.value) || 0;
    const tax = parseFloat(taxInput.value) || 0;
    const finalTotal = subtotal - discount + tax;
    
    totalInput.value = finalTotal.toFixed(2);
}

// Function to save sale
function saveSale() {
    const token = localStorage.getItem('token');
    
    // Get form values
    const customerId = document.getElementById('saleCustomer').value;
    const paymentMethod = document.getElementById('salePaymentMethod').value;
    const notes = document.getElementById('saleNotes').value;
    const discount = parseFloat(document.getElementById('saleDiscount').value) || 0;
    const tax = parseFloat(document.getElementById('saleTax').value) || 0;
    
    // Validate required fields
    if (!paymentMethod) {
        showAlert('Please select a payment method', 'danger');
        return;
    }
    
    // Get sale items
    const rows = document.querySelectorAll('#saleItemsTable tr');
    const items = [];
    let totalAmount = 0;
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const productSelect = row.querySelector('.product-select');
        const quantityInput = row.querySelector('.quantity-input');
        const priceInput = row.querySelector('.price-input');
        const totalInput = row.querySelector('.total-input');
        
        const productId = productSelect.value;
        const quantity = parseInt(quantityInput.value) || 0;
        const unitPrice = parseFloat(priceInput.value) || 0;
        const totalPrice = parseFloat(totalInput.value) || 0;
        
        if (!productId || quantity <= 0) {
            showAlert('Please select a product and enter a valid quantity for all items', 'danger');
            return;
        }
        
        items.push({
            product_id: parseInt(productId),
            quantity: quantity,
            unit_price: unitPrice,
            total_price: totalPrice
        });
        
        totalAmount += totalPrice;
    }
    
    if (items.length === 0) {
        showAlert('Please add at least one item to the sale', 'danger');
        return;
    }
    
    // Create sale data object
    const saleData = {
        customer_id: customerId ? parseInt(customerId) : null,
        user_id: 1, // In a real app, this would be the logged in user's ID
        total_amount: totalAmount,
        discount: discount,
        tax: tax,
        final_amount: totalAmount - discount + tax,
        payment_method: paymentMethod,
        notes: notes,
        items: items
    };
    
    // Send request to create sale
    fetch('/api/sales', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saleData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Failed to create sale');
            });
        }
        return response.json();
    })
    .then(sale => {
        // Close modal
        document.getElementById('newSaleModalBackdrop').style.display = 'none';
        modal.hide();
        
        // Reset form
        document.getElementById('addSaleForm').reset();
        document.getElementById('saleItemsTable').innerHTML = '';
        document.getElementById('saleTotal').value = '';
        
        // Reload sales
        loadSales();
        
        // Show success message
        showAlert('Sale created successfully', 'success');
    })
    .catch(error => {
        console.error('Error creating sale:', error);
        showAlert(error.message, 'danger');
    });
}

// Function to view sale (placeholder)
function viewSale(saleId) {
    showAlert('View functionality not implemented yet', 'warning');
}

// Function to delete sale
function deleteSale(saleId) {
    if (!confirm('Are you sure you want to delete this sale?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    fetch(`/api/sales/${saleId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(async response => {
        if (!response.ok) {
            let errorMessage = 'Failed to delete sale';
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
        // Reload sales
        loadSales();
        
        // Show success message
        showAlert('Sale deleted successfully', 'success');
    })
    .catch(error => {
        console.error('Error deleting sale:', error);
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
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to body
    document.body.appendChild(alertDiv);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
