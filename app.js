const express = require('express');
const app = express();
const https = require('https');
const ejs = require('ejs');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
const date = require(__dirname + "/date.js");
const day = date.getDate();


app.get("/", (req, res) => {
  const sendData = {
    location   : "Location",
    temp       : "Temp",
    weatherDec : "Description",
    feel       : "Feel_like",
    humidity   : "Humidity",
    Speed      : "Speed",
    mintemp    : "Mintemp",
    maxtemp    : "Maxtemp",
    pressure   : "Pressure"
  };

  res.render("index", {
    currentDate: day,
    sendData: sendData
  });
});

app.post("/", (req, res) => {

  const cityName = req.body.city;
  const units = "metric"
  const appid = 'dc213691967c76dcec8510cfbe87871e'

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&limit=5&units=${units}&appid=${appid}`
  https.get(url, function(response) {

    response.on("data", function(data) {
      const weathermapData = JSON.parse(data)
      const temp = Math.round(weathermapData.main.temp);
      const weatherDec = weathermapData.weather[0].description;
      const feels_like = weathermapData.main.feels_like;
      const humidity   = weathermapData.main.humidity;
      const windSpeed  = weathermapData.wind.speed;
      const mintemp    = weathermapData.main.temp_min;
      const maxtemp    = weathermapData.main.temp_min;
      const pressure   = weathermapData.main.pressure;

      const sendData = {};
      sendData.location   = cityName;
      sendData.temp       = temp;
      sendData.weatherDec = weatherDec
      sendData.feels_like = feels_like;
      sendData.humidity   = humidity;
      sendData.windSpeed  = windSpeed;
      sendData.mintemp    = mintemp;
      sendData.maxtemp    = maxtemp;
      sendData.pressure   = pressure;

      res.render("index", {
        currentDate: day,
        sendData: sendData
      });;

    });
  });
});

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log('server running on port 3000');
});
