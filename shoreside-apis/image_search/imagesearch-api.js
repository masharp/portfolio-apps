/* A web API that accepts an image search parameter. The results can be paginated by adding the query
'offset=2'. A list of recent search queries can be viewed at the API access point. Utilizes the
Bing Search API. Hooks into an Express / Node app. */

router.get("/apis/imagesearch/:param(*)", function(request, response, next) {
  let requestPkg = require("request");
  let search = request.params.param;
  let offset = request.query.offset ? request.query.offset : 0;
  let searchURL = "https://api.datamarket.azure.com/Bing/Search/Image?Query=%27" +
                    search + "%27&$top=10&$skip=" + offset + "&$format=JSON";
  let key = process.env.BING_PRIMARY_KEY;

  /* self executing promise to retreive image search results from Bing API */
  (function() {
    return new Promise(function(resolve, reject) {
      requestPkg.get(searchURL, {auth: { user: "", password: key }}, function(error, reply) {
        if(error) reject(Error(error));
        resolve(reply);
      });
    });
  })().then(function(reply) {
    let data = JSON.parse(reply.body);
    let jsonObj = {results: []};

    data.d.results.forEach(function(result) {
      let newObj = {
        url: result.MediaUrl,
        snippet: result.Title,
        thumbnail: result.Thumbnail.MediaUrl
      };
      jsonObj.results.push(newObj);
    });

    /* log the search to the recent searchs in websites Redis database */
    db.recordSearch("recent_image_searches", JSON.stringify({ term: search, when: new Date()}));

    response.setHeader("Content-Type", "application/json");
    response.json(jsonObj);
  });
});

/* Route to handle imagesearch latest searches */
router.get("/apis/searches", function(request, response, next) {

  db.getSearches("recent_image_searches").then(function(reply) {
    let data = { results: [] };

    reply.forEach(function(item) {
      data.results.push(JSON.parse(item));
    });

    response.setHeader("Content-Type", "application/json");
    response.json(data);
  });
});
