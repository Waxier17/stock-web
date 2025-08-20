// Sistema de Temas Corrigido e Melhorado para Stock Web
class ThemeSystem {
    constructor() {
        this.themes = {
            light: {
                name: 'Claro',
                icon: 'sun',
                colors: {
                    // Primary colors
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
                    
                    // Gray colors
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
                    
                    // Status colors
                    '--success-50': '#ecfdf5',
                    '--success-100': '#d1fae5',
                    '--success-200': '#a7f3d0',
                    '--success-300': '#6ee7b7',
                    '--success-400': '#34d399',
                    '--success-500': '#10b981',
                    '--success-600': '#059669',
                    '--success-700': '#047857',
                    '--success-800': '#065f46',
                    '--success-900': '#064e3b',
                    
                    '--warning-50': '#fffbeb',
                    '--warning-100': '#fef3c7',
                    '--warning-200': '#fde68a',
                    '--warning-300': '#fcd34d',
                    '--warning-400': '#fbbf24',
                    '--warning-500': '#f59e0b',
                    '--warning-600': '#d97706',
                    '--warning-700': '#b45309',
                    '--warning-800': '#92400e',
                    '--warning-900': '#78350f',
                    
                    '--error-50': '#fef2f2',
                    '--error-100': '#fee2e2',
                    '--error-200': '#fecaca',
                    '--error-300': '#fca5a5',
                    '--error-400': '#f87171',
                    '--error-500': '#ef4444',
                    '--error-600': '#dc2626',
                    '--error-700': '#b91c1c',
                    '--error-800': '#991b1b',
                    '--error-900': '#7f1d1d',
                    
                    '--info-50': '#f0f9ff',
                    '--info-100': '#e0f2fe',
                    '--info-200': '#bae6fd',
                    '--info-300': '#7dd3fc',
                    '--info-400': '#38bdf8',
                    '--info-500': '#06b6d4',
                    '--info-600': '#0891b2',
                    '--info-700': '#0e7490',
                    '--info-800': '#155e75',
                    '--info-900': '#164e63',
                    
                    // Semantic colors
                    '--background-primary': '#ffffff',
                    '--background-secondary': '#f9fafb',
                    '--background-tertiary': '#f3f4f6',
                    '--text-primary': '#111827',
                    '--text-secondary': '#6b7280',
                    '--text-tertiary': '#9ca3af',
                    '--border-color': '#e5e7eb',
                    '--border-hover': '#d1d5db',
                    '--shadow-color': 'rgba(0, 0, 0, 0.1)',
                    '--shadow-hover': 'rgba(0, 0, 0, 0.15)'
                }
            },
            dark: {
                name: 'Escuro',
                icon: 'moon',
                colors: {
                    // Primary colors (adjusted for dark theme)
                    '--primary-50': '#1e3a8a',
                    '--primary-100': '#1e40af',
                    '--primary-200': '#1d4ed8',
                    '--primary-300': '#2563eb',
                    '--primary-400': '#3b82f6',
                    '--primary-500': '#60a5fa',
                    '--primary-600': '#93c5fd',
                    '--primary-700': '#bfdbfe',
                    '--primary-800': '#dbeafe',
                    '--primary-900': '#eff6ff',
                    
                    // Gray colors (inverted)
                    '--gray-50': '#111827',
                    '--gray-100': '#1f2937',
                    '--gray-200': '#374151',
                    '--gray-300': '#4b5563',
                    '--gray-400': '#6b7280',
                    '--gray-500': '#9ca3af',
                    '--gray-600': '#d1d5db',
                    '--gray-700': '#e5e7eb',
                    '--gray-800': '#f3f4f6',
                    '--gray-900': '#f9fafb',
                    
                    // Status colors (adjusted for dark theme)
                    '--success-50': '#064e3b',
                    '--success-100': '#065f46',
                    '--success-200': '#047857',
                    '--success-300': '#059669',
                    '--success-400': '#10b981',
                    '--success-500': '#34d399',
                    '--success-600': '#6ee7b7',
                    '--success-700': '#a7f3d0',
                    '--success-800': '#d1fae5',
                    '--success-900': '#ecfdf5',
                    
                    '--warning-50': '#78350f',
                    '--warning-100': '#92400e',
                    '--warning-200': '#b45309',
                    '--warning-300': '#d97706',
                    '--warning-400': '#f59e0b',
                    '--warning-500': '#fbbf24',
                    '--warning-600': '#fcd34d',
                    '--warning-700': '#fde68a',
                    '--warning-800': '#fef3c7',
                    '--warning-900': '#fffbeb',
                    
                    '--error-50': '#7f1d1d',
                    '--error-100': '#991b1b',
                    '--error-200': '#b91c1c',
                    '--error-300': '#dc2626',
                    '--error-400': '#ef4444',
                    '--error-500': '#f87171',
                    '--error-600': '#fca5a5',
                    '--error-700': '#fecaca',
                    '--error-800': '#fee2e2',
                    '--error-900': '#fef2f2',
                    
                    '--info-50': '#164e63',
                    '--info-100': '#155e75',
                    '--info-200': '#0e7490',
                    '--info-300': '#0891b2',
                    '--info-400': '#06b6d4',
                    '--info-500': '#38bdf8',
                    '--info-600': '#7dd3fc',
                    '--info-700': '#bae6fd',
                    '--info-800': '#e0f2fe',
                    '--info-900': '#f0f9ff',
                    
                    // Semantic colors for dark theme
                    '--background-primary': '#111827',
                    '--background-secondary': '#1f2937',
                    '--background-tertiary': '#374151',
                    '--text-primary': '#f9fafb',
                    '--text-secondary': '#d1d5db',
                    '--text-tertiary': '#9ca3af',
                    '--border-color': '#374151',
                    '--border-hover': '#4b5563',
                    '--shadow-color': 'rgba(0, 0, 0, 0.3)',
                    '--shadow-hover': 'rgba(0, 0, 0, 0.4)'
                }
            }
        };
        
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeTheme());
        } else {
            this.initializeTheme();
        }
    }
    
    initializeTheme() {
        this.injectDarkThemeFixes();
        this.createThemeToggle();
        this.applyTheme(this.currentTheme);
        this.listenToSystemChanges();
        this.isInitialized = true;
    }

    injectDarkThemeFixes() {
        // Check if the CSS is already loaded
        if (document.querySelector('link[href*="dark-theme-fixes.css"]')) {
            return;
        }

        // Create and inject the CSS link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/dark-theme-fixes.css';
        link.type = 'text/css';

        // Insert after the main CSS files
        const existingStylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        const lastStylesheet = existingStylesheets[existingStylesheets.length - 1];

        if (lastStylesheet) {
            lastStylesheet.parentNode.insertBefore(link, lastStylesheet.nextSibling);
        } else {
            document.head.appendChild(link);
        }

        console.log('Dark theme fixes CSS injected automatically');
    }
    
    getStoredTheme() {
        return localStorage.getItem('stock-web-theme');
    }
    
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    createThemeToggle() {
        // Remove existing theme toggle if present
        const existingToggle = document.querySelector('.theme-toggle-container');
        if (existingToggle) {
            existingToggle.remove();
        }
        
        // Find header user section
        const headerUser = document.querySelector('.header-user');
        if (!headerUser) {
            console.warn('Header user section not found. Theme toggle not created.');
            return;
        }
        
        // Create theme toggle
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle-container';
        themeToggle.innerHTML = `
            <button class="theme-toggle-btn" id="themeToggle" title="Alternar tema">
                <i data-lucide="${this.getCurrentThemeIcon()}" class="theme-icon"></i>
            </button>
            <div class="theme-dropdown" id="themeDropdown">
                <div class="theme-option ${this.currentTheme === 'light' ? 'active' : ''}" data-theme="light">
                    <i data-lucide="sun"></i>
                    <span>Tema Claro</span>
                </div>
                <div class="theme-option ${this.currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                    <i data-lucide="moon"></i>
                    <span>Tema Escuro</span>
                </div>
                <div class="theme-option ${this.currentTheme === 'system' ? 'active' : ''}" data-theme="system">
                    <i data-lucide="monitor"></i>
                    <span>Sistema</span>
                </div>
            </div>
        `;
        
        // Insert before user display
        const userDisplay = headerUser.querySelector('#userDisplay, .user-avatar');
        if (userDisplay) {
            headerUser.insertBefore(themeToggle, userDisplay);
        } else {
            headerUser.insertBefore(themeToggle, headerUser.firstChild);
        }
        
        // Add styles
        this.addThemeStyles();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize icons
        this.updateIcons();
    }
    
    addThemeStyles() {
        // Remove existing theme styles
        const existingStyle = document.getElementById('theme-system-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.id = 'theme-system-styles';
        style.textContent = `
            /* Theme Toggle Styles */
            .theme-toggle-container {
                position: relative;
                margin-right: 1rem;
                z-index: 1001;
            }
            
            .theme-toggle-btn {
                background: var(--background-secondary, #f3f4f6);
                border: 1px solid var(--border-color, #e5e7eb);
                border-radius: var(--radius-md, 0.5rem);
                padding: 0.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 2.5rem;
                height: 2.5rem;
                color: var(--text-secondary, #6b7280);
                box-shadow: var(--shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05));
            }
            
            .theme-toggle-btn:hover {
                background: var(--background-tertiary, #f9fafb);
                border-color: var(--border-hover, #d1d5db);
                color: var(--text-primary, #111827);
                transform: translateY(-1px);
                box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
            }
            
            .theme-toggle-btn:active {
                transform: translateY(0);
            }
            
            .theme-icon {
                width: 1.25rem;
                height: 1.25rem;
                transition: transform 0.3s ease;
            }
            
            .theme-toggle-btn:hover .theme-icon {
                transform: scale(1.1);
            }
            
            .theme-dropdown {
                position: absolute;
                top: calc(100% + 0.5rem);
                right: 0;
                background: var(--background-primary, #ffffff);
                border: 1px solid var(--border-color, #e5e7eb);
                border-radius: var(--radius-lg, 0.75rem);
                box-shadow: var(--shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.1));
                padding: 0.5rem;
                min-width: 180px;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px) scale(0.95);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
            }
            
            .theme-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }
            
            .theme-option {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                border-radius: var(--radius-md, 0.5rem);
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--text-primary, #111827);
                font-size: 0.875rem;
                font-weight: 500;
                position: relative;
                overflow: hidden;
            }
            
            .theme-option::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--primary-500, #3b82f6);
                opacity: 0;
                transition: opacity 0.2s ease;
                border-radius: inherit;
            }
            
            .theme-option:hover {
                background: var(--background-secondary, #f9fafb);
                color: var(--primary-600, #2563eb);
                transform: translateX(4px);
            }
            
            .theme-option:hover::before {
                opacity: 0.1;
            }
            
            .theme-option.active {
                background: var(--primary-100, #dbeafe);
                color: var(--primary-700, #1d4ed8);
                font-weight: 600;
            }
            
            .theme-option.active::after {
                content: '✓';
                margin-left: auto;
                font-weight: bold;
                color: var(--primary-600, #2563eb);
            }
            
            .theme-option i {
                width: 1rem;
                height: 1rem;
                flex-shrink: 0;
                z-index: 1;
                position: relative;
            }
            
            .theme-option span {
                z-index: 1;
                position: relative;
            }
            
            /* Smooth theme transitions */
            :root {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }

            body {
                transition: background-color 0.3s ease, color 0.3s ease;
            }

            /* Apply smooth transitions to all themed elements */
            .modern-header,
            .modern-sidebar,
            .modern-card,
            .modal-overlay,
            .modal-content,
            .form-field-enhanced input,
            .form-field-enhanced select,
            .form-field-enhanced textarea,
            .btn-secondary-modern,
            .table-enhanced,
            .search-input,
            .alert-enhanced,
            .badge-enhanced,
            .stat-card-enhanced {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }
            
            /* Dark theme specific fixes */
            [data-theme="dark"] {
                color-scheme: dark;
            }

            [data-theme="dark"] body {
                background-color: var(--background-secondary);
                color: var(--text-primary);
            }

            /* Fix all white backgrounds in dark mode */
            [data-theme="dark"] *:not(.lucide):not(svg):not(path) {
                border-color: var(--border-color);
            }
            
            [data-theme="dark"] .modern-header {
                background: var(--background-primary);
                border-color: var(--border-color);
                box-shadow: 0 1px 3px var(--shadow-color);
            }
            
            [data-theme="dark"] .modern-sidebar {
                background: var(--background-primary);
                border-color: var(--border-color);
                box-shadow: 1px 0 3px var(--shadow-color);
            }
            
            [data-theme="dark"] .nav-link {
                color: var(--text-secondary);
            }
            
            [data-theme="dark"] .nav-link:hover {
                background-color: var(--background-secondary);
                color: var(--text-primary);
            }
            
            [data-theme="dark"] .nav-link.active {
                background: var(--primary-600);
                color: white;
            }
            
            [data-theme="dark"] .modern-card {
                background: var(--background-primary);
                border-color: var(--border-color);
                box-shadow: 0 4px 6px var(--shadow-color);
            }
            
            [data-theme="dark"] .card-header {
                background: var(--background-secondary);
                border-color: var(--border-color);
            }
            
            [data-theme="dark"] .card-title {
                color: var(--text-primary);
            }
            
            [data-theme="dark"] .page-title {
                color: var(--text-primary);
            }
            
            [data-theme="dark"] .page-subtitle {
                color: var(--text-secondary);
            }
            
            [data-theme="dark"] .modal-overlay {
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(4px);
            }

            [data-theme="dark"] .modal-content {
                background: var(--background-primary) !important;
                border-color: var(--border-color) !important;
                box-shadow: 0 20px 25px var(--shadow-color) !important;
            }

            /* Fix modal sections */
            [data-theme="dark"] .modal-content > *,
            [data-theme="dark"] .modal-modern,
            [data-theme="dark"] .modal-modern .modal-content {
                background: var(--background-primary) !important;
                color: var(--text-primary) !important;
            }

            /* Fix modal backdrop */
            [data-theme="dark"] .modal-backdrop {
                background: rgba(0, 0, 0, 0.8) !important;
            }
            
            [data-theme="dark"] .modal-header {
                background: var(--background-secondary);
                border-color: var(--border-color);
            }
            
            [data-theme="dark"] .modal-header h3 {
                color: var(--text-primary);
            }
            
            [data-theme="dark"] .modal-footer {
                background: var(--background-secondary);
                border-color: var(--border-color);
            }
            
            [data-theme="dark"] .form-field-enhanced input,
            [data-theme="dark"] .form-field-enhanced select,
            [data-theme="dark"] .form-field-enhanced textarea,
            [data-theme="dark"] .form-input,
            [data-theme="dark"] .form-control,
            [data-theme="dark"] .form-select,
            [data-theme="dark"] input,
            [data-theme="dark"] select,
            [data-theme="dark"] textarea {
                background: var(--background-secondary) !important;
                border-color: var(--border-color) !important;
                color: var(--text-primary) !important;
            }

            [data-theme="dark"] .form-field-enhanced input::placeholder,
            [data-theme="dark"] .form-input::placeholder,
            [data-theme="dark"] input::placeholder,
            [data-theme="dark"] textarea::placeholder {
                color: var(--text-tertiary) !important;
            }
            
            [data-theme="dark"] .form-field-enhanced input::placeholder {
                color: var(--text-tertiary);
            }
            
            [data-theme="dark"] .form-field-enhanced input:focus,
            [data-theme="dark"] .form-field-enhanced select:focus,
            [data-theme="dark"] .form-field-enhanced textarea:focus {
                background: var(--background-primary);
                border-color: var(--primary-500);
                box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
            }
            
            [data-theme="dark"] .form-field-enhanced label {
                color: var(--text-primary);
            }
            
            [data-theme="dark"] .field-help {
                color: var(--text-tertiary);
            }
            
            [data-theme="dark"] .btn-secondary-modern,
            [data-theme="dark"] .btn-secondary {
                background: var(--background-secondary) !important;
                color: var(--text-primary) !important;
                border-color: var(--border-color) !important;
            }

            [data-theme="dark"] .btn-secondary-modern:hover,
            [data-theme="dark"] .btn-secondary:hover {
                background: var(--background-tertiary) !important;
                border-color: var(--border-hover) !important;
                color: var(--text-primary) !important;
            }
            
            [data-theme="dark"] .table-enhanced {
                background: var(--background-primary);
            }
            
            [data-theme="dark"] .table-enhanced thead th {
                background: var(--background-secondary);
                color: var(--text-primary);
                border-color: var(--border-color);
            }
            
            [data-theme="dark"] .table-enhanced tbody td {
                border-color: var(--border-color);
                color: var(--text-secondary);
            }
            
            [data-theme="dark"] .table-enhanced tbody tr:hover {
                background-color: var(--background-secondary);
            }
            
            [data-theme="dark"] .search-input {
                background: var(--background-secondary);
                border-color: var(--border-color);
                color: var(--text-primary);
            }
            
            [data-theme="dark"] .search-input::placeholder {
                color: var(--text-tertiary);
            }
            
            [data-theme="dark"] .search-input:focus {
                background: var(--background-primary);
                border-color: var(--primary-500);
            }
            
            [data-theme="dark"] .search-icon {
                color: var(--text-tertiary);
            }
            
            [data-theme="dark"] .stat-card-enhanced {
                background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 100%);
                border-color: var(--border-color);
                box-shadow: 0 4px 6px var(--shadow-color);
            }
            
            [data-theme="dark"] .stat-number {
                color: var(--text-primary);
            }
            
            [data-theme="dark"] .stat-label {
                color: var(--text-secondary);
            }
            
            [data-theme="dark"] .stat-change {
                border-color: var(--border-color);
                color: var(--text-secondary);
            }
            
            [data-theme="dark"] .user-name {
                color: var(--text-primary);
            }
            
            [data-theme="dark"] .user-email {
                color: var(--text-tertiary);
            }
            
            [data-theme="dark"] .text-muted {
                color: var(--text-tertiary) !important;
            }
            
            [data-theme="dark"] .loading-text {
                color: var(--text-secondary);
            }
            
            [data-theme="dark"] .empty-title {
                color: var(--text-primary);
            }
            
            [data-theme="dark"] .empty-description {
                color: var(--text-secondary);
            }
            
            [data-theme="dark"] .alert-enhanced {
                border-color: var(--border-color);
            }
            
            [data-theme="dark"] .alert-enhanced.success {
                background: linear-gradient(135deg, var(--success-50) 0%, rgba(16, 185, 129, 0.1) 100%);
                border-color: var(--success-300);
                color: var(--success-600);
            }
            
            [data-theme="dark"] .alert-enhanced.warning {
                background: linear-gradient(135deg, var(--warning-50) 0%, rgba(245, 158, 11, 0.1) 100%);
                border-color: var(--warning-300);
                color: var(--warning-600);
            }
            
            [data-theme="dark"] .alert-enhanced.error {
                background: linear-gradient(135deg, var(--error-50) 0%, rgba(239, 68, 68, 0.1) 100%);
                border-color: var(--error-300);
                color: var(--error-600);
            }
            
            /* Enhanced button themes */
            [data-theme="dark"] .btn-edit-enhanced {
                background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%);
                color: var(--primary-300);
                border-color: var(--primary-700);
            }
            
            [data-theme="dark"] .btn-password-enhanced {
                background: linear-gradient(135deg, var(--warning-900) 0%, var(--warning-800) 100%);
                color: var(--warning-300);
                border-color: var(--warning-700);
            }
            
            [data-theme="dark"] .btn-delete-enhanced {
                background: linear-gradient(135deg, var(--error-900) 0%, var(--error-800) 100%);
                color: var(--error-300);
                border-color: var(--error-700);
            }
            
            /* Badge themes */
            [data-theme="dark"] .badge-enhanced.primary,
            [data-theme="dark"] .badge {
                background: var(--primary-900) !important;
                color: var(--primary-300) !important;
                border-color: var(--primary-700) !important;
            }

            /* Fix progress bars */
            [data-theme="dark"] .progress,
            [data-theme="dark"] .progress-bar {
                background: var(--background-secondary) !important;
            }

            [data-theme="dark"] .progress .progress-bar {
                background: var(--primary-600) !important;
            }

            /* Fix form sections */
            [data-theme="dark"] .form-section,
            [data-theme="dark"] .section-header,
            [data-theme="dark"] .card-section {
                background: var(--background-primary) !important;
                border-color: var(--border-color) !important;
                color: var(--text-primary) !important;
            }

            /* Fix white sections in modals */
            [data-theme="dark"] .modal-body > div,
            [data-theme="dark"] .modal-content div {
                background-color: transparent !important;
            }

            [data-theme="dark"] .modal-body > div[style*="background"],
            [data-theme="dark"] .modal-content div[style*="background"] {
                background: var(--background-secondary) !important;
            }
            
            [data-theme="dark"] .badge-enhanced.success {
                background: var(--success-900);
                color: var(--success-300);
                border-color: var(--success-700);
            }
            
            [data-theme="dark"] .badge-enhanced.error {
                background: var(--error-900);
                color: var(--error-300);
                border-color: var(--error-700);
            }
            
            [data-theme="dark"] .role-admin {
                background: linear-gradient(135deg, var(--error-900) 0%, var(--error-800) 100%);
                color: var(--error-300);
                border-color: var(--error-600);
            }
            
            [data-theme="dark"] .role-user {
                background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%);
                color: var(--primary-300);
                border-color: var(--primary-600);
            }
            
            /* Mobile responsive adjustments */
            @media (max-width: 768px) {
                .theme-toggle-container {
                    margin-right: 0.5rem;
                }
                
                .theme-toggle-btn {
                    width: 2rem;
                    height: 2rem;
                    padding: 0.375rem;
                }
                
                .theme-dropdown {
                    min-width: 160px;
                    right: -0.5rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        const toggleBtn = document.getElementById('themeToggle');
        const dropdown = document.getElementById('themeDropdown');
        const themeOptions = document.querySelectorAll('.theme-option');
        
        if (!toggleBtn || !dropdown) return;
        
        // Toggle dropdown
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShown = dropdown.classList.contains('show');
            
            // Close all other dropdowns first
            document.querySelectorAll('.theme-dropdown.show').forEach(d => {
                if (d !== dropdown) d.classList.remove('show');
            });
            
            dropdown.classList.toggle('show', !isShown);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-toggle-container')) {
                dropdown.classList.remove('show');
            }
        });
        
        // Close dropdown on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdown.classList.remove('show');
            }
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
    }
    
    setTheme(theme) {
        const oldTheme = this.currentTheme;
        this.currentTheme = theme;
        
        if (theme === 'system') {
            localStorage.removeItem('stock-web-theme');
            this.applyTheme(this.getSystemTheme());
        } else {
            localStorage.setItem('stock-web-theme', theme);
            this.applyTheme(theme);
        }
        
        this.updateThemeIcon();
        this.updateActiveOption();
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { oldTheme, newTheme: theme }
        }));
        
        // Show feedback
        if (window.App && window.App.showToast) {
            const themeName = theme === 'system' ? 'Sistema' : this.themes[theme === 'system' ? this.getSystemTheme() : theme]?.name;
            window.App.showToast(`Tema alterado para: ${themeName}`, 'success', 2000);
        }
    }
    
    applyTheme(theme) {
        const actualTheme = theme === 'system' ? this.getSystemTheme() : theme;
        
        // Set data attribute on html element
        document.documentElement.setAttribute('data-theme', actualTheme);
        
        // Apply CSS variables
        const themeColors = this.themes[actualTheme]?.colors;
        if (!themeColors) {
            console.warn(`Theme "${actualTheme}" not found`);
            return;
        }
        
        const root = document.documentElement;
        
        // Apply all theme colors
        Object.entries(themeColors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        
        // Force repaint for better theme switching
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';

        // Force re-apply theme classes
        setTimeout(() => {
            this.forceThemeApplication(actualTheme);
        }, 100);
    }
    
    getCurrentThemeIcon() {
        if (this.currentTheme === 'system') {
            return 'monitor';
        }
        const actualTheme = this.currentTheme === 'system' ? this.getSystemTheme() : this.currentTheme;
        return this.themes[actualTheme]?.icon || 'sun';
    }
    
    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            const iconName = this.getCurrentThemeIcon();
            themeIcon.setAttribute('data-lucide', iconName);
            this.updateIcons();
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
    
    updateIcons() {
        // Update Lucide icons if available
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    listenToSystemChanges() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            if (this.currentTheme === 'system' || !this.getStoredTheme()) {
                this.applyTheme(this.getSystemTheme());
                this.updateThemeIcon();
            }
        });
    }
    
    forceThemeApplication(theme) {
        // Force all elements to respect the theme
        const elementsToFix = document.querySelectorAll(
            '.modal-content, .modal-body, .modal-header, .modal-footer, ' +
            'input, select, textarea, .form-control, .form-select, ' +
            '.card, .modern-card, .table, .modern-table'
        );

        elementsToFix.forEach(element => {
            // Remove any conflicting inline styles
            if (theme === 'dark') {
                if (element.style.backgroundColor === 'white' ||
                    element.style.backgroundColor === '#fff' ||
                    element.style.backgroundColor === '#ffffff') {
                    element.style.backgroundColor = '';
                }
                if (element.style.color === 'black' ||
                    element.style.color === '#000' ||
                    element.style.color === '#000000') {
                    element.style.color = '';
                }
            }
        });
    }

    // Public API methods
    getTheme() {
        return this.currentTheme;
    }
    
    getActualTheme() {
        return this.currentTheme === 'system' ? this.getSystemTheme() : this.currentTheme;
    }
    
    isDark() {
        return this.getActualTheme() === 'dark';
    }
    
    isLight() {
        return this.getActualTheme() === 'light';
    }
}

// Initialize theme system
let themeSystemInstance = null;

function initThemeSystem() {
    if (!themeSystemInstance) {
        themeSystemInstance = new ThemeSystem();
    }
    return themeSystemInstance;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeSystem);
} else {
    initThemeSystem();
}

// Make available globally
window.ThemeSystem = ThemeSystem;
window.themeSystem = () => themeSystemInstance || initThemeSystem();

// Global function to force theme refresh
window.forceThemeRefresh = function() {
    const themeSystem = window.themeSystem();
    if (themeSystem) {
        const currentTheme = themeSystem.getTheme();
        themeSystem.applyTheme(currentTheme);
        console.log('Theme refreshed:', currentTheme);
        return true;
    }
    return false;
};

// Global function to toggle theme
window.toggleTheme = function() {
    const themeSystem = window.themeSystem();
    if (themeSystem) {
        const currentTheme = themeSystem.getActualTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        themeSystem.setTheme(newTheme);
        return newTheme;
    }
    return null;
};

// Compatibility with existing code
document.addEventListener('DOMContentLoaded', () => {
    // Re-initialize icons after theme system is loaded
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 100);
});
