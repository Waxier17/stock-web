// ===== SISTEMA DE TEMA UNIFICADO - STOCK WEB =====
// Única fonte de verdade para controle de temas

class UnifiedThemeSystem {
    constructor() {
        this.isInitialized = false;
        this.isApplying = false;
        this.debounceTimeout = null;
        
        this.themes = {
            light: {
                name: 'Claro',
                icon: 'sun',
                vars: {
                    '--background-primary': '#ffffff',
                    '--background-secondary': '#f9fafb',
                    '--background-tertiary': '#f3f4f6',
                    '--text-primary': '#111827',
                    '--text-secondary': '#6b7280',
                    '--text-tertiary': '#9ca3af',
                    '--border-color': '#e5e7eb',
                    '--border-hover': '#d1d5db',
                    '--primary-500': '#3b82f6',
                    '--primary-600': '#2563eb',
                    '--primary-700': '#1d4ed8',
                    '--success-500': '#10b981',
                    '--success-600': '#059669',
                    '--warning-500': '#f59e0b',
                    '--warning-600': '#d97706',
                    '--error-500': '#ef4444',
                    '--error-600': '#dc2626'
                }
            },
            dark: {
                name: 'Escuro',
                icon: 'moon',
                vars: {
                    '--background-primary': '#111827',
                    '--background-secondary': '#1f2937',
                    '--background-tertiary': '#374151',
                    '--text-primary': '#f9fafb',
                    '--text-secondary': '#d1d5db',
                    '--text-tertiary': '#9ca3af',
                    '--border-color': '#374151',
                    '--border-hover': '#4b5563',
                    '--primary-500': '#60a5fa',
                    '--primary-600': '#3b82f6',
                    '--primary-700': '#2563eb',
                    '--success-500': '#34d399',
                    '--success-600': '#10b981',
                    '--warning-500': '#fbbf24',
                    '--warning-600': '#f59e0b',
                    '--error-500': '#f87171',
                    '--error-600': '#ef4444'
                }
            }
        };
        
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        console.log('🎨 Inicializando Sistema de Tema Unificado');
        
        // Aplicar tema inicial imediatamente
        this.applyTheme(this.currentTheme, true);

        // Marcar página como pronta para prevenir flicker
        document.documentElement.classList.add('theme-ready');

        // Setup event listeners
        this.setupEventListeners();
        
        // Configurar observer para mudanças do sistema
        this.setupSystemThemeObserver();
        
        this.isInitialized = true;
        
        // Auto-inject theme control if not present
        this.autoInjectThemeControl();

        // Dispatch evento de inicialização
        window.dispatchEvent(new CustomEvent('themeSystemReady', {
            detail: { theme: this.currentTheme }
        }));
    }
    
