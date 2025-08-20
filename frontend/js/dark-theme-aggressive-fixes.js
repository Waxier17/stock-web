// Aggressive dark theme fixes for white boxes
(function() {
    'use strict';

    function removeWhiteBackgrounds() {
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (!isDarkTheme) return;

        console.log('🔧 Applying aggressive dark theme fixes...');

        // Find all elements with white/light backgrounds
        const allElements = document.querySelectorAll('*:not(svg):not(path):not(.lucide)');
        
        allElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const inlineStyle = element.style;
            
            // Check for white backgrounds
            const bgColor = computedStyle.backgroundColor;
            const inlineBgColor = inlineStyle.backgroundColor;
            
            if (bgColor === 'rgb(255, 255, 255)' || 
                bgColor === 'white' ||
                inlineBgColor === 'white' ||
                inlineBgColor === '#fff' ||
                inlineBgColor === '#ffffff' ||
                inlineBgColor === 'rgb(255, 255, 255)') {
                
                // Force dark background
                element.style.setProperty('background-color', 'var(--background-primary)', 'important');
                element.style.setProperty('color', 'var(--text-primary)', 'important');
                
                console.log('🎨 Fixed white background on:', element.tagName, element.className);
            }
            
            // Fix light yellow/warning backgrounds
            if (bgColor === 'rgb(255, 251, 235)' || // #fffbeb
                inlineBgColor === '#fffbeb') {
                element.style.setProperty('background-color', 'var(--background-secondary)', 'important');
                element.style.setProperty('color', 'var(--text-primary)', 'important');
                element.style.setProperty('border-color', 'var(--warning-600)', 'important');
            }
            
            // Fix black text
            const textColor = computedStyle.color;
            const inlineColor = inlineStyle.color;
            
            if (textColor === 'rgb(0, 0, 0)' || 
                textColor === 'black' ||
                inlineColor === 'black' ||
                inlineColor === '#000' ||
                inlineColor === '#000000' ||
                inlineColor === 'rgb(0, 0, 0)') {
                
                element.style.setProperty('color', 'var(--text-primary)', 'important');
            }
        });

        // Fix specific known problematic elements
        fixSpecificElements();
    }

    function fixSpecificElements() {
        // Fix stat cards
        const statCards = document.querySelectorAll('.stat-card, .modern-card, .card');
        statCards.forEach(card => {
            card.style.setProperty('background-color', 'var(--background-primary)', 'important');
            card.style.setProperty('color', 'var(--text-primary)', 'important');
            card.style.setProperty('border-color', 'var(--border-color)', 'important');
        });

        // Fix alert boxes
        const alerts = document.querySelectorAll('#lowStockAlert > div, .alert-warning, .alert');
        alerts.forEach(alert => {
            alert.style.setProperty('background-color', 'var(--background-secondary)', 'important');
            alert.style.setProperty('color', 'var(--text-primary)', 'important');
            alert.style.setProperty('border-color', 'var(--warning-600)', 'important');
        });

        // Fix action sections
        const actionSections = document.querySelectorAll('.action-section, .quick-actions-grid > div');
        actionSections.forEach(section => {
            section.style.setProperty('background-color', 'var(--background-primary)', 'important');
            section.style.setProperty('border-color', 'var(--border-color)', 'important');
        });

        // Fix card bodies and headers
        const cardElements = document.querySelectorAll('.card-body, .card-header');
        cardElements.forEach(element => {
            element.style.setProperty('background-color', 'var(--background-primary)', 'important');
            element.style.setProperty('color', 'var(--text-primary)', 'important');
        });

        console.log('✅ Aggressive fixes applied to specific elements');
    }

    // Run fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeWhiteBackgrounds);
    } else {
        removeWhiteBackgrounds();
    }

    // Run fixes when theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'data-theme' &&
                mutation.target === document.documentElement) {
                
                setTimeout(removeWhiteBackgrounds, 100);
            }
        });
    });

    observer.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: ['data-theme'] 
    });

    // Debounced content observer to prevent excessive executions
    let contentFixTimeout = null;
    let isFixing = false;

    function debouncedContentFix() {
        if (isFixing) return;

        clearTimeout(contentFixTimeout);
        contentFixTimeout = setTimeout(() => {
            const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDarkTheme && !isFixing) {
                isFixing = true;
                removeWhiteBackgrounds();
                setTimeout(() => {
                    isFixing = false;
                }, 2000); // Prevent rapid re-execution
            }
        }, 300); // Increased delay
    }

    // Only watch for major content changes
    const contentObserver = new MutationObserver((mutations) => {
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        if (!isDarkTheme) return;

        let shouldFix = false;
        mutations.forEach((mutation) => {
            // Only fix for modal or significant additions
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 &&
                        (node.classList?.contains('modal') ||
                         node.classList?.contains('card') ||
                         node.tagName === 'TR' ||
                         node.querySelector?.('.modal, .card'))) {
                        shouldFix = true;
                    }
                });
            }
        });

        if (shouldFix) {
            debouncedContentFix();
        }
    });

    contentObserver.observe(document.body, {
        childList: true,
        subtree: false // Reduced scope to prevent excessive triggers
    });

    // Expose global function for manual fixes
    window.fixWhiteBoxes = removeWhiteBackgrounds;

    console.log('🌙 Aggressive dark theme fixes initialized');
})();
