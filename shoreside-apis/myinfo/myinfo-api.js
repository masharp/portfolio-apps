/* Web API that queries the request header and returns a JSON object that includes
  the requests IP address, language, and browser operating system. Hooks into a
  Node.js express app. */
router.get("/apis/myinfo", function(request, response, next) {

  //JSON Object with ip included at assignment
  var myInfo = {
    "ipAddress": request.ip,
    //split the user-agent field by (parantheses) in a regex and then pull out useful info
    "language": request.get("Accept-Language").slice(0, 5),
    "software": request.get("User-Agent").split(/[()]+/).filter(function(e) { return e; })[1]
  };

  response.setHeader("Content-Type", "application/json");
  response.json(myInfo);
});
