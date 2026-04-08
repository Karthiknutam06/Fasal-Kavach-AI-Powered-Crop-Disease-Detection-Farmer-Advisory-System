document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fertForm');
    const btn = document.getElementById('fertBtn');
    const resultDiv = document.getElementById('fertResult');
    const rCrop = document.getElementById('rCrop');
    const fertName = document.getElementById('fertName');
    const recalcFertBtn = document.getElementById('recalcFertBtn');

    if (form) {
        form.addEventListener('submit', handleFertilizerRequest);

        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                if (input.value !== '') {
                    input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    const errorSpan = input.parentElement.querySelector('.error-message');
                    if (errorSpan) errorSpan.style.display = 'none';
                }
            });
        });
    }

    if (recalcFertBtn) {
        recalcFertBtn.addEventListener('click', () => {
            resultDiv.style.display = 'none';
            form.style.display = 'block';
        });
    }

    function handleFertilizerRequest(e) {
        e.preventDefault();

        let isValid = true;
        const data = {};

        form.querySelectorAll('input').forEach(input => {
            let fieldValid = true;

            if (input.value === '') {
                fieldValid = false;
            } else if (input.type === 'number' && parseFloat(input.value) < 0) {
                fieldValid = false;
            }

            if (!fieldValid) {
                isValid = false;
                input.style.borderColor = 'var(--danger)';
                const errorSpan = input.parentElement.querySelector('.error-message');
                if (errorSpan) {
                    errorSpan.style.display = 'block';
                    if (parseFloat(input.value) < 0) {
                        errorSpan.textContent = "Value cannot be negative.";
                    } else {
                        errorSpan.textContent = "This field is required.";
                    }
                }
            } else {
                data[input.id] = input.value;
            }
        });

        if (!isValid) return;

        btn.innerHTML = '<i class="ph ph-spinner" style="animation: spin 1s linear infinite;"></i> Running Diagnostics...';
        btn.disabled = true;

        const cropName = document.getElementById('fertCrop').value;

        setTimeout(() => {
            const fertilizers = ['Urea 46-0-0', 'DAP 18-46-0', 'MOP 0-0-60', 'NPK 14-35-14', 'Ammonium Sulfate'];
            const recommendation = fertilizers[Math.floor(Math.random() * fertilizers.length)];

            fertName.textContent = recommendation;
            rCrop.textContent = cropName;

            form.style.display = 'none';
            resultDiv.style.display = 'block';

            btn.innerHTML = 'Generate Analysis';
            btn.disabled = false;
        }, 1500);
    }
});
