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

  let img1 = document.getElementById("img1");
  let img2 = document.getElementById("img2");
  let img3 = document.getElementById("img3");
  let img4 = document.getElementById("img4");
  let img5 = document.getElementById("img5");
  let img6 = document.getElementById("img6");
  let img7 = document.getElementById("img7");

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

  $.ajax({
    method: "GET",
    url: `http://api.weatherapi.com/v1/history.json?key=4a758dd1aed04dc3950175920231609&q=Panadura&dt=${startDate}&end_dt=${endDate}`,
    success: (resp) => {
      for (let i = 0; i < 7; i++) {
        const forecastDay = resp['forecast']['forecastday'][i]['day'];

        const img = document.getElementById(`img${i + 1}`);
        const title = document.getElementById(`title${i + 1}`);
        const date = document.getElementById(`date${i + 1}`);

        img.src = forecastDay['condition']['icon'];
        title.innerHTML = forecastDay['condition']['text'];
        date.innerHTML = resp['forecast']['forecastday'][i]['date'];
      }

    }
  });

}
