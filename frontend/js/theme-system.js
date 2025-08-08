// Sistema de Temas Avançado para Stock Web
class ThemeSystem {
    constructor() {
        this.themes = {
            light: {
                name: 'Claro',
                icon: 'sun',
                colors: {
                    '--primary-50': '#eff6ff',
                    '--primary-100': '#dbeafe',
                    '--primary-200': '#bfdbfe',
                    '--primary-300': '#93c5fd',
                    '--primary-400': '#60a5fa',
                    '--primary-500': '#3b82f6',
                    '--primary-600': '#2563eb',
                    '--primary-700': '#1d4ed8',
                    '--primary-800': '#1e40af',
                    '--primary-900': '#1e3a8a',
                    
                    '--gray-50': '#f9fafb',
                    '--gray-100': '#f3f4f6',
                    '--gray-200': '#e5e7eb',
                    '--gray-300': '#d1d5db',
                    '--gray-400': '#9ca3af',
                    '--gray-500': '#6b7280',
                    '--gray-600': '#4b5563',
                    '--gray-700': '#374151',
                    '--gray-800': '#1f2937',
                    '--gray-900': '#111827',
                    
                    '--background-primary': '#ffffff',
                    '--background-secondary': '#f9fafb',
                    '--text-primary': '#111827',
                    '--text-secondary': '#6b7280',
                    '--border-color': '#e5e7eb',
                    '--shadow-color': 'rgba(0, 0, 0, 0.1)'
                }
            },
            dark: {
                name: 'Escuro',
                icon: 'moon',
                colors: {
                    '--primary-50': '#1e3a8a',
                    '--primary-100': '#1d4ed8',
                    '--primary-200': '#2563eb',
                    '--primary-300': '#3b82f6',
                    '--primary-400': '#60a5fa',
                    '--primary-500': '#3b82f6',
                    '--primary-600': '#2563eb',
                    '--primary-700': '#1d4ed8',
                    '--primary-800': '#1e40af',
                    '--primary-900': '#1e3a8a',
                    
                    '--gray-50': '#1f2937',
                    '--gray-100': '#111827',
                    '--gray-200': '#374151',
                    '--gray-300': '#4b5563',
                    '--gray-400': '#6b7280',
                    '--gray-500': '#9ca3af',
                    '--gray-600': '#d1d5db',
                    '--gray-700': '#e5e7eb',
                    '--gray-800': '#f3f4f6',
                    '--gray-900': '#f9fafb',
                    
                    '--background-primary': '#111827',
                    '--background-secondary': '#1f2937',
                    '--text-primary': '#f9fafb',
                    '--text-secondary': '#d1d5db',
                    '--border-color': '#374151',
                    '--shadow-color': 'rgba(0, 0, 0, 0.25)'
                }
            }
        };
        
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }
    
    init() {
        this.createThemeToggle();
        this.applyTheme(this.currentTheme);
        this.listenToSystemChanges();
    }
    
