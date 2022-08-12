let lat;
let lon;
var unit = "f";
var weather = {};
var locationSet;

window.onload = function () {
	if (sessionStorage['authorizedGeoLocation'] == 1) {
		navigator.geolocation.getCurrentPosition(
			function locSuc(position) {
				locationCheck(false);
				lat = position.coords.latitude;
				lon = position.coords.longitude;
				apiFetch(lat, lon);
			},
			function locFail() {
				return;
			});
	}
	else locationCheck(true);
}

document.getElementById("locReq").onclick = async () => {
	locationSet = await locRequest();
	apiFetch(lat, lon);
	locationCheck(locationSet);
};

function locationCheck(locationSet) {
	var x = document.getElementById("warning");
	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}
}

function locRequest(locationSet) {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function locSuc(position) {
					lat = position.coords.latitude;
					lon = position.coords.longitude;
					resolve();
				},
				function locFail() {
					alert("Location request denied, can't fetch weather.");
					reject();
				}
			);
		} else {
			alert(
				"Weather data can't be fetched. Make sure you're using a supported browser."
			);
			reject();
		}
	});
}

function apiFetch(lat, lon) {
	fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=90f14c855cac366c6c17ac5c2c77d82c`
	)
		.then(function (resp) {
			return resp.json();
		})
		.then(function (resp) {
			console.log("API call succeeded.");
			console.log(resp);
			weather = resp;
			sessionStorage['authorizedGeoLocation'] = 1;
			locationCheck(false);
			dataFill();
		})
		.catch(function () {
			console.log("Unable to reach OpenWeatherMap API.");
		});
}

function dataFill() {
	document.getElementById("temp").innerHTML = temp(weather.main.temp) + "°";
	document.getElementById("mainConditions").innerHTML = weather.weather[0].main;
	document.getElementById("feel").innerHTML = temp(weather.main.feels_like) + "°";
	document.getElementById("humid").innerHTML = weather.main.humidity + "%";
	document.getElementById("wind").innerHTML = windUnit(weather.wind.speed);
	document.getElementById("windDirection").innerHTML = windDirection(weather.wind.deg);
	document.getElementById("sunRise").innerHTML = unixConvert(weather.sys.sunrise);
	document.getElementById("sunSet").innerHTML = unixConvert(weather.sys.sunset);
	document.getElementById("city").innerHTML = weather.name;
	document.getElementById("details").innerHTML = detailedWeather(weather.weather[0].description);
}

function windUnit(speed) {
	if (unit == "f") {
		return parseInt(speed * 2.237) + "mph";
	} else {
		return parseInt(speed) + "m/s";
	}
}

function detailedWeather(string) {
	const words = string.split(" ");
	var details = "";
	for (let i = 0; i < words.length; i++) {
		words[i] = words[i][0].toUpperCase() + words[i].substr(1);
		if (words[i] == ",") words[i] = " ";
		details += words[i] + " ";
	}
	return details;
}

function windDirection(weather) {
	var directions = ["↑ N", "↗ NE", "→ E", "↘ SE", "↓ S", "↙ SW", "← W", "↖ NW"];
	return directions[Math.round(weather / 45) % 8];
}

function unixConvert(unix) {
	var date = new Date(unix * 1000);
	var ampm = date.getHours() >= 12 ? "pm" : "am";
	var hour = ((date.getHours() + 11) % 12) + 1;
	var minutes = date.getMinutes();
	if (minutes == 0) minutes = "00";
	var time = hour + ":" + minutes + ampm;
	return time;
}

function temp(tmp) {
	if (unit == "f") {
		return fahrenheit(tmp);
	} else {
		return celsius(tmp);
	}
}

function fahrenheit(num) {
	return Math.round((parseFloat(num) - 273.15) * 1.8 + 32);
}

function celsius(num) {
	return Math.round(parseFloat(num) - 273.15);
}

function unitToggle() {
	if (document.getElementById("unit").checked == true) {
		unit = "c";
	} else if (document.getElementById("unit").checked == false) {
		unit = "f";
	}
	dataFill();
}

function modal() {
	var modal = document.getElementById("modal");
	var btn = document.getElementById("myBtn");
	var search = document.getElementById("select");
	var span = document.getElementsByClassName("close")[0];

	modal.style.display = "block";

	span.onclick = function () {
		modal.style.display = "none";
	};

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};
}

function locationSelect(id) {
	id = id.replace(/\D/g, "");
	lat = document.getElementById("lat" + id).innerHTML;
	lon = document.getElementById("lon" + id).innerHTML;
	apiFetch(lat, lon);
	document.getElementById("warning").style.display = "none";
	document.getElementById("modal").style.display = "none";
}

const form = document.querySelector(".modal-content form");
const input = document.querySelector(".modal-content input");
const msg = document.querySelector(".modal-content .msg");
const list = document.querySelector(".modal-content .cities");
const apiKey = "90f14c855cac366c6c17ac5c2c77d82c";

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const listItems = list.querySelectorAll(".modal-content .city");
	const inputVal = input.value;
	const limit = 4;
	const url = `https://api.openweathermap.org/geo/1.0/direct?q=${inputVal}&limit=${limit}&appid=90f14c855cac366c6c17ac5c2c77d82c`;

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			let locations = ([{ name, lat, lon, country }] = data);
			document.getElementById("cities").innerHTML = "";
			for (let i = 0; i < limit; i++) {
				if (typeof locations[i].state === "undefined") {
					locations[i].state = "Unknown State";
				}
				const li = document.createElement("li");
				li.classList.add("city");
				const markup = `
			<div class="column">
			<div class="block">
			<h2 class="city-name">${locations[i].name}</h2>
			<p class="data">${locations[i].state}</p>
			<p class="subtitle">${locations[i].country}</p>
			<button id="button${[i]}" class="select" onClick="locationSelect(this.id)">Select</button>
			<div class='hidden${[i]}'>
			<p id="lat${[i]}" hidden>${locations[i].lat}</p>
			<p id="lon${[i]}" hidden>${locations[i].lon}</p>
			</div>
			</div>
			</div>
			`;
				li.innerHTML = markup;
				list.appendChild(li);
			}
		})
		.catch((e) => { });

	msg.textContent = "";
	form.reset();
	input.focus();
});
