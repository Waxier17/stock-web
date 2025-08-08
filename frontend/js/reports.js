// Reports functionality for Stock Web Application

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
    
    // Set up generate sales report button
    const generateSalesReportBtn = document.getElementById('generateSalesReport');
    generateSalesReportBtn.addEventListener('click', generateSalesReport);
    
    // Load initial data for inventory, customer, and supplier reports
    loadInventoryReport();
    loadCustomerReport();
    loadSupplierReport();
    
    // Set today's date as default for sales report end date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('salesEndDate').value = today;
    
    // Set 30 days ago as default for sales report start date
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    document.getElementById('salesStartDate').value = thirtyDaysAgo.toISOString().split('T')[0];
});

// Function to generate sales report
function generateSalesReport() {
    const token = localStorage.getItem('token');
    
    // Get date values
    const startDate = document.getElementById('salesStartDate').value;
    const endDate = document.getElementById('salesEndDate').value;
    
    // Validate dates
    if (!startDate || !endDate) {
        showAlert('Please select both start and end dates', 'danger');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        showAlert('Start date cannot be after end date', 'danger');
        return;
    }
    
    // Fetch sales report
    fetch(`/api/reports/sales?start_date=${startDate}&end_date=${endDate}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch sales report');
        }
        return response.json();
    })
    .then(data => {
        populateSalesReportTable(data);
        showAlert('Sales report generated successfully', 'success');
    })
    .catch(error => {
        console.error('Error fetching sales report:', error);
        showAlert('Failed to generate sales report', 'danger');
    });
}

// Function to populate sales report table
function populateSalesReportTable(data) {
    const tableBody = document.getElementById('salesReportTable');
    tableBody.innerHTML = '';
    
    // Add summary row
    const summaryRow = document.createElement('tr');
    summaryRow.className = 'table-info';
    summaryRow.innerHTML = `
        <td colspan="3"><strong>Total Sales: ${data.summary.total_sales}</strong></td>
        <td><strong>${formatCurrency(data.summary.total_revenue)}</strong></td>
        <td><strong>Avg: ${formatCurrency(data.summary.average_sale)}</strong></td>
    `;
    tableBody.appendChild(summaryRow);
    
    // Add individual sales rows
    data.sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${sale.customer_name || 'N/A'}</td>
            <td>${formatDate(sale.created_at)}</td>
            <td>${formatCurrency(sale.final_amount)}</td>
            <td>${sale.payment_method || 'N/A'}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to load inventory report
function loadInventoryReport() {
    const token = localStorage.getItem('token');
    
    fetch('/api/reports/inventory', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch inventory report');
        }
        return response.json();
    })
    .then(data => {
        populateInventoryReportTable(data);
    })
    .catch(error => {
        console.error('Error fetching inventory report:', error);
    });
}

// Function to populate inventory report table
function populateInventoryReportTable(data) {
    const tableBody = document.getElementById('inventoryReportTable');
    tableBody.innerHTML = '';
    
    // Add summary row
    const summaryRow = document.createElement('tr');
    summaryRow.className = 'table-info';
    summaryRow.innerHTML = `
        <td colspan="5"><strong>Total Products: ${data.summary.total_products}</strong></td>
        <td><strong>Total Stock Value: ${formatCurrency(data.summary.total_stock_value)}</strong></td>
        <td><strong>Low Stock Items: ${data.summary.low_stock_items}</strong></td>
    `;
    tableBody.appendChild(summaryRow);
    
    // Add individual product rows
    data.products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category_name || 'N/A'}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${formatCurrency(product.cost)}</td>
            <td>${product.stock_quantity}</td>
            <td>${product.min_stock_level}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to load customer report
function loadCustomerReport() {
    const token = localStorage.getItem('token');
    
    fetch('/api/reports/customers', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch customer report');
        }
        return response.json();
    })
    .then(data => {
        populateCustomerReportTable(data);
    })
    .catch(error => {
        console.error('Error fetching customer report:', error);
    });
}

// Function to populate customer report table
function populateCustomerReportTable(data) {
    const tableBody = document.getElementById('customerReportTable');
    tableBody.innerHTML = '';
    
    // Add summary row
    const summaryRow = document.createElement('tr');
    summaryRow.className = 'table-info';
    summaryRow.innerHTML = `
        <td colspan="5"><strong>Total Customers: ${data.summary.total_customers}</strong></td>
        <td><strong>Total Spent: ${formatCurrency(data.summary.total_spent)}</strong></td>
        <td><strong>Avg Spent: ${formatCurrency(data.summary.average_spent_per_customer)}</strong></td>
    `;
    tableBody.appendChild(summaryRow);
    
    // Add individual customer rows
    data.customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.first_name} ${customer.last_name}</td>
            <td>${customer.email || 'N/A'}</td>
            <td>${customer.phone || 'N/A'}</td>
            <td>${customer.city || 'N/A'}</td>
            <td>${customer.total_purchases || 0}</td>
            <td>${formatCurrency(customer.total_spent || 0)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to load supplier report
function loadSupplierReport() {
    const token = localStorage.getItem('token');
    
    fetch('/api/reports/suppliers', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch supplier report');
        }
        return response.json();
    })
    .then(data => {
        populateSupplierReportTable(data);
    })
    .catch(error => {
        console.error('Error fetching supplier report:', error);
    });
}

// Function to populate supplier report table
function populateSupplierReportTable(data) {
    const tableBody = document.getElementById('supplierReportTable');
    tableBody.innerHTML = '';
    
    // Add summary row
    const summaryRow = document.createElement('tr');
    summaryRow.className = 'table-info';
    summaryRow.innerHTML = `
        <td colspan="6"><strong>Total Suppliers: ${data.summary.total_suppliers}</strong></td>
        <td><strong>Total Products: ${data.summary.total_products}</strong></td>
    `;
    tableBody.appendChild(summaryRow);
    
    // Add individual supplier rows
    data.suppliers.forEach(supplier => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${supplier.id}</td>
            <td>${supplier.name}</td>
            <td>${supplier.contact_person || 'N/A'}</td>
            <td>${supplier.email || 'N/A'}</td>
            <td>${supplier.phone || 'N/A'}</td>
            <td>${supplier.city || 'N/A'}</td>
            <td>${supplier.total_products || 0}</td>
        `;
        tableBody.appendChild(row);
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