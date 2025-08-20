// Enhanced Users management functionality
let users = [];
let isEditMode = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    checkAuth();

    // Initialize stats with zero values first
    initializeStats();

    loadUsers();
    setupEventListeners();
    initializeEnhancements();
});

// Initialize stats with zero values
function initializeStats() {
    resetStats();
    updateStats();
}

// Reset all stats to zero
function resetStats() {
    const elements = [
        'totalUsersCard',
        'adminUsersCard',
        'regularUsersCard',
        'totalUsers',
        'adminUsers',
        'regularUsers'
    ];

    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            // Clear any running animations
            if (element._animationTimer) {
                clearInterval(element._animationTimer);
                delete element._animationTimer;
            }

            if (id.includes('Card')) {
                element.textContent = '0';
            } else {
                element.textContent = '0 ' + (id.includes('total') ? 'Total' :
                                        id.includes('admin') ? 'Admin' : 'Regular');
            }
        }
    });
}

// Enhanced authentication check
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Check if user is admin
    if (user.role !== 'admin') {
        showAlert('Acesso negado. Apenas administradores podem gerenciar usuários.', 'error');
        window.location.href = '/dashboard.html';
        return;
    }

    // Update user display safely
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
        userDisplay.textContent = user.username || 'Admin';
    }

    // Update user avatar safely
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar && user.username) {
        userAvatar.textContent = user.username.charAt(0).toUpperCase();
    }
}

// Initialize enhanced features
function initializeEnhancements() {
    // Add smooth animations to cards
    const cards = document.querySelectorAll('.stat-card-enhanced');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-enhanced');
    });

    // Enhanced search with debounce
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterUsers();
                addSearchHighlight();
            }, 300);
        });
    }

    // Add tooltips to action buttons
    addEnhancedTooltips();
}

// Enhanced setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterUsers);
        
        // Add keyboard shortcuts
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                filterUsers();
                this.blur();
            }
        });
    }

    // Form submissions with enhanced validation
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
        
        // Real-time validation
        const inputs = userForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField.call(this);
                }
            });
        });
    }

    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordSubmit);
        
        // Real-time password validation
        const passwordInputs = passwordForm.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', validatePasswordFields);
        });
    }

    // Enhanced logout with confirmation
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Tem certeza que deseja sair do sistema?')) {
                logout();
            }
        });
    }

    // Refresh button with loading state
    const refreshBtn = document.getElementById('refreshUsers');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.disabled = true;
            this.innerHTML = '<i data-lucide="loader" style="animation: spin 1s linear infinite;"></i> Atualizando...';
            loadUsers().finally(() => {
                this.disabled = false;
                this.innerHTML = '<i data-lucide="refresh-cw"></i> Atualizar';
                lucide.createIcons();
            });
        });
    }

    // Enhanced modal interactions
    setupModalEvents();
}

// Enhanced modal events
function setupModalEvents() {
    const userModal = document.getElementById('userModal');
    const passwordModal = document.getElementById('passwordModal');
    
    // Close on background click
    [userModal, passwordModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    const closeFunction = modal.id === 'userModal' ? closeUserModal : closePasswordModal;
                    closeFunction();
                }
            });
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (userModal.style.display === 'flex') closeUserModal();
            if (passwordModal.style.display === 'flex') closePasswordModal();
        }
    });
}

