/* Conway's Game of Life
    - A React-driven app that creates Conway's cellular automaton based on an initial state.
      https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life. A FreeCodeCamp project.

      RULES
      -----

      - Any live cell with fewer than two live neighbours dies, as if caused by under-population.
      - Any live cell with two or three live neighbours lives on to the next generation.
      - Any live cell with more than three live neighbours dies, as if by over-population.
      - Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

      by Michael A Sharp
      www.softwareontheshore.com

      TODO: Fix board component mounting flow
*/

"use strict";


/*
---- REACT BOOTSTRAP COMPONENTS -----
*/
const ButtonToolbar = ReactBootstrap.ButtonToolbar;
const Button = ReactBootstrap.Button;


/*
---- SCRIPT GLOBALS -----
*/
var generations = 0;
var boardHeight = 50;
var generateTimer;

const BOARD_HEIGHT = 50;
const BOARD_WIDTH = 70;


/*
---- CUSTOM REACT COMPONENTS -----
*/
const Game = React.createClass({ displayName: "Game",
  propTypes: {
    boardWidth: React.PropTypes.number.isRequired,
    boardHeight: React.PropTypes.number.isRequired
  },

  getInitialState: function getInitialState() {
    return({ board: [], time: 0 });
  },

  componentDidMount: function componentDidMount() {
    this.initiateBoard(500);
  },


  /*
  ---- GENERATE BOARD FUNCTION -----
      - generates the tiles and gives them a class based on the initial randomized board
  */
  generateBoard: function generateBoard(boardState) {
    let generatedBoard = [];
    let tileKey = 0;
    boardState = boardState.length > 0 ? boardState : [-1];

    for(let j = 0; j < this.props.boardHeight; j++) {
      let id = "";

      for(let k = 0; k < this.props.boardWidth; k++) {
        id = String(j) + "-" + String(k);

        if(boardState.indexOf(id) > -1) {
          generatedBoard.push((
            React.createElement("div", { key: tileKey, id: id, className: "tile alive", onClick: this.changeTile })
          ));
        } else {
          generatedBoard.push((
            React.createElement("div", { key: tileKey, id: id, className: "tile dead", onClick: this.changeTile })
          ));
        }

        tileKey++;
      }
    }
    this.setState({ board: generatedBoard }, this.render);
  },


  /*
  ---- INITIATE BOARD FUNCTION-----
      - Generate an initial board at random when the page loads. Size of the random
        sample controlled by the passed variable. Also used to clear the board by generating
        an empty sample size. Then calls the rendering of the board.
  */
  initiateBoard: function initiateBoard(sampleSize) {
    let boardState = [];

    for (let i = 0; i < sampleSize; i++) {
      boardState.push( String(Math.floor(Math.random() * (50))) + "-" + String(Math.floor(Math.random() * (70))) );
    }
    this.generateBoard(boardState);
  },


  /*
  ---- START FUNCTION -----
      starts the board setting the global interval variable
  */
  start: function start() {
    let self = this;
    generateTimer = setInterval(function runBoard() {
      self.handleTime();
      self.checkBoard();
    }, 750);
  },

  /*
  ---- STOP FUNCTION -----
      pauses the board by clearing the global interval variable
  */
  stop: function stop() {
    clearInterval(generateTimer);
  },


  /*
  ---- CLEAR FUNCTION -----
      -resets the board via jQuery
  */
  clear: function clear() {
    this.setState({ time: 0}, function clearBoard() {
      $(".tile").each(function(tile) {
        $(this).removeClass("alive old dead");
        $(this).addClass("dead");
      });
    });
  },


  /*
  --- CHANGE TILE FUNCTION -----
      - allows the user to turn the tile on
  */
  changeTile: function changeTile(event) {
    let target = $("#" + event.target.id);

    if(target.hasClass("alive")) {
      target.removeClass("alive dead old");
      target.addClass("dead");
    } else if (target.hasClass("dead")) {
      target.removeClass("alive dead old");
      target.addClass("alive");
    }
  },


  /*
  ---- HANDLE TIME FUNCTION -----
      uses a global variable to track the generations and then a react.state to update dom
  */
  handleTime: function handleTime() {
    generations++;
    this.setState({ time: generations });
  },

  /*
  ---- CHECK BOARD FUNCTION -----
    - checks the board start and runs it through Conway's algorithm to determine
      all tiles' state and then generates the board based on that state
      TODO: run the algo, update boardstate
  */
  checkBoard: function checkBoard() {
    let tiles = this.state.board;
    let self = this;
    let boardLife = 0;

    //check each tile for status and neighbours
    tiles.forEach(function checkTile(tile){
      let tileID = tile.props.id;
      let tileY = Number(tileID.split("-")[0]);
      let tileX = Number(tileID.split("-")[1]);
      let neighboursAlive = 0;
      let tileAlive = false;

      //check target tile status
      if($("#" + tileID).hasClass("alive") || $("#" + tileID).hasClass("old")) {
        tileAlive = true;
        boardLife++;
      }

      //figure out which function we should send our tile to in order to find neighbours
      let tileNeighbours =
          (tileY === 0 || tileY === self.props.boardHeight - 1 || tileX === 0 || tileX === self.props.boardWidth) ?
          self.findEdgeNeighbours(tiles, tileID, tileY, tileX) : self.findNeighbours(tiles, tileID, tileY, tileX);

      //check how many of these neighbours are alive
      tileNeighbours.forEach(function checkNeighbourStatus(tile) {
        if($("#" + tile).hasClass("alive")) {
          neighboursAlive++;
        }
      });

      //apply new class status based on the Conway's Rules

      //under-population
      if (tileAlive && neighboursAlive < 2) {
        $("#" + tileID).removeClass("alive old dead");
        $("#" + tileID).addClass("dead");
      }

      //lives on
      else if (tileAlive && (neighboursAlive === 2 || neighboursAlive == 3)) {
        $("#" + tileID).removeClass("alive old dead");
        $("#" + tileID).addClass("old");
      }

      //over-population
      else if (tileAlive && neighboursAlive > 3) {
        $("#" + tileID).removeClass("alive old dead");
        $("#" + tileID).addClass("dead");
      }

      //birth
      else if (!tileAlive && neighboursAlive === 3) {
        $("#" + tileID).removeClass("alive old dead");
        $("#" + tileID).addClass("alive");
      }
    });

    if(boardLife === 0) this.stop();
  },


  /*
  ---- FIND NEIGHBOURS FUNCTION -----
      - a function to find the 8 neighbours of a 'normally' placed tile
  */
  findNeighbours: function findNeighbours(tiles, tileID, tileY, tileX) {
    let neighbours = [];

    //capture the horizontal neighbours
    neighbours.push(tileY + "-" + (tileX + 1));
    neighbours.push(tileY + "-" + (tileX - 1));

    //capture the 3 neighbours above and below;
    for(let i = tileX + 1; i > tileX - 2; i--) {
      let neighbourAbove = (tileY - 1) + "-" + i;
      let neighbourBelow = (tileY + 1) + "-" + i;
      neighbours.push(neighbourAbove);
      neighbours.push(neighbourBelow);
    }

    return neighbours;
  },


  /*
  ---- FIND EDGE NEIGHBOURS FUNCTION -----
      - return 8 neighbours of grid edge cases - wrap around the grid ()[50, 0] left neighbour = [50, 70])
      - for the corner cases - it seemed better visually and logically to hardcode each neighbour's position.
        I don't think the amount of code would have been any lower.
  */
  findEdgeNeighbours: function findEdgeNeighbours(tiles, tileID, tileY, tileX) {
    let neighbours = [];
    let self = this.props;

    //check for top left corner case
    if (tileY === 0 && tileX === 0) {
      neighbours.push(tileY + "-" + (tileX + 1));
      neighbours.push(tileY + "-" + (self.boardWidth - 1));
      neighbours.push((self.boardHeight - 1) + "-" + (tileX + 1));
      neighbours.push((boardHeight - 1) + "-" + (self.boardWidth - 1));
      neighbours.push((self.boardHeight - 1) + "-" + tileX);
      neighbours.push((tileY - 1) + "-" + (tileX + 1));
      neighbours.push((tileY - 1) + "-" + (self.boardWidth - 1));
      neighbours.push((tileY - 1) + "-" + tileX);

      return neighbours;
    }
    //check for top right corner case
    else if (tileY === (self.boardHeight - 1) && tileX === (self.boardWidth - 1)) {
      neighbours.push(tileY + "-" + (tileX - 1));
      neighbours.push(tileY + "-" + 0);
      neighbours.push((self.boardHeight - 1) + "-" + 0);
      neighbours.push((self.boardHeight - 1) + "-" + (tileX - 1));
      neighbours.push((self.boardHeight - 1) + "-" + tileX);
      neighbours.push((tileY - 1) + "-" + (tileX - 1));
      neighbours.push((tileY - 1) + "-" + 0);
      neighbours.push((tileY - 1) + "-" + tileX);

      return neighbours;
    }
    //check for bottom left corner case
    else if (tileY === (self.boardHeight - 1) && tileX === 0) {
      neighbours.push(tileY + "-" + (tileX + 1));
      neighbours.push(tileY + "-" + (self.boardWidth - 1));
      neighbours.push((tileY + 1) + "-" + (tileX + 1));
      neighbours.push((tileY + 1) + "-" + tileX);
      neighbours.push((tileY + 1) + "-" + (self.boardWidth - 1));
      neighbours.push(0 + "-" + (tileX - 1));
      neighbours.push(0 + "-" + (self.boardWidth - 1));
      neighbours.push(0 + "-" + tileX);

      return neighbours;
    }
    //check for bottom right corner case
    else if (tileY === (self.boardHeight - 1) && tileX === (self.boardWidth - 1)){
      neighbours.push(tileY + "-" + 0);
      neighbours.push(tileY + "-" + (tileX - 1));
      neighbours.push((tileY + 1) + "-" + (tileX - 1));
      neighbours.push((tileY + 1) + "-" + tileX);
      neighbours.push((tileY + 1) + "-" + 0);
      neighbours.push(0 + "-" + (tileX - 1));
      neighbours.push(0 + "-" + 0);
      neighbours.push(0 + "-" + tileX);

      return neighbours;
    }
    //check for top row case
    else if (tileY === 0) {
      //get horizontal neighbours
      neighbours.push(tileY + "-" + (tileX + 1));
      neighbours.push(tileY + "-" + (tileX - 1));

      //capture the 3 neighbours wrapped above and below;
      for(let i = tileX + 1; i > tileX - 2; i--) {
        let neighbourAbove = (self.boardHeight - 1) + "-" + i;
        let neighbourBelow = (tileY + 1) + "-" + i;
        neighbours.push(neighbourAbove);
        neighbours.push(neighbourBelow);
      }

      return neighbours;
    }
    //check for bottom row case
    else if (tileY === (self.boardHeight - 1)) {
      //get horizontal neighbours
      neighbours.push(tileY + "-" + (tileX + 1));
      neighbours.push(tileY + "-" + (tileX - 1));

      //capture the 3 neighbours wrapped below and above;
      for(let i = tileX + 1; i > tileX - 2; i--) {
        let neighbourAbove = (tileY - 1) + "-" + i;
        let neighbourBelow = 0 + "-" + i;
        neighbours.push(neighbourAbove);
        neighbours.push(neighbourBelow);
      }

      return neighbours;
    }
    //check for left column case
    else if (tileX === 0) {
      //tileX = boardWidth - 1

      //capture horizontal neighbours
      neighbours.push(tileY + "-" + (tileX + 1));
      neighbours.push(tileY + "-" + (self.boardWidth - 1));

      //capure the 3 neighbours above and below
      for(let i = tileX + 1; i > tileX - 1; i--) {
        let neighbourAbove = (tileY - 1) + "-" + i;
        let neighbourBelow = (tileY + 1) + "-" + i;
        neighbours.push(neighbourAbove);
        neighbours.push(neighbourBelow);
      }

      //capture the wrapped above and wrapped below to the left
      neighbours.push((tileY - 1) + "-" + (self.boardWidth - 1));
      neighbours.push((tileY + 1) + "-" + (self.boardWidth - 1));

      return neighbours;
    }
    //check for right column case
    else if (tile === (self.boardWidth - 1)) {
      //tileX = 0;

      //capture horizontal neighbours
      neighbours.push(tileY + "-" + 0);
      neighbours.push(tileY + "-" + (tileX - 1));

      //capure the 3 neighbours above and below
      for(let i = tileX + 1; i > tileX - 1; i--) {
        let neighbourAbove = (tileY - 1) + "-" + i;
        let neighbourBelow = (tileY + 1) + "-" + i;
        neighbours.push(neighbourAbove);
        neighbours.push(neighbourBelow);
      }

      //capture the wrapped above and wrapped below to the left
      neighbours.push((tileY - 1) + "-" + 0);
      neighbours.push((tileY + 1) + "-" + 0);

      return neighbours;
    }
    else {
      console.log("Corner Case Error");
      return [];
    }
  },

  render: function render() {
    return(
      React.createElement("div", { id: "content", className: "container" },
        React.createElement(ButtonToolbar, { id: "buttons" },
          React.createElement(Button, { id: "start-btn", onClick: this.start }, "Start"),
          React.createElement(Button, { id: "stop-btn", onClick: this.stop }, "Stop"),
          React.createElement(Button, { id: "clear-btn", onClick: this.clear }, "Clear"),
          React.createElement(Button, { id: "generations-btn", disabled: true }, "Generations: " + this.state.time)
        ),
        React.createElement(GameBoard, { board: this.state.board })
      )
    );
  }
});

const GameBoard = React.createClass({ displayName: "GameBoard",
  propTypes: {
    board: React.PropTypes.arrayOf(React.PropTypes.element.isRequired)
  },

  render: function render() {
    let boardNodes = this.props.board;
    return(
      React.createElement("div", { id: "board" }, boardNodes)
    );
  }
});

ReactDOM.render(React.createElement(Game, { boardWidth: BOARD_WIDTH, boardHeight: BOARD_HEIGHT }),
  document.getElementById("main"));
