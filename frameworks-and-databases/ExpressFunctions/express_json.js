/* These Express.js application are useful for understand JSON queries and RESTful APIs

  - by Michael Sharp
  - msharp.oh@gmail.com
  - www.softwareontheshore.com
*/


/*
- This application reads a file, parses it into JSON and then serves the JSON object
*/

var express = require("express");
var fs = require("fs");

var port = process.argv[2];
var filePath = process.argv[3];

var app = express();

app.get("/books", function(request, response) {
  fs.readFile(filePath, function(error, data) {
    if(error) {
      console.error(error);
    } else {
      var query = JSON.parse(data);
      response.json(query);
    }
  });
});

app.listen(port);



/*
- This application that returns a JSON object of a URLencoded query string
*/

var express = require("express");
var port = process.argv[2];
var app = express();

app.get("/search", function(request, response) {
  var query = JSON.stringify(request.query);

  response.send(query);
});

app.listen(port);
