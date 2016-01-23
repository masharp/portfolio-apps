/* These snippets of code are largely useful for understand Express.js middleware modules
  and their different potential uses.

  - by Michael Sharp
  - msharp.oh@gmail.com
  - www.softwareontheshore.com
*/


/*
  This app uses a security middleware (crypto) to create a SHA-1 hash of a URL paramater
*/

var express = require("express");
var crypto = require("crypto");

var port = process.argv[2];
var app = express();

app.put("/message/:ID", function(request, response) {
  var id = request.params.ID;
  response.end(crypto.createHash("sha1").update(new Date().toDateString() + id).digest("hex"));
});

app.listen(port);



/*
  This app uses a stylesheet template engine (Stylus) middeleware and serves the result statically
*/

var express = require("express");
var stylus = require("stylus");

var port = process.argv[2];
var stylesheet = process.argv[3];

var app = express();

app.use(stylus.middleware(stylesheet));
app.use(express.static(stylesheet));

app.listen(port);


/*
  This app uses bodyparser middleware to process a form and the reverse the string in that form
*/

var port = process.argv[2];
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.post("/form", function(request, response) {
  response.end(request.body.str.split("").reverse().join(""));
});

app.listen(port);


/*
  This app uses an HTML template engine (Jade) middleware and then renders the jade file
*/

var port = process.argv[2];
var jadeFile = process.argv[3];

var express = require("express");
var app = express();

app.set("view engine", "jade");

app.get("/home", function(request, response) {
  response.render(jadeFile, {date: new Date().toDateString()});
});

app.listen(port);

/*
  This app statically serves a file at a particular port, using Express middleware
*/

var port = process.argv[2];
var filePath = process.argv[3];

var express = require("express");
var app = express();

app.use(express.static(filePath || path.join(__dirname, "public")));
app.listen(port);
