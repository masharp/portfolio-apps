/* This program initalizes a mongoDB and then uses the db.collections.insert() function
    to create a new document in the docs collection containing an object with the firstName
    and lastName property values passed to the program. Solution to learnyoumongo tutorial.

    - Michael Sharp
    - www.softwareontheshore.com
    - msharp.oh@gmail.com
*/


var mongo = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/learnyoumongo";

var firstName = process.argv[2];
var lastName = process.argv[3];
var newDoc = {
  firstName: firstName,
  lastName: lastName
};

mongo.connect(url, function(error, database) {
  if(!error) {
    var collection = database.collection("docs");

    collection.insert(newDoc, function(error, data) {
      if(!error) {
        console.log(JSON.stringify(newDoc));
        database.close();
      } else {
        throw error;
      }
    });
  } else {
    throw error;
  }
});
