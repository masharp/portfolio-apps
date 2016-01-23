(function() {
  var app = angular.module("calc", []);
  app.controller("CalcController", ["$scope", function($scope) {

    $scope.screen = 0;
    var result = 0;
    var operation = null;

    $scope.add = function() {
      operate();
      operation = "+";
    }
    $scope.subtract = function() {
      operate();
      operation = "-";
    }
    $scope.multiply = function() {
      operate();
      operation = "*";
    }
    $scope.divide = function() {
      operate();
      operation = "/";
    }
    $scope.modulate = function() {
      operate();
      operation = "%";
    }
    $scope.changeSign = function() {
        $scope.screen = (parseFloat($scope.screen) * -1).toString();
    }
    $scope.submit = function() {
      operate();
      operation = "=";
      $scope.screen = result;
    }
    $scope.clear = function() {
      $scope.screen = 0;
      result = 0;
      operation = null;
    }
    $scope.display = function(num) {
      if($scope.screen.toString() == "0" || operation == "="){
        $scope.screen = "";
      }
      if(operation == "=") {
        operation = null;
      }
      $scope.screen = $scope.screen + num;
    }

    function operate() {
      if(operation == "+") {
        result += parseFloat($scope.screen);
        $scope.screen = 0;
      } else if(operation == "-") {
        result -= parseFloat($scope.screen);
        $scope.screen = 0;
      } else if(operation == "*") {
        result *= parseFloat($scope.screen);
        $scope.screen = 0;
      } else if(operation == "/") {
        result /= parseFloat($scope.screen);
        $scope.screen = 0;
      } else if(operation == "%") {
        result %= parseFloat($scope.screen);
        $scope.screen = 0;
      } else {
        result = parseFloat($scope.screen);
        $scope.screen = 0;
      }
    }
  }]);
})();
