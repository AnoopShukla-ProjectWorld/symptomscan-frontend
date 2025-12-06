// js/common.js - Common utilities and reusable functions

// Mobile menu toggle
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Back button functionality
function goBack() {
    window.history.back();
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navMenu && menuToggle && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// Common disease emoji function
function getDiseaseMoji(disease) {
    if (!disease) return '🏥';
    
    const diseaseLower = disease.toLowerCase();
    
    if (diseaseLower.includes('fungal') || diseaseLower.includes('infection')) return '🦠';
    if (diseaseLower.includes('fever') || diseaseLower.includes('cold')) return '🤒';
    if (diseaseLower.includes('heart')) return '❤️';
    if (diseaseLower.includes('diabetes')) return '💉';
    if (diseaseLower.includes('asthma')) return '😷';
    if (diseaseLower.includes('hepatitis') || diseaseLower.includes('jaundice')) return '🟡';
    if (diseaseLower.includes('malaria') || diseaseLower.includes('dengue')) return '🦟';
    if (diseaseLower.includes('tuberculosis')) return '🫁';
    if (diseaseLower.includes('arthritis')) return '🦴';
    if (diseaseLower.includes('acne') || diseaseLower.includes('psoriasis')) return '🧴';
    if (diseaseLower.includes('pneumonia')) return '🫁';
    if (diseaseLower.includes('allergy')) return '🤧';
    if (diseaseLower.includes('migraine') || diseaseLower.includes('headache')) return '🤕';
    if (diseaseLower.includes('aids')) return '⚕️';
    
    return '🏥';
}

// Format model name
function formatModelName(modelName) {
    if (!modelName) return 'Unknown';
    
    const modelLower = modelName.toLowerCase();
    if (modelLower.includes('random_forest') || modelLower === 'rf') return 'Random Forest';
    if (modelLower.includes('svm')) return 'Support Vector Machine';
    if (modelLower.includes('naive_bayes') || modelLower === 'nb') return 'Naive Bayes';
    
    return modelName;
}

// Format date
function formatDate(dateStr) {
    if (!dateStr) return 'Unknown date';
    
    try {
        const date = new Date(dateStr);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    } catch (e) {
        return dateStr;
    }
}

// Format date for long format
function formatDateLong(dateStr) {
    if (!dateStr) return 'Unknown date';
    
    try {
        const date = new Date(dateStr);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    } catch (e) {
        return dateStr;
    }
}

// Get model short name
function getModelShortName(model) {
    if (!model) return 'N/A';
    const m = model.toLowerCase();
    if (m.includes('random_forest') || m.includes('rf')) return 'RF';
    if (m.includes('svm')) return 'SVM';
    if (m.includes('naive_bayes') || m.includes('nb')) return 'NB';
    return 'N/A';
}

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}