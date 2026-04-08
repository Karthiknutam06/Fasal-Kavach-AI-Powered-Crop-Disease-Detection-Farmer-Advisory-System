// JS Form Validation and Processing for Yield Prediction

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('yieldForm');
    const btn = document.getElementById('yieldBtn');
    const resultDiv = document.getElementById('yieldResult');
    const predictedYield = document.getElementById('predictedYield');
    const recalculateBtn = document.getElementById('recalculateBtn');

    if(form) {
        form.addEventListener('submit', handleYieldPrediction);

        // Real-time error clearance
        form.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', () => {
                if (input.value !== '') {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    const errorSpan = input.parentElement.querySelector('.error-message');
                    if(errorSpan) errorSpan.style.display = 'none';
                }
            });
        });
    }

    if(recalculateBtn) {
        recalculateBtn.addEventListener('click', () => {
            resultDiv.style.display = 'none';
            form.style.display = 'block';
        });
    }

    function handleYieldPrediction(e) {
        e.preventDefault();

        let isValid = true;
        const data = {};

        // Validation Logic
        form.querySelectorAll('input, select').forEach(input => {
            let fieldValid = true;
            
            if (input.value === '') {
                fieldValid = false;
            } else if (input.type === 'number' && parseFloat(input.value) <= 0) {
                fieldValid = false;
            }

            if (!fieldValid) {
                isValid = false;
                input.style.borderColor = 'var(--danger)';
                const errorSpan = input.parentElement.querySelector('.error-message');
                if(errorSpan) errorSpan.style.display = 'block';
            } else {
                data[input.id] = input.value;
            }
        });

        if (!isValid) return;

        // Visual feedback state
        btn.innerHTML = '<i class="ph ph-spinner" style="animation: spin 1s linear infinite;"></i> Running ML Model...';
        btn.disabled = true;

        const area = parseFloat(data.area);

        // Simulate API delay and processing
        setTimeout(() => {
            let baseYieldPerHectare = Math.random() * (4.5 - 2.5) + 2.5; // tons
            let total = (area * baseYieldPerHectare).toFixed(2);
            
            predictedYield.textContent = `${total} Tons`;
            
            form.style.display = 'none';
            resultDiv.style.display = 'block';
            
            // Revert button state
            btn.innerHTML = 'Predict Yield';
            btn.disabled = false;
        }, 1500);
    }
});