// Enhanced load users from API
async function loadUsers() {
    const token = localStorage.getItem('token');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const emptyState = document.getElementById('emptyState');
    const tableContainer = document.getElementById('usersTable');

    try {
        // Reset stats before loading
        resetStats();

        if (loadingSpinner) {
            loadingSpinner.style.display = 'flex';
            loadingSpinner.classList.add('fade-in-enhanced');
        }
        if (emptyState) emptyState.style.display = 'none';
        if (tableContainer) tableContainer.style.display = 'none';
        
        const response = await fetch('/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            users = Array.isArray(data) ? data : [];

            displayUsers(users);
            updateStats();

            if (users.length === 0) {
                if (emptyState) {
                    emptyState.style.display = 'flex';
                    emptyState.classList.add('scale-in-enhanced');
                }
            } else {
                if (tableContainer) {
                    tableContainer.style.display = 'table';
                    tableContainer.classList.add('fade-in-enhanced');
                }
            }

            // Show success notification
            showAlert(`${users.length} usuários carregados com sucesso!`, 'success', 3000);
        } else {
            throw new Error('Falha ao carregar usuários');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        users = []; // Ensure users is always an array
        updateStats(); // Update stats even on error
        showAlert('Erro ao carregar usuários: ' + error.message, 'error');
        if (emptyState) emptyState.style.display = 'flex';
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// Enhanced display users in table
function displayUsers(usersToShow) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) {
        console.warn('Table body not found');
        return;
    }

    // Ensure usersToShow is an array
    if (!Array.isArray(usersToShow)) {
        console.warn('usersToShow is not an array:', usersToShow);
        usersToShow = [];
    }

    tbody.innerHTML = '';

    usersToShow.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${index * 0.05}s`;
        tr.classList.add('slide-in-enhanced');
        
        tr.innerHTML = `
            <td>
                <span class="badge-enhanced primary">#${user.id}</span>
            </td>
            <td>
                <div class="user-info-enhanced">
                    <div class="user-avatar-enhanced">${user.username.charAt(0).toUpperCase()}</div>
                    <div class="user-details">
                        <div class="user-name">${user.username}</div>
                        <div class="user-email">${user.email}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="text-muted">${user.email}</span>
            </td>
            <td>
                <span class="role-badge-enhanced ${user.role === 'admin' ? 'role-admin' : 'role-user'}">
                    ${user.role === 'admin' ? '🛡️ Administrador' : '👤 Usuário'}
                </span>
            </td>
            <td class="text-muted">${formatDate(user.created_at)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon-enhanced btn-edit-enhanced tooltip-enhanced" onclick="editUser(${user.id})" title="Editar usuário">
                        <div class="tooltip-content">Editar</div>
                        <i data-lucide="edit-2" style="width: 1rem; height: 1rem;"></i>
                    </button>
                    <button class="btn-icon-enhanced btn-password-enhanced tooltip-enhanced" onclick="changeUserPassword(${user.id})" title="Alterar senha">
                        <div class="tooltip-content">Alterar Senha</div>
                        <i data-lucide="key" style="width: 1rem; height: 1rem;"></i>
                    </button>
                    <button class="btn-icon-enhanced btn-delete-enhanced tooltip-enhanced" onclick="deleteUser(${user.id}, '${user.username}')" title="Excluir usuário">
                        <div class="tooltip-content">Excluir</div>
                        <i data-lucide="trash-2" style="width: 1rem; height: 1rem;"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Update count with animation
    const usersCountEl = document.getElementById('usersCount');
    if (usersCountEl) {
        const count = usersToShow.length;
        usersCountEl.textContent = `${count} ${count === 1 ? 'usuário encontrado' : 'usuários encontrados'}`;
        usersCountEl.classList.add('fade-in-enhanced');
    }

    // Re-initialize icons for new elements
    lucide.createIcons();
    
    // Add enhanced tooltips
    addEnhancedTooltips();
}

// Enhanced update statistics with safe values
function updateStats() {
    // Ensure users array exists and is valid
    if (!Array.isArray(users)) {
        console.warn('Users array is not valid, initializing empty array');
        users = [];
    }

    const totalUsers = users.length || 0;
    const adminUsers = users.filter(user => user && user.role === 'admin').length || 0;
    const regularUsers = users.filter(user => user && user.role === 'user').length || 0;

    // Animate number changes with safe values
    animateNumber('totalUsersCard', totalUsers);
    animateNumber('adminUsersCard', adminUsers);
    animateNumber('regularUsersCard', regularUsers);

    // Update badges with safe values
    const totalUsersEl = document.getElementById('totalUsers');
    const adminUsersEl = document.getElementById('adminUsers');
    const regularUsersEl = document.getElementById('regularUsers');

    if (totalUsersEl) totalUsersEl.textContent = `${totalUsers} Total`;
    if (adminUsersEl) adminUsersEl.textContent = `${adminUsers} Admin`;
    if (regularUsersEl) regularUsersEl.textContent = `${regularUsers} Regular`;

    // Debug log for troubleshooting
    console.log('Stats updated:', { totalUsers, adminUsers, regularUsers });
}

// Enhanced animate number counting with safer logic
function animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Clear any existing animation
    if (element._animationTimer) {
        clearInterval(element._animationTimer);
    }

    // Get current number, but handle edge cases
    let currentText = element.textContent.replace(/[^0-9.-]/g, '');
    let currentNumber = parseInt(currentText) || 0;

    // If the current number is unreasonable, start from 0
    if (currentNumber < 0 || currentNumber > 10000) {
        currentNumber = 0;
    }

    // If target and current are the same, just set it
    if (currentNumber === targetNumber) {
        element.textContent = targetNumber;
        return;
    }

    const difference = Math.abs(targetNumber - currentNumber);
    const increment = targetNumber > currentNumber ? 1 : -1;

    // For large differences, use faster animation
    const speed = difference > 20 ? 20 : 80;
    const step = difference > 50 ? Math.ceil(difference / 20) : 1;

    let current = currentNumber;

    element._animationTimer = setInterval(() => {
        if (increment > 0) {
            current = Math.min(current + step, targetNumber);
        } else {
            current = Math.max(current - step, targetNumber);
        }

        element.textContent = current;

        if (current === targetNumber) {
            clearInterval(element._animationTimer);
            delete element._animationTimer;
        }
    }, speed);
}

// Enhanced filter users based on search
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );
    
    displayUsers(filteredUsers);
    
    // Update search result indicator
    const searchInput = document.getElementById('searchInput');
    if (searchTerm && filteredUsers.length === 0) {
        searchInput.classList.add('error');
        showAlert('Nenhum usuário encontrado com esse termo de pesquisa.', 'warning', 3000);
    } else {
        searchInput.classList.remove('error');
    }
}

