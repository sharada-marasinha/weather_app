// ===============================
// ENHANCED WEATHER APP JAVASCRIPT
// ===============================

// DOM Elements
const mapContainer = $("#map-container");
let countryP = $(".country");
let idP = $(".temp_c");
let latP = $("#lat");
let lonP = $("#lon");
let nameP = $(".name");
let regionP = $(".region");
let urlP = $(".url");
let humidity = $(".humidity");
let tz_id = $(".tz_id");
let wind_kph = $(".wind_kph");
let img = document.getElementById("weatherIcon");

// API Configuration
const apiKey = "4a758dd1aed04dc3950175920231609";
const newsApiKey = "8c3c23f0ce854f9b9e4a8e73ddca6c06";

// Global Variables
let latitude, longitude;
let map;
let marker;
let currentLocation = "Panadura";
let currentForecastType = "daily";

// Initialize Application
document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
});

function initializeApp() {
  initializeMap();
  getLocation();
  updateCurrentDate();
  setupEventListeners();
  checkSavedTheme();
}

// ===============================
// THEME MANAGEMENT
// ===============================
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById('theme-icon');

  if (body.getAttribute('data-theme') === 'dark') {
    body.removeAttribute('data-theme');
    themeIcon.className = 'fas fa-moon';
    localStorage.setItem('theme', 'light');
  } else {
    body.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fas fa-sun';
    localStorage.setItem('theme', 'dark');
  }
}

function checkSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  const themeIcon = document.getElementById('theme-icon');

  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fas fa-sun';
  }
}

// ===============================
// GEOLOCATION AND MAP
// ===============================
function initializeMap() {
  map = L.map('map').setView([6.9271, 79.8612], 10); // Default to Colombo, Sri Lanka

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleLocationError);
  } else {
    showNotification("Geolocation is not supported by this browser.", "error");
    // Fallback to default location
    fetchWeatherData(currentLocation);
  }
}

function handleLocationError(error) {
  let message = "Unable to retrieve your location. ";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message += "Location access denied.";
      break;
    case error.POSITION_UNAVAILABLE:
      message += "Location information unavailable.";
      break;
    case error.TIMEOUT:
      message += "Location request timed out.";
      break;
  }
  showNotification(message, "warning");
  fetchWeatherData(currentLocation);
}

function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  updateMapLocation(latitude, longitude);
  fetchWeatherData(`${latitude},${longitude}`);

  // Reverse geocoding for location name
  reverseGeocode(latitude, longitude);
}

function updateMapLocation(lat, lon) {
  if (marker) {
    marker.setLatLng([lat, lon]).update();
  } else {
    marker = L.marker([lat, lon]).addTo(map);
  }
  map.setView([lat, lon], 13);
}

function zoomToCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      updateMapLocation(lat, lon);
      fetchWeatherData(`${lat},${lon}`);
    });
  } else {
    showNotification("Geolocation is not available.", "error");
  }
}

function reverseGeocode(lat, lon) {
  const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

  $.ajax({
    method: "GET",
    url: geoApiUrl,
    success: (resp) => {
      console.log('Reverse geocoding response:', resp);
      currentLocation = resp.city || resp.locality || "Unknown Location";
    },
    error: (error) => {
      console.error('Reverse geocoding failed:', error);
    }
  });
}

// ===============================
// WEATHER DATA FETCHING
// ===============================
function fetchWeatherData(location) {
  showLoading(true);

  $.ajax({
    method: "GET",
    url: `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`,
    success: function (data) {
      updateCurrentWeather(data);
      updateMapLocation(data.location.lat, data.location.lon);
      fetchForecastData(location);
      showLoading(false);
    },
    error: function (error) {
      console.error('Weather API Error:', error);
      showNotification("Failed to fetch weather data. Please try again.", "error");
      showLoading(false);
    }
  });
}

function updateCurrentWeather(data) {
  const { location, current } = data;

  // Update main weather info
  nameP.text(location.name);
  countryP.text(location.country);
  regionP.text(location.region);
  idP.text(current.temp_c);
  $(".temp_c").text(`${current.temp_c}°C`);
  urlP.text(current.condition.text);
  humidity.text(`${current.humidity}%`);
  tz_id.text(location.tz_id);
  wind_kph.text(`${current.wind_kph} km/h`);
  latP.text(location.lat);
  lonP.text(location.lon);

  // Update weather icon
  img.src = `https:${current.condition.icon}`;

  // Update additional stats
  $(".visibility").text(`${current.vis_km} km`);
  $(".pressure").text(`${current.pressure_mb} mb`);
  $(".uv").text(current.uv);

  // Update location coordinates
  latitude = location.lat;
  longitude = location.lon;
  currentLocation = location.name;

  // Add fade-in animation
  $("#current-weather").addClass("fade-in");
}

