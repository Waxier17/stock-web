// Users management functionality
let users = [];
let isEditMode = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    checkAuth();
    loadUsers();
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

    // Check if user is admin
    if (user.role !== 'admin') {
        alert('Acesso negado. Apenas administradores podem gerenciar usuários.');
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

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterUsers);
    }

    // Form submissions
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    }

    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordSubmit);
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshUsers');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadUsers);
    }

    // Modal close on background click
    const userModal = document.getElementById('userModal');
    if (userModal) {
        userModal.addEventListener('click', function(e) {
            if (e.target === this) closeUserModal();
        });
    }

    const passwordModal = document.getElementById('passwordModal');
    if (passwordModal) {
        passwordModal.addEventListener('click', function(e) {
            if (e.target === this) closePasswordModal();
        });
    }
}

// Load users from API
async function loadUsers() {
    const token = localStorage.getItem('token');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const emptyState = document.getElementById('emptyState');
    const tableContainer = document.querySelector('.table-responsive');

    try {
        if (loadingSpinner) loadingSpinner.style.display = 'flex';
        if (emptyState) emptyState.style.display = 'none';

        // Hide table while loading
        const tableContainer = document.querySelector('.modern-table');
        if (tableContainer) tableContainer.style.display = 'none';
        
        const response = await fetch('/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            users = await response.json();
            displayUsers(users);
            updateStats();
            
            if (users.length === 0) {
                if (emptyState) emptyState.style.display = 'flex';
            } else {
                // Show table
                const tableContainer = document.querySelector('.modern-table');
                if (tableContainer) tableContainer.style.display = 'table';
            }
        } else {
            throw new Error('Falha ao carregar usuários');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Erro ao carregar usuários: ' + error.message);
        if (emptyState) emptyState.style.display = 'flex';
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// Display users in table
function displayUsers(usersToShow) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    usersToShow.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="text-muted">#${user.id}</span></td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar-sm me-2">${user.username.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="fw-semibold">${user.username}</div>
                        ${user.role === 'admin' ? '<span class="badge bg-danger badge-sm">Admin</span>' : ''}
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}">
                    ${user.role === 'admin' ? 'Administrador' : 'Usuário'}
                </span>
            </td>
            <td class="text-muted">${formatDate(user.created_at)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editUser(${user.id})" title="Editar">
                        <i data-lucide="edit-2" style="width: 1rem; height: 1rem;"></i>
                    </button>
                    <button class="btn-icon btn-change-password" onclick="changeUserPassword(${user.id})" title="Alterar Senha">
                        <i data-lucide="key" style="width: 1rem; height: 1rem;"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteUser(${user.id}, '${user.username}')" title="Excluir">
                        <i data-lucide="trash-2" style="width: 1rem; height: 1rem;"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Update count
    const usersCountEl = document.getElementById('usersCount');
    if (usersCountEl) {
        const count = usersToShow.length;
        usersCountEl.textContent = `${count} ${count === 1 ? 'usuário' : 'usuários'}`;
    }

    // Re-initialize icons for new elements
    lucide.createIcons();
}

// Update statistics
function updateStats() {
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const regularUsers = users.filter(user => user.role === 'user').length;

    const totalUsersEl = document.getElementById('totalUsers');
    const adminUsersEl = document.getElementById('adminUsers');
    const regularUsersEl = document.getElementById('regularUsers');

    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    if (adminUsersEl) adminUsersEl.textContent = adminUsers;
    if (regularUsersEl) regularUsersEl.textContent = regularUsers;
}

// Filter users based on search
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );
    displayUsers(filteredUsers);
}

// Open user modal for creating/editing
function openUserModal(user = null) {
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const userForm = document.getElementById('userForm');
    const passwordGroup = document.getElementById('passwordGroup');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    
    isEditMode = !!user;
    
    if (isEditMode) {
        modalTitle.textContent = 'Editar Usuário';
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
        modalTitle.textContent = 'Novo Usuário';
        userForm.reset();
        document.getElementById('userId').value = '';
        
        // Show password fields in create mode
        passwordGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'block';
        document.getElementById('password').required = true;
        document.getElementById('confirmPassword').required = true;
    }
    
    modal.style.display = 'flex';
}

// Close user modal
function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('userForm').reset();
}

// Handle user form submission
async function handleUserSubmit(e) {
    e.preventDefault();
    
    const btn = document.getElementById('saveUserBtn');
    const btnText = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.spinner');
    
    const userId = document.getElementById('userId').value;
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!username || !email || !role) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    if (!isEditMode) {
        if (!password || password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }
    }
    
    const token = localStorage.getItem('token');
    
    try {
        // Show loading state
        btn.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'inline-block';
        
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
            alert(isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
            closeUserModal();
            loadUsers();
        } else {
            alert('Erro: ' + (data.error || 'Falha ao salvar usuário'));
        }
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Erro ao salvar usuário: ' + error.message);
    } finally {
        // Reset loading state
        btn.disabled = false;
        btnText.style.display = 'inline';
        spinner.style.display = 'none';
    }
}

// Edit user
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        openUserModal(user);
    }
}

// Delete user
async function deleteUser(userId, username) {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${username}"?`)) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Usuário excluído com sucesso!');
            loadUsers();
        } else {
            alert('Erro: ' + (data.error || 'Falha ao excluir usuário'));
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Erro ao excluir usuário: ' + error.message);
    }
}

// Change user password
function changeUserPassword(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        document.getElementById('passwordUserId').value = userId;
        document.getElementById('passwordModal').style.display = 'flex';
        document.getElementById('passwordForm').reset();
    }
}

// Close password modal
function closePasswordModal() {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('passwordForm').reset();
}

// Handle password change form submission
async function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const btn = document.getElementById('changePasswordBtn');
    const btnText = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.spinner');
    
    const userId = document.getElementById('passwordUserId').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // Validation
    if (!newPassword || newPassword.length < 6) {
        alert('A nova senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('As senhas não coincidem.');
        return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
        // Show loading state
        btn.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'inline-block';
        
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
            alert('Senha alterada com sucesso!');
            closePasswordModal();
        } else {
            alert('Erro: ' + (data.error || 'Falha ao alterar senha'));
        }
    } catch (error) {
        console.error('Error changing password:', error);
        alert('Erro ao alterar senha: ' + error.message);
    } finally {
        // Reset loading state
        btn.disabled = false;
        btnText.style.display = 'inline';
        spinner.style.display = 'none';
    }
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}
