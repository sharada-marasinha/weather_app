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
       getWeatherTimeLine();
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

let img1=document.getElementById("img1");
let img2=document.getElementById("img2");
let img3=document.getElementById("img3");
let img4=document.getElementById("img4");
let img5=document.getElementById("img5");
let img6=document.getElementById("img6");
let img7=document.getElementById("img7");

let title1 = document.querySelector(".title1");
let title2 = document.querySelector(".title2");
let title3 = document.querySelector(".title3");
let title4 = document.querySelector(".title4");
let title5 = document.querySelector(".title5");
let title6 = document.querySelector(".title6");
let title7 = document.querySelector(".title7");


let date01 = document.querySelector("#date1");
let date02 = document.querySelector("#date2");
let date03 = document.querySelector("#date3");
let date04 = document.querySelector("#date4");
let date05 = document.querySelector("#date5");
let date06 = document.querySelector("#date6");
let date07 = document.querySelector("#date7");

function getWeatherTimeLine(startDate, endDate) {

  
  $.ajax({
    method : "GET",
    url: `http://api.weatherapi.com/v1/history.json?key=4a758dd1aed04dc3950175920231609&q=Panadura&dt=${startDate}&end_dt=${endDate}`,
    success : (resp) => {
     img1.src= resp['forecast']['forecastday'][0]['day']['condition']['icon'];
     img2.src= resp['forecast']['forecastday'][1]['day']['condition']['icon'];
    img3.src= resp['forecast']['forecastday'][2]['day']['condition']['icon'];
    img4.src= resp['forecast']['forecastday'][3]['day']['condition']['icon'];
    img5.src= resp['forecast']['forecastday'][4]['day']['condition']['icon'];
    img6.src= resp['forecast']['forecastday'][5]['day']['condition']['icon'];
    img7.src= resp['forecast']['forecastday'][6]['day']['condition']['icon'];

    title1.innerHTML= resp['forecast']['forecastday'][0]['day']['condition']['text'];
   title2.innerHTML= resp['forecast']['forecastday'][1]['day']['condition']['text'];
    title3.innerHTML= resp['forecast']['forecastday'][2]['day']['condition']['text'];
   title4.innerHTML= resp['forecast']['forecastday'][3]['day']['condition']['text'];
   title5.innerHTML= resp['forecast']['forecastday'][3]['day']['condition']['text'];
   title6.innerHTML= resp['forecast']['forecastday'][3]['day']['condition']['text'];
   title7.innerHTML= resp['forecast']['forecastday'][3]['day']['condition']['text'];

    date01.innerHTML= resp['forecast']['forecastday'][0]['date'];
    date02.innerHTML= resp['forecast']['forecastday'][1]['date'];
    date03.innerHTML= resp['forecast']['forecastday'][2]['date'];
    date04.innerHTML= resp['forecast']['forecastday'][3]['date'];
    date05.innerHTML= resp['forecast']['forecastday'][4]['date'];
    date06.innerHTML= resp['forecast']['forecastday'][5]['date'];
    date07.innerHTML= resp['forecast']['forecastday'][6]['date'];
    }
 });

}

function searchForecast(){

  const startDate = new Date(document.getElementById('startDate').value);
  const endDate = new Date(document.getElementById('endDate').value);
  //getWeatherTimeLine(startDate, endDate);

  const timeDiff = endDate - startDate;

  const daysDiff = timeDiff / (1000 * 3600 * 24);
  if(daysDiff == 7){
    getWeatherTimeLine(document.getElementById('startDate').value, document.getElementById('endDate').value);
  }else{
    alert("Date range exceeds 7 days!");
  }

  alert(daysDiff);
}
