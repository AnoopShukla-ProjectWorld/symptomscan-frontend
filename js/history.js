// js/history.js

let allHistory = [];
let filteredHistory = [];

// Load history on page load
window.addEventListener('DOMContentLoaded', function () {
    loadHistory();
});

// Search functionality
document.getElementById('searchHistory')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filterHistory(query);
});

async function loadHistory() {
    const user = Storage.getUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('historyList').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';

    try {
        // Get history from backend
        const result = await apiCall(`${API_CONFIG.ENDPOINTS.HISTORY}/${user.id}`);

        document.getElementById('loadingState').style.display = 'none';

        if (result.history && result.history.length > 0) {
            // Sort by date (newest first)
            allHistory = result.history.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            filteredHistory = [...allHistory];
            displayHistory(filteredHistory);
            document.getElementById('historyList').style.display = 'block';
            document.getElementById('emptyState').style.display = 'none';
        } else {
            document.getElementById('emptyState').style.display = 'block';
            document.getElementById('historyList').style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading history:', error);
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('emptyState').style.display = 'block';
    }
}

function displayHistory(history) {
    const container = document.getElementById('historyList');
    container.innerHTML = '';

    if (history.length === 0 && allHistory.length > 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No results found</p>';
        return;
    }

    if (history.length === 0) {
        return; // Empty state will be shown instead
    }

    history.forEach((item, index) => {
        const card = createHistoryCard(item, index);
        container.appendChild(card);
    });
}

function createHistoryCard(item, index) {
    const card = document.createElement('div');
    card.className = 'history-card';

    const emoji = getDiseaseMoji(item.disease);
    const confidence = item.confidence;
    const confidenceColor = confidence >= 80 ? '#4CAF50' : confidence >= 60 ? '#FF9800' : '#F44336';

    card.innerHTML = `
        <div style="flex: 1; cursor: pointer;" onclick="viewHistoryDetail(${index})">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                <span style="font-size: 32px;">${emoji}</span>
                <div>
                    <h4 style="margin: 0;">${item.disease}</h4>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                        <span style="color: ${confidenceColor}; font-weight: 600; font-size: 14px;">
                            ${confidence.toFixed(1)}% Confidence
                        </span>
                        <span style="background: #E0E0E0; padding: 2px 8px; border-radius: 4px; font-size: 11px; color: #757575;">
                            ${getModelShortName(item.model_used)}
                        </span>
                    </div>
                </div>
            </div>
            <div class="history-meta">
                <span>📅 ${formatDate(item.date)}</span>
                <span>🩺 ${item.symptoms ? item.symptoms.length : 0} symptoms</span>
            </div>
        </div>
        <button onclick="deleteHistory(event, '${item.id}', ${index})" class="btn-delete-history">
            🗑️ Delete
        </button>
    `;

    return card;
}

function filterHistory(query) {
    if (query === '') {
        filteredHistory = [...allHistory];
    } else {
        filteredHistory = allHistory.filter(item =>
            item.disease.toLowerCase().includes(query)
        );
    }
    displayHistory(filteredHistory);
}

function viewHistoryDetail(index) {
    const item = filteredHistory[index];
    // Make sure to include diet and workout in sessionStorage
    sessionStorage.setItem('historyDetail', JSON.stringify({
        id: item.id,
        disease: item.disease,
        confidence: item.confidence,
        model_used: item.model_used,
        symptoms: item.symptoms,
        description: item.description,
        medications: item.medications,
        precautions: item.precautions,
        diet: item.diet || [],
        workout: item.workout || [],
        date: item.date
    }));
    window.location.href = 'history-detail.html';
}

async function deleteHistory(event, id, index) {
    event.stopPropagation();

    if (!confirm('Are you sure you want to delete this prediction?')) {
        return;
    }

    try {
        const result = await apiCall(`${API_CONFIG.ENDPOINTS.DELETE_HISTORY}/${id}`, 'DELETE');

        if (result.status === 'success' || result.success) {
            // Remove from arrays
            allHistory = allHistory.filter(item => item.id !== id);
            filteredHistory = filteredHistory.filter(item => item.id !== id);

            displayHistory(filteredHistory);

            if (allHistory.length === 0) {
                document.getElementById('historyList').style.display = 'none';
                document.getElementById('emptyState').style.display = 'block';
            }
            alert('Prediction deleted successfully');
        }
        else {
            alert('Failed to delete: ' + (result.message || 'Unknown error'));
        }
    }
    catch (error) {
        alert('Failed to delete prediction');
        console.error('Delete error:', error);
    }
}