/* These functions are useful for manipulating http networking functions in
   Node.js. Many of these are my solutions for the 'learnyounode' command-line
   tutorial module.

  - by Michael Sharp
  - msharp.oh@gmail.com
  - www.softwareontheshore.com
*/



/*
  This is a function for a simple HTTP server that serves JSON data when
  it receives a GET request containing an 'iso' key inside of query string and
  and ISO-format time as the value.
*/
function http_JSON(args)
  var port = args[2];
  var network = require("http");
  var url = require("url");

  var paths = {
      "/api/parsetime": function(parsedURL) {
          var date = new Date(parsedURL.query.iso)
          return {
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
          };
      },
      "/api/unixtime": function(parsedURL) {
          var date = new Date(parsedURL.query.iso);

          return {"unixtime" : date.getTime() };
      },
  }

  var server = network.createServer(function(request, response) {
    var parsedURL = url.parse(request.url, true);
    var data = paths[parsedURL.pathname];

    if(data) {
        response.writeHead(200, {"content-type": "application/json"});
        response.end(JSON.stringify(data(parsedURL)));
    }
  });

  server.listen(port);
}

/*
  This is a function for a simple http server for receiving a POST request containing
  a string and returning that string converted to uppercase.
*/
function http_uppercase(args) {
  var port = args[2];
  var network = require("http");
  var mapper = require("through2-map");

  var server = network.createServer(function(request, response) {
    if(request.method === "POST") {
      request.pipe(mapper(function(chunk) {
        return chunk.toString().toUpperCase();
      })).pipe(response);
    }
  });

  server.listen(port);
}


/*
  This is a function that creates a simple http server for sending a sample file
  containing strings for each request
*/
function http_file(args) {
  var port = args[2];
  var file = args[3];
  var network = require("http");
  var fs = require("fs");

  var server = network.createServer(function(request, response) {
    response.writeHead(200, {"content-type": "text/plain"});
    fs.createReadStream(file).pipe(response);
  });

  server.listen(port);
}


/*
  This is a function that creates a simple TCP server that gives the current date and time
  for each connection.
*/
function http_time(args) {
  var port = args[2];
  var network = require("net");
  var server = network.createServer(function(socket) {
    var date = new Date();
    var dateStr = "";
    function addZero(num) {
      return (num < 10 ? "0" : "") + num;
    }

    dateStr += addZero(date.getFullYear()) + "-";
    dateStr += addZero(date.getMonth() + 1) + "-";
    dateStr += addZero(date.getDate()) + " ";
    dateStr += addZero(date.getHours()) + ":";
    dateStr += addZero(date.getMinutes()) + "\n";

    socket.end(dateStr); //writes the data the socket object and then closes the socket
  });

  server.listen(port);
}

/*
  This is a function that manages three http.get rquests asynchronously by tracking
  the completion and position of each request and outputing the results in their
  original get order.
*/
function http_async(args) {
  var urls = [argsv[2], args[3], args[4]];
  var http = require("http");

  var messages = [];
  var unfinished = 0;

  urls.forEach(function(url, index) {
    http.get(url, function(response) {
      var stringData = "";
      unfinished++;

      response.setEncoding("utf8");
      response.on("error", console.error);

      response.on("data", function(data) {
        stringData += data;
      });

      response.on("end", function() {
        unfinished--;
        messages[index] = stringData;

        if(unfinished === 0) {
          messages.forEach(function(message) {
            console.log(message);
          });
        }
      });
    });
  });
}

/*
  This is a function that makes an http request and then concats all of the data
  streams into one string.
*/
function http_concat(args) {
  var url = args[2];
  var http = require("http");
  var concatString = "";

  http.get(url, function(response) {
    response.setEncoding("utf8");

    response.on("error", console.error);
    response.on("data", function(data) {
      concatString += data;
    });
    response.on("end", function() {
      console.log(concatString.length);
      console.log(concatString);
    })
  });
}


/*
  This is a function that makes an http.get request for a stream of data.
*/
function http_stream(args) {
  var arg = args[2];
  var http = require('http');

  http.get(arg, function(response) {

    response.setEncoding("utf8");
    response.on("data", console.log);
    response.on("error", console.error);
  });
}
