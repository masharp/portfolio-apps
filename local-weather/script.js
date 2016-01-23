//JavaScript application that uses the Yahoo Weather API found at https://developer.yahoo.com/weather/
$(document).ready(function() {

  $("body").flowtype({
    minFont: 10,
    maxFont: 40
  });

  $("#input-box").attr("value", "Seattle");

  $("#input-box").click(function() {
    this.value = "";

    $("#errors").text("");

    for (var i = 0; i < 4; i++) {
      $("#weather"+i).text("");
      $("#temp"+i).text("");
      $("#day"+i).text("");
    }
  });

  $("#input-box").keypress(function(event) {
    if(event.which == 13) {
      userCity = $("#input-box").val();
      getLocationInformation(userCity);
      $("#input-box").blur();
    }
  });

  $("#celsius ").click(function() {
    measurement = getMeasurement();
    getLocationInformation(userCity);

  });

  $("#fahrenheit").click(function() {
    measurement = getMeasurement();
    getLocationInformation(userCity);
  });

  var userCity = $("#input-box").val();
  var measurement = getMeasurement();
  var YAHOO_URL = "https://query.yahooapis.com/v1/public/yql?q=";

  getLocationInformation(userCity);

  //----------------------------------------------------------------

  function getLocationInformation(userCity) {

    var yahooLocationQuery = "SELECT woeid FROM geo.placefinder WHERE text='"+ userCity +"'&format=json";
    var jsonQuery = YAHOO_URL + yahooLocationQuery;
    $.getJSON(jsonQuery, function(data){
      var locationID = null;

      //if no geo-location data found with input
      if (data.query.count <= 0){
        locationID = null;
      } else if (data.query.count == 1) {
        locationID = data.query.results.Result.woeid;
      } else {
        locationID = data.query.results.Result[0].woeid;
      }

      getWeatherInformation(locationID);
    });
  }

  function getWeatherInformation(locationID) {
    if (locationID != null) {
      var weatherQuery = "SELECT * FROM weather.forecast WHERE woeid=" + locationID + " AND u='"+ measurement + "' &format=json";
      var jsonQuery = YAHOO_URL + weatherQuery;
      $.getJSON(jsonQuery, function(data) {
        for (var i = 0; i < 4; i++) {
          var forecast = data.query.results.channel.item.forecast[i];

          setWeather(forecast.code, $("#weather"+ i));
          $("#temp"+ i).html(Math.round((parseInt(forecast.low) + parseInt(forecast.high)) / 2) + "&deg" + measurement.toUpperCase());
          $("#day"+ i).html(forecast.day);
        }
      });
    }
    else {
      $("#errors").text("That location cannot be found!");
      for (var i = 0; i < 4; i++) {
        $("#weather"+i).text("---");
        $("#temp"+i).html("----");
        $("#day"+i).html("-----");
      }
    }
  }

  function getMeasurement() {
    var fahrRadio = document.getElementById("fahrenheit").checked;
    var celsRadio = document.getElementById("celsius").checked;

    if (fahrRadio) {
      return "f";
    }
    if (celsRadio) {
      return "c";
    }
    else return "f";
  }
});
//END of document.ready()------------

function setWeather(code, elementID) {
  switch(parseInt(code)) {
    case 0:
      elementID.text("Tornado");
      break;
    case 1:
      elementID.text("Stormy");
      break;
    case 2:
      elementID.text("Windy");
      break;
    case 3:
      elementID.text("Stormy");
      break;
    case 4:
      elementID.text("Stormy");
      break;
    case 5:
      elementID.text("Snowy");
      break;
    case 6:
      elementID.text("Rainy");
      break;
    case 7:
      elementID.text("Snowy");
      break;
    case 8:
      elementID.text("Rainy");
      break;
    case 9:
      elementID.text("Rainy");
      break;
    case 10:
      elementID.text("Rainy");
      break;
    case 11:
      elementID.text("Rainy");
      break;
    case 12:
      elementID.text("Rainy");
      break;
    case 13:
      elementID.text("Snowy");
      break;
    case 14:
      elementID.text("Snowy");
      break;
    case 15:
      elementID.text("Snowy");
      break;
    case 16:
      elementID.text("Snowy");
      break;
    case 17:
      elementID.text("Hail");
      break;
    case 18:
      elementID.text("Hail");
      break;
    case 19:
      elementID.text("Hail");
      break;
    case 20:
      elementID.text("Foggy");
      break;
    case 21:
      elementID.text("Foggy");
      break;
    case 22:
      elementID.text("Foggy");
      break;
    case 23:
      elementID.text("Foggy");
      break;
    case 24:
      elementID.text("Windy");
      break;
    case 25:
      elementID.text("Freezing");
      break;
    case 26:
      elementID.text("Cloudy");
      break;
    case 27:
      elementID.text("Cloudy");
      break;
    case 28:
      elementID.text("Cloudy");
      break;
    case 29:
      elementID.text("Cloudy");
      break;
    case 30:
      elementID.text("Cloudy");
      break;
    case 31:
      elementID.text("Clear");
      break;
    case 32:
      elementID.text("Sunny");
      break;
    case 33:
      elementID.text("Clear");
      break;
    case 34:
      elementID.text("Sunny");
      break;
    case 35:
      elementID.text("Hail");
      break;
    case 36:
      elementID.text("Sunny");
      break;
    case 37:
      elementID.text("Stormy");
      break;
    case 38:
      elementID.text("Stormy");
      break;
    case 39:
      elementID.text("Stormy");
      break;
    case 40:
      elementID.text("Rainy");
      break;
    case 41:
      elementID.text("Snowy");
      break;
    case 42:
      elementID.text("Snowy");
      break;
    case 43:
      elementID.text("Snowy");
      break;
    case 44:
      elementID.text("Cloudy");
      break;
    case 45:
      elementID.text("Stormy");
      break;
    case 46:
      elementID.text("Snowy");
      break;
    case 47:
      elementID.text("Stormy");
      break;
    case 3200:
      elementID.text("Full Moon");
      break;
    default:
      elementID.text("Sunny");
      break;
  }
}
