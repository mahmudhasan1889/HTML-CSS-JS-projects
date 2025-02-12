const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWetherDiv = document.querySelector(".current-weather")

const API_KEY = "8ff37121683b7640332be9cb82571c10";

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0){ //HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}*c</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="moderate-rain">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    }else{  //HTML for the other five day forecast card
        return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h2>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="moderate-rain">
                <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}*c</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </li>`
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const Weather_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(Weather_API_URL).then(res => res.json()).then(data =>{

        // Filter the forecast to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        })

        // clearing previous weather data
        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";
        currentWetherDiv.innerHTML = "";

        // Creating weather cards and adding them to the DOM
        fiveDaysForecast.foreEach((weatherItem, index) => {
            if(index === 0){
                currentWetherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
            
        });
    }).catch(() => {
        alert("An error occured while fetching the weather forecast!");
    })
}



// Get entered city coordinates (latitude, longitude and name) from the API response
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //get user entered city name and remove extra spaces
    if(!cityName) return; //return if city name is empty
    
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const {name, lat, lon} = data[0];
        getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
        alert("An error occured while fetching the coordinates!");
    })
}

searchButton.addEventListener("click", getCityCoordinates);