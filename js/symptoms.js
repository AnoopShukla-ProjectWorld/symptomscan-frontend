if (!checkAuth()) window.location.href = 'index.html';

let allSymptoms = [];
let selectedSymptoms = [];
let isPredicting = false;

loadSymptoms();

async function loadSymptoms() {
    document.getElementById('loadingText').textContent = 'Loading...';
    
    try {
        const result = await apiCall(API_CONFIG.ENDPOINTS.SYMPTOMS);
        
        if (result.symptoms) {
            allSymptoms = result.symptoms;
            displaySymptoms(allSymptoms);
            document.getElementById('loadingText').textContent = `${allSymptoms.length} symptoms available`;
        } else {
            throw new Error('Failed to load symptoms');
        }
    } catch (error) {
        alert('Error loading symptoms: ' + error.message);
        document.getElementById('loadingText').textContent = 'Failed to load';
    }
}

function displaySymptoms(symptoms) {
    const container = document.getElementById('symptomsList');
    container.innerHTML = '';
    
    symptoms.forEach(symptom => {
        const symptomCard = document.createElement('div');
        symptomCard.className = 'symptom-card';
        symptomCard.innerHTML = `
            <input type="checkbox" id="sym_${symptom}" onchange="toggleSymptom('${symptom}')">
            <label for="sym_${symptom}">${symptom}</label>
        `;
        container.appendChild(symptomCard);
    });
}

function toggleSymptom(symptom) {
    if (selectedSymptoms.includes(symptom)) {
        selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
    } else {
        selectedSymptoms.push(symptom);
    }
    
    updateSelectedDisplay();
}

function updateSelectedDisplay() {
    const count = selectedSymptoms.length;
    document.getElementById('selectedCount').textContent = count;
    document.getElementById('predictBtn').disabled = count === 0 || isPredicting;
    
    const selectedSection = document.getElementById('selectedSection');
    const selectedList = document.getElementById('selectedList');
    
    if (count > 0) {
        selectedSection.style.display = 'block';
        selectedList.innerHTML = selectedSymptoms.map(s => `
            <div class="selected-item">
                <span>${s}</span>
                <button onclick="removeSymptom('${s}')" class="btn-remove">×</button>
            </div>
        `).join('');
    } else {
        selectedSection.style.display = 'none';
    }
}

function removeSymptom(symptom) {
    const checkbox = document.getElementById(`sym_${symptom}`);
    if (checkbox) checkbox.checked = false;
    toggleSymptom(symptom);
}

function toggleSelected() {
    const list = document.getElementById('selectedList');
    const btn = document.getElementById('toggleBtn');
    list.classList.toggle('collapsed');
    btn.textContent = list.classList.contains('collapsed') ? '▶' : '▼';
}

// Search functionality
document.getElementById('searchSymptoms').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allSymptoms.filter(s => s.toLowerCase().includes(query));
    displaySymptoms(filtered);
    
    // Re-check selected symptoms
    selectedSymptoms.forEach(s => {
        const checkbox = document.getElementById(`sym_${s}`);
        if (checkbox) checkbox.checked = true;
    });
});

async function predictDisease() {
    // Prevent multiple simultaneous calls
    if (isPredicting) {
        console.log('Prediction already in progress...');
        return;
    }

    if (selectedSymptoms.length === 0) {
        alert('Please select at least one symptom');
        return;
    }
    
    isPredicting = true;
    document.getElementById('predictText').style.display = 'none';
    document.getElementById('predictLoader').classList.remove('hidden');
    document.getElementById('predictBtn').disabled = true;
    
    try {
        const result = await apiCall(API_CONFIG.ENDPOINTS.PREDICT, 'POST', {
            symptoms: selectedSymptoms
        });
        
        if (result.status === 'success') {
            const user = Storage.getUser();
            
            // Save prediction to backend - ONLY FROM SYMPTOMS PAGE
            try {
                await apiCall(API_CONFIG.ENDPOINTS.SAVE_PREDICTION, 'POST', {
                    user_id: user.id,
                    disease: result.disease,
                    confidence: result.confidence,
                    model_used: result.model_used,
                    symptoms: selectedSymptoms,
                    description: result.description,
                    medications: result.medications || [],
                    precautions: result.precautions || [],
                    diet: result.diet || [],
                    workout: result.workout || []
                });
            } catch (err) {
                console.log('Backend save error (non-critical):', err);
            }
            
            // Update local stats
            const total = parseInt(localStorage.getItem('totalPredictions') || '0') + 1;
            localStorage.setItem('totalPredictions', total.toString());
            
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            localStorage.setItem('lastCheck', dateStr);
            
            // Save result to sessionStorage - INCLUDE ALL FIELDS
            sessionStorage.setItem('predictionResult', JSON.stringify({
                disease: result.disease,
                confidence: result.confidence,
                model_used: result.model_used,
                description: result.description,
                precautions: result.precautions || [],
                medications: result.medications || [],
                diet: result.diet || [],
                workout: result.workout || [],
                input_symptoms: selectedSymptoms
            }));
            
            // Navigate to result page - NO DELAY
            window.location.href = 'result.html';
        } else {
            alert('Prediction failed: ' + (result.message || 'Unknown error'));
            isPredicting = false;
            document.getElementById('predictText').style.display = 'inline';
            document.getElementById('predictLoader').classList.add('hidden');
            document.getElementById('predictBtn').disabled = false;
        }
    } catch (error) {
        alert('Error: ' + error.message);
        isPredicting = false;
        document.getElementById('predictText').style.display = 'inline';
        document.getElementById('predictLoader').classList.add('hidden');
        document.getElementById('predictBtn').disabled = false;
    }
}