// js/auth.js

// Redirect if already logged in
if (Storage.isLoggedIn()) {
    window.location.replace('dashboard.html');
}

// Login form handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    clearErrors();
    
    if (!email) {
        showError('emailError', 'Email is required');
        return;
    }

    if (!isValidEmail(email)) {
        showError('emailError', 'Enter a valid email address (example@gmail.com)');
        return;
    }

    if (!password) {
        showError('passwordError', 'Password is required');
        return;
    }

    if (password.length < 5) {
        showError('passwordError', 'Password must be at least 5 characters');
        return;
    }

    showLoading(true);

    try {
        const result = await apiCall(API_CONFIG.ENDPOINTS.LOGIN, 'POST', {
            email: email.toLowerCase(),
            password: password
        });

        if (result.success) {
            // Save user data
            Storage.setUser({
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                memberSince: formatMemberSince(result.user.created_at)
            });

            // Clear form
            document.getElementById('loginForm').reset();

            // Redirect to dashboard
            window.location.replace('dashboard.html');
        } else {
           showError('emailError', result.message || 'Login failed');
        }
    } catch (error) {
        showError('emailError', 'Network error: ' + error.message);
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
    const loginBtn = document.getElementById('loginBtn');
    
    if (btnText) btnText.style.display = show ? 'none' : 'inline';
    if (btnLoader) btnLoader.classList.toggle('hidden', !show);
    if (loginBtn) loginBtn.disabled = show;
}

function formatMemberSince(createdAt) {
    if (!createdAt) return '2024';
    
    try {
        const date = new Date(createdAt);
        const options = { year: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    } catch (e) {
        return createdAt.substring(0, 4);
    }
}