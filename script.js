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

let searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", handleSearch);

const apiKey = "4a758dd1aed04dc3950175920231609";
//--------------------------------------getCurrentPosition-----------------------------------
let latitude;
let longitude;
navigator.geolocation.getCurrentPosition(
  function (position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    fetchCurrentLocationName(latitude, longitude);
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

  console.log(location);

  fetchWeatherData(location);
}
function fetchWeatherData(location) {
  $.ajax({
    method : "GET",
    url: `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location} &aqi=no`,
    success : (data) => {
       console.log(data);
       countryP.text(data["location"]["country"]);
       idP.text (data["current"]["temp_c"] + "°C");
       latP.text (data["location"]["lat"]);
       lonP.text (data["location"]["lon"]);
       nameP.text (data["location"]["name"]);
       regionP.text(data["location"]["region"]);
       urlP.text(data["current"]["condition"]["text"]);
       humidity.text(data["current"]["humidity"]);
       tz_id.text(data["location"]["tz_id"]);
       wind_kph.text(data["current"]["wind_kph"] + "kph");
       img.src = data["current"]["condition"]["icon"];
    }
 });
}
//-------------------------------------------fetchCurrentLocationName----------------------------------
async function fetchCurrentLocationName(latitude, longitude) {
  
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

// -------------------------------------------------updateLocalTime-----------------------------

function updateLocalTime() {
  const localTimeElement = document.getElementById("local-time");
  const now = new Date(); 
  const localTimeString = now.toLocaleTimeString(); 

  localTimeElement.textContent = `Time: ${localTimeString}`; 
}

updateLocalTime();

setInterval(updateLocalTime, 1000);

// ------------------------------------getWeatherTimeLine---------------------------------
function getWeatherTimeLine(location) {
 // let img1=document.getElementById("day01Img");
  let img2=document.getElementById("day02Img");
  //let img3=document.getElementById("day03Img");
  let img4=document.getElementById("day04Img");

  let card01Title = document.querySelector(".card01-title");
  let card02Title = document.querySelector(".card02-title");
  let card03Title = document.querySelector(".card03-title");
  let card04Title = document.querySelector(".card04-title");


  let date01 = document.querySelector("#date");
  
  let moon_phase01 = document.querySelector("#moon_phase");

  $.ajax({
    method : "GET",
    url: `http://api.weatherapi.com/v1/history.json?key=4a758dd1aed04dc3950175920231609&q=Panadura&dt=2023-09-16&end_dt=2023-09-20`,
    success : (resp) => {
    // img1.src= resp['forecast']['forecastday'][0]['day']['condition']['icon'];
     img2.src= resp['forecast']['forecastday'][1]['day']['condition']['icon'];
    // img3.src= resp['forecast']['forecastday'][2]['day']['condition']['icon'];
     img4.src= resp['forecast']['forecastday'][4]['day']['condition']['icon'];

    // card01Title.innerHTML= resp['forecast']['forecastday'][0]['day']['condition']['text'];
     card02Title.innerHTML= resp['forecast']['forecastday'][1]['day']['condition']['text'];
    // card03Title.innerHTML= resp['forecast']['forecastday'][2]['day']['condition']['text'];
     card04Title.innerHTML= resp['forecast']['forecastday'][3]['day']['condition']['text'];
     
     moon_phase01.innerHTML= resp['forecast']['forecastday'][0]['astro']['moonrise'];

     date01.innerHTML= resp['forecast']['forecastday'][0]['date'];
     
       console.log(resp);
    }
 });

}
