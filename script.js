
const mapContainer = document.getElementById('map-container');

let countryP =document.querySelector('#country');
let idP =document.querySelector('#id');
let latP =document.querySelector('#lat');
let lonP =document.querySelector('#lon');
let nameP =document.querySelector('#name');
let regionP =document.querySelector('#region');
let urlP =document.querySelector('#url');

let img = document.getElementById('weatherIcon');

const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', handleSearch);


let apiKey;
async function fetchWeatherData(location) {
  let divv=document.getElementById('weather-details');
    apiKey = '4a758dd1aed04dc3950175920231609';
   // const apiUrl = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${location}`;
    const apiUrl2 = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location} &aqi=no`;
    fetch(apiUrl2)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('====================================');
        console.log(data);
        console.log('====================================');

        countryP.innerHTML=data['location']['country'];
        idP.innerHTML=data['current']['temp_c'];
        latP.innerHTML=data['location']['lat'];
        lonP.innerHTML=data['location']['lon'];
        nameP.innerHTML=data['location']['name'];
        regionP.innerHTML=data['location']['region'];
        urlP.innerHTML=data['current']['condition']['text'];
        img.src=data['current']['condition']['icon'];
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });

    
}
function handleSearch() {
    const locationInput = document.getElementById('location-input');
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
      // Handle geolocation error
      console.error(`Geolocation error: ${error.message}`);
  }
);

async function fetchCurrentLocationName(latitude, longitude) {
  const apiKey = '4a758dd1aed04dc3950175920231609';
  const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;
  
  try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      const locationName = data.location.name;
      fetchWeatherData(locationName);
      console.log(`Current Location Name: ${locationName}`);
  } catch (error) {
      console.error('Fetch error:', error);
  }
}


    // Initialize the map
    function initMap() {
      
      var location ={lat:latitude,lng:longitude};
      var map = new google.maps.Map(document.getElementById('map'),{
        zoom: 4,
        center : location
      });
  }
  

// ------------------------------------------------------------------------------

