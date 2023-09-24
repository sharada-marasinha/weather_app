function darkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}


const mapContainer = $("#map-container");

let countryP = document.querySelector(".country");

//let countryP = document.querySelector(".country");
let idP = document.querySelector(".temp_c");
let latP = document.querySelector("#lat");
let lonP = document.querySelector("#lon");
let nameP = document.querySelector(".name");
let regionP = document.querySelector(".region");
let urlP = document.querySelector(".url");
let humidity = document.querySelector(".humidity");
let tz_id = document.querySelector(".tz_id");
let wind_kph = document.querySelector(".wind_kph");
let img = document.getElementById("weatherIcon");

const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", handleSearch);

let apiKey;
async function fetchWeatherData(location) {

  let divv = document.getElementById("weather-details");
  apiKey = "4a758dd1aed04dc3950175920231609";

  $.ajax({
    method : "GET",
    url: `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location} &aqi=no`,
    success : (data) => {
       console.log(data);
       countryP.innerHTML = data["location"]["country"];
       idP.innerHTML = data["current"]["temp_c"] + "°C";
       latP.innerHTML = data["location"]["lat"];
       lonP.innerHTML = data["location"]["lon"];
       nameP.innerHTML = data["location"]["name"];
       regionP.innerHTML = data["location"]["region"];
       urlP.innerHTML = data["current"]["condition"]["text"];
       humidity.innerHTML = data["current"]["humidity"];
       tz_id.innerHTML = data["location"]["tz_id"];
       wind_kph.innerHTML = data["current"]["wind_kph"] + "kph";
       img.src = data["current"]["condition"]["icon"];
    }
 });




}
function handleSearch() {
  const locationInput = document.getElementById("location-input");
  const location = locationInput.value;

  fetchWeatherData(location);
}

let latitude;
let longitude;
navigator.geolocation.getCurrentPosition(
  function (position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    // Use the latitude and longitude for reverse geocoding
    console.log(latitude);
    console.log(longitude);
    fetchCurrentLocationName(latitude, longitude);
    const iframe = document.getElementById("map-iframe");
    iframe.src = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4017007.4579222617!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2slk!4v1695104118915!5m2!1sen!2slk`;
  },
  function (error) {

    console.error(`Geolocation error: ${error.message}`);
  }
);

async function fetchCurrentLocationName(latitude, longitude) {
  const apiKey = "4a758dd1aed04dc3950175920231609";
  const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;

  $.ajax({
    method : "GET",
    url: `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`,
    success : (data) => {
       const locationName = data.location.name;
       fetchWeatherData(locationName);
       getWeatherTimeLine(locationName);
       console.log(`Current Location Name: ${locationName}`);
    }
 });
  
}

// Initialize the map
function initMap() {
  var location = { lat: latitude, lng: longitude };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: location,
  });
}

// ------------------------------------------------------------------------------

function updateLocalTime() {
  const localTimeElement = document.getElementById("local-time");
  const now = new Date(); 
  const localTimeString = now.toLocaleTimeString(); 

  localTimeElement.textContent = `Time: ${localTimeString}`; 
}

updateLocalTime();


setInterval(updateLocalTime, 1000);


function getWeatherTimeLine(location) {
  const apiKey = "4a758dd1aed04dc3950175920231609";
  let img1=document.getElementById("day01Img");
  let img2=document.getElementById("day02Img");
  let img3=document.getElementById("day03Img");
  let img4=document.getElementById("day04Img");

  let card01Title = document.querySelector(".card01-title");
  let card02Title = document.querySelector(".card02-title");
  let card03Title = document.querySelector(".card03-title");
  let card04Title = document.querySelector(".card04-title");


  let date01 = document.querySelector("#date");
  $.ajax({
    method : "GET",
    url: `http://api.weatherapi.com/v1/history.json?key=4a758dd1aed04dc3950175920231609&q=Panadura&dt=2023-09-16&end_dt=2023-09-20`,
    success : (resp) => {
     img1.src= resp['forecast']['forecastday'][0]['day']['condition']['icon'];
     img2.src= resp['forecast']['forecastday'][1]['day']['condition']['icon'];
     img3.src= resp['forecast']['forecastday'][2]['day']['condition']['icon'];
     img4.src= resp['forecast']['forecastday'][4]['day']['condition']['icon'];

     card01Title.innerHTML= resp['forecast']['forecastday'][0]['day']['condition']['text'];
     card02Title.innerHTML= resp['forecast']['forecastday'][1]['day']['condition']['text'];
     card03Title.innerHTML= resp['forecast']['forecastday'][2]['day']['condition']['text'];
     card04Title.innerHTML= resp['forecast']['forecastday'][3]['day']['condition']['text'];
     
    date01.innerHTML= resp['forecast']['forecastday'][0]['date'];
     
       console.log(resp);
    }
 });

}
