// Suppliers functionality for Stock Web Application

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
    const refreshButton = document.getElementById('refreshSuppliers');
    if (refreshButton) {
        refreshButton.addEventListener('click', loadSuppliers);
    }

    // Set up search functionality
    const searchInput = document.getElementById('searchSuppliers');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchSuppliers();
        });
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchSuppliers();
            }
        });
    }

    // Set up add supplier button
    const addSupplierBtn = document.getElementById('addSupplierBtn');
    if (addSupplierBtn) {
        addSupplierBtn.addEventListener('click', showAddModal);
    }

    // Set up save supplier button
    const saveSupplierBtn = document.getElementById('saveSupplierBtn');
    if (saveSupplierBtn) {
        saveSupplierBtn.addEventListener('click', saveSupplier);
    }

    // Set up modal close buttons
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    if (closeModal) closeModal.addEventListener('click', hideAddModal);
    if (cancelBtn) cancelBtn.addEventListener('click', hideAddModal);

    // Load initial data
    loadSuppliers();
});

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
        populateSuppliersTable(suppliers);
    })
    .catch(error => {
        console.error('Error fetching suppliers:', error);
        showAlert('Failed to load suppliers', 'danger');
    });
}

// Function to search suppliers
function searchSuppliers() {
    const token = localStorage.getItem('token');
    const searchTerm = document.getElementById('searchSuppliers').value;
    
    if (!searchTerm) {
        loadSuppliers();
        return;
    }
    
    fetch(`/api/suppliers/search?name=${encodeURIComponent(searchTerm)}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to search suppliers');
        }
        return response.json();
    })
    .then(suppliers => {
        populateSuppliersTable(suppliers);
    })
    .catch(error => {
        console.error('Error searching suppliers:', error);
        showAlert('Failed to search suppliers', 'danger');
    });
}

// Function to populate suppliers table
function populateSuppliersTable(suppliers) {
    const tableBody = document.getElementById('suppliersTable');
    const suppliersCount = document.getElementById('suppliersCount');

    if (!tableBody) return;

    if (suppliers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="padding: 3rem; color: var(--gray-500);">
                    <i data-lucide="truck" style="width: 2rem; height: 2rem;"></i>
                    <br><br>Nenhum fornecedor encontrado
                </td>
            </tr>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        return;
    }

    tableBody.innerHTML = suppliers.map(supplier => {
        const isActive = supplier.active !== false;

        return `
            <tr>
                <td>#${supplier.id}</td>
                <td><strong>${supplier.name}</strong></td>
                <td>${supplier.email || 'Não informado'}</td>
                <td>${supplier.phone || 'Não informado'}</td>
                <td>${supplier.city || 'Não informado'}</td>
                <td>${supplier.state || 'Não informado'}</td>
                <td>
                    <span class="supplier-status ${isActive ? 'active' : 'inactive'}">
                        ${isActive ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit edit-supplier" data-id="${supplier.id}" title="Editar">
                            <i data-lucide="edit-2" style="width: 1rem; height: 1rem;"></i>
                        </button>
                        <button class="btn-icon btn-delete delete-supplier" data-id="${supplier.id}" title="Excluir">
                            <i data-lucide="trash-2" style="width: 1rem; height: 1rem;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Update suppliers count
    if (suppliersCount) {
        suppliersCount.textContent = `${suppliers.length} fornecedor${suppliers.length !== 1 ? 'es' : ''}`;
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-supplier').forEach(button => {
        button.addEventListener('click', function() {
            const supplierId = this.getAttribute('data-id');
            editSupplier(supplierId);
        });
    });
    
    document.querySelectorAll('.delete-supplier').forEach(button => {
        button.addEventListener('click', function() {
            const supplierId = this.getAttribute('data-id');
            deleteSupplier(supplierId);
        });
    });
}

// Function to save supplier
function saveSupplier() {
    const token = localStorage.getItem('token');

    // Get form values
    const name = document.getElementById('supplierName').value;
    const contactPerson = document.getElementById('supplierContact').value;
    const email = document.getElementById('supplierEmail').value;
    const phone = document.getElementById('supplierPhone').value;
    const address = document.getElementById('supplierAddress').value;
    const city = document.getElementById('supplierCity').value;
    const state = document.getElementById('supplierState').value;
    const zipCode = document.getElementById('supplierZipCode').value;
    
    // Validate required fields
    if (!name) {
        showAlert('Please enter the supplier name', 'danger');
        return;
    }
    
    // Create supplier data object
    const supplierData = {
        name: name,
        contact_person: contactPerson || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip_code: zipCode || null
    };
    
    // Send request to create supplier
    fetch('/api/suppliers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(supplierData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Failed to create supplier');
            });
        }
        return response.json();
    })
    .then(supplier => {
        // Close modal
        hideAddModal();

        // Reset form
        document.getElementById('addSupplierForm').reset();

        // Reload suppliers
        loadSuppliers();

        // Show success message
        showAlert('Fornecedor criado com sucesso', 'success');
    })
    .catch(error => {
        console.error('Error creating supplier:', error);
        showAlert(error.message, 'danger');
    });
}