function fetchForecastData(location) {
  $.ajax({
    method: "GET",
    url: `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=no&alerts=no`,
    success: function (data) {
      updateDailyForecast(data.forecast.forecastday);
    },
    error: function (error) {
      console.error('Forecast API Error:', error);
      showNotification("Failed to fetch forecast data.", "warning");
    }
  });
}

function updateDailyForecast(forecastDays) {
  const imgIds = ["img1", "img2", "img3", "img4", "img5", "img6", "img7"];
  const titleClasses = [".title1", ".title2", ".title3", ".title4", ".title5", ".title6", ".title7"];
  const dateIds = ["date1", "date2", "date3", "date4", "date5", "date6", "date7"];

  forecastDays.forEach((dayData, index) => {
    if (index < 7) {
      const day = dayData.day;
      const date = new Date(dayData.date);

      // Update basic forecast info
      document.getElementById(imgIds[index]).src = `https:${day.condition.icon}`;
      document.querySelector(titleClasses[index]).textContent = day.condition.text;
      document.getElementById(dateIds[index]).textContent = formatDate(date);

      // Update temperature ranges
      const tempHighId = `temp-high-${index + 1}`;
      const tempLowId = `temp-low-${index + 1}`;
      const humidityId = `humidity-${index + 1}`;
      const windId = `wind-${index + 1}`;

      const tempHighEl = document.getElementById(tempHighId);
      const tempLowEl = document.getElementById(tempLowId);
      const humidityEl = document.getElementById(humidityId);
      const windEl = document.getElementById(windId);

      if (tempHighEl) tempHighEl.textContent = `${Math.round(day.maxtemp_c)}°`;
      if (tempLowEl) tempLowEl.textContent = `${Math.round(day.mintemp_c)}°`;
      if (humidityEl) humidityEl.textContent = `${day.avghumidity}%`;
      if (windEl) windEl.textContent = `${Math.round(day.maxwind_kph)} km/h`;
    }
  });
}

// ===============================
// FORECAST TYPE SWITCHING
// ===============================
function switchForecastType(type) {
  currentForecastType = type;

  // Update tab active states
  document.querySelectorAll('.forecast-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-type="${type}"]`).classList.add('active');

  // Show/hide forecast containers
  document.querySelectorAll('.forecast-container').forEach(container => {
    container.classList.remove('active');
  });
  document.getElementById(`${type}-forecast`).classList.add('active');

  if (type === 'hourly') {
    fetchHourlyForecast();
  }
}

function fetchHourlyForecast() {
  $.ajax({
    method: "GET",
    url: `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${currentLocation}&days=2&aqi=no&alerts=no`,
    success: function (data) {
      updateHourlyForecast(data.forecast.forecastday);
    },
    error: function (error) {
      console.error('Hourly forecast error:', error);
    }
  });
}

function updateHourlyForecast(forecastDays) {
  const container = document.getElementById('hourly-cards-container');
  container.innerHTML = '';

  const now = new Date();
  const currentHour = now.getHours();

  // Get next 24 hours
  const hourlyData = [];

  // Today's remaining hours
  if (forecastDays[0] && forecastDays[0].hour) {
    for (let i = currentHour; i < 24; i++) {
      hourlyData.push(forecastDays[0].hour[i]);
    }
  }

  // Tomorrow's hours to make 24 total
  if (forecastDays[1] && forecastDays[1].hour) {
    const remainingHours = 24 - hourlyData.length;
    for (let i = 0; i < remainingHours; i++) {
      hourlyData.push(forecastDays[1].hour[i]);
    }
  }

  hourlyData.slice(0, 24).forEach(hour => {
    const hourCard = createHourlyCard(hour);
    container.appendChild(hourCard);
  });
}

function createHourlyCard(hourData) {
  const card = document.createElement('div');
  card.className = 'hourly-card';

  const time = new Date(hourData.time);
  const timeString = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true
  });

  card.innerHTML = `
        <div class="hourly-time">${timeString}</div>
        <img src="https:${hourData.condition.icon}" alt="Weather" class="hourly-icon">
        <div class="hourly-temp">${Math.round(hourData.temp_c)}°</div>
        <div class="hourly-condition">${hourData.condition.text}</div>
        <div class="hourly-details">
            <div><i class="fas fa-tint"></i> ${hourData.humidity}%</div>
            <div><i class="fas fa-wind"></i> ${Math.round(hourData.wind_kph)} km/h</div>
        </div>
    `;

  return card;
}

