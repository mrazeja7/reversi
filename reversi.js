// checkers.js
/** Jan Mrázek */
/** based on the HTML version of the checkers game created in CIS580. */

/** The state of the game */
var state = {
  over: false,
  turn: 'b',
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
  * "white wins", "black wins", "tie", or null, if neither
  * has yet won.
  */
function checkForVictory() 
{
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
  if (whiteScore+blackScore == state.board.length*state.board.length)
  {
    if (whiteScore > blackScore)
      return 'white wins';
    else if (whiteScore < blackScore)
      return 'black wins';
    else return 'tie';
  }
  return null;
}

/** @function nextTurn()
  * Starts the next turn by flipping
  * the "turn" and "enemy" fields of state.
  */
function nextTurn() {
  var tmp = state.turn;
  state.turn = state.enemy;
  state.enemy = tmp;
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

/** @function checkHorizontalL()
  * Checks the possibility of a valid move
  * when going from the passed location to the left.
  * @param {integer} x - the x position of the new piece
  * @param {integer} y - the y position of the new piece
  * @returns {Array} the enemy pieces to be taken when applying this move
  * as an array of x and y coordinates.
  */
function checkHorizontalL(x, y)
{
  var streak = 0;
  var enemyPieces = [];
  for (var k = y-1; k >= 0; k--) 
  {
    if (state.board[x][k] == state.enemy)
    {
      streak++;
      enemyPieces.push({x: x, y: k});
    }
    if ((streak == (y-1-k)) && streak != 0 && state.board[x][k]==state.turn)
    {
      return enemyPieces;
    }
  }
  return [];
}

/** @function checkHorizontalR()
  * Checks the possibility of a valid move
  * when going from the passed location to the right.
  * @param {integer} x - the x position of the new piece
  * @param {integer} y - the y position of the new piece
  * @returns {Array} the enemy pieces to be taken when applying this move
  * as an array of x and y coordinates.
  */
function checkHorizontalR(x, y)
{
  var streak = 0;
  var enemyPieces = [];
  for (var k = y+1; k < state.board.length; k++) 
  {
    if (state.board[x][k] == state.enemy)
    {
      streak++;
      enemyPieces.push({x: x, y: k});
    }
    if ((streak == (k-y-1)) && streak != 0 && state.board[x][k]==state.turn)
    {
      return enemyPieces;
    }
  }
  return [];
}

/** @function checkVerticalU()
  * Checks the possibility of a valid move
  * when going from the passed location upwards.
  * @param {integer} x - the x position of the new piece
  * @param {integer} y - the y position of the new piece
  * @returns {Array} the enemy pieces to be taken when applying this move
  * as an array of x and y coordinates.
  */
function checkVerticalU(x, y)
{
  var streak = 0;
  var enemyPieces = [];
  for (var k = x-1; k >= 0; k--) 
  {
    if (state.board[k][y] == state.enemy)
    {
      streak++;
      enemyPieces.push({x: k, y: y});
    }
    if ((streak == (x-1-k)) && streak != 0 && state.board[k][y]==state.turn)
    {
      return enemyPieces;
    }
  }
  return [];
}

/** @function checkVerticalD()
  * Checks the possibility of a valid move
  * when going from the passed location downwards.
  * @param {integer} x - the x position of the new piece
  * @param {integer} y - the y position of the new piece
  * @returns {Array} the enemy pieces to be taken when applying this move
  * as an array of x and y coordinates.
  */
function checkVerticalD(x, y)
{
  var streak = 0;
  var enemyPieces = [];
  for (var k = x+1; k < state.board.length; k++) 
  {
    if (state.board[k][y] == state.enemy)
    {
      streak++;
      enemyPieces.push({x: k, y: y});
    }
    if ((streak == (k-x-1)) && streak != 0 && state.board[k][y]==state.turn)
    {
      return enemyPieces;
    }
  }
  return [];
}

/** @function checkDiagonalSE()
  * Checks the possibility of a valid move
  * when going from the passed location to the bottom-right (south-east).
  * @param {integer} x - the x position of the new piece
  * @param {integer} y - the y position of the new piece
  * @returns {Array} the enemy pieces to be taken when applying this move
  * as an array of x and y coordinates.
  */
function checkDiagonalSE(x, y)
{
  var streak = 0;
  var l = y+1;
  var enemyPieces = [];
  for (var k = x+1; k < state.board.length; k++, l++) 
  {
    if (l >= state.board.length)
      break;
    if (state.board[k][l] == state.enemy)
    {
      streak++;
      enemyPieces.push({x: k, y: l});
    }
    if ((streak == (k-x-1)) && streak != 0 && state.board[k][l]==state.turn)
    {
      return enemyPieces;
    }
  }
  return [];
}

/** @function checkDiagonalSW()
  * Checks the possibility of a valid move
  * when going from the passed location to the bottom-left (south-west).
  * @param {integer} x - the x position of the new piece
  * @param {integer} y - the y position of the new piece
  * @returns {Array} the enemy pieces to be taken when applying this move
  * as an array of x and y coordinates.
  */
function checkDiagonalSW(x, y)
{
  var streak = 0;
  var l = y-1;
  var enemyPieces = [];
  for (var k = x+1; k < state.board.length; k++, l--) 
  {
    if (l < 0)
      break;
    if (state.board[k][l] == state.enemy)
    {
      streak++;
      enemyPieces.push({x: k, y: l});
    }
    if ((streak == (k-x-1)) && streak != 0 && state.board[k][l]==state.turn)
    {
      return enemyPieces;
    }
  }
  return [];
}

/** @function checkDiagonalNE()
  * Checks the possibility of a valid move
  * when going from the passed location to the top-right (north-east).
  * @param {integer} x - the x position of the new piece
  * @param {integer} y - the y position of the new piece
  * @returns {Array} the enemy pieces to be taken when applying this move
  * as an array of x and y coordinates.
  */
function checkDiagonalNE(x, y)
{
  var streak = 0;
  var l = y+1;
  var enemyPieces = [];
  for (var k = x-1; k >= 0; k--, l++) 
  {
    if (l >= state.board.length)
      break;
    if (state.board[k][l] == state.enemy)
    {
      streak++;
      enemyPieces.push({x: k, y: l});
    }
    if ((streak == (x-1-k)) && streak != 0 && state.board[k][l]==state.turn)
    {
      return enemyPieces;
    }
  }
  return [];
}

/** @function checkDiagonalNW()
  * Checks the possibility of a valid move
  * when going from the passed location to the top-left (north-west).
  * @param {integer} x - the x position of the new piece
  * @param {integer} y - the y position of the new piece
  * @returns {Array} the enemy pieces to be taken when applying this move
  * as an array of x and y coordinates.
  */
function checkDiagonalNW(x, y)
{
  var streak = 0;
  var l = y-1;
  var enemyPieces = [];
  for (var k = x-1; k >= 0; k--, l--) 
  {
    if (l < 0)
      break;
    if (state.board[k][l] == state.enemy)
    {
      streak++;
      enemyPieces.push({x: k, y: l});
    }
    if ((streak == (x-1-k)) && streak != 0 && state.board[k][l]==state.turn)
    {
      return enemyPieces;
    }
  }
  return [];
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
  if (isNaN(x))
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

/** @function getEnemyPieces
  * Calculates all squares affected by the desired move.
  * @param {integer} x - the x position of the piece
  * @param {integer} y - the y position of the piece
  * @returns {Array} the enemy pieces to be taken when applying this move
  */
function getEnemyPieces(x, y)
{
  var pieces = checkHorizontalR(x, y);
  pieces = pieces.concat(checkHorizontalL(x, y));
  pieces = pieces.concat(checkVerticalD(x, y));
  pieces = pieces.concat(checkVerticalU(x, y));
  pieces = pieces.concat(checkDiagonalSE(x, y));
  pieces = pieces.concat(checkDiagonalSW(x, y));      
  pieces = pieces.concat(checkDiagonalNW(x, y));
  pieces = pieces.concat(checkDiagonalNE(x, y));  

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
    alert(vic);
    location.reload(); //play again
  }
  nextTurn();
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
  if (state.board[x][y] != null)
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
  nextTurn();
}

/** @function setup
  * Takes care of creating the board at the start of the game.
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
  var pass = document.createElement('div');
  pass.id = ('pass-square');
  pass.classList.add('pass-square');
  pass.appendChild(document.createTextNode("Pass turn"));
  pass.onclick = handlePassClick;
  board.appendChild(pass);
}

setup();