// checkers.js
/** Jan Mrázek */
/** based on the HTML version of the checkers game created in CIS580. */
// <p id = 'message'>
// </p>
// var t = document.getElementById('message');
// t.textContent = 'asdf';
/** The state of the game */
var state = {
  over: false,
  turn: 'b',
  turnIndicator: null,
  enemy: 'w',
  board: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'w', 'b', null, null, null],
    [null, null, null, 'b', 'w', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ],
  captures: {w: 0, b: 0}
}

/** @function checkForVictory
  * Checks to see if a victory has been achieved
  * (Whole board is populated and one player has more pieces on the board)
  * @return {String} one of four values:
  * a string containing the result of the game or null, if neither
  * player has yet won.
  */
function checkForVictory() 
{
  var gameOver = false;
  var whiteScore = 0;
  var blackScore = 0;
  for (var i = 0; i < state.board.length; i++) 
  {
    for (var j = 0; j < state.board[i].length; j++)
    {
      if (state.board[i][j] == 'w')
        whiteScore++;
      else if (state.board[i][j] == 'b')
        blackScore++;
    }
  }

  var msg = 'There are no more moves to be played; ';

  if (noMoreMoves())
  {
    if (whiteScore > blackScore)
      return msg+'White wins!';
    else if (whiteScore < blackScore)
      return msg+'Black wins!';
    else return msg+'Tie!';
  }
  return null;
}

/** @function noMoreMoves()
  * Checks if there are any more moves to be played.
  * @returns {boolean} returns true if there are no more moves to be played.
  */
function noMoreMoves()
{
  nextTurn();
  if (canPlay())
  {
    nextTurn();
    return false;
  }
  else
  {
    nextTurn();
    return !canPlay();
  }
}

/** @function nextTurn()
  * Starts the next turn by flipping
  * the "turn" and "enemy" fields of state.
  * Also flips the turn indicator.
  */
function nextTurn() {
  var tmp = state.turn;
  state.turn = state.enemy;
  state.enemy = tmp;
  state.turnIndicator.classList.remove('turn-indicator-' + state.enemy);
  state.turnIndicator.classList.add('turn-indicator-' + state.turn);
}

/** @function deselectAll()
  * Removes the highlights of potential move squares.
  */
function deselectAll()
{
  var allCheckers = document.querySelectorAll('.possible');

  for (var i = allCheckers.length-1; i >= 0 ; i--)
  {
    allCheckers[i].classList.remove('possible');
  }
}

/** @function highlightSquare
  * Highlights a square on the playing board (for visualizing the desired move).
  * @param {integer} x - the x position of the piece
  * @param {integer} y - the y position of the piece
  */
function highlightSquare(x, y)
{
  var square = document.getElementById('square-' + x + "-" + y);
  square.classList.add('possible');
}

/** @function highlightOnHover
  * Highlights all squares affected by playing the hovered-over square.
  * @param {Event} event - the event
  */
function highlightOnHover(event)
{
  event.preventDefault();
  var x = parseInt(event.target.id.charAt(7));
  var y = parseInt(event.target.id.charAt(9));
  if (isNaN(x) || isNaN(y))
    return;
  if (state.board[x][y])
    return;
  var pieces = getEnemyPieces(x, y);

  pieces.forEach(function(piece) {
    highlightSquare(piece.x, piece.y);
  });

  if (pieces.length > 0)
    highlightSquare(x, y);
}

/** @function universalCheck()
  * Checks the possibility of a valid move
  * when going from the passed location in the passed direction.
  * I had 8 different functions, each of which checked one direction,
  * before I consolidated them all into this one function.
  * xIncrement of -1 means we go up vertically,
  * xIncrement of 0 means no change in row,  
  * xIncrement of 1 means we go down vertically.
  * yIncrement of -1 means we go left horizontally,
  * yIncrement of 0 means no change in column,  
  * yIncrement of 1 means we go right horizontally.
  * @param {integer} x - the x position of the new piece
  * @param {integer} y - the y position of the new piece
  * @param {integer} xIncrement - the proposed change in the x coordinate
  * @param {integer} yIncrement - the proposed change in the y coordinate
  * @returns {Array} the enemy pieces to be taken when applying this move
  * as an array of x and y coordinates.
  */
function universalCheck(x, y, xIncrement, yIncrement)
{
  var k = x + xIncrement;
  var l = y + yIncrement;
  var enemyPieces = [];
  while (k >= 0 && k < state.board.length && l >= 0 && l < state.board.length)
  {
    if (state.board[k][l] == state.enemy)
    {
      enemyPieces.push({x: k, y: l});
    }
    else if (state.board[k][l] == state.turn)
    {
      return enemyPieces;
    }
    else
    {
      return [];
    }

    k += xIncrement;
    l += yIncrement;
  }
  return [];
}

