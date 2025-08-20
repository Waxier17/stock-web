// Emergency white box fix - can be run manually
let isEmergencyFixing = false;

window.emergencyFixWhiteBoxes = function() {
    if (isEmergencyFixing) {
        console.log('🚨 Emergency fix already running, skipping...');
        return 0;
    }

    isEmergencyFixing = true;
    console.log('🚨 Running emergency white box fixes...');
    
    // Force dark theme data attribute
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Only target specific problematic elements instead of all elements
    const targetSelectors = [
        '.modern-card', '.card', '.stat-card',
        '.modal-content', '.modal-body', '.modal-header',
        '.form-input', '.form-control', '.alert', '.badge',
        '.action-section', '#lowStockAlert > div'
    ];

    const allElements = document.querySelectorAll(targetSelectors.join(','));
    let fixedCount = 0;

    allElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;
        
        // List of problematic background colors
        const whiteBgs = [
            'rgb(255, 255, 255)',
            'white',
            '#fff',
            '#ffffff',
            'rgba(255, 255, 255, 1)',
            'rgb(255, 251, 235)', // #fffbeb - warning yellow
            '#fffbeb'
        ];
        
        if (whiteBgs.includes(bgColor) || whiteBgs.includes(element.style.backgroundColor)) {
            // Apply dark theme styles
            element.style.setProperty('background-color', '#111827', 'important'); // --background-primary
            element.style.setProperty('color', '#f9fafb', 'important'); // --text-primary
            element.style.setProperty('border-color', '#374151', 'important'); // --border-color
            
            fixedCount++;
            console.log(`Fixed element: ${element.tagName}.${element.className}`);
        }
        
        // Fix text colors
        const textColor = style.color;
        if (textColor === 'rgb(0, 0, 0)' || textColor === 'black' || textColor === '#000') {
            element.style.setProperty('color', '#f9fafb', 'important');
        }
    });
    
    // Fix specific known problematic selectors
    const specificSelectors = [
        '.stat-card',
        '.modern-card', 
        '.card',
        '.card-body',
        '.card-header',
        '.alert',
        '.action-section',
        '#lowStockAlert > div'
    ];
    
    specificSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.setProperty('background-color', '#111827', 'important');
            element.style.setProperty('color', '#f9fafb', 'important');
            element.style.setProperty('border-color', '#374151', 'important');
            fixedCount++;
        });
    });
    
    console.log(`✅ Emergency fix complete! Fixed ${fixedCount} elements.`);

    // Force a repaint (less aggressive)
    document.documentElement.style.transform = 'translateZ(0)';
    document.documentElement.offsetHeight;
    document.documentElement.style.transform = '';

    // Reset flag
    setTimeout(() => {
        isEmergencyFixing = false;
    }, 1000);

    return fixedCount;
};

// Auto-run on dark theme with debouncing
let emergencyTimeout = null;

document.addEventListener('DOMContentLoaded', function() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        clearTimeout(emergencyTimeout);
        emergencyTimeout = setTimeout(() => {
            window.emergencyFixWhiteBoxes();
        }, 1000); // Longer delay to let other systems settle
    }
});

// Run when theme changes with debouncing
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' &&
            mutation.attributeName === 'data-theme' &&
            mutation.target === document.documentElement) {

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                clearTimeout(emergencyTimeout);
                emergencyTimeout = setTimeout(() => {
                    window.emergencyFixWhiteBoxes();
                }, 500); // Debounced delay
            }
        }
    });
});

observer.observe(document.documentElement, { 
    attributes: true, 
    attributeFilter: ['data-theme'] 
});

console.log('🚨 Emergency white box fix loaded. Use emergencyFixWhiteBoxes() to run manually.');
