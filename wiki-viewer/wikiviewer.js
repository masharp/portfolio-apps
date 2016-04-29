'use strict';

const app = angular.module('viewer', []);

app.controller('ViewController', ['$http', '$scope', ($http, $scope) => {
  const WIKI_API = 'http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch='
  const WIKI_PAGE = 'http://en.wikipedia.org/?curid=';
  const input = $('input');

  $scope.getArticles = function getArticles() {
    const CALLBACK = '&callback=JSON_CALLBACK';
    const searchText = input.val();
    const results = [];

    $http.jsonp(WIKI_API + searchText + CALLBACK).success((data) => {
      $scope.results = 0;
      $scope.hide = false;
      $scope.show = false;
      $scope.articles = [];

      const results = data.query.pages;

      angular.forEach(results, (info) => {
        $scope.articles.push({ title: info.title, body: info.extract, page: WIKI_PAGE + info.pageid });
        $scope.results++;
      });

      $scope.hide = true;
      $scope.show = true;
    });
  }

  $scope.handleEnterKey = function handleEnterKey(event) {
    if (event.keyCode === 13) $scope.getArticles();
  }
}]);
