/* Web API that queries the request header and returns a JSON object that includes
  the requests IP address, language, and browser operating system. Hooks into a
  Node.js express app. */
router.get("/apis/myinfo", function(request, response, next) {

  //JSON Object with ip included at assignment
  var myInfo = {
    "ipAddress": request.connection.remoteAddress.toString(),
    "language": "",
    "software": ""
  };

  //cycles through the request.rawHeaders to find the language and sotware
  for(var i = 0; i < request.rawHeaders.length - 1; i++) {
    if(request.rawHeaders[i] === "User-Agent") {
      //split the user-agent field by (parantheses) in a regex and then pull out useful info
      var temp = request.rawHeaders[i + 1].split(/[()]+/).filter(function(e){ return e; });
      myInfo.software = temp[1];
    }
    if(request.rawHeaders[i] === "Accept-Language") {
      myInfo.language = request.rawHeaders[i + 1].slice(0, 5);
    }
  }

  response.json(myInfo);
});
