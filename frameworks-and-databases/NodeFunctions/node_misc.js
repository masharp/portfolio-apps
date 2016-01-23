/* These functions are useful for modulation and file system manipulation within
    Node.js. Some functions are my solutions to the 'learnyounode' command-line
    tutorial.

  - by Michael Sharp
  - msharp.oh@gmail.com
  - www.softwareontheshore.com
*/



/*
  This function shows the modulation of the function after this into an exportable
  function.
*/
function node_modulate(args) {
  //-------PROGRAM.JS--------
  var myModule = require("./myFilterModule");

  myModule(args[2], args[3], function(error, data) {
    if(error) {
      return console.error("Error: ", error);
    } else {
      data.forEach(function(item) {
        console.log(item);
      });
    }
  });

  //-------MODULE.JS --------
  var fs = require("fs");
  var path = require("path");

  module.exports = function(dir, target, callback) {
    var targetExt = "." + target;

    var fileDir = fs.readdir(dir, function(error, data) {
      if(error) {
        return callback(error);
      } else {
        data = data.filter(function(item) {
          return path.extname(item) === targetExt;
        });
      }
      return callback(null, data);
    });
  }
}


/*
  This function reads the files in a directory and filters them based on the passed
  extension type.
*/
function node_dir(args) {
  var fs = require("fs");
  var path = require("path");

  var targetExt = "." + args[3];
  var fileDir = fs.readdir(args[2], callback);

  function callback(error, list) {
    if(!error) {
      list.forEach(function(item) {
        if(path.extname(item) == targetExt) {
          console.log(item);
        }
      });
    }
  }
}

/*
  This function reads the newlines in a sample string
*/
function node_newlines(args) {
  var fs = require('fs');

  fs.readFile(args[2], "utf8", callback);


  function callback(error, data) {
    if(!error) {
      var result = data.split("\n").length - 1;
      console.log(result);
    }
  }
}
