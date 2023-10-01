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
const apiKey = "4a758dd1aed04dc3950175920231609";


//--------------------------------------getCurrentPosition-----------------------------------
let latitude;
let longitude;
navigator.geolocation.getCurrentPosition(
  function (position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    fetchWeatherData(latitude + "," + longitude);
  },
  function (error) {
    console.error(`Geolocation error: ${error.message}`);
  }
);

function darkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

//-------------------------------------------handleSearch----------------------------------------

function handleSearch() {
  const location = document.getElementById("location-input").value;
  fetchWeatherData(location);
}
document.getElementById("search-button").addEventListener("click", handleSearch);

function fetchWeatherData(location) {
  $.ajax({
    method: "GET",
    url: `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location} &aqi=no`,
    success: (data) => {
      console.log(data);
      countryP.text(data["location"]["country"]);
      idP.text(data["current"]["temp_c"] + "°C");
      latP.text(data["location"]["lat"]);
      lonP.text(data["location"]["lon"]);
      nameP.text(data["location"]["name"]);
      regionP.text(data["location"]["region"]);
      urlP.text(data["current"]["condition"]["text"]);
      humidity.text(data["current"]["humidity"]);
      tz_id.text(data["location"]["tz_id"]);
      wind_kph.text(data["current"]["wind_kph"] + "kph");
      img.src = data["current"]["condition"]["icon"];
    }
  });
}

// -------------------------------------------------updateLocalTime-----------------------------

function updateLocalTime() {
  const localTimeElement = document.getElementById("local-time");
  const now = new Date();
  const localTimeString = now.toLocaleTimeString();

  localTimeElement.textContent = `Time: ${localTimeString}`;
}

updateLocalTime();

setInterval(updateLocalTime, 1000);

//---------------------------------------------------searchForecast-------------------------------------

searchForecast();

function searchForecast() {

  const startDate = new Date(document.getElementById('startDate').value);
  const endDate = new Date(document.getElementById('endDate').value);
  //getWeatherTimeLine(startDate, endDate);

  const timeDiff = endDate - startDate;

  const daysDiff = timeDiff / (1000 * 3600 * 24);
  // getWeatherTimeLine(document.getElementById('startDate').value, document.getElementById('endDate').value);
  etWeatherTimeLine("2023-09-29", "2023-09-24");
  // if(daysDiff == 7){
  //   getWeatherTimeLine(document.getElementById('startDate').value, document.getElementById('endDate').value);
  // }else{
  //  alert("Date range exceeds 7 days!");
  // }
}

// ------------------------------------getWeatherTimeLine---------------------------------

function getWeatherTimeLine(startDate, endDate) {
  
  const imgIds = ["img1", "img2", "img3", "img4", "img5", "img6", "img7"];
  const titleClasses = [".title1", ".title2", ".title3", ".title4", ".title5", ".title6", ".title7"];
  const dateIds = ["date1", "date2", "date3", "date4", "date5", "date6", "date7"];

  $.ajax({
    method: "GET",
    url: `http://api.weatherapi.com/v1/history.json?key=4a758dd1aed04dc3950175920231609&q=Panadura&dt=${startDate}&end_dt=${endDate}`,
    success: (resp) => {
      for (let i = 0; i < 7; i++) {
        const forecastDay = resp['forecast']['forecastday'][i]['day'];

        const img = document.getElementById(imgIds[i]);
        const title = document.querySelector(titleClasses[i]);
        const date = document.getElementById(dateIds[i]);

        img.src = forecastDay['condition']['icon'];
        title.innerHTML = forecastDay['condition']['text'];
        date.innerHTML = resp['forecast']['forecastday'][i]['date'];
      }
    }
  });
}

