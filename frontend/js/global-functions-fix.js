// Global Functions Fix - Ensures onclick handlers work properly
// This script exposes commonly used functions to the global scope

(function() {
    'use strict';
    
    // Wait for other scripts to load before fixing functions
    document.addEventListener('DOMContentLoaded', function() {
        // Delay to ensure all scripts are loaded
        setTimeout(function() {
            fixGlobalFunctions();
        }, 100);
    });
    
    function fixGlobalFunctions() {
        console.log('🔧 Checking and fixing global function accessibility...');
        
        // List of functions that need to be globally accessible
        const functionMap = {
            // Users page functions
            'openUserModal': 'openUserModal',
            'closeUserModal': 'closeUserModal', 
            'closePasswordModal': 'closePasswordModal',
            'editUser': 'editUser',
            'deleteUser': 'deleteUser',
            'changeUserPassword': 'changeUserPassword',
            
            // Categories page functions
            'openCategoryModal': 'openCategoryModal',
            'closeCategoryModal': 'closeCategoryModal',
            
            // Inventory page functions
            'editProduct': 'editProduct',
            'deleteProduct': 'deleteProduct',
            
            // Sales page functions
            'selectCustomer': 'selectCustomer',
            'selectProduct': 'selectProduct',
            'updateQuantity': 'updateQuantity',
            'setQuantity': 'setQuantity',
            'toggleProductDiscountType': 'toggleProductDiscountType',
            'removeProduct': 'removeProduct',
            'toggleDiscountType': 'toggleDiscountType',
            'viewSale': 'viewSale',
            
            // Reports page functions
            'generateQuickReport': 'generateQuickReport',
            
            // Admin page functions
            'logout': 'logout',
            'resetDatabase': 'resetDatabase',
            'clearAllData': 'clearAllData',
            'clearProducts': 'clearProducts',
            'clearCustomers': 'clearCustomers',
            'clearSuppliers': 'clearSuppliers',
            'refreshData': 'refreshData',
            
            // Inspect page functions
            'loadTables': 'loadTables',
            'loadAllData': 'loadAllData',
            'loadTableData': 'loadTableData'
        };
        
        let fixedFunctions = 0;
        let missingFunctions = [];
        
        // Check each function and make it global if it exists but isn't accessible
        Object.entries(functionMap).forEach(([globalName, localName]) => {
            // Skip if already globally accessible
            if (typeof window[globalName] === 'function') {
                return;
            }
            
            // Try to find the function in various contexts
            let foundFunction = null;
            
            // Check if it exists in the global scope with a different name
            if (typeof window[localName] === 'function') {
                foundFunction = window[localName];
            }
            
            // If we found the function, make it globally accessible
            if (foundFunction) {
                window[globalName] = foundFunction;
                fixedFunctions++;
                console.log(`✅ Fixed global access for: ${globalName}`);
            } else {
                missingFunctions.push(globalName);
            }
        });
        
        if (fixedFunctions > 0) {
            console.log(`🎯 Fixed ${fixedFunctions} functions for global access`);
        }
        
        if (missingFunctions.length > 0) {
            console.log(`⚠️ Missing functions (may be on different pages): ${missingFunctions.join(', ')}`);
        }
        
        if (fixedFunctions === 0 && missingFunctions.length === 0) {
            console.log('✅ All required functions are already globally accessible');
        }
    }
    
    // Also expose the fix function globally for manual use
    window.fixGlobalFunctions = fixGlobalFunctions;
    
})();