// Add search highlighting
function addSearchHighlight() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) return;
    
    const userRows = document.querySelectorAll('#usersTableBody tr');
    userRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.backgroundColor = 'var(--primary-50)';
            row.style.borderLeft = '3px solid var(--primary-500)';
        } else {
            row.style.backgroundColor = '';
            row.style.borderLeft = '';
        }
    });
}

// Enhanced open user modal
function openUserModal(user = null) {
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const userForm = document.getElementById('userForm');
    const passwordGroup = document.getElementById('passwordGroup');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    
    isEditMode = !!user;
    
    if (isEditMode) {
        modalTitle.innerHTML = `
            <i data-lucide="edit" style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem;"></i>
            Editar Usuário
        `;
        document.getElementById('userId').value = user.id;
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.role;
        
        // Hide password fields in edit mode
        passwordGroup.style.display = 'none';
        confirmPasswordGroup.style.display = 'none';
        document.getElementById('password').required = false;
        document.getElementById('confirmPassword').required = false;
    } else {
        modalTitle.innerHTML = `
            <i data-lucide="user-plus" style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem;"></i>
            Novo Usuário
        `;
        userForm.reset();
        document.getElementById('userId').value = '';
        
        // Show password fields in create mode
        passwordGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'block';
        document.getElementById('password').required = true;
        document.getElementById('confirmPassword').required = true;
    }
    
    // Clear any validation errors
    clearFormErrors();
    
    modal.style.display = 'flex';
    modal.classList.add('fade-in-enhanced');
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('username').focus();
    }, 300);
    
    // Re-initialize icons
    lucide.createIcons();
}

// Enhanced close user modal
function closeUserModal() {
    const modal = document.getElementById('userModal');
    modal.style.display = 'none';
    document.getElementById('userForm').reset();
    clearFormErrors();
}

// Enhanced handle user form submission
async function handleUserSubmit(e) {
    e.preventDefault();
    
    const btn = document.getElementById('saveUserBtn');
    const btnText = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.spinner-sm');
    
    const userId = document.getElementById('userId').value;
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Enhanced validation
    if (!validateUserForm()) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
        // Show enhanced loading state
        setButtonLoading(btn, true);
        
        const userData = { username, email, role };
        if (!isEditMode) {
            userData.password = password;
        }
        
        const url = isEditMode ? `/api/users/${userId}` : '/api/users';
        const method = isEditMode ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const message = isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!';
            showAlert(message, 'success');
            closeUserModal();
            loadUsers();
        } else {
            showAlert('Erro: ' + (data.error || 'Falha ao salvar usuário'), 'error');
        }
    } catch (error) {
        console.error('Error saving user:', error);
        showAlert('Erro ao salvar usuário: ' + error.message, 'error');
    } finally {
        setButtonLoading(btn, false);
    }
}