// Function to edit supplier
function editSupplier(supplierId) {
    const token = localStorage.getItem('token');
    
    // Fetch supplier details
    fetch(`/api/suppliers/${supplierId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch supplier details');
        }
        return response.json();
    })
    .then(supplier => {
        // Populate form with supplier data
        document.getElementById('supplierName').value = supplier.name;
        document.getElementById('supplierContact').value = supplier.contact_person || '';
        document.getElementById('supplierEmail').value = supplier.email || '';
        document.getElementById('supplierPhone').value = supplier.phone || '';
        document.getElementById('supplierAddress').value = supplier.address || '';
        document.getElementById('supplierCity').value = supplier.city || '';
        document.getElementById('supplierState').value = supplier.state || '';
        document.getElementById('supplierZipCode').value = supplier.zip_code || '';
        
        // Change modal title and button text
        document.getElementById('modalTitle').textContent = 'Editar Fornecedor';
        document.getElementById('saveSupplierBtn').textContent = 'Atualizar Fornecedor';
        
        // Store supplierId in a data attribute on the save button
        document.getElementById('saveSupplierBtn').setAttribute('data-supplier-id', supplierId);
        
        // Change save button event listener to updateSupplier function
        const saveSupplierBtn = document.getElementById('saveSupplierBtn');
        saveSupplierBtn.removeEventListener('click', saveSupplier);
        saveSupplierBtn.addEventListener('click', updateSupplier);
        
        // Show modal
        document.getElementById('modalBackdrop').style.display = 'flex';
    })
    .catch(error => {
        console.error('Error fetching supplier details:', error);
        showAlert('Failed to load supplier details', 'danger');
    });
}

// Function to update supplier
function updateSupplier() {
    const token = localStorage.getItem('token');
    const supplierId = document.getElementById('saveSupplierBtn').getAttribute('data-supplier-id');

    // Get form values
    const name = document.getElementById('supplierName').value;
    const contactPerson = document.getElementById('supplierContact').value;
    const email = document.getElementById('supplierEmail').value;
    const phone = document.getElementById('supplierPhone').value;
    const address = document.getElementById('supplierAddress').value;
    const city = document.getElementById('supplierCity').value;
    const state = document.getElementById('supplierState').value;
    const zipCode = document.getElementById('supplierZipCode').value;
    
    // Validate required fields
    if (!name) {
        showAlert('Por favor, informe o nome do fornecedor', 'danger');
        return;
    }
    
    // Create supplier data object
    const supplierData = {
        name: name,
        contact_person: contactPerson || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip_code: zipCode || null
    };
    
    // Send request to update supplier
    fetch(`/api/suppliers/${supplierId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(supplierData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Failed to update supplier');
            });
        }
        return response.json();
    })
    .then(supplier => {
        // Close modal
        document.getElementById('modalBackdrop').style.display = 'none';
        modal.hide();
        
        // Reset form
        document.getElementById('addSupplierForm').reset();
        
        // Reset modal title and button text
        document.getElementById('modalTitle').textContent = 'Adicionar Novo Fornecedor';
        document.getElementById('saveSupplierBtn').textContent = 'Salvar Fornecedor';
        
        // Reset save button event listener to saveSupplier function
        const saveSupplierBtn = document.getElementById('saveSupplierBtn');
        saveSupplierBtn.removeEventListener('click', updateSupplier);
        saveSupplierBtn.addEventListener('click', saveSupplier);
        
        // Remove supplierId data attribute
        saveSupplierBtn.removeAttribute('data-supplier-id');
        
        // Reload suppliers
        loadSuppliers();
        
        // Show success message
        showAlert('Fornecedor atualizado com sucesso', 'success');
    })
    .catch(error => {
        console.error('Error updating supplier:', error);
        showAlert(error.message, 'danger');
    });
}

// Function to delete supplier
function deleteSupplier(supplierId) {
    if (!confirm('Are you sure you want to delete this supplier?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    fetch(`/api/suppliers/${supplierId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(async response => {
        if (!response.ok) {
            // Try to get error message from response
            let errorMessage = 'Falha ao excluir fornecedor';
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

        // For successful DELETE requests, check if there's JSON content
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
        } catch (parseError) {
            // If parsing fails, that's okay for DELETE requests
            console.log('No JSON content in DELETE response (this is normal)');
        }

        return { success: true };
    })
    .then(data => {
        // Reload suppliers
        loadSuppliers();

        // Show success message
        showAlert('Fornecedor excluído com sucesso', 'success');
    })
    .catch(error => {
        console.error('Error deleting supplier:', error);
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
    document.getElementById('addSupplierForm').reset();

    // Reset progress bar if it exists
    const progressBar = document.getElementById('supplierFormProgress');
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
