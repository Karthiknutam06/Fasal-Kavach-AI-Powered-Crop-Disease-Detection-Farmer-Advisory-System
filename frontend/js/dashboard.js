document.addEventListener("DOMContentLoaded", () => {
    const dashLocation = document.getElementById("dashLocation");
    const dashWeatherIcon = document.getElementById("dashWeatherIcon");
    const dashWeatherText = document.getElementById("dashWeatherText");

    if (!dashLocation || !dashWeatherIcon || !dashWeatherText) return;

    const savedLat = localStorage.getItem("fk_weather_lat");
    const savedLon = localStorage.getItem("fk_weather_lon");
    const savedLoc = localStorage.getItem("fk_weather_loc");

    const defaultLat = 30.9009;
    const defaultLon = 75.8572;

    function fetchDashboardWeather(lat, lon, locationName = "Punjab, India") {
        if (locationName) {
            let shortName = locationName.split(',')[0].trim();
            if (shortName.length > 15) shortName = shortName.substring(0, 15) + '...';
            dashLocation.textContent = shortName;
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const current = data.current;
                const temp = Math.round(current.temperature_2m);
                const code = current.weather_code;

                let desc = "Clear";
                let icon = "ph-sun";
                let color = "var(--warning)";

                if (code >= 1 && code <= 3) { desc = "Cloudy"; icon = "ph-cloud-sun"; }
                else if (code >= 45 && code <= 48) { desc = "Foggy"; icon = "ph-cloud-fog"; color = "#94a3b8"; }
                else if (code >= 51 && code <= 67) { desc = "Rain"; icon = "ph-cloud-rain"; color = "#38bdf8"; }
                else if (code >= 71 && code <= 82) { desc = "Snow"; icon = "ph-cloud-snow"; color = "#e2e8f0"; }
                else if (code >= 95) { desc = "Storm"; icon = "ph-cloud-lightning"; color = "#f59e0b"; }

                dashWeatherText.textContent = `${temp}°C ${desc}`;
                dashWeatherIcon.className = `ph-fill ${icon}`;
                dashWeatherIcon.style.color = color;
            })
            .catch(err => {
                console.error("Dashboard weather error:", err);
                dashWeatherText.textContent = "--°C Error";
            });
    }

    if (savedLat && savedLon) {
        fetchDashboardWeather(savedLat, savedLon, savedLoc);
    } else if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => fetchDashboardWeather(pos.coords.latitude, pos.coords.longitude, "Live Location"),
            (err) => fetchDashboardWeather(defaultLat, defaultLon, "Punjab, India")
        );
    } else {
        fetchDashboardWeather(defaultLat, defaultLon, "Punjab, India");
    }
});
