// js/history-detail.js

// Load detail from sessionStorage
const detailData = sessionStorage.getItem('historyDetail');

if (!detailData) {
    alert('No detail data found');
    window.location.href = 'history.html';
} else {
    const item = JSON.parse(detailData);
    displayDetail(item);
}

function displayDetail(item) {
    const container = document.getElementById('detailContainer');
    const emoji = getDiseaseMoji(item.disease);
    const confidence = item.confidence;
    const confidenceColor = confidence >= 80 ? '#4CAF50' : confidence >= 60 ? '#FF9800' : '#F44336';

    container.innerHTML = `
        <div class="result-card">
            <div class="emoji">${emoji}</div>
            <h2>${item.disease}</h2>
            <p style="font-size: 18px; color: var(--text-secondary); margin: 10px 0;">
                Confidence: <span style="font-weight: 700; color: ${confidenceColor};">${confidence.toFixed(1)}%</span>
            </p>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${confidence}%; background: ${confidenceColor};"></div>
            </div>
            <p style="color: var(--text-secondary); font-size: 14px; margin-top: 10px;">
                📅 ${formatDateLong(item.date)}
            </p>
            <p style="color: var(--text-secondary); font-size: 14px;">
                Model: ${formatModelName(item.model_used)}
            </p>
        </div>

        ${item.symptoms && item.symptoms.length > 0 ? `
        <div class="info-card">
            <h3>🩺 Your Symptoms</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${item.symptoms.map(s => `<span class="selected-item" style="background: #E3F2FD; color: #1976D2;">${s}</span>`).join('')}
            </div>
        </div>
        ` : ''}

        ${item.description ? `
        <div class="info-card">
            <h3>📋 Description</h3>
            <p style="color: var(--text-secondary); line-height: 1.8;">${item.description}</p>
        </div>
        ` : ''}

        ${item.medications && item.medications.length > 0 ? `
        <div class="info-card">
            <h3>💊 Medications</h3>
            <ul>${item.medications.map(m => `<li>${m}</li>`).join('')}</ul>
        </div>
        ` : ''}

        ${item.precautions && item.precautions.length > 0 ? `
        <div class="info-card">
            <h3>⚠️ Precautions</h3>
            <ul>${item.precautions.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        ` : ''}

        ${item.diet && item.diet.length > 0 ? `
        <div class="info-card">
            <h3>🥗 Diet Recommendations</h3>
            <ul>${item.diet.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>
        ` : ''}

        ${item.workout && item.workout.length > 0 ? `
        <div class="info-card">
            <h3>🏃 Workout & Exercise</h3>
            <ul>${item.workout.map(w => `<li>${w}</li>`).join('')}</ul>
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 30px;">
            <button onclick="goBack()" class="btn btn-primary">← Back to History</button>
        </div>
    `;
}