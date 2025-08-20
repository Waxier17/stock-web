// Auto-inject dark theme fixes CSS
(function() {
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
})();

// Also provide a function to force theme reapplication
window.forceThemeRefresh = function() {
    const themeSystem = window.themeSystem && window.themeSystem();
    if (themeSystem) {
        const currentTheme = themeSystem.getTheme();
        themeSystem.applyTheme(currentTheme);
        console.log('Theme refreshed:', currentTheme);
    }
};
