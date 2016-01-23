(function() {
  var app = angular.module("viewer", []);
  app.controller("ViewController", ["$http", function($http) {
    var WIKI_API = "http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch="
    var WIKI_PAGE = "http://en.wikipedia.org/?curid=";
    var view = this;
    var input = $("input");

    view.getArticles = function(searchValue) {
      var CALLBACK = "&callback=JSON_CALLBACK";
      var searchText = input.val();
      var results = [];

      $http.jsonp(WIKI_API + searchText + CALLBACK).success(function(data) {
        view.results = 0;
        view.hide = false;
        view.show = false;
        view.articles = [];

        var results = data.query.pages;

        angular.forEach(results, function(info, k) {
          view.articles.push({title: info.title, body: info.extract, page: WIKI_PAGE + info.pageid});
          view.results++;
        });
        
        view.hide = true;
        view.show = true;
      });
    }
  }]);
})();
