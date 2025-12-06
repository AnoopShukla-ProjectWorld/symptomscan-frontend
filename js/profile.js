// js/profile.js

// Check authentication
if (!checkAuth()) {
    window.location.href = 'index.html';
}

// Load user data
const user = Storage.getUser();
if (user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    
    // Set avatar initial
    const initial = user.name.charAt(0).toUpperCase();
    document.getElementById('avatar').textContent = initial;
    
    // Set member since
    const memberSince = user.memberSince || localStorage.getItem('memberSince') || '2024';
    document.getElementById('memberSince').textContent = memberSince;
}

function editProfile() {
    const newName = prompt('Enter new name:', user.name);
    if (!newName || newName.trim() === '') return;

    const newEmail = prompt('Enter new email:', user.email);
    if (!newEmail || newEmail.trim() === '') return;

    if (!isValidEmail(newEmail)) {
        alert('Please enter a valid email address');
        return;
    }

    updateProfile(newName.trim(), newEmail.trim());
}

async function updateProfile(name, email) {
    try {
        const result = await apiCall(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, 'POST', {
            user_id: user.id,
            name: name,
            email: email
        });

        if (result.status === 'success') {
            // Update local storage
            user.name = name;
            user.email = email;
            Storage.setUser(user);

            // Update UI
            document.getElementById('userName').textContent = name;
            document.getElementById('userEmail').textContent = email;
            document.getElementById('avatar').textContent = name.charAt(0).toUpperCase();

            alert('Profile updated successfully!');
        } else {
            alert(result.message || 'Failed to update profile');
        }
    } catch (error) {
        alert('Error updating profile: ' + error.message);
    }
}

function changePassword() {
    const currentPassword = prompt('Enter current password:');
    if (!currentPassword) return;

    const newPassword = prompt('Enter new password (min 5 characters):');
    if (!newPassword || newPassword.length < 5) {
        alert('Password must be at least 5 characters');
        return;
    }

    const confirmPassword = prompt('Confirm new password:');
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    updatePassword(currentPassword, newPassword);
}

async function updatePassword(currentPassword, newPassword) {
    try {
        const result = await apiCall(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, 'POST', {
            user_id: user.id,
            current_password: currentPassword,
            new_password: newPassword
        });

        if (result.status === 'success') {
            alert('Password changed successfully!');
        } else {
            alert(result.message || 'Failed to change password');
        }
    } catch (error) {
        alert('Error changing password: ' + error.message);
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        Storage.logout();
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Mobile menu toggle
function toggleMenu() {
    document.querySelector('.nav-menu').classList.toggle('active');
}