// Categories management functionality
let categories = [];
let isEditMode = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    checkAuth();
    loadCategories();
    setupEventListeners();
});

// Authentication check
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Update user display safely
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
        userDisplay.textContent = user.username || 'Usuário';
    }

    // Update user avatar safely
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar && user.username) {
        userAvatar.textContent = user.username.charAt(0).toUpperCase();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterCategories);
    }

    // Form submission
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', handleCategorySubmit);
    }

    // Clear errors on input
    const categoryName = document.getElementById('categoryName');
    if (categoryName) {
        categoryName.addEventListener('input', function() {
            clearFieldError(this.id);
        });
    }

    // Add direct button click listener as backup
    const saveBtn = document.getElementById('saveCategoryBtn');
    if (saveBtn) {
        console.log('Save button found, adding click listener');
        saveBtn.addEventListener('click', function(e) {
            console.log('Save button clicked directly');
            // If button is not in form or form is not working, handle manually
            if (e.target.type === 'submit') {
                console.log('Button is submit type, should trigger form submit');
            } else {
                console.log('Button is not submit type, triggering manual submit');
                handleCategorySubmit(e);
            }
        });
    } else {
        console.log('Save button NOT found during setup');
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshCategories');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadCategories);
    }

    // Modal close on background click
    const categoryModal = document.getElementById('categoryModal');
    if (categoryModal) {
        categoryModal.addEventListener('click', function(e) {
            if (e.target === this) closeCategoryModal();
        });
    }
}

