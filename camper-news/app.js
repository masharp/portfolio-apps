(function() {
  var app = angular.module("news", []);
  app.controller("NewsController", ["$http", function($http) {
    var news = this;
    news.stories = [];

    $http.get("http://www.freecodecamp.com/news/hot").success(function(data) {
      news.stories = chunk(data, (data.length / 3));
    });

    //function for chunking columns
    function chunk(arr, size) {
      var newArray = [];

      for(var i = 0; i < arr.length; i += size) {
        newArray.push(arr.slice(i, i+size));
      }
      return newArray;
    }
  }]);
})();
