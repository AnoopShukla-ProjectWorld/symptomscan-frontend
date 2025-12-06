// js/dashboard.js

// Check authentication
if (!checkAuth()) {
    window.location.href = 'index.html';
}

// Load user data
const user = Storage.getUser();
if (user) {
    document.getElementById('userName').textContent = user.name;
}

// Load stats from backend and localStorage
loadStats();

async function loadStats() {
    try {
        // Get actual count from backend
        const result = await apiCall(`${API_CONFIG.ENDPOINTS.HISTORY}/${user.id}`);
        
        // Set total predictions from actual history count
        const totalCount = result.history ? result.history.length : 0;
        localStorage.setItem('totalPredictions', totalCount.toString());
        document.getElementById('totalPredictions').textContent = totalCount;
    } catch (error) {
        // Fallback to localStorage if backend fails
        console.error('Error fetching history count:', error);
        const stats = localStorage.getItem('totalPredictions') || '0';
        document.getElementById('totalPredictions').textContent = stats;
    }
    
    // Get last check from localStorage
    const lastCheck = localStorage.getItem('lastCheck') || 'Never';
    document.getElementById('lastCheck').textContent = lastCheck;
}

// Mobile menu toggle
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});