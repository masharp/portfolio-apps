/* This program initalizes a mongoDB and then uses the db.collections.update() function
    to update the age of a specific user found in the "users" collection. Solution to
    learnyoumongo database.

    - Michael Sharp
    - www.softwareontheshore.com
    - msharp.oh@gmail.com
*/

var mongo = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/" + process.argv[2];

mongo.connect(url, function(error, database) {
  if(error) {
    throw error;
  } else {
    var collection = database.collection("users");
    collection.update({
      username: "tinatime"
    }, {
       $set: {
        age: 40
      },
    }, function(error, data) {
      if(error) {
        throw error;
      } else {
        database.close();
      }
    });
  }
});
