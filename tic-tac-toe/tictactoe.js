/*
  This JavaScript initializes a TicTacToe game with 2-player or 1-player options.
  The first player can also choose their tile (Ex or Oh). Events are handled with
  jQuery selectors. The computer AI is an implementation of the minimax algorithm
  with alpha-beta pruning. It does not include iterative deepening. MiniMax algotithm
  inspired by http://richard.to/programming/ai-for-owari-part-2.html.
    - by Michael Sharp 2015
    www.softwareontheshore.com
*/
'use strict';
/*
-------------------
CSS Color Variables
-------------------
*/
const primaryColor = '#60FF90';
const secondaryColor = '#60CFFF';
const tertiaryColor = '#FF60CF';
/*
----------------
Global Variables
----------------
  - The tile booleans alternate between the two players, whether human or computer
  - The compPlayer / playerTurn allows for the AI turns
*/
let exes = true;
let ohs = false;
let computerPlayer = false;
let playerTurn = true;
/*
-----------------------------
Initialization Menu Selectors
-----------------------------
*/
$('#end').hide();
$('#begin-select').hide();

$('#xSelect').click(() => {
  $('#begin').hide();
  $('#begin-select').show();
});
$('#oSelect').click(() => {
    exes = false;
    ohs = true;
    $('#begin').hide();
    $('#begin-select').show();
});
$('#twoPlayer').click(() => {
  $('#begin-select').hide();
});
$('#singlePlayer').click(() => {
  computerPlayer = true;
  $('#begin-select').hide();
});
/*
---------------------
jQuery Event Handlers
---------------------
*/
$('#board .tac').hover(function() {
    if (exes && !$(this).hasClass('active') && playerTurn) {
      $(this).css('background', primaryColor);
      $(this).append('<i class=\'fa fa-times\'></i>');
    } if (ohs && !$(this).hasClass('active') && playerTurn) {
      $(this).css('background', secondaryColor);
      $(this).append('<i class=\'fa fa-circle-o\'></i>');
    }
  }, function() {
    if (!$(this).hasClass('active')) {
      $(this).css('background', tertiaryColor);
      $(this).text('');
    }
});
// click event for a player choosing a move. Triggers win checking and computer turn
$('#board .tac').click(function() {
  if ($(this).hasClass('active')) return; // cancel click if the tile is already active

  if (exes) {
    if (!computerPlayer) {
      $(this).css('background', primaryColor);
      $(this).text('');
      $(this).append('<i class=\'fa fa-times\'></i>');
      $(this).addClass('active ex');

      checkWinner();
      exes = false;
      ohs = true;
    } else if (computerPlayer && playerTurn) {
      $(this).css('background', primaryColor);
      $(this).text('');
      $(this).append('<i class=\'fa fa-times\'></i>');
      $(this).addClass('active ex');

      checkWinner();
      exes = false;
      ohs = true;
      playerTurn = false;
      runComputerTurn();
    }
  } else if (ohs) {
    if (!computerPlayer) {
      $(this).css('background', secondaryColor);
      $(this).text('');
      $(this).append('<i class=\'fa fa-circle-o\'></i>');
      $(this).addClass('active oh');

      checkWinner();
      exes = true;
      ohs = false;
    } else if (computerPlayer && playerTurn) {
      $(this).css('background', secondaryColor);
      $(this).text('');
      $(this).append('<i class=\'fa fa-circle-o\'></i>');
      $(this).addClass('active oh');

      checkWinner();
      exes = true;
      ohs = false;
      playerTurn = false;
      runComputerTurn();
    }
  }
});
// click event for restarting a new game after a winner is found
$('#restart').click(() => clearBoard());

