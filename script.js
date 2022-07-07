navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=90f14c855cac366c6c17ac5c2c77d82c`)
        .then(function (resp) { return resp.json() })
        .then(function (data) {
            // Push data to other functions.
        })
        .catch(function () {
            // Error Catching
        });
});
