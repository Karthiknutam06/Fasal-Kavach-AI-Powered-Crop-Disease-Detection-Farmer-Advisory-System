document.addEventListener("DOMContentLoaded", () => {
    // Default coordinates (e.g., Punjab, India)
    const defaultLat = 30.9009;
    const defaultLon = 75.8572;

    const locNameElem = document.getElementById("locationName");
    const tempElem = document.getElementById("tempDisplay");
    const descElem = document.getElementById("descDisplay");
    const humElem = document.getElementById("humidityDisplay");
    const windElem = document.getElementById("windDisplay");
    const iconElem = document.getElementById("weatherIcon");
    const searchForm = document.getElementById("citySearchForm");
    const cityInput = document.getElementById("cityInput");

    function fetchWeather(lat, lon, locationName = null) {
        if(locationName) {
            locNameElem.textContent = locationName;
            localStorage.setItem("fk_weather_loc", locationName);
        }
        localStorage.setItem("fk_weather_lat", lat);
        localStorage.setItem("fk_weather_lon", lon);
        
        // Using Open-Meteo Free API
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const current = data.current;
                
                tempElem.textContent = `${Math.round(current.temperature_2m)}°C`;
                humElem.textContent = `${current.relative_humidity_2m}%`;
                windElem.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

                // Map WMO weather code to text and phosphor icons
                const code = current.weather_code;
                let desc = "Clear";
                let icon = "ph-sun";
                let color = "var(--warning)";

                if (code >= 1 && code <= 3) {
                    desc = "Partly Cloudy";
                    icon = "ph-cloud-sun";
                } else if (code >= 45 && code <= 48) {
                    desc = "Foggy";
                    icon = "ph-cloud-fog";
                    color = "#94a3b8";
                } else if (code >= 51 && code <= 67) {
                    desc = "Rain Showers";
                    icon = "ph-cloud-rain";
                    color = "#38bdf8";
                } else if (code >= 71 && code <= 82) {
                    desc = "Snow";
                    icon = "ph-cloud-snow";
                    color = "#e2e8f0";
                } else if (code >= 95) {
                    desc = "Thunderstorm";
                    icon = "ph-cloud-lightning";
                    color = "#f59e0b";
                }

                descElem.textContent = desc;
                iconElem.className = `ph-fill ${icon}`;
                iconElem.style.color = color;
            })
            .catch(err => {
                console.error("Error fetching weather:", err);
                locNameElem.textContent = "Weather Error";
                tempElem.textContent = "N/A";
            });
    }

    function searchCity(city) {
        locNameElem.textContent = "Searching...";
        // Open-Meteo Free Geocoding API
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        
        fetch(geoUrl)
            .then(res => res.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const result = data.results[0];
                    const fullName = `${result.name}, ${result.country}`;
                    fetchWeather(result.latitude, result.longitude, fullName);
                } else {
                    locNameElem.textContent = "City Not Found";
                    tempElem.textContent = "--°C";
                    descElem.textContent = "Try another city";
                }
            })
            .catch(err => {
                console.error("Geocoding error:", err);
                locNameElem.textContent = "Network Error";
            });
    }

    // Attach search event
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if(city) {
            searchCity(city);
        }
    });

    // Try Geo-location on initial load
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                fetchWeather(pos.coords.latitude, pos.coords.longitude, "Live Current Location");
            },
            (err) => {
                console.warn("Geolocation denied/failed. Using defaults.", err);
                fetchWeather(defaultLat, defaultLon, "Punjab, India (Default)");
            }
        );
    } else {
        fetchWeather(defaultLat, defaultLon, "Punjab, India (Default)");
    }
});