// Enhanced form validation
function validateUserForm() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    if (!username) {
        showFieldError('username', 'Nome de usuário é obrigatório');
        isValid = false;
    } else if (username.length < 3) {
        showFieldError('username', 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
    }
    
    if (!email) {
        showFieldError('email', 'Email é obrigatório');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('email', 'Email inválido');
        isValid = false;
    }
    
    if (!role) {
        showFieldError('role', 'Função é obrigatória');
        isValid = false;
    }
    
    if (!isEditMode) {
        if (!password) {
            showFieldError('password', 'Senha é obrigatória');
            isValid = false;
        } else if (password.length < 6) {
            showFieldError('password', 'Senha deve ter pelo menos 6 caracteres');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            showFieldError('confirmPassword', 'Senhas não coincidem');
            isValid = false;
        }
    }
    
    return isValid;
}

// Enhanced field validation
function validateField() {
    const field = this;
    const value = field.value.trim();
    const fieldName = field.id;
    
    clearFieldError(fieldName);
    
    switch (fieldName) {
        case 'username':
            if (value && value.length < 3) {
                showFieldError(fieldName, 'Nome deve ter pelo menos 3 caracteres');
                return false;
            }
            break;
        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showFieldError(fieldName, 'Email inválido');
                return false;
            }
            break;
        case 'password':
            if (value && value.length < 6) {
                showFieldError(fieldName, 'Senha deve ter pelo menos 6 caracteres');
                return false;
            }
            break;
    }
    
    showFieldSuccess(fieldName);
    return true;
}

// Validate password fields
function validatePasswordFields() {
    const password = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmNewPassword');
    
    if (password.value && confirmPassword.value) {
        if (password.value !== confirmPassword.value) {
            showFieldError('confirmNewPassword', 'Senhas não coincidem');
        } else {
            showFieldSuccess('confirmNewPassword');
        }
    }
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const fieldContainer = field.closest('.form-field-enhanced');
    
    field.classList.add('error');
    fieldContainer.classList.add('error');
    
    let errorElement = fieldContainer.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        fieldContainer.appendChild(errorElement);
    }
    
    errorElement.innerHTML = `
        <i data-lucide="alert-circle" style="width: 0.75rem; height: 0.75rem;"></i>
        ${message}
    `;
    
    lucide.createIcons();
}

// Show field success
function showFieldSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    const fieldContainer = field.closest('.form-field-enhanced');
    
    field.classList.remove('error');
    fieldContainer.classList.remove('error');
    fieldContainer.classList.add('success');
    
    let successElement = fieldContainer.querySelector('.field-success');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'field-success';
        fieldContainer.appendChild(successElement);
    }
    
    successElement.innerHTML = `
        <i data-lucide="check-circle" style="width: 0.75rem; height: 0.75rem;"></i>
        Campo válido
    `;
    
    lucide.createIcons();
}

// Clear field error
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const fieldContainer = field.closest('.form-field-enhanced');
    
    field.classList.remove('error');
    fieldContainer.classList.remove('error', 'success');
    
    const errorElement = fieldContainer.querySelector('.field-error');
    const successElement = fieldContainer.querySelector('.field-success');
    
    if (errorElement) errorElement.remove();
    if (successElement) successElement.remove();
}

// Clear all form errors
function clearFormErrors() {
    const errorElements = document.querySelectorAll('.field-error, .field-success');
    errorElements.forEach(el => el.remove());
    
    const errorFields = document.querySelectorAll('.form-field-enhanced.error, .form-field-enhanced.success');
    errorFields.forEach(field => {
        field.classList.remove('error', 'success');
    });
    
    const errorInputs = document.querySelectorAll('.form-input.error');
    errorInputs.forEach(input => {
        input.classList.remove('error');
    });
}

// Enhanced edit user
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        openUserModal(user);
    }
}

