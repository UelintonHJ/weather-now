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

        document.getElementById("weatherResult").classList.remove("hidden");
    })
    .catch(error => {
        alert(error.message);
    });
}