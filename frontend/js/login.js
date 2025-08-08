// Login functionality for Stock Web Application

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Get form and error message elements
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get username and password values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Hide any previous error messages
        errorMessage.style.display = 'none';
        
        // Validate input
        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }
        
        // Create login data object
        const loginData = {
            username: username,
            password: password
        };
        
        // Send login request to API
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error || 'Login failed');
                });
            }
            return response.json();
        })
        .then(data => {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to dashboard
            window.location.href = '/dashboard.html';
        })
        .catch(error => {
            showError(error.message);
        });
    });
    
    // Function to show error messages
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});