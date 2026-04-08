// Logic for handling the Crop Recommendation Form

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recommendationForm');
    const btn = document.getElementById('recommendBtn');
    const recResult = document.getElementById('recResult');
    const recommendedCrop = document.getElementById('recommendedCrop');

    if(form) {
        form.addEventListener('submit', handleRecommendation);

        // Basic clean validation UX similar to auth
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                if (input.value !== '') {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    input.nextElementSibling.style.display = 'none';
                }
            });
        });
    }

    function handleRecommendation(e) {
        e.preventDefault();

        let isValid = true;
        const data = {};

        form.querySelectorAll('input').forEach(input => {
            if (input.value === '') {
                isValid = false;
                input.style.borderColor = 'var(--danger)';
                input.nextElementSibling.style.display = 'block';
            } else {
                data[input.id] = parseFloat(input.value);
            }
        });

        if (!isValid) return;

        // Visual feedback
        btn.innerHTML = '<i class="ph ph-spinner" style="animation: spin 1s linear infinite;"></i> Processing Model Data...';
        btn.disabled = true;

        // TODO: Map to actual Flask API integration
        // fetch('http://localhost:5000/api/recommend', { method: 'POST', body: JSON.stringify(data) })

        setTimeout(() => {
            // Mock random crop response mapped to typical values or just a dummy one
            const crops = ['rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate', 'banana', 'mango', 'grapes', 'watermelon', 'muskmelon', 'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee'];
            const randomCrop = crops[Math.floor(Math.random() * crops.length)];
            
            recommendedCrop.textContent = randomCrop;
            form.style.display = 'none';
            recResult.style.display = 'block';
        }, 2000);
    }
});
