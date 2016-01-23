/* Conway's Game of Life
    - A React-driven app that creates Conway's cellular automaton based on an initial state.
      https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life. A FreeCodeCamp project.

      RULES
      -----

      - Any live cell with fewer than two live neighbours dies, as if caused by under-population.
      - Any live cell with two or three live neighbours lives on to the next generation.
      - Any live cell with more than three live neighbours dies, as if by over-population.
      - Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

      www.softwareontheshore.com
*/

"use strict";

//React Bootstrap components
const ButtonToolbar = ReactBootstrap.ButtonToolbar;
const Button = ReactBootstrap.Button;

//script globals
var generations = 0;
var boardHeight = 50;
var generateTimer;

const BOARD_HEIGHT = 50;
const BOARD_WIDTH = 70;

const Game = React.createClass({ displayName: "Game",
  propTypes: {
    boardWidth: React.PropTypes.number.isRequired,
    boardHeight: React.PropTypes.number.isRequired
  },

  getInitialState: function getInitialState() {
    return({ board: [], time: 0 });
  },

  componentDidMount: function componentDidMount() {
    this.initiateBoard(200);
  },

  //generates the tiles and gives them a class based on the initial randomized board
  generateBoard: function generateBoard(boardState) {
    let generatedBoard = [];
    let tileKey = 0;
    boardState = boardState ? boardState : [-1];

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
    this.setState({ board: generatedBoard });
  },

  /* Generate an initial board at random when the page loads. Size of the random
    sample controlled by the passed variable */
  initiateBoard: function initiateBoard(sampleSize) {
    let boardState = [];

    for (let i = 0; i < sampleSize; i++) {
      boardState.push( String(Math.floor(Math.random() * (50))) + "-" + String(Math.floor(Math.random() * (70))) );
    }
    this.generateBoard(boardState);
  },

  /* starts the board setting the global interval variable */
  start: function start() {
    let self = this;
    generateTimer = setInterval(function runBoard() {
      self.handleTime();
      self.checkBoard();
    }, 750);
  },

  //pauses the board by clearing the global interval variable
  stop: function stop() {
    clearInterval(generateTimer);
  },

  //resets the board
  clear: function clear() {
    this.initiateBoard(0);
  },

  //allows the user to turn a tile on
  changeTile: function changeTile(event) {
    let target = $("#" + event.target.id);
    console.log(target);
    target.removeClass("tile alive dead old");
    target.addClass("tile alive");
  },

  //uses a global variable to track the generations and then a react.state to update dom
  handleTime: function handleTime() {
    generations++;
    this.setState({ time: generations });
  },

  /* checks the board start and runs it through Conway's algorithm to determine
    all tiles' state and then generates the board based on that state
    TODO: run the algo, update boardstate */
  checkBoard: function checkBoard() {
    let tiles = this.state.board;
    let self = this;

    tiles.forEach(function checkTile(tile){
      let tileID = tile.props.id;
      let tileY = Number(tileID.split("-")[0]);
      let tileX = Number(tileID.split("-")[1]);

      //figure out which function we should send our tile to in order to find neighbours
      let tileNeighbours =
          (tileY === 0 || tileY === self.props.boardHeight - 1 || tileX === 0 || tileX === self.props.boardWidth) ?
          self.findCornerNeighbours(tileID, tileY, tileX) : self.findNeighbours(tileID, tileY, tileX);

    });
  },

  //Return the 4 neighbours of this tile
  findNeighbours: function findNeighbours(tileID, tileY, tileX) {
    let neighbours = [];

    return neighbours;
  },

  //Return 4 neighbours of grid edge cases - wrap around the grid ()[50, 0] left neighbour = [50, 70])
  findCornerNeighbours: function findCornerNeighbours(tileID, tileY, tileX) {
    let neighbours = [];

    return neighbours;
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
