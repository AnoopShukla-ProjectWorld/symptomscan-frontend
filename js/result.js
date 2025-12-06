// js/result.js

// Check authentication
if (!checkAuth()) {
    window.location.href = 'index.html';
}

// Get prediction result from sessionStorage
const predictionResult = sessionStorage.getItem('predictionResult');

if (!predictionResult) { 
    // No alert - silently redirect to symptoms page
    window.location.href = 'symptoms.html';
} else {
    const result = JSON.parse(predictionResult);
    displayResult(result);
}

function displayResult(result) {
    // Hide loading, show result - IMMEDIATELY
    const loadingState = document.getElementById('loadingState');
    const resultContainer = document.getElementById('resultContainer');

    if (loadingState) loadingState.style.display = 'none';
    if (resultContainer) resultContainer.style.display = 'block';

    // Display disease emoji
    const emoji = getDiseaseMoji(result.disease);
    const diseaseEmoji = document.getElementById('diseaseEmoji');
    if (diseaseEmoji) diseaseEmoji.textContent = emoji;

    // Display disease name
    const diseaseName = document.getElementById('diseaseName');
    if (diseaseName) diseaseName.textContent = result.disease;

    // Display confidence
    const confidence = result.confidence || 0;
    const confidenceEl = document.getElementById('confidence');
    if (confidenceEl) confidenceEl.textContent = confidence.toFixed(1) + '%';
    
    // Animate confidence bar - NO DELAY
    const fill = document.getElementById('confidenceFill');
    if (fill) {
        fill.style.width = confidence + '%';
        
        // Color code based on confidence
        if (confidence >= 80) {
            fill.style.background = '#4CAF50';
            if (confidenceEl) confidenceEl.style.color = '#4CAF50';
        } else if (confidence >= 60) {
            fill.style.background = '#FF9800';
            if (confidenceEl) confidenceEl.style.color = '#FF9800';
        } else {
            fill.style.background = '#F44336';
            if (confidenceEl) confidenceEl.style.color = '#F44336';
        }
    }

    // Display model used
    const modelUsed = document.getElementById('modelUsed');
    if (modelUsed) modelUsed.textContent = formatModelName(result.model_used || 'N/A');

    // Display description
    const description = document.getElementById('description');
    if (description) description.textContent = result.description || 'No description available.';

    // Display symptoms
    displaySymptoms(result.input_symptoms || []);

    // Display medications
    displayList('medicationsList', result.medications || [], 'medicationsCard');

    // Display precautions
    displayList('precautionsList', result.precautions || [], 'precautionsCard');

    // Display diet
    displayList('dietList', result.diet || [], 'dietCard');

    // Display workout
    displayList('workoutList', result.workout || [], 'workoutCard');
}

function displaySymptoms(symptoms) {
    const container = document.getElementById('symptomsList');
    if (!container) return;
    
    container.innerHTML = '';

    if (symptoms && symptoms.length > 0) {
        symptoms.forEach(symptom => {
            const badge = document.createElement('span');
            badge.className = 'selected-item';
            badge.style.background = '#E3F2FD';
            badge.style.color = '#1976D2';
            badge.style.padding = '8px 16px';
            badge.style.borderRadius = '20px';
            badge.style.fontSize = '14px';
            badge.textContent = symptom;
            container.appendChild(badge);
        });
    } else {
        container.innerHTML = '<p style="color: var(--text-secondary);">No symptoms recorded</p>';
    }
}

function displayList(listId, items, cardId) {
    const list = document.getElementById(listId);
    const card = document.getElementById(cardId);
    
    if (!list || !card) return;
    
    list.innerHTML = '';

    if (items && items.length > 0) {
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.style.padding = '10px 0';
            li.style.borderBottom = '1px solid var(--border-color)';
            list.appendChild(li);
        });
        card.style.display = 'block';
    } else {
        card.style.display = 'none';
    }
}

function goToHome() {
    sessionStorage.removeItem('predictionResult');
    window.location.href = 'dashboard.html';
}

function newCheck() {
    sessionStorage.removeItem('predictionResult');
    window.location.href = 'symptoms.html';
}