// js/dashboard.js

// Load user data
window.addEventListener('DOMContentLoaded', function () {
    const user = Storage.getUser();
    if (user) {
        document.getElementById('userName').textContent = user.name;
    }

    // Load stats from database
    loadStats();
});

async function loadStats() {
    const user = Storage.getUser();

    if (!user || !user.id) {
        console.error('No user data');
        return;
    }

    try {
        // Get actual count from backend
        const result = await apiCall(`${API_CONFIG.ENDPOINTS.HISTORY}/${user.id}`);

        if (result.history) {
            // Set total predictions from actual history count
            const totalCount = result.history.length;
            // localStorage.setItem('totalPredictions', totalCount.toString());
            document.getElementById('totalPredictions').textContent = totalCount;

            // Get last check date if history exists
            if (totalCount > 0) {
                const lastDate = result.history[0].date;
                const formatted = new Date(lastDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
                document.getElementById('lastCheck').textContent = formatted;
            } else {
                document.getElementById('lastCheck').textContent = 'Never';
            }
        }
    } catch (error) {
        console.error('Error fetching history count:', error);
        // Default values on error
        document.getElementById('totalPredictions').textContent = '0';
        document.getElementById('lastCheck').textContent = 'Never';
    }
}
