// js/config.js
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000',
    // BASE_URL: 'https://symptomscan-backend.onrender.com',
    ENDPOINTS: {
        LOGIN: '/api/login',
        REGISTER: '/api/register',
        SYMPTOMS: '/api/symptoms',
        PREDICT: '/api/predict',
        HISTORY: '/api/history',
        SAVE_PREDICTION: '/api/save_prediction',
        DELETE_HISTORY: '/api/history',
        UPDATE_PROFILE: '/api/user/update_profile',
        CHANGE_PASSWORD: '/api/user/change_password'
    }
};

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

        const response = await fetch(url, options);
        return await response.json();
}

// Local storage helpers
const Storage = {
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
    },

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isLoggedIn: () => {
        return localStorage.getItem('isLoggedIn') === 'true';
    },

    logout: () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace('index.html');
    }
};

// Check authentication - USER on every page
function checkAuth() {
    if (!Storage.isLoggedIn()) {
        window.location.replace('index.html');
        return false;
    }
    return true;
}

// Prevent Back Button after logout
window.addEventListener('load', function() {
    this.window.history.pushState(null, null, this.location.href);
})

window.addEventListener('popstate', function() {
    if (!Storage.isLoggedIn()) {
        window.location.replace('index.html');
    } 
});