// Load categories from API
async function loadCategories() {
    const token = localStorage.getItem('token');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const emptyState = document.getElementById('emptyState');
    const categoriesGrid = document.getElementById('categoriesGrid');

    try {
        if (loadingSpinner) loadingSpinner.style.display = 'flex';
        if (emptyState) emptyState.style.display = 'none';

        // Hide table while loading
        const tableContainer = document.querySelector('.modern-table');
        if (tableContainer) tableContainer.style.display = 'none';
        
        const response = await fetch('/api/categories/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            categories = await response.json();
            displayCategories(categories);
            updateStats();
            
            if (categories.length === 0) {
                if (emptyState) emptyState.style.display = 'flex';
            } else {
                // Show table
                const tableContainer = document.querySelector('.modern-table');
                if (tableContainer) tableContainer.style.display = 'table';
            }
        } else {
            throw new Error('Falha ao carregar categorias');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('Erro ao carregar categorias: ' + error.message);
        if (emptyState) emptyState.style.display = 'flex';
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// Display categories in table
function displayCategories(categoriesToShow) {
    const tbody = document.getElementById('categoriesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    categoriesToShow.forEach(category => {
        const tr = document.createElement('tr');
        const hasProducts = category.product_count > 0;
        const productText = category.product_count === 1 ? 'produto' : 'produtos';

        tr.innerHTML = `
            <td><span class="text-muted">#${category.id}</span></td>
            <td>
                <div class="d-flex align-items-center category-row" style="cursor: pointer;" onclick="viewCategoryProducts(${category.id}, '${category.name}')" title="Clique para ver os produtos desta categoria">
                    <div class="category-icon-sm">
                        <i data-lucide="folder" style="width: 16px; height: 16px;"></i>
                    </div>
                    <div class="category-info">
                        <div class="fw-semibold category-name">${category.name}</div>
                        ${hasProducts ? '<span class="badge bg-success badge-sm">Com produtos</span>' : '<span class="badge bg-secondary badge-sm">Vazia</span>'}
                    </div>
                </div>
            </td>
            <td class="text-muted">${category.description || 'Sem descrição'}</td>
            <td>
                <span class="badge bg-primary">${category.product_count} ${productText}</span>
            </td>
            <td>
                <span class="badge bg-info">${category.total_stock} itens</span>
            </td>
            <td class="text-muted">${formatDate(category.created_at)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editCategory(${category.id})" title="Editar">
                        <i data-lucide="edit-2" style="width: 1rem; height: 1rem;"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteCategory(${category.id}, '${category.name}')" title="Excluir">
                        <i data-lucide="trash-2" style="width: 1rem; height: 1rem;"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Update count
    const categoriesCountEl = document.getElementById('categoriesCount');
    if (categoriesCountEl) {
        const count = categoriesToShow.length;
        categoriesCountEl.textContent = `${count} ${count === 1 ? 'categoria' : 'categorias'}`;
    }

    // Re-initialize icons for new elements
    lucide.createIcons();
}

// Update statistics
function updateStats() {
    const totalCategories = categories.length;
    const categoriesWithProducts = categories.filter(cat => cat.product_count > 0).length;
    const totalProducts = categories.reduce((sum, cat) => sum + cat.product_count, 0);

    const totalCategoriesEl = document.getElementById('totalCategories');
    const categoriesWithProductsEl = document.getElementById('categoriesWithProducts');
    const totalProductsEl = document.getElementById('totalProductsInCategories');

    if (totalCategoriesEl) totalCategoriesEl.textContent = totalCategories;
    if (categoriesWithProductsEl) categoriesWithProductsEl.textContent = categoriesWithProducts;
    if (totalProductsEl) totalProductsEl.textContent = totalProducts;
}

// Filter categories based on search
function filterCategories() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm) ||
        (category.description && category.description.toLowerCase().includes(searchTerm))
    );
    displayCategories(filteredCategories);
}

// Open category modal for creating/editing
window.openCategoryModal = function(category = null) {
    const modal = document.getElementById('categoryModal');
    const modalTitle = document.getElementById('modalTitle');
    const categoryForm = document.getElementById('categoryForm');

    isEditMode = !!category;

    // Clear any existing errors
    clearFormErrors();

    if (isEditMode) {
        modalTitle.textContent = 'Editar Categoria';
        document.getElementById('categoryId').value = category.id;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryDescription').value = category.description || '';
    } else {
        modalTitle.textContent = 'Nova Categoria';
        categoryForm.reset();
        document.getElementById('categoryId').value = '';
    }

    modal.style.display = 'flex';
    document.getElementById('categoryName').focus();
}

// Clear form validation errors
function clearFormErrors() {
    const formFields = document.querySelectorAll('.form-field');
    formFields.forEach(field => {
        field.classList.remove('error');
        const errorMsg = field.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    });
}

// Show field validation error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const formField = field.closest('.form-field');
    if (!formField) return;

    formField.classList.add('error');

    // Remove existing error message
    const existingError = formField.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error-600)';
    errorDiv.style.fontSize = '0.75rem';
    errorDiv.style.marginTop = '0.25rem';

    formField.appendChild(errorDiv);

    // Focus the field
    field.focus();
}

// Clear single field error
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const formField = field.closest('.form-field');
    if (!formField) return;

    formField.classList.remove('error');
    const errorMsg = formField.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Close category modal
window.closeCategoryModal = function() {
    document.getElementById('categoryModal').style.display = 'none';
    document.getElementById('categoryForm').reset();
}

// Handle category form submission
async function handleCategorySubmit(e) {
    e.preventDefault();
    console.log('Category form submitted');

    const btn = document.getElementById('saveCategoryBtn');
    if (!btn) {
        console.error('Save button not found!');
        return;
    }

    const btnText = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.spinner');

    console.log('Button elements found:', { btn: !!btn, btnText: !!btnText, spinner: !!spinner });
    
    const categoryId = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value.trim();
    const description = document.getElementById('categoryDescription').value.trim();

    console.log('Form data:', { categoryId, name, description, isEditMode });

    // Clear any existing errors first
    clearFormErrors();

    // Validation
    if (!name || name.length < 2) {
        console.log('Validation failed: name too short');
        showFieldError('categoryName', 'Nome deve ter pelo menos 2 caracteres');
        return;
    }
    
    const token = localStorage.getItem('token');
    console.log('Token available:', !!token);

    try {
        // Show loading state
        btn.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'inline-block';

        const categoryData = { name, description };
        console.log('Sending category data:', categoryData);

        const url = isEditMode ? `/api/categories/${categoryId}` : '/api/categories';
        const method = isEditMode ? 'PUT' : 'POST';
        console.log('Request URL:', url, 'Method:', method);

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(categoryData)
        });

        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
            console.log('Category saved successfully');
            alert(isEditMode ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!');
            closeCategoryModal();
            loadCategories();
        } else {
            console.error('Server error:', data);
            alert('Erro: ' + (data.error || 'Falha ao salvar categoria'));
        }
    } catch (error) {
        console.error('Error saving category:', error);
        alert('Erro ao salvar categoria: ' + error.message);
    } finally {
        // Reset loading state
        btn.disabled = false;
        btnText.style.display = 'inline';
        spinner.style.display = 'none';
    }
}

// Edit category
function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
        openCategoryModal(category);
    }
}

// Delete category
async function deleteCategory(categoryId, categoryName) {
    const category = categories.find(c => c.id === categoryId);
    
    if (category && category.product_count > 0) {
        alert(`Não é possível excluir a categoria "${categoryName}" pois ela possui ${category.product_count} produto(s) associado(s). Remova ou reassigne os produtos primeiro.`);
        return;
    }
    
    if (!confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`/api/categories/${categoryId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Categoria excluída com sucesso!');
            loadCategories();
        } else {
            alert('Erro: ' + (data.error || 'Falha ao excluir categoria'));
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Erro ao excluir categoria: ' + error.message);
    }
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// View products in category
async function viewCategoryProducts(categoryId, categoryName) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/inventory/products?category=${categoryId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const products = await response.json();
            showCategoryProductsModal(categoryName, products);
        } else {
            console.error('Failed to load category products');
            alert('Erro ao carregar produtos da categoria');
        }
    } catch (error) {
        console.error('Error loading category products:', error);
        alert('Erro ao carregar produtos da categoria');
    }
}

// Show category products in modal
function showCategoryProductsModal(categoryName, products) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('categoryProductsModal');
    if (!modal) {
        modal = createCategoryProductsModal();
        document.body.appendChild(modal);
    }

    // Update modal content
    document.getElementById('categoryProductsTitle').textContent = `Produtos da categoria: ${categoryName}`;

    const productsContainer = document.getElementById('categoryProductsList');
    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="text-center py-4">
                <i data-lucide="package" style="width: 3rem; height: 3rem; color: var(--gray-400);"></i>
                <p class="mt-2 text-muted">Nenhum produto encontrado nesta categoria</p>
            </div>
        `;
    } else {
        productsContainer.innerHTML = products.map(product => `
            <div class="product-item">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-details">
                        <span class="product-price">${formatCurrency(product.price || 0)}</span>
                        <span class="product-stock">${product.stock_quantity || 0} un.</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-icon btn-edit" onclick="editProductFromCategory(${product.id})" title="Editar produto">
                        <i data-lucide="edit-2" style="width: 1rem; height: 1rem;"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Show modal
    modal.style.display = 'flex';
    lucide.createIcons();
}

// Create category products modal
function createCategoryProductsModal() {
    const modal = document.createElement('div');
    modal.id = 'categoryProductsModal';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';

    modal.innerHTML = `
        <div class="modal-improved" style="max-width: 600px;">
            <div class="modal-header-improved">
                <h2>
                    <i data-lucide="package"></i>
                    <span id="categoryProductsTitle">Produtos da Categoria</span>
                </h2>
                <button class="btn-secondary-modern btn-sm" onclick="closeCategoryProductsModal()">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="modal-body-improved">
                <div id="categoryProductsList" class="products-list">
                    <!-- Products will be loaded here -->
                </div>
            </div>
            <div class="modal-footer-improved">
                <button class="btn-secondary-modern" onclick="closeCategoryProductsModal()">
                    <i data-lucide="x"></i>
                    Fechar
                </button>
            </div>
        </div>
    `;

    // Close modal when clicking backdrop
    modal.addEventListener('click', function(e) {
        if (e.target === this) closeCategoryProductsModal();
    });

    return modal;
}

// Close category products modal
function closeCategoryProductsModal() {
    const modal = document.getElementById('categoryProductsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Edit product from category modal (redirect to inventory)
function editProductFromCategory(productId) {
    localStorage.setItem('editProductId', productId);
    window.location.href = '/inventory.html';
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}
