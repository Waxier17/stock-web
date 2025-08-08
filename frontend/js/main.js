// Enhanced Frontend JavaScript for Stock Web Application
// Modern ES6+ implementation with improved UX

// Global app state
const App = {
    user: null,
    token: null,
    isAuthenticated: false,
    currentPage: null
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize app
    App.init();
});

// Main App Object
App.init = function() {
    // Check authentication state
    this.checkAuth();
    
    // Initialize UI components
    this.initializeUI();
    
    // Setup global event listeners
    this.setupEventListeners();
    
    // Initialize page-specific functionality
    this.initializePage();
};

App.checkAuth = function() {
    this.token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (this.token && userData) {
        this.user = JSON.parse(userData);
        this.isAuthenticated = true;
        
        // Verify token validity
        this.verifyToken();
    } else {
        this.isAuthenticated = false;
        
        // Redirect to login if on protected page
        const currentPath = window.location.pathname;
        const publicPages = ['/login.html', '/'];
        
        if (!publicPages.includes(currentPath)) {
            window.location.href = '/login.html';
        }
    }
};

App.verifyToken = async function() {
    try {
        const response = await fetch('/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${this.token}` }
        });
        
        if (!response.ok) {
            this.logout();
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        this.logout();
    }
};

App.logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticated = false;
    this.user = null;
    this.token = null;
    window.location.href = '/login.html';
};

App.initializeUI = function() {
    // Initialize Lucide icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Initialize tooltips
    this.initializeTooltips();
    
    // Setup responsive behavior
    this.setupResponsive();
    
    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
};

App.initializeTooltips = function() {
    // Tooltip functionality placeholder - can be implemented when needed
};

// Popover functionality removed - not used in current implementation

App.setupResponsive = function() {
    // Handle responsive breakpoints
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleBreakpointChange = (e) => {
        if (e.matches) {
            // Mobile layout
            document.body.classList.add('mobile-layout');
            this.initializeMobileUI();
        } else {
            // Desktop layout
            document.body.classList.remove('mobile-layout');
            this.initializeDesktopUI();
        }
    };
    
    mediaQuery.addListener(handleBreakpointChange);
    handleBreakpointChange(mediaQuery);
};

App.initializeMobileUI = function() {
    // Mobile-specific UI initialization
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('show');
    }
};

App.initializeDesktopUI = function() {
    // Desktop-specific UI initialization
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('show');
    }
};

App.setupKeyboardShortcuts = function() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input, #searchProducts');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            App.closeActiveModal();
        }
        
        // Ctrl/Cmd + N for new item (context dependent)
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            App.handleNewItemShortcut();
        }
    });
};

App.setupEventListeners = function() {
    // Global logout handlers
    const logoutButtons = document.querySelectorAll('#logoutBtn, [data-logout]');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', () => this.logout());
    });
    
    // Mobile menu toggles
    const mobileMenuToggles = document.querySelectorAll('.mobile-menu-toggle, #mobileMenuToggle');
    mobileMenuToggles.forEach(toggle => {
        toggle.addEventListener('click', this.toggleMobileMenu.bind(this));
    });
    
    // Form validation
    this.setupFormValidation();
    
    // Loading states
    this.setupLoadingStates();

    // Close mobile menu on escape key or outside click
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            this.closeMobileMenu();
        }
    });

    // Close mobile menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');

        if (window.innerWidth <= 768 && sidebar && mobileMenuToggle) {
            if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        }
    });
};

App.toggleMobileMenu = function() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');

    if (sidebar) {
        sidebar.classList.toggle('show');

        // Create or toggle overlay
        let overlay = document.getElementById('sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'sidebar-overlay';
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);

            // Close sidebar when clicking overlay
            overlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        overlay.classList.toggle('show');
    }

    if (hamburger) {
        hamburger.classList.toggle('active');
    }
};

App.closeMobileMenu = function() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar) {
        sidebar.classList.remove('show');
    }

    if (hamburger) {
        hamburger.classList.remove('active');
    }

    if (overlay) {
        overlay.classList.remove('show');
    }
};

App.setupFormValidation = function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!App.validateForm(this)) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                App.validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    App.validateField(this);
                }
            });
        });
    });
};

App.validateForm = function(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!this.validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
};

App.validateField = function(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const type = field.type;
    
    // Remove previous error styling
    field.classList.remove('error');
    this.removeFieldError(field);
    
    // Required field validation
    if (isRequired && !value) {
        this.showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    // Type-specific validation
    if (value) {
        switch (type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.showFieldError(field, 'Email inválido');
                    return false;
                }
                break;
            case 'number':
                if (isNaN(value) || value < 0) {
                    this.showFieldError(field, 'Número inválido');
                    return false;
                }
                break;
        }
    }
    
    // Custom validation
    const customValidator = field.getAttribute('data-validator');
    if (customValidator && window[customValidator]) {
        const result = window[customValidator](value);
        if (result !== true) {
            this.showFieldError(field, result);
            return false;
        }
    }
    
    return true;
};

App.showFieldError = function(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
};

App.removeFieldError = function(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
};

App.setupLoadingStates = function() {
    // Intercept form submissions to show loading states
    document.addEventListener('submit', function(e) {
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        
        if (submitBtn && !submitBtn.disabled) {
            App.setButtonLoading(submitBtn, true);
            
            // Auto-reset after 10 seconds as fallback
            setTimeout(() => {
                App.setButtonLoading(submitBtn, false);
            }, 10000);
        }
    });
};

