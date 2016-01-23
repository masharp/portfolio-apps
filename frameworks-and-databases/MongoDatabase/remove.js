/* This program initalizes a mongoDB and then uses the db.collections.remove() function
  to remove a docment with the passed _id field.

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
    var docId = process.argv[4];
    var collection = database.collection(process.argv[3]);

    collection.remove({
      _id: docId
    }, function(error, data) {
      if(error) {
        throw error;
      } else {
        database.close();
      }
    });
  }
});
