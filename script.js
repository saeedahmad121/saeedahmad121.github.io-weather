const apiKey = '59676c70afe6c56cf515e463be2ce576';

function getWeather(event) {
  if (event) event.preventDefault();
  const cityName = document.getElementById('cityName').value;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

  const contDiv = document.querySelector('.cont');
  let resultDiv = document.getElementById('weatherResult');
  if (!resultDiv) {
    resultDiv = document.createElement('div');
    resultDiv.id = 'weatherResult';
    contDiv.appendChild(resultDiv);
  }
  resultDiv.innerHTML = 'Loading...';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const currentWeather = data.list[0];
      const temperature = currentWeather.main.temp;
      const feelsLike = currentWeather.main.feels_like;
      const windSpeed = currentWeather.wind.speed;
      const humidity = currentWeather.main.humidity;

      let maxChanceOfRain = 0;
      for (let i = 0; i < 8; i++) {
        if (data.list[i] && data.list[i].pop > maxChanceOfRain) {
          maxChanceOfRain = data.list[i].pop;
        }
      }
      const chanceOfRain = (maxChanceOfRain * 100).toFixed(0);

      resultDiv.innerHTML = `
        <div class="weather-details">
          <h2>${cityName}</h2>
          <p>Temperature: ${temperature}°C</p>
          <p>Feels Like: ${feelsLike}°C</p>
          <p>Wind Speed: ${windSpeed} km/hr</p>
          <p>Humidity: ${humidity}%</p>
          <p>Chance of Rain: ${chanceOfRain}%</p>
        </div>
      `;

      contDiv.style.height = 'auto';
      contDiv.style.minHeight = '300px';
      contDiv.style.padding = '40px 20px';
    })
    .catch(error => {
      resultDiv.innerHTML = 'City not found. Try again.';
      console.error('Fetch error:', error);
      contDiv.style.height = 'auto';
      contDiv.style.minHeight = 'auto';
      contDiv.style.padding = '20px';
    });
}

document.getElementById('getWeatherBtn').addEventListener('click', getWeather);
document.getElementById('cityName').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    getWeather(event);
  }

});

