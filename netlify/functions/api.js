const express = require("express");
const serverless = require("serverless-http");
const request = require("request");

// Create an instance of the Express app
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Create a router to handle routes
const router = express.Router();

// Define a route that responds with a JSON object when a GET request is made to the root path
router.get("/", (req, res) => {
  res.json({
    hello: "hi!",
  });
});

router.get("/getnews", function (req, res) {
  var qParams = [];
  for (var p in req.query) {
    qParams.push({ name: p, value: req.query[p] });
  }
  var url =
    "http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=" +
    qParams[0].name +
    "&count=3&maxlength=300&format=json";
  request(url, function (err, response, body) {
    if (!err && response.statusCode < 400) {
      console.log(body);
      res.send(body);
    }
  });
});

router.get("/getuserstats", function (req, res) {
  var qParams = [];
  for (var p in req.query) {
    qParams.push({ name: p, value: req.query[p] });
  }
  var url =
    "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=730&count=3&maxlength=300&format=json";
  // var url = 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=' + qParams[0].name + '&key=XXXXXXXXXXXXXXXXX&steamid=' + qParams[0].value;
  request(url, function (err, response, body) {
    if (!err && response.statusCode < 400) {
      console.log(body);
      res.send(body);
    }
  });
});

// +"&key=XXXXXXXXXXXXXXXXX&steamid=";

// Use the router to handle requests to the `/.netlify/functions/api` path
// app.use(`/api/`, router);
app.use(`/.netlify/functions/api`, router);

// Export the app and the serverless function
module.exports = app;
module.exports.handler = serverless(app);
