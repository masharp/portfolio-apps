#Shoreside URL Shortener Microservice
  Web API that accepts a url as a parameter and returns a shortened url. The pair
  are stored in the Redis database and allows the shortened url to redirect to the
  original. These two routes hook into an Express application and utilize an internal
  database model that calls an external Redis database.

### Known Issues
  * I currently only intend to store shortened urls and originals for a relatively small
    amount of time. 