App.setButtonLoading = function(button, loading) {
    if (loading) {
        button.disabled = true;
        button.classList.add('loading');
        
        const originalText = button.textContent;
        button.setAttribute('data-original-text', originalText);
        
        const spinner = '<span class="spinner"></span>';
        button.innerHTML = spinner + ' Carregando...';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.textContent = originalText;
        }
    }
};

App.initializePage = function() {
    const path = window.location.pathname;
    
    // Determine current page
    if (path.includes('dashboard')) {
        this.currentPage = 'dashboard';
    } else if (path.includes('inventory')) {
        this.currentPage = 'inventory';
    } else if (path.includes('sales')) {
        this.currentPage = 'sales';
    } else if (path.includes('customers')) {
        this.currentPage = 'customers';
    } else if (path.includes('suppliers')) {
        this.currentPage = 'suppliers';
    } else if (path.includes('reports')) {
        this.currentPage = 'reports';
    } else if (path.includes('login')) {
        this.currentPage = 'login';
    }
    
    // Initialize page-specific functionality
    switch (this.currentPage) {
        case 'dashboard':
            this.initializeDashboard();
            break;
        case 'inventory':
            this.initializeInventory();
            break;
        case 'sales':
            this.initializeSales();
            break;
        case 'customers':
            this.initializeCustomers();
            break;
        case 'suppliers':
            this.initializeSuppliers();
            break;
        case 'reports':
            this.initializeReports();
            break;
        case 'login':
            this.initializeLogin();
            break;
    }
};

// Page-specific initialization methods
App.initializeDashboard = function() {
    console.log('Initializing dashboard...');
    this.updateActiveNavItem('dashboard');
};

App.initializeInventory = function() {
    console.log('Initializing inventory...');
    this.updateActiveNavItem('inventory');
};

App.initializeSales = function() {
    console.log('Initializing sales...');
    this.updateActiveNavItem('sales');
};

App.initializeCustomers = function() {
    console.log('Initializing customers...');
    this.updateActiveNavItem('customers');
};

App.initializeSuppliers = function() {
    console.log('Initializing suppliers...');
    this.updateActiveNavItem('suppliers');
};

App.initializeReports = function() {
    console.log('Initializing reports...');
    this.updateActiveNavItem('reports');
};

App.initializeLogin = function() {
    console.log('Initializing login...');
    // Focus on username field
    const usernameField = document.getElementById('username');
    if (usernameField) {
        usernameField.focus();
    }
};

App.updateActiveNavItem = function(page) {
    // Update active navigation item
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (link.href.includes(page)) {
            link.classList.add('active');
        }
    });
};

// Utility methods
App.isValidEmail = function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

App.formatCurrency = function(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
};

App.formatDate = function(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

App.formatDateTime = function(dateString) {
    return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Toast notification system
App.showToast = function(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fade-in`;
    toast.innerHTML = `
        <div class="toast-content">
            <i data-lucide="${this.getToastIcon(type)}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;
    
    // Add to toast container or create one
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 1060;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        `;
        document.body.appendChild(container);
    }
    
    container.appendChild(toast);
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }
};

App.getToastIcon = function(type) {
    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        warning: 'alert-triangle',
        info: 'info'
    };
    return icons[type] || 'info';
};

// Modal management
App.closeActiveModal = function() {
    const openModals = document.querySelectorAll('.modal-backdrop[style*="flex"]');
    openModals.forEach(modal => {
        modal.style.display = 'none';
    });
};

App.handleNewItemShortcut = function() {
    switch (this.currentPage) {
        case 'inventory':
            const addProductBtn = document.getElementById('addProductBtn');
            if (addProductBtn) addProductBtn.click();
            break;
        case 'sales':
            // Add sale logic
            break;
        case 'customers':
            // Add customer logic
            break;
        case 'suppliers':
            // Add supplier logic
            break;
    }
};

// API request helper
App.apiRequest = async function(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (this.token) {
        defaultOptions.headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        if (response.status === 401) {
            this.logout();
            throw new Error('Não autorizado');
        }
        
        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// Export App object for global access
window.App = App;

// Legacy compatibility functions
function showAlert(message, type = 'info') {
    App.showToast(message, type);
}

function confirmDelete(message = 'Tem certeza que deseja excluir este item?') {
    return confirm(message);
}

function formatCurrency(amount) {
    return App.formatCurrency(amount);
}

function formatDate(dateString) {
    return App.formatDate(dateString);
}

// Enhanced CSS for toast notifications
const toastStyles = `
    .toast {
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--gray-200);
        min-width: 300px;
        max-width: 400px;
        overflow: hidden;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-md) var(--space-lg);
    }
    
    .toast-success {
        border-left: 4px solid var(--success-500);
    }
    
    .toast-error {
        border-left: 4px solid var(--error-500);
    }
    
    .toast-warning {
        border-left: 4px solid var(--warning-500);
    }
    
    .toast-info {
        border-left: 4px solid var(--info-500);
    }
    
    .toast-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: var(--space-xs);
        margin-left: auto;
        border-radius: var(--radius-sm);
        transition: background-color 0.3s ease;
    }
    
    .toast-close:hover {
        background: var(--gray-100);
    }
    
    .field-error {
        color: var(--error-500);
        font-size: var(--font-size-sm);
        margin-top: var(--space-xs);
        display: none;
    }
    
    .form-input-modern.error,
    .form-select-modern.error {
        border-color: var(--error-500);
        box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
    }
`;

// Add toast styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);