    getStoredTheme() {
        return localStorage.getItem('theme');
    }
    
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    createThemeToggle() {
        // Encontrar onde adicionar o toggle (header user section)
        const headerUser = document.querySelector('.header-user');
        if (!headerUser) return;
        
        // Criar o dropdown de temas
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle-container';
        themeToggle.innerHTML = `
            <button class="theme-toggle-btn" id="themeToggle">
                <i data-lucide="${this.getCurrentThemeIcon()}" class="theme-icon"></i>
            </button>
            <div class="theme-dropdown" id="themeDropdown">
                <div class="theme-option" data-theme="light">
                    <i data-lucide="sun"></i>
                    <span>Claro</span>
                </div>
                <div class="theme-option" data-theme="dark">
                    <i data-lucide="moon"></i>
                    <span>Escuro</span>
                </div>
                <div class="theme-option" data-theme="system">
                    <i data-lucide="monitor"></i>
                    <span>Sistema</span>
                </div>
            </div>
        `;
        
        // Inserir antes do avatar do usuário
        const userAvatar = headerUser.querySelector('.user-avatar');
        headerUser.insertBefore(themeToggle, userAvatar);
        
        // Adicionar estilos
        this.addThemeStyles();
        
        // Adicionar event listeners
        this.setupEventListeners();
        
        // Inicializar ícones
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    addThemeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .theme-toggle-container {
                position: relative;
                margin-right: 1rem;
            }
            
            .theme-toggle-btn {
                background: var(--gray-100);
                border: 1px solid var(--gray-300);
                border-radius: var(--radius-md);
                padding: 0.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 2.5rem;
                height: 2.5rem;
                color: var(--gray-600);
            }
            
            .theme-toggle-btn:hover {
                background: var(--gray-200);
                border-color: var(--gray-400);
                color: var(--gray-700);
            }
            
            .theme-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--background-primary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-xl);
                padding: 0.5rem;
                min-width: 150px;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                margin-top: 0.5rem;
            }
            
            .theme-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .theme-option {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--text-primary);
                font-size: 0.875rem;
                font-weight: 500;
            }
            
            .theme-option:hover {
                background: var(--gray-100);
            }
            
            .theme-option.active {
                background: var(--primary-100);
                color: var(--primary-700);
            }
            
            .theme-option i {
                width: 1rem;
                height: 1rem;
                flex-shrink: 0;
            }
            
            /* Transições suaves para mudança de tema */
            :root {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }

            body {
                transition: background-color 0.3s ease, color 0.3s ease;
            }

            /* Apply transitions to all interactive elements */
            input, select, textarea, button, .btn, .card, .modal, .form-field {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }
            
            .modern-header,
            .modern-sidebar,
            .modern-card,
            .modal-improved,
            .form-section {
                transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }
            
            /* Estilos específicos para tema escuro */
            [data-theme="dark"] body {
                background-color: var(--background-secondary);
                color: var(--text-primary);
            }
            
            [data-theme="dark"] .modern-header {
                background: var(--background-primary);
                border-color: var(--border-color);
                box-shadow: 0 1px 3px var(--shadow-color);
            }
            
            [data-theme="dark"] .modern-sidebar {
                background: var(--background-primary);
                border-color: var(--border-color);
            }
            
            [data-theme="dark"] .modern-card {
                background: var(--background-primary);
                border-color: var(--border-color);
                box-shadow: 0 4px 6px var(--shadow-color);
            }
            
            [data-theme="dark"] .modal-improved {
                background: var(--background-primary);
                box-shadow: 0 20px 25px var(--shadow-color);
            }
            
            [data-theme="dark"] .form-section {
                background: var(--background-primary);
                border-color: var(--border-color);
            }
            
            [data-theme="dark"] .section-header {
                background: var(--background-secondary);
                border-color: var(--border-color);
            }
            
            [data-theme="dark"] .modern-table th {
                background: var(--background-secondary);
                color: var(--text-primary);
                border-color: var(--border-color);
            }
            
            [data-theme="dark"] .modern-table td {
                border-color: var(--border-color);
                color: var(--text-secondary);
            }
            
            [data-theme="dark"] .modern-table tbody tr:hover {
                background-color: var(--background-secondary);
            }
            
            [data-theme="dark"] .form-field input,
            [data-theme="dark"] .form-field select,
            [data-theme="dark"] .form-field textarea {
                background: var(--background-secondary);
                border-color: var(--border-color);
                color: var(--text-primary);
            }
            
            [data-theme="dark"] .form-field input:focus,
            [data-theme="dark"] .form-field select:focus,
            [data-theme="dark"] .form-field textarea:focus {
                background: var(--background-primary);
            }
            
            [data-theme="dark"] .btn-secondary-modern {
                background: var(--background-secondary);
                color: var(--text-primary);
                border-color: var(--border-color);
            }
            
            [data-theme="dark"] .btn-secondary-modern:hover {
                background: var(--gray-600);
                border-color: var(--gray-500);
            }

            /* Specific dark theme fixes for sales modal */
            [data-theme="dark"] .sales-modal-improved {
                background: var(--background-primary);
            }

            [data-theme="dark"] .sales-header-improved {
                background: linear-gradient(135deg, var(--gray-800) 0%, var(--gray-700) 100%);
                border-color: var(--border-color);
                color: var(--text-primary);
            }

            [data-theme="dark"] .customer-section,
            [data-theme="dark"] .products-section,
            [data-theme="dark"] .payment-section {
                background: var(--background-primary);
                border-color: var(--border-color);
            }

            [data-theme="dark"] .product-list {
                border-color: var(--border-color);
            }

            [data-theme="dark"] .product-item {
                border-color: var(--border-color);
                color: var(--text-primary);
            }

            [data-theme="dark"] .product-item:hover {
                background-color: var(--background-secondary);
            }

            [data-theme="dark"] .sale-summary {
                background: var(--background-secondary);
                border-color: var(--border-color);
                color: var(--text-primary);
            }

            [data-theme="dark"] .summary-label,
            [data-theme="dark"] .summary-value {
                color: var(--text-secondary);
            }

            [data-theme="dark"] .summary-total {
                color: var(--text-primary);
            }

            [data-theme="dark"] .sales-footer-improved {
                background: var(--background-secondary);
                border-color: var(--border-color);
            }

            [data-theme="dark"] .discount-input {
                background: var(--background-secondary);
                border-color: var(--border-color);
                color: var(--text-primary);
            }

            [data-theme="dark"] .payment-method label {
                background: var(--background-secondary);
                border-color: var(--border-color);
                color: var(--text-primary);
            }

            [data-theme="dark"] .payment-method input:checked + label {
                background: var(--primary-900);
                border-color: var(--primary-600);
            }

            [data-theme="dark"] .installment-preview {
                background: var(--background-secondary);
                border-color: var(--border-color);
            }

            [data-theme="dark"] .remove-product {
                background: var(--error-900);
                color: var(--error-300);
            }

            [data-theme="dark"] .remove-product:hover {
                background: var(--error-800);
                color: var(--error-200);
            }

            /* Fix for tables */
            [data-theme="dark"] .table-container {
                background: var(--background-primary);
            }

            [data-theme="dark"] .table-header {
                background: var(--background-primary);
                border-color: var(--border-color);
                color: var(--text-primary);
            }

            [data-theme="dark"] .card-body {
                background: var(--background-primary);
                color: var(--text-primary);
            }

            /* Fix for filters container */
            [data-theme="dark"] .filters-container {
                background: var(--background-primary);
                border-color: var(--border-color);
                color: var(--text-primary);
            }

            /* Fix for page header */
            [data-theme="dark"] .page-header {
                color: var(--text-primary);
            }

            [data-theme="dark"] .page-title {
                color: var(--text-primary);
            }

            [data-theme="dark"] .page-subtitle {
                color: var(--text-secondary);
            }

            /* Fix for empty states */
            [data-theme="dark"] .empty-products {
                color: var(--text-secondary);
            }

            /* Fix for progress bars */
            [data-theme="dark"] .progress-bar {
                background: var(--gray-700);
            }

            /* Fix for search inputs */
            [data-theme="dark"] .search-input {
                background: var(--background-secondary);
                border-color: var(--border-color);
                color: var(--text-primary);
            }

            [data-theme="dark"] .search-input::placeholder {
                color: var(--text-secondary);
            }

            /* Fix for help text */
            [data-theme="dark"] .help-text {
                color: var(--text-secondary);
            }

            /* Fix for badges */
            [data-theme="dark"] .badge-enhanced {
                background: var(--background-secondary);
                border-color: var(--border-color);
                color: var(--text-primary);
            }

            /* Fix modal backdrop */
            [data-theme="dark"] .modal-backdrop {
                background: rgba(0, 0, 0, 0.8);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        const toggleBtn = document.getElementById('themeToggle');
        const dropdown = document.getElementById('themeDropdown');
        const themeOptions = document.querySelectorAll('.theme-option');
        
        // Toggle dropdown
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });
        
        // Theme option clicks
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedTheme = option.dataset.theme;
                this.setTheme(selectedTheme);
                dropdown.classList.remove('show');
            });
        });
        
        // Update active option
        this.updateActiveOption();
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        
        if (theme === 'system') {
            localStorage.removeItem('theme');
            this.applyTheme(this.getSystemTheme());
        } else {
            localStorage.setItem('theme', theme);
            this.applyTheme(theme);
        }
        
        this.updateThemeIcon();
        this.updateActiveOption();
    }
    
    applyTheme(theme) {
        const actualTheme = theme === 'system' ? this.getSystemTheme() : theme;
        
        // Set data attribute on html element
        document.documentElement.setAttribute('data-theme', actualTheme);
        
        // Apply CSS variables
        const themeColors = this.themes[actualTheme].colors;
        const root = document.documentElement;
        
        Object.entries(themeColors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }
    
    getCurrentThemeIcon() {
        if (this.currentTheme === 'system') {
            return 'monitor';
        }
        return this.themes[this.currentTheme]?.icon || 'sun';
    }
    
    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            const iconName = this.getCurrentThemeIcon();
            themeIcon.setAttribute('data-lucide', iconName);
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    updateActiveOption() {
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === this.currentTheme) {
                option.classList.add('active');
            }
        });
    }
    
    listenToSystemChanges() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            if (this.currentTheme === 'system' || !this.getStoredTheme()) {
                this.applyTheme(this.getSystemTheme());
            }
        });
    }
}

// Inicializar o sistema de temas quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new ThemeSystem();
});

// Tornar disponível globalmente
window.ThemeSystem = ThemeSystem;
