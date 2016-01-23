/* This program initalizes a mongoDB and then uses the db.collections.aggregate() to
    find all of the items with the passed size and averages their prices.

    - Michael Sharp
    - www.softwareontheshore.com
    - msharp.oh@gmail.com
*/

var mongo = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/learnyoumongo";
var findSize = process.argv[2];

mongo.connect(url, function(error, database) {
  if(error) {
    throw error;
  } else {
    var collection = database.collection("prices");

    collection.aggregate([
      { $match: { size: findSize }},
      { $group: { _id: "average", average: {
                      $avg: "$price"
        }
      }}
    ]).toArray(function(error, results) {
      if(error) {
        throw error;
      } else {
        var avgPrice = Number(results[0].average).toFixed(2);
        console.log(avgPrice);
        database.close();
      }
    });
  }
