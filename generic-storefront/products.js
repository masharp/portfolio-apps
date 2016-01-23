(function() {
  var app = angular.module("store-products", []);
  app.directive("productTitle", function() {
    return {
      restrict: "E", //E stands for html ELEMENT
      templateUrl: "product-title.html",

      /* --- attribute drective ---
      restrict: "A",
      templateUrl: "product-title.html",
      */

    };
  });
  app.directive("productPanel", function() {
    return {
      restrict: "E",
      templateUrl: "product-panel.html",
      controller: function() {
        this.tab = 0;

        this.selectTab =  function(setTab) {
          this.tab = setTab;
        };

        this.isSelected = function(checkTab) {
          return this.tab === checkTab;
        }
      },
      controllerAs: "panels",
    };
  });
})();
