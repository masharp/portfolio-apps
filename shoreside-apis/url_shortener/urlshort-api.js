/* Web API that accepts a url as a parameter and returns a shortened url. The pair
  are stored in the redis database and allows the shortened url to redirect to the
  original. These two routes hook into an Express application and utilize an internal
  database model that calls an external Redis database.
*/
router.get("/apis/urlshort/:url(*)", function(request, response, next) {
  var query = request.query.allow ? request.query.allow : false;
  var url = request.params.url;

  //check if a proper url or a proper query
  if(!query && url.slice(0, 4) !== "http") {
    response.status(500);
    response.json({
      "message": "Invalid URL. Ensure your URL begins with 'http'. Include'?allow=true' after an intentionally invalid URL.'"
    });
  } else {
    var random = Math.floor(Math.random() * 10000);
    var original = url;
    var shortened = "http://softwareontheshore.com/short/" + random;
    var jsonObj = { "original_url" : original, "shortened_url": shortened };

    db.set("short_urls", random, JSON.stringify(jsonObj));

    response.setHeader("Content-Type", "application/json");
    response.json(jsonObj);
  }
});

/* Redirect Routing for Urlshortener */
router.get("/short/:url", function(request, response, next) {
  var url = request.params.url;

  db.get("short_urls", url).then(function(reply) {
    var data = JSON.parse(reply);

    if(data) {
      response.redirect(data.original_url);
    } else {
      response.send("URL Not Found");
    }
  });
});