/** @function getEnemyPieces
  * Calculates all squares affected by the desired move.
  * @param {integer} x - the x position of the piece
  * @param {integer} y - the y position of the piece
  * @returns {Array} the enemy pieces to be taken when applying this move
  */
function getEnemyPieces(x, y)
{
  var pieces = universalCheck(x, y, 0, 1);
  pieces = pieces.concat(universalCheck(x, y, 0, -1));
  pieces = pieces.concat(universalCheck(x, y, 1, 0));
  pieces = pieces.concat(universalCheck(x, y, -1, 0));
  pieces = pieces.concat(universalCheck(x, y, 1, 1));
  pieces = pieces.concat(universalCheck(x, y, 1, -1));      
  pieces = pieces.concat(universalCheck(x, y, -1, -1));
  pieces = pieces.concat(universalCheck(x, y, -1, 1));

  return pieces;
}

/** @function flipChecker
  * Flips the color of the desired piece
  * @param {integer} x - the x position of the piece
  * @param {integer} y - the y position of the piece
  */
function flipChecker(x, y)
{
  var square = document.getElementById('square-' + x + "-" + y);
  var checker = square.childNodes.item('checker');
  checker.classList.remove('checker-' + state.enemy);
  checker.classList.add('checker-' + state.turn);
  state.board[x][y] = state.turn;
}

/** @function applyMove
  * Applies the selected move. Also checks for victory conditions
  * and activates the next turn.
  * @param {Event} event - needed to create a new checker
  * in the correct square
  * @param {integer} x - the x position of the piece
  * @param {integer} y - the y position of the piece
  */
function applyMove(event, x, y)
{
  var pieces = getEnemyPieces(x, y);
  if (pieces.length == 0)
    return;

  pieces.forEach(function(piece) {
    flipChecker(piece.x, piece.y);
  });

  state.board[x][y] = state.turn;
  var square = event.target;
  var checker = document.createElement('div');
  checker.classList.add('checker');
  checker.classList.add('checker-' + state.board[x][y]);
  square.appendChild(checker);

  var vic = checkForVictory();
  if (vic)
  {
    //alert(vic);
    //location.reload(); //play again
    document.getElementById('message').textContent = vic;
    return;
  }
  nextTurn();

  if (!canPlay())
  {
    //alert((state.turn=='w'?'White':'Black') + ' has no possible moves. Please pass your turn.');
    document.getElementById('message').textContent = ((state.turn=='w'?'White':'Black') + ' has no possible moves. Please pass your turn.');
  }
}

/** @function handleSquareClick
  * Parses the coordinates of the clicked square
  * in order to prepare for applying the selected move.
  * @param {Event} event
  */
function handleSquareClick(event)
{  
  event.preventDefault();
  var x = parseInt(event.target.id.charAt(7));
  var y = parseInt(event.target.id.charAt(9));
  if (isNaN(x) || isNaN(y) || state.board[x][y] != null)
    return;

  applyMove(event, x, y);
}

/** @function handlePassClick
  * Handles a click on the "pass move" button.
  * @param {Event} event
  */
function handlePassClick(event)
{
  event.preventDefault();
  document.getElementById('message').textContent = null;
  nextTurn();
}

/** @function canPlay
  * Checks whether the current player can make any moves.
  * Could potentially be slowing the game down, as it checks every
  * field of the board.
  * @returns {boolean} returns true if the current player can make a move.
  */
function canPlay()
{
  pieces = [];
  for (var i = 0; i < state.board.length; i++)
  {
    for (var j = 0; j < state.board.length; j++)
    {
      if (state.board[i][j])
        continue;
      pieces = pieces.concat(getEnemyPieces(i, j));
    }
  }
  return (pieces.length > 0);
}

/** @function setup
  * Takes care of creating the board, the turn indicator
  * and the "pass move" button at the start of the game.
  */
function setup()
{
  var board = document.createElement('section');
  board.id = 'game-board';
  document.body.appendChild(board);
  for (var i = 0; i < state.board.length; i++) 
  {
    for (var j = 0; j < state.board[i].length; j++)
    {
      var square = document.createElement('div');
      square.id = ('square-' + i + '-' + j);
      square.classList.add('reversi-square');
      square.onclick = handleSquareClick;      
      square.onmouseover = highlightOnHover;
      square.onmouseleave = deselectAll;
      if (state.board[i][j])
      {
        var checker = document.createElement('div');
        checker.classList.add('checker');
        checker.classList.add('checker-' + state.board[i][j]);
        square.appendChild(checker);
      }
      board.appendChild(square);
    }
  }  

  state.turnIndicator = document.createElement('div');
  state.turnIndicator.id = ('turn-indicator');
  state.turnIndicator.classList.add('turn-indicator-b');
  board.appendChild(state.turnIndicator);

  var pass = document.createElement('div');
  pass.id = ('pass-square');
  pass.classList.add('pass-square');
  pass.appendChild(document.createTextNode("Pass turn"));
  pass.onclick = handlePassClick;
  board.appendChild(pass);
}

setup();