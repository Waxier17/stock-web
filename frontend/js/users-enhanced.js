// Enhanced Users management functionality - DEBUG VERSION
let users = [];
let isEditMode = false;

// Debug function
function debugLog(message, data = null) {
    console.log(`[USERS DEBUG] ${message}`, data || '');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOM loaded, initializing users page');
    lucide.createIcons();
    checkAuth();
    
    // Initialize stats with zero values first
    initializeStats();
    
    loadUsers();
    setupEventListeners();
    initializeEnhancements();
});

// Initialize stats with zero values - ENHANCED
function initializeStats() {
    debugLog('Initializing stats');
    
    const elements = {
        totalUsersCard: document.getElementById('totalUsersCard'),
        adminUsersCard: document.getElementById('adminUsersCard'),
        regularUsersCard: document.getElementById('regularUsersCard'),
        totalUsers: document.getElementById('totalUsers'),
        adminUsers: document.getElementById('adminUsers'),
        regularUsers: document.getElementById('regularUsers')
    };
    
    // Check if elements exist
    Object.entries(elements).forEach(([key, element]) => {
        if (!element) {
            debugLog(`Warning: Element ${key} not found`);
        } else {
            if (key.includes('Card')) {
                element.textContent = '0';
            } else {
                const type = key.includes('total') ? 'Total' : 
                           key.includes('admin') ? 'Admin' : 'Regular';
                element.textContent = `0 ${type}`;
            }
        }
    });
    
    debugLog('Stats initialized with zero values');
}

// Enhanced load users from API
async function loadUsers() {
    debugLog('Starting to load users');
    const token = localStorage.getItem('token');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const emptyState = document.getElementById('emptyState');
    const tableContainer = document.getElementById('usersTable');

    try {
        // Reset stats before loading
        initializeStats();
        
        if (loadingSpinner) {
            loadingSpinner.style.display = 'flex';
            loadingSpinner.classList.add('fade-in-enhanced');
        }
        if (emptyState) emptyState.style.display = 'none';
        if (tableContainer) tableContainer.style.display = 'none';
        
        debugLog('Making API call to /api/users');
        const response = await fetch('/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        debugLog('API response status:', response.status);

        if (response.ok) {
            const data = await response.json();
            debugLog('Raw users data from API:', data);
            
            // Validate data
            if (!Array.isArray(data)) {
                debugLog('ERROR: API did not return an array', typeof data);
                throw new Error('Invalid data format from API');
            }
            
            users = data;
            debugLog('Processed users array:', users);
            debugLog('Total users count:', users.length);
            
            // Count users by role
            const adminCount = users.filter(user => user && user.role === 'admin').length;
            const userCount = users.filter(user => user && user.role === 'user').length;
            debugLog('User counts:', { total: users.length, admin: adminCount, regular: userCount });
            
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
            debugLog('Users loaded successfully');
            if (window.App && window.App.showToast) {
                window.App.showToast(`${users.length} usuários carregados com sucesso!`, 'success', 3000);
            }
        } else {
            throw new Error(`API error: ${response.status}`);
        }
    } catch (error) {
        debugLog('ERROR loading users:', error);
        users = []; // Ensure users is always an array
        updateStats(); // Update stats even on error
        
        if (window.App && window.App.showToast) {
            window.App.showToast('Erro ao carregar usuários: ' + error.message, 'error');
        }
        
        if (emptyState) emptyState.style.display = 'flex';
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// Enhanced update statistics with extensive debugging
function updateStats() {
    debugLog('=== UPDATING STATS ===');
    
    // Ensure users array exists and is valid
    if (!Array.isArray(users)) {
        debugLog('ERROR: users is not an array', typeof users);
        users = [];
    }
    
    debugLog('Users array:', users);
    
    const totalUsers = users.length || 0;
    const adminUsers = users.filter(user => {
        debugLog('Checking user:', user);
        return user && user.role === 'admin';
    }).length || 0;
    const regularUsers = users.filter(user => {
        return user && user.role === 'user';
    }).length || 0;

    debugLog('Calculated stats:', { totalUsers, adminUsers, regularUsers });

    // Update card elements with direct assignment (no animation for debugging)
    const totalUsersCard = document.getElementById('totalUsersCard');
    const adminUsersCard = document.getElementById('adminUsersCard');
    const regularUsersCard = document.getElementById('regularUsersCard');
    
    if (totalUsersCard) {
        debugLog('Updating totalUsersCard from', totalUsersCard.textContent, 'to', totalUsers);
        totalUsersCard.textContent = totalUsers;
    } else {
        debugLog('ERROR: totalUsersCard element not found');
    }
    
    if (adminUsersCard) {
        debugLog('Updating adminUsersCard from', adminUsersCard.textContent, 'to', adminUsers);
        adminUsersCard.textContent = adminUsers;
    } else {
        debugLog('ERROR: adminUsersCard element not found');
    }
    
    if (regularUsersCard) {
        debugLog('Updating regularUsersCard from', regularUsersCard.textContent, 'to', regularUsers);
        regularUsersCard.textContent = regularUsers;
    } else {
        debugLog('ERROR: regularUsersCard element not found');
    }
    
    // Update badges with safe values
    const totalUsersEl = document.getElementById('totalUsers');
    const adminUsersEl = document.getElementById('adminUsers');
    const regularUsersEl = document.getElementById('regularUsers');

    if (totalUsersEl) {
        totalUsersEl.textContent = `${totalUsers} Total`;
        debugLog('Updated totalUsers badge');
    }
    if (adminUsersEl) {
        adminUsersEl.textContent = `${adminUsers} Admin`;
        debugLog('Updated adminUsers badge');
    }
    if (regularUsersEl) {
        regularUsersEl.textContent = `${regularUsers} Regular`;
        debugLog('Updated regularUsers badge');
    }
    
    debugLog('=== STATS UPDATE COMPLETE ===');
}

// Enhanced display users in table
function displayUsers(usersToShow) {
    debugLog('Displaying users:', usersToShow);
    
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) {
        debugLog('ERROR: Table body not found');
        return;
    }

    // Ensure usersToShow is an array
    if (!Array.isArray(usersToShow)) {
        debugLog('ERROR: usersToShow is not an array:', usersToShow);
        usersToShow = [];
    }

    tbody.innerHTML = '';

    usersToShow.forEach((user, index) => {
        debugLog(`Creating row for user ${index}:`, user);
        
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
    
    debugLog('Users displayed successfully');
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
        if (window.App && window.App.showToast) {
            window.App.showToast('Acesso negado. Apenas administradores podem gerenciar usuários.', 'error');
        }
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
    debugLog('Initializing enhancements');
    
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
            }, 300);
        });
    }
}