// function that handles the computer's move and then changes the board UI to reflect that
function runComputerTurn() {
  const boardState = checkBoard();
  const compTile = ohs ? 'ohs' : 'exes';
  const bestMove = findBestMove(boardState, compTile);

  if (exes) {
    $('#' + bestMove).css('background', primaryColor);
    $('#' + bestMove).text('');
    $('#' + bestMove).append('<i class=\'fa fa-times\'></i>');
    $('#' + bestMove).addClass('active ex');

    checkWinner();
    exes = false;
    ohs = true;
    playerTurn = true;
  } else if (ohs) {
    $('#' + bestMove).css('background', secondaryColor);
    $('#' + bestMove).text('');
    $('#' + bestMove).append('<i class=\'fa fa-circle-o\'></i>');
    $('#' + bestMove).addClass('active oh');

    checkWinner();
    exes = true;
    ohs = false;
    playerTurn = true;
  }
}
/*
  --------------------
  Check Board Function
  --------------------
    - a function that looks at the DOM and then creates an array out of the
        tiles on the board. If they are empty -> push 0. If an Ex -> push 2.
        If an Oh -> push 5.
*/
function checkBoard() {
  const elements = Array.prototype.slice.call($('div .tac'));
  const tempArr = [];
  const board = [];

  elements.forEach((element) => {
    const temp = element.className.split(' ');
    tempArr.push(temp);
  });

  tempArr.forEach((tac) => {
    if (tac.length < 3) {
      board.push(0);
    } else {
      if (tac[3] === 'ex') {
        board.push(2);
      } else if (tac[3] === 'oh') {
        board.push(5);
      }
    }
  });
  return board;
}
/*
------------------------
Check Winning Conditions
------------------------
 -function that checks the state of the board and sees if there is a winner during
    live play. Or a tie. If a winner is found, triggers the win event
*/
function checkWinner() {
  const board = checkBoard();
  // win values
  const exesWin = 6;
  const ohsWin = 15;
  let turnsTaken = 0;

  // winning conditions
  const rowOne = board[0] + board[1] + board[2];
  const rowTwo = board[3] + board[4] + board[5];
  const rowThree = board[6] + board[7] + board[8];
  const colOne = board[0] + board[3] + board[6];
  const colTwo = board[1] + board[4] + board[7];
  const colThree = board[2] + board[5] + board[8];
  const diagOne = board[2] + board[4] + board[6];
  const diagTwo = board[0] + board[4] + board[8];

  // see if the board is full.
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== 0) {
      turnsTaken++;
    }
  }

  // if board is full, there is a tie
  if (turnsTaken === 9) {
      winnerAlert(3);

  } else if (rowOne === exesWin || rowTwo === exesWin || rowThree === exesWin ||
            colOne === exesWin || colTwo === exesWin || colThree === exesWin ||
            diagOne === exesWin || diagTwo === exesWin) {

    winnerAlert(1);

  } else if (rowOne === ohsWin || rowTwo === ohsWin || rowThree === ohsWin ||
              colOne === ohsWin || colTwo === ohsWin || colThree === ohsWin ||
              diagOne === ohsWin || diagTwo === ohsWin) {

    winnerAlert(2);
  }
}
/*
  ---------------------
  Winner Alert Function
  ---------------------
   - Function to end game and display results. 3 is a tie display, 1 is a win for
      Exes. 2 is a win for Ohs.
*/
function winnerAlert(player) {
  if (player === 3) {
    $('#end').show();
    $('#end p').text('It\'s a tie.');
    $('#reset').click(() => clearBoard());
  } else if (player === 1) {
    $('#end').show();
    $('#end p').text('Exes Win!');
    $('#reset').click(() => clearBoard());
  } else if(player === 2) {
    $('#end').show();
    $('#end p').text('Ohs Win!');
    $('#reset').click(() => clearBoard());
  }
}
/*
------------------------
Main MiniMax Function
------------------------
 - Determins the best move by calculating the maximum move value of the computer
    and minimizing the move values of the human player by projecting their
    future moves. Uses alpha-beta pruning. Does not include depth.
*/
function findBestMove(boardState, compTile) {
  const maxPlayer = (compTile === 'exes') ? 2 : 5;
  const minPlayer = (maxPlayer === 2) ? 5 : 2;
  let bestMove = -2;
  let move = 0;

  for(let i = 0; i < boardState.length; i++) {
    const newBoard = testMove(boardState, i, maxPlayer);
    if (newBoard) {
      const predictedMove = minValue(newBoard, minPlayer, maxPlayer);
      if (predictedMove > bestMove) {
        bestMove = predictedMove;
        move = i;
      }
    }
  }
  return move;
}
// calculates the value of the opposing players moves in order to block if necessary
function minValue(testBoard, minPlayer, maxPlayer) {
  if (testWinner(testBoard, maxPlayer)) {
    return 1;
  } else if (testWinner(testBoard, minPlayer)) {
    return -1;
  } else if (testWinner(testBoard, 0)) { // check for a tie
    return 0;
  } else {
    let bestMove = 10;
    for (let i = 0; i < testBoard.length; i++) {
      const newBoard = testMove(testBoard, i, minPlayer);
      if (newBoard) {
        const predictedMove = maxValue(newBoard, minPlayer, maxPlayer);
        if (predictedMove < bestMove) {
          bestMove = predictedMove;
        }
      }
    }
    return bestMove;
  }
}
// calculates the value of the computer players moves to prune off the best choice
function maxValue(testBoard, minPlayer, maxPlayer) {
  if (testWinner(testBoard, maxPlayer)) {
    return 1;
  } else if(testWinner(testBoard, minPlayer)) {
    return -1;
  } else if (testWinner(testBoard, 0)) { // check for a tie
    return 0;
  } else {
    let bestMove = -10;
    for(let i = 0; i < testBoard.length; i++) {
      const newBoard = testMove(testBoard, i, maxPlayer);
      if (newBoard) {
        const predictedMove = minValue(newBoard, minPlayer, maxPlayer);
        if (predictedMove > bestMove) {
          bestMove = predictedMove;
        }
      }
    }
    return bestMove;
  }
}
// function that checks if a move in the minimax algo is valid
function testMove(boardState, move, player) {
  const testBoard = boardState.slice(0);

  if (testBoard[move] === 0) {
    testBoard[move] = player;
    return testBoard;
  } else {
    return null;
  }
}
/*
  --------------------
  Test Winner Function
  --------------------
    - function that tests if the moves made by the algorithm result in a victory
        or a tie. If 0 is passed, the function checks for a tie. Otherwise,
        tests if there is a winner or not. Decided against combining live and
        test 'winner' functions to uncomplicate the code.
*/
function testWinner(board, player) {
  // capture the value needed for a victory
  const winSum = (player === 2) ? 6 : 15;
  const tie = (player === 0) ? true : false;
  const testBoard = board.slice(0);

  // win conditions
  const rowOne = testBoard[0] + testBoard[1] + testBoard[2];
  const rowTwo = testBoard[3] + testBoard[4] + testBoard[5];
  const rowThree = testBoard[6] + testBoard[7] + testBoard[8];
  const colOne = testBoard[0] + testBoard[3] + testBoard[6];
  const colTwo = testBoard[1] + testBoard[4] + testBoard[7];
  const colThree = testBoard[2] + testBoard[5] + testBoard[8];
  const diagOne = testBoard[2] + testBoard[4] + testBoard[6];
  const diagTwo = testBoard[0] + testBoard[4] + testBoard[8];

  if (tie) { // test for a tie if tie is true
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 0) {
        return false;
      }
    }
    return true;

  } else if ((rowOne === winSum) || (rowTwo === winSum) || (rowThree === winSum) ||
        (colOne === winSum) || (colTwo === winSum) || (colThree === winSum) ||
        (diagOne === winSum) || (diagTwo === winSum) ) {

    return true;
  } else {
    return false;
  }
}
// reset board function that reloads the page from the browser cache
function clearBoard() {
  location.reload(false);
}
