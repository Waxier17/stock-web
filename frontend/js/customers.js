// Customers functionality for Stock Web Application

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
    const refreshButton = document.getElementById('refreshCustomers');
    if (refreshButton) {
        refreshButton.addEventListener('click', loadCustomers);
    }

    // Set up search functionality
    const searchInput = document.getElementById('searchCustomers');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchCustomers();
        });
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchCustomers();
            }
        });
    }

    // Set up add customer button
    const addCustomerBtn = document.getElementById('addCustomerBtn');
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', showAddModal);
    }

    // Set up save customer button
    const saveCustomerBtn = document.getElementById('saveCustomerBtn');
    if (saveCustomerBtn) {
        saveCustomerBtn.addEventListener('click', saveCustomer);
    }

    // Set up modal close buttons
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    if (closeModal) closeModal.addEventListener('click', hideAddModal);
    if (cancelBtn) cancelBtn.addEventListener('click', hideAddModal);

    // Load initial data
    loadCustomers();
});

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
        populateCustomersTable(customers);
    })
    .catch(error => {
        console.error('Error fetching customers:', error);
        showAlert('Failed to load customers', 'danger');
    });
}

// Function to search customers
function searchCustomers() {
    const token = localStorage.getItem('token');
    const searchTerm = document.getElementById('searchCustomers').value;
    
    if (!searchTerm) {
        loadCustomers();
        return;
    }
    
    fetch(`/api/customers/search?name=${encodeURIComponent(searchTerm)}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to search customers');
        }
        return response.json();
    })
    .then(customers => {
        populateCustomersTable(customers);
    })
    .catch(error => {
        console.error('Error searching customers:', error);
        showAlert('Failed to search customers', 'danger');
    });
}

// Function to populate customers table
function populateCustomersTable(customers) {
    const tableBody = document.getElementById('customersTable');
    const customersCount = document.getElementById('customersCount');

    if (!tableBody) return;

    if (customers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center" style="padding: 3rem; color: var(--gray-500);">
                    <i data-lucide="users" style="width: 2rem; height: 2rem;"></i>
                    <br><br>Nenhum cliente encontrado
                </td>
            </tr>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        return;
    }

    tableBody.innerHTML = customers.map(customer => `
        <tr>
            <td>#${customer.id}</td>
            <td><strong>${customer.first_name} ${customer.last_name}</strong></td>
            <td>${customer.email || 'Não informado'}</td>
            <td>${customer.phone || 'Não informado'}</td>
            <td>${customer.city || 'Não informado'}</td>
            <td>${customer.state || 'Não informado'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit edit-customer" data-id="${customer.id}" title="Editar">
                        <i data-lucide="edit-2" style="width: 1rem; height: 1rem;"></i>
                    </button>
                    <button class="btn-icon btn-delete delete-customer" data-id="${customer.id}" title="Excluir">
                        <i data-lucide="trash-2" style="width: 1rem; height: 1rem;"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // Update customers count
    if (customersCount) {
        customersCount.textContent = `${customers.length} cliente${customers.length !== 1 ? 's' : ''}`;
    }

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-customer').forEach(button => {
        button.addEventListener('click', function() {
            const customerId = this.getAttribute('data-id');
            editCustomer(customerId);
        });
    });

    document.querySelectorAll('.delete-customer').forEach(button => {
        button.addEventListener('click', function() {
            const customerId = this.getAttribute('data-id');
            deleteCustomer(customerId);
        });
    });
}

// Function to save customer
function saveCustomer() {
    const token = localStorage.getItem('token');
    
    // Get form values
    const firstName = document.getElementById('customerFirstName').value;
    const lastName = document.getElementById('customerLastName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const city = document.getElementById('customerCity').value;
    const state = document.getElementById('customerState').value;
    const zipCode = document.getElementById('customerZipCode').value;
    
    // Validate required fields
    if (!firstName || !lastName) {
        showAlert('Please enter both first name and last name', 'danger');
        return;
    }
    
    // Create customer data object
    const customerData = {
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip_code: zipCode || null
    };
    
    // Send request to create customer
    fetch('/api/customers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(customerData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Failed to create customer');
            });
        }
        return response.json();
    })
    .then(customer => {
        // Close modal
        hideAddModal();

        // Reset form
        document.getElementById('addCustomerForm').reset();

        // Reload customers
        loadCustomers();

        // Show success message
        showAlert('Cliente criado com sucesso', 'success');
    })
    .catch(error => {
        console.error('Error creating customer:', error);
        showAlert(error.message, 'danger');
    });
}

