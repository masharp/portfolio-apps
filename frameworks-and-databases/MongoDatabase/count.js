/* This program initalizes a mongoDB and then uses the db.collections.count() to
  count the number of documents that meet the passed age comparison.

    - Michael Sharp
    - www.softwareontheshore.com
    - msharp.oh@gmail.com
*/

var mongo = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/learnyoumongo";
var arg = Number(process.argv[2]);

mongo.connect(url, function(error, database) {
  if(error) {
    throw error;
  } else {
    var collection = database.collection("parrots");

    collection.count({
      age: {
        $gt: arg
      }
    }, function(error, count) {
      if(error) {
        throw error;
      } else {
        console.log(count);
        database.close();
      }
    });
  }
});
