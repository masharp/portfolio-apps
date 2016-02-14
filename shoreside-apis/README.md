#Shoreside APIs
  This is a folder that contains the code for various web API projects I have
  completed. Most of these are implemented within my Software on the Shore website.

###APIs
  * [Shoreside Timestamp Microservice](http://www.softwareontheshore.com/apis/timestamp/)
    * Accepts a string as a parameter and checks if it contains either a UNIX timestamp
      or a natural language data. If so, returns both the UNIX timestamp and the natural date.
      If not, returns null for both. FreeCodeCamp project.

  * [Shoreside MyInfo Microservice](http://www.softwareontheshore.com/apis/myinfo)
    * This is a web API project that parses the request header for the ip address, language,
      and browser operating system and then returns them as a JSON object. FreeCodeCamp project.

  * [Shortside URL Shortener Microservice](http://www.softwareontheshore.com/apis/urlshort/)
    * This web API accepts a parameter in the GET request consisting of a valid URL (http://etc)
      or an invalid URL with the query 'allow=true'. Using the shortened url will redirect to the original.

  * [Shorside Image Search Abstraction Layer](http://www.softwareontheshore.com/apis/imagesearch/)
    * A web API that accepts an image search parameter. The results can be paginated by adding the query
      'offset=2'. A list of recent search queries can be viewed at the API access point.

  * [Shoreside File Metadata Microservice](http://www.softwareontheshore.com/apis/filemeta/)
    * A web API that allows a user to submit a FormData file upload parameter with the request.
      When the file is submitted, file metadata will be returned as JSON.
