'use strict';

const app = angular.module('news', []);

app.controller('NewsController', ['$http', '$scope', ($http, $scope) => {
  const url = 'https://crossorigin.me/http://www.freecodecamp.com/news/hot'; // prepend with crossorigin to avoid CORS error
  $scope.stories = [];

  $http.get(url).success((data) => { $scope.stories = chunk(data, (data.length / 3)); });

}]);


// function for chunking columns
function chunk(data, size) {
  const newArray = [];

  for (let i = 0; i < data.length; i += size) {
    newArray.push(data.slice(i, i + size));
  }
  return newArray;
}
