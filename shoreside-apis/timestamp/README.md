#Shoreside Timestamp API
 This is an API that accepts a unix timestamp or a natural date and returns both.
 If neither are found, returns null. Hooks into an express app. A FreeCodeCamp
 project.

### Known Issues
 * currently functional on most cases, however edge cases like " 2016" or
   "De, 2016" pass.