// ===============================
// EVENT LISTENERS
// ===============================
function setupEventListeners() {
  // Search functionality
  document.getElementById("search-button").addEventListener("click", handleSearch);
  document.getElementById("location-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  // Auto-suggest for locations (future enhancement)
  // document.getElementById("location-input").addEventListener("input", debounce(handleLocationInput, 300));
}

function handleSearch() {
  const location = document.getElementById("location-input").value.trim();
  if (location) {
    fetchWeatherData(location);
    document.getElementById("location-input").value = "";
  } else {
    showNotification("Please enter a location name.", "warning");
  }
}

// ===============================
// UTILITY FUNCTIONS
// ===============================
function updateCurrentDate() {
  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const dateElement = document.getElementById("current-date");
  if (dateElement) {
    dateElement.textContent = dateString;
  }
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function showLoading(show) {
  // You can implement a loading indicator here
  const searchBtn = document.getElementById("search-button");
  if (show) {
    searchBtn.innerHTML = '<i class="loading"></i> Loading...';
    searchBtn.disabled = true;
  } else {
    searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
    searchBtn.disabled = false;
  }
}

function showNotification(message, type = 'info') {
  // Simple notification system
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

  // Set background color based on type
  const colors = {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };
  notification.style.backgroundColor = colors[type] || colors.info;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===============================
// MAP LAYER MANAGEMENT
// ===============================
function changeMapLayer(layerType) {
  // Update active button
  document.querySelectorAll('.layer-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-layer="${layerType}"]`).classList.add('active');

  // Update legend
  updateMapLegend(layerType);

  // In a real implementation, you would add weather layers here
  console.log(`Switching to ${layerType} layer`);
  showNotification(`Switched to ${layerType} layer`, 'info');
}

function updateMapLegend(layerType) {
  const legend = document.getElementById('map-legend');
  const legendTitle = legend.querySelector('.legend-title');

  const legends = {
    temp: 'Temperature (°C)',
    precipitation: 'Precipitation (mm)',
    wind: 'Wind Speed (km/h)',
    clouds: 'Cloud Coverage (%)'
  };

  legendTitle.textContent = legends[layerType] || 'Temperature (°C)';
}

// ===============================
// TIME AND DATE FUNCTIONS
// ===============================
function updateLocalTime() {
  const localTimeElement = document.getElementById("local-time");
  const now = new Date();
  const localTimeString = now.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  if (localTimeElement) {
    localTimeElement.textContent = localTimeString;
  }
}

// Update time every second
setInterval(updateLocalTime, 1000);
updateLocalTime(); // Initial call

// ===============================
// HISTORICAL WEATHER SEARCH
// ===============================
function searchForecast() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!startDate || !endDate) {
    showNotification("Please select both start and end dates.", "warning");
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end - start;
  const daysDiff = timeDiff / (1000 * 3600 * 24);

  if (daysDiff < 0) {
    showNotification("End date must be after start date.", "error");
    return;
  }

  if (daysDiff > 7) {
    showNotification("Date range cannot exceed 7 days.", "warning");
    return;
  }

  getWeatherTimeLine(startDate, endDate);
}

function getWeatherTimeLine(startDate, endDate) {
  console.log('Fetching historical data for:', startDate, 'to', endDate);

  $.ajax({
    method: "GET",
    url: `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${currentLocation}&dt=${startDate}&end_dt=${endDate}`,
    success: function (resp) {
      if (resp.forecast && resp.forecast.forecastday) {
        updateDailyForecast(resp.forecast.forecastday);
        showNotification("Historical weather data loaded successfully!", "success");
      }
    },
    error: function (error) {
      console.error('Historical weather error:', error);
      showNotification("Failed to fetch historical weather data.", "error");
    }
  });
}

// ===============================
// NEWS SECTION
// ===============================
function loadNews() {
  const newsElements = {
    images: ['imgN1', 'imgN2', 'imgN3'],
    titles: ['title1', 'title2', 'title3'],
    links: ['a1', 'a2', 'a3'],
    descriptions: ['p1', 'p2', 'p3'],
    times: ['ptime1', 'ptime2', 'ptime3']
  };

  $.ajax({
    method: "GET",
    url: `https://newsapi.org/v2/everything?q=weather OR climate&from=${getYesterdayDate()}&sortBy=popularity&apiKey=${newsApiKey}`,
    success: function (data) {
      if (data.articles && data.articles.length >= 3) {
        for (let i = 0; i < 3; i++) {
          const article = data.articles[i];

          document.getElementById(newsElements.images[i]).src =
            article.urlToImage || 'img/default-news.jpg';
          document.getElementById(newsElements.titles[i]).textContent =
            article.title || 'No title available';
          document.getElementById(newsElements.links[i]).href =
            article.url || '#';
          document.getElementById(newsElements.descriptions[i]).textContent =
            article.description || 'No description available';
          document.getElementById(newsElements.times[i]).textContent =
            formatNewsDate(article.publishedAt);
        }
      }
    },
    error: function (error) {
      console.error('News API Error:', error);
      showNotification("Failed to load news articles.", "warning");
    }
  });
}

function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

function formatNewsDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Load news on page load
setTimeout(loadNews, 2000); // Delay to avoid API rate limits

// ===============================
// LEGACY FUNCTION COMPATIBILITY
// ===============================
// Keep these for backward compatibility
function darkMode() {
  toggleTheme();
}

// Initialize legacy functions
news = loadNews;
