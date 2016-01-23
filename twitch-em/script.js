(function() {
    var STREAMERS = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb",
                          "thomasballinger","noobs2ninjas","beohoff",
                          "RiotGamesBrazil", "FragbiteLive", "realkraftyy", "medryBW", "GfinityTV"];
    var TWITCH_URL = "https://api.twitch.tv/kraken/";

    var app = angular.module("TwitchEm", []);
    app.controller("AppController", ["$http", function($http) {
      var channels = this;

      channels.all = [];
      channels.online = [];
      channels.offline = [];

      STREAMERS.forEach(function(stream) {
        var tempStream = {};

        $http.get(TWITCH_URL + "streams/" + stream).success(function(data) {
          var streaming = (data.stream === null) ? false : true;
          tempStream.username = stream;

          if(streaming) {
            tempStream.status = "fa fa-check";
            tempStream.title = data.stream.channel.status;
          } else {
            tempStream.status = "fa fa-exclamation";
            tempStream.title = "";
          }

          $http.get(TWITCH_URL + "channels/" + stream).success(function(data) {
            tempStream.name = data.display_name;
            tempStream.logo = (data.logo !== null ? data.logo : "http://blog.roblox.com/wp-content/uploads/2014/02/Twitch-Icon.png");

            channels.all.push(tempStream);
            if(streaming) {
              channels.online.push(tempStream);
            } else {
              channels.offline.push(tempStream);
            }
          });
        });
      });
    }]);
    app.controller("PanelController", function() {
      this.tab = 0;

      this.selectTab =  function(setTab) {
        this.tab = setTab;
      };

      this.isSelected = function(checkTab) {
        return this.tab === checkTab;
      }
    });
})();
