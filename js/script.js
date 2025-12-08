const apiKey = "28be0d95281d908f22306074f72a6744";

document.getElementById("searchBtn").addEventListener("click", getWeather);

function getWeather() {
    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Digite uma cidade!");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Cidade não encontrada");
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("cityName").innerText = data.name;
            document.getElementById("temperature").innerText = Math.round(data.main.temp);
            document.getElementById("description").innerText = data.weather[0].description;

            loadWeatherIcon(data.weather[0].main.toLowerCase());

            document.getElementById("weatherResult").classList.remove("hidden");
        })
        .catch(error => {
            alert(error.message);
        });
}

function loadWeatherIcon(condition) {
    let iconUrl = "";

    if (condition.includes("clear")) iconUrl = "assets/icons/weatherIcon/clear.json";
    else if (condition.includes("cloud")) iconUrl = "assets/icons/weatherIcon/clouds.json"
    else if (condition.includes("rain")) iconUrl = "assets/icons/weatherIcon/rain.json"
    else if (condition.includes("storm") || condition.includes("thunder")) iconUrl = "assets/icons/weatherIcon/storm.json";

    document.getElementById("weatherIcon").innerHTML = `
    <lottie-player src="${iconUrl}" speed="1" autoplay loop>
    </lottie-player>
    `;
}

const themeBtn = document.getElementById("toggleTheme");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    themeBtn.innerHTML = document.body.classList.contains("dark") ? "<img src='/assets/icons/toggleIcon/sun.png' alt='theme-light'>" : "<img src='/assets/icons/toggleIcon/night.png' alt='theme-dark'>";

    localStorage.setItem("theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
});

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.innerHTML = "<img src='/assets/icons/toggleIcon/sun.png' alt='theme-light'>"
}

if(serviceWorker in navigator) {
    navigator.serviceWorker.register("sw.js");
}