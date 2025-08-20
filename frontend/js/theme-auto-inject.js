// Auto-inject theme control if not present
(function() {
    'use strict';
    
    function injectThemeControl() {
        // Check if theme control already exists
        if (document.getElementById('themeToggle')) {
            console.log('🎨 Theme control already exists');
            return;
        }
        
        // Find header-user element
        const headerUser = document.querySelector('.header-user');
        if (!headerUser) {
            console.log('📄 No header-user found, skipping theme injection');
            return;
        }
        
        console.log('🎨 Injecting theme control...');
        
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
        const userAvatar = headerUser.querySelector('.user-avatar');
        
        if (logoutBtn) {
            // Insert before logout button
            headerUser.insertBefore(themeControl, logoutBtn);
        } else if (userAvatar) {
            // Insert after user avatar
            userAvatar.parentNode.insertBefore(themeControl, userAvatar.nextSibling);
        } else {
            // Append to header-user
            headerUser.appendChild(themeControl);
        }
        
        // Re-initialize Lucide icons if available
        if (typeof lucide !== 'undefined') {
            try {
                lucide.createIcons();
            } catch (e) {
                console.warn('Error re-initializing Lucide icons:', e);
            }
        }
        
        console.log('✅ Theme control injected successfully');
    }
    
    // Inject theme control when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectThemeControl);
    } else {
        injectThemeControl();
    }
    
    // Also run after a short delay to ensure everything is loaded
    setTimeout(injectThemeControl, 500);
    
})();
