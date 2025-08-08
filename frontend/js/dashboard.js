// Dashboard functionality for Stock Web Application

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
    
    // Load dashboard data
    loadDashboardData();
});

// Function to load dashboard data
function loadDashboardData() {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Fetch inventory report
    fetch('/api/reports/inventory', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch inventory data');
        }
        return response.json();
    })
    .then(data => {
        // Update inventory summary
        document.getElementById('totalProducts').textContent = data.summary.total_products;
        document.getElementById('lowStockItems').textContent = data.summary.low_stock_items;
    })
    .catch(error => {
        console.error('Error fetching inventory data:', error);
    });
    
    // Fetch sales report
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days
    const endDate = new Date();
    
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    fetch(`/api/reports/sales?start_date=${formattedStartDate}&end_date=${formattedEndDate}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch sales data');
        }
        return response.json();
    })
    .then(data => {
        // Update sales summary
        document.getElementById('totalSales').textContent = formatCurrency(data.summary.total_revenue);
        
        // Update recent sales table
        const recentSalesTable = document.getElementById('recentSalesTable');
        recentSalesTable.innerHTML = '';
        
        data.sales.slice(0, 5).forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.id}</td>
                <td>${sale.customer_name || 'N/A'}</td>
                <td>${formatDate(sale.created_at)}</td>
                <td>${formatCurrency(sale.final_amount)}</td>
                <td><span class="badge bg-success">Completed</span></td>
            `;
            recentSalesTable.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching sales data:', error);
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