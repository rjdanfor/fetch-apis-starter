//using the open-meteo.com API for this activity
"use strict";


// API reference: https://open-meteo.com/en/docs
// endpoint: https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=8&current=temperature_2m,weather_code&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch
// there are no image icons available with this API, so I have included some from Flaticon
// on fail, and object with success set to false is returned along with other information about the error (code, type, info)

// values we're using for current weather:
// location 
// temp 
// weather description 
// weather icon based on the code returned

// values we're using for forecast:
// day of the week/date
// low temp 
// high temp
// weather description - ex: "Clear"
// weather icon 

// this variable holds a map of WMO Weather Codes returned to describe the weather conditions & icons from Flaticon to represent those conditions
// table of codes here: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
let conditions = {
	"0" : {
		"desc" : "Clear Sky",
		"path" : "images/sun.svg"
	},
	"1" : {
		"desc" : "Mostly Clear",
		"path" : "images/sun.svg"
	},
	"2" : {
		"desc": "Partly Cloudy",
		"path": "images/cloudy.svg"
	},
	"3" : {
		"desc": "Overcast",
		"path": "images/overcast.svg"
	},
	"45" : {
		"desc": "Fog",
		"path": "images/overcast.svg"
	},
	"48" : {
		"desc" : "Depositing Rime Fog",
		"path": "images/overcast.svg"
	},
	"51" : {
		"desc" : "Light Drizzle",
		"path": "images/rain.svg"
	},
	"53" : {
		"desc" : "Moderate Drizzle",
		"path": "images/rain.svg"
	},
	"55" : {
		"desc" : "Heavy Drizzle",
		"path": "images/rain.svg"
	},
	"56" : {
		"desc" : "Light Freezing Drizzle",
		"path": "images/rain.svg"
	},
	"57" : {
		"desc" : "Heavy Freezing Drizzle",
		"path": "images/rain.svg"
	},
	"61" : {
		"desc" : "Light Rain",
		"path": "images/rain.svg"
	},
	"63" : {
		"desc" : "Moderate Rain",
		"path": "images/rain.svg"
	},
	"65" : {
		"desc" : "Heavy Rain",
		"path": "images/rain.svg"
	},
	"66" : {
		"desc" : "Light Freezing Rain",
		"path": "images/rain.svg"
	},
	"67" : {
		"desc" : "Heavy Freezing Rain",
		"path": "images/rain.svg"
	},
	"71" : {
		"desc" : "Light Snowfall",
		"path": "images/snow.svg"
	},
	"73" : {
		"desc" : "Moderate Snowfall",
		"path": "images/snow.svg"
	},
	"75" : {
		"desc" : "Heavy Snowfall",
		"path": "images/snow.svg"
	},
	"77" : {
		"desc" : "Snow Grains",
		"path": "images/snow.svg"
	},
	"80" : {
		"desc" : "Light Rain Showers",
		"path": "images/rain.svg"
	},
	"81" : {
		"desc" : "Moderate Rain Showers",
		"path": "images/rain.svg"
	},
	"82" : {
		"desc" : "Violent Rain Showers",
		"path": "images/rain.svg"
	},
	"85" : {
		"desc" : "Light Snow Showers",
		"path": "images/snow.svg"
	},
	"86" : {
		"desc" : "Heavy Snow Showers",
		"path": "images/snow.svg"
	},
	"95" : {
		"desc" : "Slight Thunderstorm",
		"path": "images/thunderstorm.svg"
	},
	"96" : {
		"desc" : "Thunderstorm with Light Hail",
		"path": "images/thunderstorm.svg"
	},
	"99" : {
		"desc" : "Thunderstorm with Heavy Hail",
		"path": "images/thunderstorm.svg"
	}
};


// function to display the weather to the page after getting a response from the API
function displayData(data){
	// page element to display current weather
	let current = document.getElementById("current");
	// page element to display 7 day forecast
	let forecast = document.getElementById("forecast");

	// if we got an error in response, display that to the page/user
	if(data.error){
		current.innerHTML = `<p>There was an error: ${data.reason}. Please try again later.</p>`;
	}else{
		// if there were no errors, let's add the weather to the page
		let today = new Date();
		//the current weather
		let currentHTML = `<h3>${data.timezone}</h3>
							<p>${today.toLocaleString("en-us", {weekday: "long"})}, ${today.toLocaleString("en-us", {month: "long"})} ${today.getDate()}</p>
							<img src="${conditions[data.current.weather_code].path}" alt="${conditions[data.current.weather_code].desc}">
							<p><b>Current Weather: </b>${Math.round(data.current.temperature_2m)}&deg; and ${conditions[data.current.weather_code].desc}</p>
							`;
		// add the current weather information to the page
		current.innerHTML = currentHTML;

		// clear out the string for building output to work on content for the forecast
		let forecastHTML = "";

		//the upcoming forecast
		for(let i = 0; i < 8; i++){
			// generate a date object from the given date for this day in the forecast
			let date = new Date(data.daily.time[i]);

			// add the weather for each date to the page with the information listed in comments above
			forecastHTML += `<section class="day">
								<h3><span>${date.toLocaleString("en-us", {weekday: "long"})}</span> ${date.toLocaleString("en-us", {month: "long"})} ${date.getDate()}</h3>
								<img src="${conditions[data.daily.weather_code[i]].path}" alt="${conditions[data.daily.weather_code[i]].desc}">
								<p><b>High: </b>${Math.round(data.daily.temperature_2m_max[i])}</p>
								<p><b>Low: </b>${Math.round(data.daily.temperature_2m_min[i])}</p>
								<p>${conditions[data.daily.weather_code[i]].desc}</p>
							</section>`;
		}
	// add the complete upcoming forecast to the page
	forecast.innerHTML = forecastHTML;
	}
}

//build URL for API call
async function getWeather(location){
	// storing the data about the user's location, used in the endpoint (latitude and longitude)
	let latitude = location.coords.latitude;
	let longitude = location.coords.longitude;

	// our full endpoint with the following settings:
		/*
			- looking for a forecast
			- give latitude and longitude for our location
			- for each day:
				- high temperature
				- low temperature
				- daily weather code
				- eight days of forecast
			- also getting the current temperature and weather code
			- temperature should be returned in Fahrenheit
		*/
	let endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=8&current=temperature_2m,weather_code&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch&forecast_days=8`; 

	// fetch call to API
	fetch(endpoint)
		.then(response => response.json())
		.then(data => {
			displayData(data);
			console.log(data);
		})
		.catch(err => {
			console.error(err.message);
		})
}

//on page load, get geolocation
window.addEventListener("load", function(){
	//get user's geolocation to use to return weather for that location
	//user will have to agree to allow this access, may need to use FIrefox
	if(!navigator.geolocation) {
		document.getElementById("forecast").textContent = 'Geolocation is not supported by your browser';
	} else {
		navigator.geolocation.getCurrentPosition(getWeather);
		// console.log(navigator.geolocation.getCurrentPosition())
	}

	// update the copyright year in the footer
	let now = new Date();
	let span = document.querySelector("footer span");

	span.innerHTML = now.getFullYear();
});
