// DOM Elements
const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

// Admin credentials
const ADMIN_USERNAME = "ANI";
const ADMIN_PASSWORD = "Ani@2003";

// Toggle password visibility
togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Form submission handler
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Store login status in sessionStorage
        sessionStorage.setItem('adminAuthenticated', 'true');
        
        // Redirect to admin panel
        window.location.href = 'admin.html';
    } else {
        showMessage('Invalid username or password!', 'error');
    }
});

// Check if already logged in (redirect if already authenticated)
if (sessionStorage.getItem('adminAuthenticated') === 'true') {
    window.location.href = 'admin.html';
}