    getStoredTheme() {
        try {
            return localStorage.getItem('stock-web-theme');
        } catch (e) {
            console.warn('Erro ao acessar localStorage para tema:', e);
            return null;
        }
    }
    
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    setTheme(theme, silent = false) {
        if (this.isApplying) {
            console.log('Tema já sendo aplicado, ignorando chamada duplicada');
            return;
        }
        
        const oldTheme = this.currentTheme;
        this.currentTheme = theme;
        
        // Salvar no localStorage
        try {
            if (theme === 'system') {
                localStorage.removeItem('stock-web-theme');
                this.applyTheme(this.getSystemTheme());
            } else {
                localStorage.setItem('stock-web-theme', theme);
                this.applyTheme(theme);
            }
        } catch (e) {
            console.warn('Erro ao salvar tema no localStorage:', e);
        }
        
        if (!silent) {
            // Dispatch evento de mudança
            window.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { oldTheme, newTheme: theme }
            }));
            
            // Mostrar notificação
            this.showThemeNotification(theme);
        }
        
        this.updateUI();
    }
    
    applyTheme(theme, immediate = false) {
        if (this.isApplying && !immediate) {
            console.log('Aplicação de tema já em andamento');
            return;
        }
        
        this.isApplying = true;
        
        // Debounce para evitar múltiplas aplicações
        clearTimeout(this.debounceTimeout);
        
        const applyFunction = () => {
            try {
                const actualTheme = theme === 'system' ? this.getSystemTheme() : theme;
                console.log(`🎨 Aplicando tema: ${actualTheme}`);
                
                // 1. Definir atributo data-theme
                document.documentElement.setAttribute('data-theme', actualTheme);
                
                // 2. Aplicar variáveis CSS
                const themeVars = this.themes[actualTheme]?.vars;
                if (themeVars) {
                    const root = document.documentElement;
                    Object.entries(themeVars).forEach(([property, value]) => {
                        root.style.setProperty(property, value);
                    });
                }
                
                // 3. Aplicar correções específicas
                this.applyThemeCorrections(actualTheme);
                
                // 4. Forçar repaint
                this.forceRepaint();
                
                console.log(`✅ Tema ${actualTheme} aplicado com sucesso`);
                
            } catch (error) {
                console.error('Erro ao aplicar tema:', error);
            } finally {
                this.isApplying = false;
            }
        };
        
        if (immediate) {
            applyFunction();
        } else {
            this.debounceTimeout = setTimeout(applyFunction, 100);
        }
    }
    
    applyThemeCorrections(theme) {
        if (theme === 'dark') {
            // Correções específicas para tema escuro
            this.fixDarkThemeElements();
        }
    }
    
    fixDarkThemeElements() {
        // Corrigir elementos problemáticos sem usar querySelectorAll massivo
        const selectors = [
            '.modern-card', '.card', '.stat-card-enhanced',
            '.modal-content', '.modal-body', '.modal-header',
            '.form-input', '.form-control', '.form-select',
            '.alert', '.badge', '.btn'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Remover estilos inline problemáticos
                if (element.style.backgroundColor === 'white' || 
                    element.style.backgroundColor === '#fff' ||
                    element.style.backgroundColor === 'rgb(255, 255, 255)') {
                    element.style.backgroundColor = '';
                }
                
                if (element.style.color === 'black' || 
                    element.style.color === '#000' ||
                    element.style.color === 'rgb(0, 0, 0)') {
                    element.style.color = '';
                }
            });
        });
    }
    
    forceRepaint() {
        // Método otimizado para forçar repaint
        document.body.style.transform = 'translateZ(0)';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.transform = '';
    }
    
    setupEventListeners() {
        // Event listener para toggle de tema
        document.addEventListener('click', (e) => {
            if (e.target.closest('#themeToggle, .theme-toggle-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDropdown();
            }
        });

        // Event listener para opções do dropdown
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-option')) {
                e.preventDefault();
                e.stopPropagation();
                const option = e.target.closest('.theme-option');
                const theme = option.dataset.theme;
                this.setTheme(theme);
                this.closeDropdown();
            }
        });

        // Fechar dropdown clicando fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-toggle-container')) {
                this.closeDropdown();
            }
        });

        // Listener para mudanças de conteúdo
        this.setupContentObserver();
    }
    
    setupContentObserver() {
        // Observer otimizado para mudanças de conteúdo
        let observerTimeout = null;
        
        const observer = new MutationObserver((mutations) => {
            if (this.isApplying) return;
            
            let shouldFix = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Verificar se elementos importantes foram adicionados
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && 
                            (node.classList?.contains('modal') ||
                             node.classList?.contains('card') ||
                             node.querySelector?.('.modal, .card'))) {
                            shouldFix = true;
                        }
                    });
                }
            });
            
            if (shouldFix && this.currentTheme === 'dark') {
                clearTimeout(observerTimeout);
                observerTimeout = setTimeout(() => {
                    this.fixDarkThemeElements();
                }, 300);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: false // Scope reduzido
        });
    }
    
    setupSystemThemeObserver() {
        // Observer para mudanças do tema do sistema
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (this.currentTheme === 'system' || !this.getStoredTheme()) {
                    this.applyTheme(this.getSystemTheme());
                    this.updateUI();
                }
            });
        }
    }
    
    toggleTheme() {
        const currentActual = this.currentTheme === 'system' ? this.getSystemTheme() : this.currentTheme;
        const newTheme = currentActual === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    toggleDropdown() {
        const dropdown = document.getElementById('themeDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    closeDropdown() {
        const dropdown = document.getElementById('themeDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }
    
    updateUI() {
        // Atualizar ícones de tema
        this.updateThemeIcons();
        
        // Atualizar controles de tema
        this.updateThemeControls();
        
        // Re-inicializar ícones Lucide se disponível
        if (typeof lucide !== 'undefined') {
            try {
                lucide.createIcons();
            } catch (e) {
                console.warn('Erro ao re-inicializar ícones Lucide:', e);
            }
        }
    }
    
    updateThemeIcons() {
        const actualTheme = this.currentTheme === 'system' ? this.getSystemTheme() : this.currentTheme;
        const iconName = this.themes[actualTheme]?.icon || 'sun';

        // Atualizar ícone do botão principal
        document.querySelectorAll('.theme-icon').forEach(icon => {
            icon.setAttribute('data-lucide', iconName);
        });
    }

    updateThemeControls() {
        // Atualizar opções ativas no dropdown
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === this.currentTheme);
        });

        // Atualizar inputs de radio se existirem
        document.querySelectorAll('input[name="theme"]').forEach(input => {
            input.checked = input.value === this.currentTheme;
        });
    }
    
    showThemeNotification(theme) {
        const themeName = theme === 'system' ? 'Sistema' : this.themes[theme === 'system' ? this.getSystemTheme() : theme]?.name;
        
        if (window.App && window.App.showToast) {
            window.App.showToast(`Tema alterado para: ${themeName}`, 'success', 2000);
        }
    }
    
    // API Pública
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
    
    refresh() {
        console.log('🔄 Refrescando tema...');
        this.applyTheme(this.currentTheme, true);
    }

    autoInjectThemeControl() {
        // Check if theme control already exists
        if (document.getElementById('themeToggle')) {
            return;
        }

        // Find header-user element
        const headerUser = document.querySelector('.header-user');
        if (!headerUser) {
            return;
        }

        console.log('🎨 Auto-injecting theme control...');

        // Create theme control HTML
        const themeControl = document.createElement('div');
        themeControl.className = 'theme-toggle-container';
        themeControl.innerHTML = `
            <button class="theme-toggle-btn" id="themeToggle" title="Alternar tema">
                <i data-lucide="sun" class="theme-icon"></i>
            </button>
            <div class="theme-dropdown" id="themeDropdown">
                <button class="theme-option active" data-theme="light">
                    <i data-lucide="sun" class="theme-option-icon"></i>
                    <span>Claro</span>
                </button>
                <button class="theme-option" data-theme="dark">
                    <i data-lucide="moon" class="theme-option-icon"></i>
                    <span>Escuro</span>
                </button>
                <button class="theme-option" data-theme="system">
                    <i data-lucide="monitor" class="theme-option-icon"></i>
                    <span>Sistema</span>
                </button>
            </div>
        `;

        // Find the best position to insert
        const logoutBtn = headerUser.querySelector('#logoutBtn, .btn-sm');

        if (logoutBtn) {
            // Insert before logout button
            headerUser.insertBefore(themeControl, logoutBtn);
        } else {
            // Append to header-user
            headerUser.appendChild(themeControl);
        }

        // Update UI after injection
        this.updateUI();
    }
}

// ===== INICIALIZAÇÃO E CONTROLE GLOBAL =====

// Prevenir múltiplas inicializações
if (window.unifiedThemeSystem) {
    console.warn('Sistema de tema já inicializado');
} else {
    let themeSystemInstance = null;
    
    function initUnifiedTheme() {
        if (!themeSystemInstance) {
            themeSystemInstance = new UnifiedThemeSystem();
        }
        return themeSystemInstance;
    }
    
    // Inicialização imediata ou quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUnifiedTheme);
    } else {
        initUnifiedTheme();
    }
    
    // API Global
    window.unifiedThemeSystem = () => themeSystemInstance || initUnifiedTheme();
    window.toggleTheme = () => window.unifiedThemeSystem().toggleTheme();
    window.refreshTheme = () => window.unifiedThemeSystem().refresh();
    
    // Compatibilidade com scripts antigos
    window.themeSystem = window.unifiedThemeSystem;
    window.forceThemeRefresh = window.refreshTheme;
}

console.log('🎨 Sistema de Tema Unificado carregado');
