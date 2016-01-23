/* This program initalizes a mongoDB and then uses the db.collections.find() function
    to find all documents in the parrots collection with age greater than the argument
    passed to it. Uses a projection to only return the name and age fields. Solution
    to NodeSchool's learnyoumongo tutorial.

    - Michael Sharp
    - www.softwareontheshore.com
    - msharp.oh@gmail.com
*/

var age = Number(process.argv[2]);

var url = "mongodb://localhost:27017/learnyoumongo";
var mongo = require("mongodb").MongoClient;

mongo.connect(url, function(error, database) {

  if(!error) {
    var collection = database.collection("parrots");

    collection.find({
      age: {
        $gt: age  //query greater than the argument passed
        
      },{ //includes the fields with 1 and excludes with 0
        name: 1,
        age: 1,
        _id: 0
      }).toArray(function(error, documents) {
      if(!error) {
        console.log(documents);
        database.close();
      } else {
        throw error;
      }
    });
  } else {
    throw error;
  }
});
