/* Conway's Game of Life
  - A React-driven app that creates Conway's cellular automaton based on an initial state.
    Uses vanilla Javascript to select elements, in order to increase performance.
    https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life. A FreeCodeCamp project.

    RULES
    -----
    - Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    - Any live cell with two or three live neighbours lives on to the next generation.
    - Any live cell with more than three live neighbours dies, as if by over-population.
    - Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

    by Michael A Sharp
    www.softwareontheshore.com
*/

'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactBootstrap = require('react-bootstrap');

/* ---- REACT BOOTSTRAP COMPONENTS ----- */
const ButtonToolbar = ReactBootstrap.ButtonToolbar;
const Button = ReactBootstrap.Button;

/* ---- SCRIPT GLOBALS ----- */
const BOARD_HEIGHT = 50;
const BOARD_WIDTH = 70;
let generations = 0;
let generateTimer = null;

/* ---- CUSTOM REACT COMPONENTS ----- */
const Game = React.createClass({ displayName: 'Game',
  propTypes: {
    boardWidth: React.PropTypes.number.isRequired,
    boardHeight: React.PropTypes.number.isRequired
  },
  getInitialState: function getInitialState() {
    return ({ board: [], time: 0 });
  },
  componentDidMount: function componentDidMount() {
    this.generateBoard(300);
    this.start();
  },
  /* ---- GENERATE BOARD FUNCTION -----
      - generates the tile components and uses a randomized initial array as a beginning state.
      - Accepts an integer as an initial size of random 'alive' elements */
  generateBoard: function generateBoard(beginningSize) {
    let boardState = [];
    let generatedBoard = [];
    let tileKey = 0;

    if (beginningSize === 0) {
      boardState = [-1];
    } else {
      for (let i = 0; i < beginningSize; i++) {
        boardState.push(
          String(Math.floor(Math.random() * (50))) + '-' + String(Math.floor(Math.random() * (70)))
        );
      }
    }
    for (let j = 0; j < this.props.boardHeight; j++) {
      let id = '';

      for (let k = 0; k < this.props.boardWidth; k++) {
        id = String(j) + '-' + String(k);

        if (boardState.indexOf(id) > -1) {
          generatedBoard.push((
            React.createElement('div', { key: tileKey, id,
              className: 'tile alive', onClick: this.changeTile })
          ));
        } else {
          generatedBoard.push((
            React.createElement('div', { key: tileKey, id,
              className: 'tile dead', onClick: this.changeTile })
          ));
        }
        tileKey++;
      }
    }
    this.setState({ board: generatedBoard });
  },

  /* ---- START FUNCTION -----
      - starts the board setting the global interval variable */
  start: function start() {
    const self = this;
    generateTimer = setInterval(function runBoard() {
      self.handleTime();
      self.checkBoard();
    }, 200);
  },
  /*
  ---- STOP FUNCTION -----
      pauses the board by clearing the global interval variable */
  stop: function stop() {
    clearInterval(generateTimer);
  },
  /* ---- CLEAR FUNCTION -----
      -resets the board via vanilla JavaScript Web API. */
  clear: function clear() {
    this.stop();
    generations = 0;
    this.setState({ time: 0 }, function clearBoard() {
      const elements = [].slice.call(document.getElementsByClassName('tile'));

      elements.forEach((tile) => {
        tile.classList.remove('alive');
        tile.classList.remove('old');
        tile.classList.add('dead');
      });
    });
  },
  /* --- CHANGE TILE FUNCTION -----
      - allows the user to turn the tile on */
  changeTile: function changeTile(event) {
    const target = document.getElementById(event.target.id);

    if (target.classList.contains('alive') || target.classList.contains('old')) {
      target.classList.remove('alive');
      target.classList.remove('old');
      target.classList.add('dead');
    } else if (target.classList.contains('dead')) {
      target.classList.remove('dead');
      target.classList.add('alive');
    }
  },
  /*  ---- HANDLE TIME FUNCTION -----
      - uses a global variable to track the generations and then a react.state to update dom */
  handleTime: function handleTime() {
    generations++;
    this.setState({ time: generations });
  },
  /*  ---- CHECK BOARD FUNCTION -----
    - checks the board start and runs it through Conway's algorithm to determine
      all tiles' state and then generates the board based on that state */
  checkBoard: function checkBoard() {
    const tiles = this.state.board;
    const self = this;
    let boardLife = 0;

    // check each tile for status and neighbours
    tiles.forEach((tile) => {
      const tileID = tile.props.id;
      const tileElement = document.getElementById(tileID);
      const tileY = Number(tileID.split('-')[0]);
      const tileX = Number(tileID.split('-')[1]);
      let neighboursAlive = 0;
      let tileAlive = false;

      // check target tile status and track living tiles
      if (tileElement.classList.contains('alive') || tileElement.classList.contains('old')) {
        tileAlive = true;
        boardLife++;
      }
      // figure out which function we should send our tile to in order to find neighbours
      const tileNeighbours = self.findNeighbours(tiles, tileID, tileY, tileX);

      // check how many of these neighbours are alive
      tileNeighbours.forEach(function checkNeighbourStatus(tile) {
        const targetTile = document.getElementById(tile);

        if (targetTile.classList.contains('alive') || targetTile.classList.contains('old')) {
          neighboursAlive++;
        }
      });

      // apply new class status based on the Conway's Rules
      // under-population
      if (tileAlive && neighboursAlive < 2) {
        tileElement.classList.remove('alive');
        tileElement.classList.remove('old');
        tileElement.classList.add('dead');
      }

      // lives on
      else if (tileAlive && (neighboursAlive === 2 || neighboursAlive === 3)) {
        tileElement.classList.remove('alive');
        tileElement.classList.remove('old');
        tileElement.classList.add('old');
      }

      // over-population
      else if (tileAlive && neighboursAlive > 3) {
        tileElement.classList.remove('alive');
        tileElement.classList.remove('old');
        tileElement.classList.add('dead');
      }

      // birth
      else if ((!tileAlive) && neighboursAlive === 3) {
        tileElement.classList.remove('dead');
        tileElement.classList.add('alive');
      }
    });

    if (boardLife === 0) this.stop();
  },


  /* ---- FIND NEIGHBOURS FUNCTION -----
    - return 8 neighbours of a tile.
    - edges wrap around the grid ()[50, 0] left neighbour = [50, 70])
    - for the corner cases - it seemed better visually and logically to hardcode each neighbour's position.
      I don't think the amount of code would have been any lower. The are wrapped to the opposite corner. */
  findNeighbours: function findNeighbours(tiles, tileID, tileY, tileX) {
    const neighbours = [];
    const self = this.props;

    // check for top left corner case
    if (tileY === 0 && tileX === 0) {
      neighbours.push(tileY + '-' + (tileX + 1));
      neighbours.push((self.boardHeight - 1) + '-' + (self.boardWidth - 2));
      // bottom 3 neighbours
      neighbours.push((self.boardHeight - 1) + '-' + (self.boardWidth - 3));
      neighbours.push((tileY + 1) + '-' + tileX);
      neighbours.push((tileY + 1) + '-' + (tileX + 1));
      // top 3 neighbours
      neighbours.push((self.boardHeight - 1) + '-' + (self.boardWidth - 1));
      neighbours.push((self.boardHeight - 2) + '-' + (self.boardWidth - 1));
      neighbours.push((self.boardHeight - 3) + '-' + (self.boardWidth - 1));

      return neighbours;
    }
    // check for top right corner case
    else if ((tileY === 0) && (tileX === self.boardWidth - 1)) {
      neighbours.push(tileY + '-' + (tileX - 1));
      neighbours.push((self.boardHeight - 1) + '-' + 1);
      // bottom 3 neighbours
      neighbours.push((self.boardHeight - 1) + '-' + 2);
      neighbours.push((tileY + 1) + '-' + (tileX - 1));
      neighbours.push((tileY + 1) + '-' + tileX);
      // top 3 neighbours
      neighbours.push((self.boardHeight - 1) + '-' + 0);
      neighbours.push((self.boardHeight - 1) + '-' + 1);
      neighbours.push((self.boardHeight - 1) + '-' + 2);

      return neighbours;
    }
    // check for bottom left corner case
    else if ((tileY === self.boardHeight - 1) && tileX === 0) {
      neighbours.push(tileY + '-' + (tileX + 1));
      neighbours.push(0 + '-' + (self.boardWidth - 2));
      // bottom 3 neighbours
      neighbours.push(0 + '-' + (self.boardWidth - 1));
      neighbours.push(1 + '-' + (self.boardWidth - 1));
      neighbours.push(2 + '-' + (self.boardWidth - 1));
      // top 3 neighbours
      neighbours.push(0 + '-' + (self.boardWidth - 3));
      neighbours.push((tileY - 1) + '-' + tileX);
      neighbours.push((tileY - 1) + '-' + (tileX + 1));

      return neighbours;
    }
    // check for bottom right corner case
    else if ((tileY === self.boardHeight - 1) && (tileX === self.boardWidth - 1)){
      neighbours.push(tileY + '-' + (tileX - 1));
      neighbours.push(0 + '-' + 1);
      // bottom 3 neighbours
      neighbours.push(2 + '-' + 0);
      neighbours.push(1 + '-' + 0);
      neighbours.push(0 + '-' + 0);
      // top 3 neighbours
      neighbours.push(0 + '-' + 2);
      neighbours.push((tileY - 1) + '-' + tileX);
      neighbours.push((tileY - 1) + '-' + (tileX - 1));

      return neighbours;
    }
    // check for top row case
    else if (tileY === 0) {
      neighbours.push(tileY + '-' + (tileX + 1));
      neighbours.push(tileY + '-' + (tileX - 1));

      // capture the 3 neighbours wrapped above and below;
      for (let i = tileX + 1; i > tileX - 2; i--) {
        const neighbourAbove = (self.boardHeight - 1) + '-' + i;
        const neighbourBelow = (tileY + 1) + '-' + i;
        neighbours.push(neighbourAbove);
        neighbours.push(neighbourBelow);
      }

      return neighbours;
    }
    // check for bottom row case
    else if (tileY === (self.boardHeight - 1)) {
      neighbours.push(tileY + '-' + (tileX + 1));
      neighbours.push(tileY + '-' + (tileX - 1));
      // capture the 3 neighbours wrapped below and above;
      for (let i = tileX + 1; i > tileX - 2; i--) {
        const neighbourAbove = (tileY - 1) + '-' + i;
        const neighbourBelow = 0 + '-' + i;
        neighbours.push(neighbourAbove);
        neighbours.push(neighbourBelow);
      }

      return neighbours;
    }

    // check for left column case
    else if (tileX === 0) {
      neighbours.push(tileY + '-' + (tileX + 1));
      neighbours.push(tileY + '-' + (self.boardWidth - 1));

      // capure the 2 'normal' neighbours above and below
      for(let i = tileX + 1; i > tileX - 1; i--) {
        const neighbourAbove = (tileY - 1) + '-' + i;
        const neighbourBelow = (tileY + 1) + '-' + i;
        neighbours.push(neighbourAbove);
        neighbours.push(neighbourBelow);
      }
      // capture the wrapped above and wrapped below to the left
      neighbours.push((tileY - 1) + '-' + (self.boardWidth - 1));
      neighbours.push((tileY + 1) + '-' + (self.boardWidth - 1));

      return neighbours;
    }

    // check for right column case
    else if (tileX === self.boardWidth - 1) {
      neighbours.push(tileY + '-' + 0);
      neighbours.push(tileY + '-' + (tileX - 1));

      // capure the 2 neighbours above and below
      for (let i = tileX; i > tileX - 2; i--) {
        const neighbourAbove = (tileY - 1) + '-' + i;
        const neighbourBelow = (tileY + 1) + '-' + i;
        neighbours.push(neighbourAbove);
        neighbours.push(neighbourBelow);
      }
      // capture the wrapped above and wrapped below to the right
      neighbours.push((tileY - 1) + '-' + 0);
      neighbours.push((tileY + 1) + '-' + 0);

      return neighbours;
    }
    // capture normally placed tiles
    else {
      neighbours.push(tileY + '-' + (tileX + 1));
      neighbours.push(tileY + '-' + (tileX - 1));

      // capture the 3 neighbours above and below;
      for (let i = tileX + 1; i > tileX - 2; i--) {
        const neighbourAbove = (tileY - 1) + '-' + i;
        const neighbourBelow = (tileY + 1) + '-' + i;
        neighbours.push(neighbourAbove);
        neighbours.push(neighbourBelow);
      }

      return neighbours;
    }
  },
  render: function render() {
    return (
      React.createElement('div', { id: 'content', className: 'container' },
        React.createElement(ButtonToolbar, { id: 'buttons' },
          React.createElement(Button, { id: 'start-btn', onClick: this.start }, 'Start'),
          React.createElement(Button, { id: 'stop-btn', onClick: this.stop }, 'Stop'),
          React.createElement(Button, { id: 'clear-btn', onClick: this.clear }, 'Clear'),
          React.createElement(Button, { id: 'generations-btn', disabled: true },
            'Generations: ' + this.state.time)
        ),
        React.createElement(GameBoard, { board: this.state.board })
      )
    );
  }
});
const GameBoard = React.createClass({ displayName: 'GameBoard',
  propTypes: {
    board: React.PropTypes.arrayOf(React.PropTypes.element.isRequired)
  },
  render: function render() {
    const boardNodes = this.props.board;
    return(
      React.createElement('div', { id: 'board' }, boardNodes)
    );
  }
});

ReactDOM.render(React.createElement(Game, { boardWidth: BOARD_WIDTH, boardHeight: BOARD_HEIGHT }),
  document.getElementById('main'));
