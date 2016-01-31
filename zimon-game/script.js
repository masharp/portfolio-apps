/*
  This JavaScript initializes my modern take on the old table-top SimonSays game, where the device
  lights up in a pattern of increasing length and speed and the player must match the pattern
  for as long as possible, scoring points based on the rounds correctly copied. My web application
  uses four squares, each uniquely colored and with a unique corresponding audio file. There is also
  a small animation when the square is "activated" by the computer or by the player.

  Helped over a small hump by the good coders at: http://codeplanet.io

  TODO: fix a few bugs with scoring

    - by Michael Sharp 2016
    www.softwareontheshore.com
*/

var simon = {
  score: 0,
  round: 0,
  tempo: 1000,
  playerMoves: 0,
  playerMode: false,
  computerPattern: [],
  /*
    ---------------------
    Audio Files Array
    ---------------------
      - contains the unique audio files provided by freecodecamp for each tile
   */
  audio: [
    "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
    "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
    "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
    "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
  ],
  /*
    ---------------------
    Game Init Function
    ---------------------
      - function that resets object properties and begins the game by triggering
        the first computer "turn"
   */
  init: function init() {
    simon.score = 0;
    simon.round = 0;
    simon.tempo = 1000;
    simon.playerMoves = 0;
    simon.playerMode = false;
    simon.computerPattern = [];

    simon.computerTurn();

  },
  /*
    ---------------------
    Computer Turn Function
    ---------------------
      - function that controls the computer "turn". adds a random tile number to
        the object property array and then checks if the tempo needs to be increased.
        then, triggers the animation of the computer pattern.
   */
  computerTurn: function computerTurn() {
    var newTile = Math.floor(Math.random() * 4) + 1;
    simon.computerPattern.push(newTile);

    //as the round gets larger, tempo gets faster
    if(simon.round < 5) {
      simon.tempo = 800;
    } else if (simon.round >= 5 && simon.round < 15) {
      simon.tempo = 600;
    } else if (simon.round >= 15 && simon.round < 30) {
      simon.tempo = 400;
    } else {
      simon.tempo = 200;
    }
    simon.activateTiles(simon.computerPattern, simon.tempo);

  },
  /*
    ---------------------
    Player Turn Function
    ---------------------
      - function used by a user tile-click event that takes the tile number clicked.
        checks if it's the player's turn and then compares it to the computer pattern array.
        if it is still the players turn and the tile matches the pattern, continues accepting inputs.
        otherwise, triggers a new computer turn. if tile does not match, immediately ends the game.
   */
  playerTurn: function playerTurn(tile) {
    if(simon.playerMode === true && (simon.playerMoves <= simon.round)) {
      var playerPattern = [];
      playerPattern.push(tile);

      if(tile == simon.computerPattern[simon.playerMoves] && (simon.playerMoves == simon.round)) {
        simon.activateTiles(playerPattern, 10);

        simon.playerMode = false;
        simon.playerMoves = 0;
        simon.round++;

        simon.score++;
        $("#score").val(simon.score);

        simon.computerTurn();
      } else if(tile == simon.computerPattern[simon.playerMoves]) {
        simon.activateTiles(playerPattern, 10);
        simon.playerMoves++;
      } else {
        simon.activateTiles(playerPattern, 10);
        $("#endGame").show();
        simon.playerMode = false;
        simon.playerMoves = 0;
        simon.computerPattern = [];
      }
    }
  },
  /*
    ---------------------
    Reset Game Function
    ---------------------
      - small function to reset the DOM and re-init a new game
   */
  resetGame: function resetGame() {
    $("#score").val("0");
    $("#endGame").hide();
    simon.init();

  },
  /*
    ---------------------
    Activate Tiles Function
    ---------------------
      - function that accepts a tempo and a pattern array. then animates and plays
        the audio file for each tile in the array with a small delay (tempo) between each.
        on player turns, the array is only 1 element with a near instant tempo to allow for
        each user click. utilizes the window.setInterval and window.setTimeout APIs in order
        to control timing. at the end of the pattern animation, triggers the player turn
   */
  activateTiles: function activateTiles(pattern, tempo) {
    var count = 0;
    //adds a delay (tempo) to the animation of each element in the pattern
    var interval = setInterval(function() {
      var tile = $("#tile" + pattern[count]);
      tile.shake();
      tile.css({"opacity": ".7"}); //add a property (lighten up tile color) with jQuery

      //switch to figure which audio element to play based on tile number
      switch(pattern[count]) {
        case 1:
          var audio1 = new Audio(simon.audio[0]);
          audio1.play();
          break;
        case 2:
          var audio2 = new Audio(simon.audio[1]);
          audio2.play();
          break;
        case 3:
          var audio3 = new Audio(simon.audio[2]);
          audio3.play();
          break;
        case 4:
          var audio4 = new Audio(simon.audio[3]);
          audio4.play();
          break;
        default:
          var audio = new Audio(simon.audio[0]);
          audio.play();
          break;
      }
      window.setTimeout(function() {
        tile.css({"opacity": ""}); //remove property with jQuery (empty string)
      }, 300);

      count++;

      if(count >= pattern.length) {
        clearInterval(interval);

        if(!simon.playerMode) {
            simon.playerMode = true;
        }
      }
    }, tempo);
  }
};
/*
  ---------------------
  jQuery Shake Function
  ---------------------
    - adds a jQuery function that adds a small shake/vibration animation to the tiles
 */
jQuery.fn.shake = function() {
    this.each(function(i) {
        $(this).css({ "position": "relative" });
        for (var x = 1; x <= 2; x++) {
            $(this).animate({ left: -15 }, 10).animate({ left: 0 }, 50).animate({ left: 15 }, 10).animate({ left: 0 }, 50);
        }
    });
    return this;
};
/*
  ------------------------------
  jQuery Document-Ready Function
  ------------------------------
    - includes all user input event functions
*/
$(document).ready(function() {
  $("#score").val(simon.score);
  $("#endGame").hide();

  $("#reset").click(function() {
    simon.resetGame();
  });
  $("#restart").click(function() {
    simon.resetGame();
  });
  $("#start").click(function() {
    simon.init();
  });
  $(".tile").click(function() {
    var tileElement = Number($(this).attr("id")[4]); //default is a String, must be a Number

    simon.playerTurn(tileElement);

  });
});
