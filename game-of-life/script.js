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
var boardWidth = 70;
var boardHeight = 50;
var boardSize = boardWidth * boardHeight;
var generateTimer;

const Game = React.createClass({ displayName: "Game",
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

    for(let j = 0; j < boardHeight; j++) {
      let id = "";

      for(let k = 0; k < boardWidth; k++) {
        id = String(j) + "," + String(k);

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
  initiateBoard: function initiateBoard(amount) {
    let boardState = [];

    for (let i = 0; i < amount; i++) {
      boardState.push( String(Math.floor(Math.random() * (50))) + "," + String(Math.floor(Math.random() * (70))) );
    }
    console.log(boardState);
    this.generateBoard(boardState);
  },
  /* checks the board start and runs it through Conway's algorithm to determine
    all tiles' state and then generates the board based on that state
    TODO: run the algo, update boardstate */
  checkBoard: function checkBoard() {
    let livingTiles = [];

    //capture all tiles currently alive
    $(".tile").each(function checkTiles() {
      if ($(this).hasClass("alive")) {
        livingTiles.push($(this).attr("id"));
      }
    });

    livingTiles.forEach(function checkLiving(tile) {
      let tileNeighbours = [];
    });
  },
  /* starts the board setting the global interval variable. uses a local variable
  to manage scoping. */
  start: function start() {
    let parent = this;
    generateTimer = setInterval(function runBoard() {
      parent.handleTime();
      parent.checkBoard();
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
  render: function render() {
    let boardNodes = this.props.board;
    return(
      React.createElement("div", { id: "board" }, boardNodes)
    );
  }
});

ReactDOM.render(React.createElement(Game, null), document.getElementById("main"));