// Function to edit customer
function editCustomer(customerId) {
    const token = localStorage.getItem('token');
    
    // Fetch customer details
    fetch(`/api/customers/${customerId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch customer details');
        }
        return response.json();
    })
    .then(customer => {
        // Populate form with customer data
        document.getElementById('customerFirstName').value = customer.first_name;
        document.getElementById('customerLastName').value = customer.last_name;
        document.getElementById('customerEmail').value = customer.email || '';
        document.getElementById('customerPhone').value = customer.phone || '';
        document.getElementById('customerAddress').value = customer.address || '';
        document.getElementById('customerCity').value = customer.city || '';
        document.getElementById('customerState').value = customer.state || '';
        document.getElementById('customerZipCode').value = customer.zip_code || '';
        
        // Change modal title and button text
        document.getElementById('modalTitle').textContent = 'Editar Cliente';
        document.getElementById('saveCustomerBtn').textContent = 'Atualizar Cliente';
        
        // Store customerId in a data attribute on the save button
        document.getElementById('saveCustomerBtn').setAttribute('data-customer-id', customerId);
        
        // Change save button event listener to updateCustomer function
        const saveCustomerBtn = document.getElementById('saveCustomerBtn');
        saveCustomerBtn.removeEventListener('click', saveCustomer);
        saveCustomerBtn.addEventListener('click', updateCustomer);
        
        // Show modal
        document.getElementById('modalBackdrop').style.display = 'flex';
    })
    .catch(error => {
        console.error('Error fetching customer details:', error);
        showAlert('Failed to load customer details', 'danger');
    });
}

// Function to update customer
function updateCustomer() {
    const token = localStorage.getItem('token');
    const customerId = document.getElementById('saveCustomerBtn').getAttribute('data-customer-id');
    
    // Get form values
    const firstName = document.getElementById('customerFirstName').value;
    const lastName = document.getElementById('customerLastName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const city = document.getElementById('customerCity').value;
    const state = document.getElementById('customerState').value;
    const zipCode = document.getElementById('customerZipCode').value;
    
    // Validate required fields
    if (!firstName || !lastName) {
        showAlert('Por favor, informe o primeiro e último nome', 'danger');
        return;
    }
    
    // Create customer data object
    const customerData = {
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip_code: zipCode || null
    };
    
    // Send request to update customer
    fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(customerData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Failed to update customer');
            });
        }
        return response.json();
    })
    .then(customer => {
        // Close modal
        document.getElementById('modalBackdrop').style.display = 'none';
        
        // Reset form
        document.getElementById('addCustomerForm').reset();
        
        // Reset modal title and button text
        document.getElementById('modalTitle').textContent = 'Adicionar Novo Cliente';
        document.getElementById('saveCustomerBtn').textContent = 'Salvar Cliente';
        
        // Reset save button event listener to saveCustomer function
        const saveCustomerBtn = document.getElementById('saveCustomerBtn');
        saveCustomerBtn.removeEventListener('click', updateCustomer);
        saveCustomerBtn.addEventListener('click', saveCustomer);
        
        // Remove customerId data attribute
        saveCustomerBtn.removeAttribute('data-customer-id');
        
        // Reload customers
        loadCustomers();
        
        // Show success message
        showAlert('Cliente atualizado com sucesso', 'success');
    })
    .catch(error => {
        console.error('Error updating customer:', error);
        showAlert(error.message, 'danger');
    });
}

// Function to delete customer
function deleteCustomer(customerId) {
    if (!confirm('Are you sure you want to delete this customer?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(async response => {
        if (!response.ok) {
            let errorMessage = 'Failed to delete customer';
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
        // Reload customers
        loadCustomers();
        
        // Show success message
        showAlert('Customer deleted successfully', 'success');
    })
    .catch(error => {
        console.error('Error deleting customer:', error);
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

// Function to show add modal
function showAddModal() {
    document.getElementById('modalBackdrop').style.display = 'flex';
    document.getElementById('addCustomerForm').reset();

    // Reset progress bar if it exists
    const progressBar = document.getElementById('customerFormProgress');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
}

// Function to hide add modal
function hideAddModal() {
    document.getElementById('modalBackdrop').style.display = 'none';
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
