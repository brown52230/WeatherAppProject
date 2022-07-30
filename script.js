function locRequest() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function locSuc(position) {
                apiFetch(position.coords.latitude, position.coords.longitude);
            },
            function locFail() {
                ipLoc();
            });
    }
    else {
        ipLoc();
    }
}

function ipLoc() {
    fetch(`http://ip-api.com/json/`)
        .then(function (resp) { return resp.json() })
        .then(function ipSuc(response) {
                console.log("Weather retreived through IP address.");
                apiFetch(response.lat, response.lon);
            })
        .catch(function () {
            alert("Cannot retreive location.");
        });
}

function apiFetch(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=90f14c855cac366c6c17ac5c2c77d82c`)
        .then(function (resp) { return resp.json() })
        .then(function (resp) {
            console.log(resp);
        })
        .catch(function () {
            // Error Catching
        });
}
2
function temp() { console.log('tmp'); document.getElementById("temp").innerHTML = data; }

function fahrenheit(d) { return Math.round(((parseFloat(d.main.temp) - 273.15) * 1.8) + 32); }

function celcius(d) { return Math.round(parseFloat(d.main.temp) - 273.15); }