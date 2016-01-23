/* This express application responds with a string when a given port GETs a "/home"

  - by Michael Sharp
  - msharp.oh@gmail.com
  - www.softwareontheshore.com
*/

var port = process.argv[2];
var express = require("express");
var app = express();

app.get("/home", function(request, response) {
  response.end("Hello World!");
});
app.listen(port);