// Enhanced delete user with better confirmation
async function deleteUser(userId, username) {
    // Create custom confirmation dialog
    const confirmed = await showConfirmDialog(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o usuário "${username}"?`,
        'Esta ação não pode ser desfeita.',
        'error'
    );
    
    if (!confirmed) return;
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Usuário excluído com sucesso!', 'success');
            loadUsers();
        } else {
            showAlert('Erro: ' + (data.error || 'Falha ao excluir usuário'), 'error');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showAlert('Erro ao excluir usuário: ' + error.message, 'error');
    }
}

// Enhanced change user password
function changeUserPassword(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        document.getElementById('passwordUserId').value = userId;
        const modal = document.getElementById('passwordModal');
        modal.style.display = 'flex';
        modal.classList.add('fade-in-enhanced');
        document.getElementById('passwordForm').reset();
        clearFormErrors();
        
        // Focus on password field
        setTimeout(() => {
            document.getElementById('newPassword').focus();
        }, 300);
    }
}

// Enhanced close password modal
function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    modal.style.display = 'none';
    document.getElementById('passwordForm').reset();
    clearFormErrors();
}

// Enhanced handle password change
async function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const btn = document.getElementById('changePasswordBtn');
    const userId = document.getElementById('passwordUserId').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // Enhanced validation
    clearFormErrors();
    let isValid = true;
    
    if (!newPassword || newPassword.length < 6) {
        showFieldError('newPassword', 'Nova senha deve ter pelo menos 6 caracteres');
        isValid = false;
    }
    
    if (newPassword !== confirmNewPassword) {
        showFieldError('confirmNewPassword', 'Senhas não coincidem');
        isValid = false;
    }
    
    if (!isValid) return;
    
    const token = localStorage.getItem('token');
    
    try {
        setButtonLoading(btn, true);
        
        const response = await fetch(`/api/users/${userId}/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ newPassword })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Senha alterada com sucesso!', 'success');
            closePasswordModal();
        } else {
            showAlert('Erro: ' + (data.error || 'Falha ao alterar senha'), 'error');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showAlert('Erro ao alterar senha: ' + error.message, 'error');
    } finally {
        setButtonLoading(btn, false);
    }
}

// Enhanced button loading state
function setButtonLoading(button, loading) {
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner-sm');
    
    if (loading) {
        button.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (spinner) spinner.style.display = 'inline-block';
    } else {
        button.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (spinner) spinner.style.display = 'none';
    }
}

// Enhanced tooltips
function addEnhancedTooltips() {
    const tooltipElements = document.querySelectorAll('.tooltip-enhanced');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = e.target.closest('.tooltip-enhanced').querySelector('.tooltip-content');
    if (tooltip) {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
    }
}

function hideTooltip(e) {
    const tooltip = e.target.closest('.tooltip-enhanced').querySelector('.tooltip-content');
    if (tooltip) {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
    }
}

// Enhanced confirmation dialog
function showConfirmDialog(title, message, description, type = 'warning') {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'modal-overlay';
        dialog.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h3>
                        <i data-lucide="${type === 'error' ? 'alert-triangle' : 'help-circle'}" style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem; color: var(--${type === 'error' ? 'error' : 'warning'}-500);"></i>
                        ${title}
                    </h3>
                </div>
                <div class="modal-body">
                    <div class="alert-enhanced ${type}">
                        <div class="alert-icon">
                            <i data-lucide="${type === 'error' ? 'alert-triangle' : 'alert-circle'}"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">${message}</div>
                            <div class="alert-description">${description}</div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary-modern" id="cancelBtn">
                        <i data-lucide="x"></i>
                        Cancelar
                    </button>
                    <button type="button" class="btn-primary-modern" id="confirmBtn" style="background: var(--error-600);">
                        <i data-lucide="trash-2"></i>
                        Confirmar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        dialog.style.display = 'flex';
        
        lucide.createIcons();
        
        document.getElementById('cancelBtn').onclick = () => {
            dialog.remove();
            resolve(false);
        };
        
        document.getElementById('confirmBtn').onclick = () => {
            dialog.remove();
            resolve(true);
        };
        
        dialog.onclick = (e) => {
            if (e.target === dialog) {
                dialog.remove();
                resolve(false);
            }
        };
    });
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Enhanced logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAlert('Logout realizado com sucesso!', 'success', 2000);
    setTimeout(() => {
        window.location.href = '/login.html';
    }, 1000);
}

// Enhanced alert function (using toast system from main.js)
function showAlert(message, type = 'info', duration = 5000) {
    if (window.App && window.App.showToast) {
        window.App.showToast(message, type, duration);
    } else {
        // Fallback to simple alert
        alert(message);
    }
}
