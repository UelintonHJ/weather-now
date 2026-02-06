const apiKey = "28be0d95281d908f22306074f72a6744";

const LAST_CITY_KEY = "lastCity";

const DOM = {
    cityInput: document.getElementById("cityInput"),
    searchBtn: document.getElementById("searchBtn"),
    cityName: document.getElementById("cityName"),
    temperature: document.getElementById("temperature"),
    description: document.getElementById("description"),
    weatherResult: document.getElementById("weatherResult"),
    weatherIcon: document.getElementById("weatherIcon"),
    themeBtn: document.getElementById("toggleTheme"),
};

const WEATHER_ICONS = {
    clear: "clear.json",
    cloud: "clouds.json",
    rain: "rain.json",
    storm: "storm.json",
    thunder: "storm.json",
    snow: "snow.json",
    mist: "clouds.json",
};

DOM.searchBtn.addEventListener("click", getWeather);

DOM.cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    const city = DOM.cityInput.value.trim();

    clearError();

    if (!city) {
        showError("Digite uma cidade!");
        return;
    }

    setLoading(true);

    try {
        const data = await fetchWeather(city);
        renderWeather(data);

        localStorage.setItem(LAST_CITY_KEY, city);
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false)
    }
}

function setLoading(isLoading) {
    DOM.searchBtn.disabled = isLoading;
    DOM.searchBtn.innerText = isLoading ? "Buscando..." : "Buscar";
}

async function fetchWeather(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`
    );

    if (!response.ok) {
        throw new Error("Cidade não encontrada");
    }

    return response.json();
}

function renderWeather(data) {
    DOM.cityName.innerText = data.name;
    DOM.temperature.innerText = Math.round(data.main.temp);
    DOM.description.innerText = data.weather[0].description;

    loadWeatherIcon(data.weather[0].main.toLowerCase());
    DOM.weatherResult.classList.remove("hidden");
}

function loadWeatherIcon(condition) {
    const key = Object.keys(WEATHER_ICONS)
        .find(k => condition.includes(k));

    if (!key) return;

    DOM.weatherIcon.innerHTML = `
        <lottie-player
            src="assets/icons/weatherIcon/${WEATHER_ICONS[key]}" 
            autoplay 
            loop>
        </lottie-player>
    `;
}

function showError(message) {
    const errorEl = document.getElementById("errorMessage");
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
}

function clearError() {
    const errorEl = document.getElementById("errorMessage");
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
}

function setTheme(theme) {
    document.body.classList.toggle("dark", theme === "dark");

    DOM.themeBtn.innerHTML = 
        theme === "dark"
            ? "<img src='/assets/icons/toggleIcon/sun.png' alt='theme-light'>"
            : "<img src='/assets/icons/toggleIcon/night.png' alt='theme-dark'>";

    localStorage.setItem("theme", theme);
}

DOM.themeBtn.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark")
        ? "light"
        : "dark";

    setTheme(nextTheme);
});

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

if (serviceWorker in navigator) {
    navigator.serviceWorker.register("sw.js");
}

const lastCity = localStorage.getItem(LAST_CITY_KEY);

if (lastCity) {
    DOM.cityInput.value = lastCity;
    getWeather();
}