const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {

    const weatherWidget = document.getElementById('weatherWidget');
    if (weatherWidget) {
        fetchWeather();
    }
});

async function fetchWeather() {
    const weatherContent = document.getElementById('weatherContent');

    setTimeout(() => {
        weatherContent.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <h1 style="font-size: 2.5rem; margin: 0;">28°C</h1>
                <p style="color: var(--text-secondary); margin: 0;">Partly Cloudy, 65% Humidity</p>
            </div>
            <i class="ph-fill ph-cloud-sun" style="font-size: 4rem; color: var(--warning);"></i>
        `;
    }, 1500);
}

function showNotification(message, type = 'success') {

    const toast = document.createElement('div');
    toast.className = `glass-panel notification ${type}`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '1rem 2rem';
    toast.style.zIndex = '1000';
    toast.style.borderLeft = `4px solid ${type === 'success' ? 'var(--success)' : 'var(--danger)'}`;
    toast.innerHTML = `<p>${message}</p>`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