// Enhanced filter users based on search
function filterUsers() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );
    
    debugLog('Filtering users:', { searchTerm, originalCount: users.length, filteredCount: filteredUsers.length });
    displayUsers(filteredUsers);
}

// Enhanced setup event listeners
function setupEventListeners() {
    debugLog('Setting up event listeners');
    
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
            debugLog('Refresh button clicked');
            this.disabled = true;
            this.innerHTML = '<i data-lucide="loader" style="animation: spin 1s linear infinite;"></i> Atualizando...';
            loadUsers().finally(() => {
                this.disabled = false;
                this.innerHTML = '<i data-lucide="refresh-cw"></i> Atualizar';
                lucide.createIcons();
            });
        });
    }
}

// Enhanced logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.App && window.App.showToast) {
        window.App.showToast('Logout realizado com sucesso!', 'success', 2000);
    }
    setTimeout(() => {
        window.location.href = '/login.html';
    }, 1000);
}

// Test function to manually trigger stats update
window.testStatsUpdate = function() {
    debugLog('=== MANUAL STATS TEST ===');
    
    // Simulate some test data
    users = [
        { id: 1, username: 'admin', role: 'admin' },
        { id: 2, username: 'user1', role: 'user' },
        { id: 3, username: 'user2', role: 'user' }
    ];
    
    debugLog('Test users set:', users);
    updateStats();
};

// Global functions for window scope
window.editUser = function(userId) { debugLog('Edit user:', userId); };
window.deleteUser = function(userId, username) { debugLog('Delete user:', userId, username); };
window.changeUserPassword = function(userId) { debugLog('Change password for user:', userId); };
