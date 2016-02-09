/* Timestamp API that accepts a unix timestamp or a natural date and returns both.
    If neither are found, returns null. Hooks into an express app.

    TODO: currently functional on most cases, however edge cases like " 2016" or
      "De, 2016" pass. */

router.get("/shoreside-timestamp/:timestamp", function(request, response, next) {
  //adds a prototype function to Date that converts a natural time to a unix timestamp
  Date.prototype.getUnixTime = function() { return (this.getTime()/1000 | 0); };

  //function that converts a UTC date string to a natural string
  function formatNatural(utcDate) {
    utcDate = utcDate.split(" ");
    var month = utcDate[1];
    var day = utcDate[2];
    var year = utcDate[3];

    switch(month) {
      case "Dec":
        month = "December";
        break;
      case "Jan":
        month = "January";
        break;
      case "Feb":
        month = "Februrary";
        break;
      case "Mar":
        month = "March";
        break;
      case "Apr":
        month = "April";
        break;
      case "Jun":
        month = "June";
        break;
      case "Jul":
        month = "July";
        break;
      case "Aug":
        month = "August";
        break;
      case "Sep":
        month = "September";
        break;
      case "Oct":
        month = "October";
        break;
      case "Nov":
        month = "November";
        break;
    }

    return(month + " " + day + ", " + year);
  }

  //timestamp object that holds the input request parameter and the default output JSON
  var timestamp = {
    input: request.params.timestamp ? request.params.timestamp : "",
    output: { "unix" : null, "natural" : null }
  };

  //first checks if it is a valid natural date by seeing if it converts to a Date object
  if(new Date(timestamp.input).getTime() > 0) {
    timestamp.output =  {
      "unix" : new Date(timestamp.input).getUnixTime(),
      "natural" : timestamp.input
    };
  }
  //checks if it is a valid unix timestamp by checking the length and ensuring it is a number
  else if (timestamp.input.length === 10 && !isNaN(timestamp.input)) {
    timestamp.output = {
      "unix" : timestamp.input.toString(),
      "natural": formatNatural(new Date(timestamp.input * 1000).toDateString())
    };
  }

  response.setHeader("Content-Type", "application/json");
  response.json(timestamp.output);
});
