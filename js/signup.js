// js/signup.js

// Redirect if already logged in
if (Storage.isLoggedIn()) {
    window.location.replace('dashboard.html');
}

// Signup form handler
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Clear previous errors
    clearErrors();

    // Validation
    if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        return;
    }

    if (!isValidEmail(email)) {
        showError('emailError', 'Enter a valid email address (example@gmail.com)');
        return;
    }

    if (password.length < 5) {
        showError('passwordError', 'Password must be at least 5 characters');
        return;
    }

    if (password !== confirmPassword) {
        showError('confirmError', 'Passwords do not match');
        return;
    }

    showLoading(true);

    try {
        const result = await apiCall(API_CONFIG.ENDPOINTS.REGISTER, 'POST', {
            name, 
            email: email.toLowerCase(), 
            password
        });

        if (result.success) {
            alert('Account created successfully! Please login.');
            document.getElementById('signupForm').reset();
            window.location.replace('index.html');
        } else {
            showError('emailError', result.message || 'Registration failed');
        }
    } catch (error) {
        alert('Registration failed: ' + error.message);
    } finally {
        showLoading(false);
    }
});

function showError(id, message) {
    const errorElement = document.getElementById(id);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

function showLoading(show) {
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const signupBtn = document.getElementById('signupBtn');
    
    if (btnText) btnText.style.display = show ? 'none' : 'inline';
    if (btnLoader) btnLoader.classList.toggle('hidden', !show);
    if (signupBtn) signupBtn.disabled = show;
}