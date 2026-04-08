

document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const loader = document.getElementById('loader');
    const resultContainer = document.getElementById('resultContainer');
    const scanAgainBtn = document.getElementById('scanAgainBtn');

    let selectedFile = null;

    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--secondary-color)';
        uploadArea.style.background = 'rgba(82, 183, 136, 0.2)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        uploadArea.style.background = 'transparent';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        uploadArea.style.background = 'transparent';

        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG, PNG).');
            return;
        }

        selectedFile = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            uploadArea.style.display = 'none';
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    retakeBtn.addEventListener('click', () => {
        selectedFile = null;
        imageInput.value = '';
        previewContainer.style.display = 'none';
        uploadArea.style.display = 'block';
    });

    analyzeBtn.addEventListener('click', () => {
        if (!selectedFile) {
            alert("Please select an image first!");
            return;
        }

        previewContainer.style.display = 'none';
        loader.style.display = 'block';

        const formData = new FormData();
        formData.append('image', selectedFile);

        fetch('http://localhost:5000/api/predict-disease', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            if (data.status === 'success') {
                showResults(data.disease, data.confidence, data.precautions, data.is_live);
            } else {
                alert('Error: ' + data.message);
                retakeBtn.click();
            }
        })
        .catch(err => {
            loader.style.display = 'none';
            alert('Failed to connect to the Fasal Kavach AI engine on Port 5000.');
            console.error(err);
            retakeBtn.click();
        });
    });

    function showResults(disease, confidence, precautions, isLive) {
        const diseaseName = document.getElementById('diseaseName');
        const confidenceScore = document.getElementById('confidenceScore');
        const precautionsList = document.getElementById('precautionsList');

        diseaseName.textContent = disease;
        
        confidenceScore.innerHTML = `${confidence}`;

        precautionsList.innerHTML = '';
        if (precautions && precautions.length > 0) {
            precautions.forEach(p => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="ph-fill ph-check-circle" style="color: var(--secondary-color); margin-right: 8px;"></i> ${p}`;
                li.style.display = 'flex';
                li.style.alignItems = 'flex-start';
                precautionsList.appendChild(li);
            });
        }

        resultContainer.style.display = 'block';
    }

    scanAgainBtn.addEventListener('click', () => {
        resultContainer.style.display = 'none';
        selectedFile = null;
        imageInput.value = '';
        uploadArea.style.display = 'block';
    });
});
