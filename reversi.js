// checkers.js

/** The state of the game */
var state = {
  over: false,
  turn: 'b',
  enemy: 'w',
  board: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'w', null, null, null, null],
    [null, 'w', null, null, 'w', 'w', null, null],
    [null, null, 'w', 'w', 'w', 'b', null, null],
    [null, null, 'w', 'b', 'w', 'w', 'w', null],
    [null, null, 'w', 'w', 'w', null, null, null],
    [null, 'w', null, null, null, 'w', null, null],
    [null, null, null, null, null, null, null, null]
  ],
  captures: {w: 0, b: 0}
}

/** @function getLegalMoves
  * returns a list of legal moves for the specified
  * piece to make.
  * @param {String} piece - 'b' or 'w' for black or white pawns,
  *    'bk' or 'wk' for white or black kings.
  * @param {integer} x - the x position of the piece on the board
  * @param {integer} y - the y position of the piece on the board
  * @returns {Array} the legal moves as an array of objects.
  */
function getLegalMoves(piece, x, y) {
  var moves = [];
  switch(piece) {
    case 'b': // black can only move down the board diagonally
      checkSlide(moves, x-1, y-1);
      checkSlide(moves, x+1, y-1);
      checkJump(moves, {captures:[],landings:[]}, piece, x, y);
      break;
    case 'w':  // white can only move up the board diagonally
      checkSlide(moves, x-1, y+1);
      checkSlide(moves, x+1, y+1);
      checkJump(moves, {captures:[],landings:[]}, piece, x, y);
      break;
    case 'bk': // kings can move diagonally any direction
    case 'wk': // kings can move diagonally any direction
      checkSlide(moves, x-1, y+1);
      checkSlide(moves, x+1, y+1);
      checkSlide(moves, x-1, y-1);
      checkSlide(moves, x+1, y-1);
      checkJump(moves, {captures:[],landings:[]}, piece, x, y);
      break;
  }
  return moves;
}

/** @function checkSlide
  * A helper function to check if a slide move is legal.
  * If it is, it is added to the moves array.
  * @param {Array} moves - the list of legal moves
  * @param {integer} x - the x position of the movement
  * @param {integer} y - the y position of the movement
  */
function checkSlide(moves, x, y) {
  // Check square is on grid
  if(x < 0 || x > 9 || y < 0 || y > 9) return;
  // check square is unoccupied
  if(state.board[y][x]) return;
  // legal move!  Add it to the move list
  moves.push({type: 'slide', x: x, y: y});
}

/** @function copyJumps
  * A helper function to clone a jumps object
  * @param {Object} jumps - the jumps to clone
  * @returns The cloned jump object
  */
function copyJumps(jumps) {
  // Use Array.prototype.slice() to create a copy
  // of the landings and captures array.
  var newJumps = {
    landings: jumps.landings.slice(),
    captures: jumps.captures.slice()
  }
  return newJumps;
}

/** @function checkJump
  * A recursive helper function to determine legal jumps
  * and add them to the moves array
  * @param {Array} moves - the moves array
  * @param {Object} jumps - an object describing the
  *  prior jumps in this jump chain.
  * @param {String} piece - 'b' or 'w' for black or white pawns,
  *    'bk' or 'wk' for white or black kings
  * @param {integer} x - the current x position of the piece
  * @param {integer} y - the current y position of the peice
  */
function checkJump(moves, jumps, piece, x, y) {
  switch(piece) {
    case 'b': // black can only move down the board diagonally
      checkLanding(moves, copyJumps(jumps), piece, x-1, y-1, x-2, y-2);
      checkLanding(moves, copyJumps(jumps), piece, x+1, y-1, x+2, y-2);
      break;
    case 'w':  // white can only move up the board diagonally
      checkLanding(moves, copyJumps(jumps), piece, x-1, y+1, x-2, y+2);
      checkLanding(moves, copyJumps(jumps), piece, x+1, y+1, x+2, y+2);
      break;
    case 'bk': // kings can move diagonally any direction
    case 'wk': // kings can move diagonally any direction
      checkLanding(moves, copyJumps(jumps), piece, x-1, y+1, x-2, y+2);
      checkLanding(moves, copyJumps(jumps), piece, x+1, y+1, x+2, y+2);
      checkLanding(moves, copyJumps(jumps), piece, x-1, y-1, x-2, y-2);
      checkLanding(moves, copyJumps(jumps), piece, x+1, y-1, x+2, y-2);
      break;
  }
}

/** @function checkLanding
  * A helper function to determine if a landing is legal,
  * if so, it adds the jump sequence to the moves list
  * and recursively seeks additional jump opportunities.
  * @param {Array} moves - the moves array
  * @param {Object} jumps - an object describing the
  *  prior jumps in this jump chain.
  * @param {String} piece - 'b' or 'w' for black or white pawns,
  *    'bk' or 'wk' for white or black kings
  * @param {integer} cx - the 'capture' x position the piece is jumping over
  * @param {integer} cy - the 'capture' y position of the peice is jumping over
  * @param {integer} lx - the 'landing' x position the piece is jumping onto
  * @param {integer} ly - the 'landing' y position of the peice is jumping onto
  */
function checkLanding(moves, jumps, piece, cx, cy, lx, ly) {
  // Check landing square is on grid
  if(lx < 0 || lx > 9 || ly < 0 || ly > 9) return;
  // Check landing square is unoccupied
  if(state.board[ly][lx]) return;
  // Check capture square is occuped by opponent
  if((piece === 'b' || piece === 'bk') && !(state.board[cy][cx] === 'w' || state.board[cy][cx] === 'wk')) return;
  if((piece === 'w' || piece === 'wk') && !(state.board[cy][cx] === 'b' || state.board[cy][cx] === 'bk')) return;
  // legal jump! add it to the moves list
  jumps.captures.push({x: cx, y: cy});
  jumps.landings.push({x: lx, y: ly});
  moves.push({
    type: 'jump',
    captures: jumps.captures.slice(),
    landings: jumps.landings.slice()
  });
  // check for further jump opportunities
  checkJump(moves, jumps, piece, lx, ly);
}

// TODO
function applyMove(x, y, move) {
  if(move.type === 'slide') {
    state.board[move.y][move.x] = state.board[y][x];
    state.board[y][x] = null;
  } else {
    move.captures.forEach(function(square){
      var piece = state.board[square.y][square.x];
      state.captures[piece.substring(0,1)]++;
      state.board[square.y][square.x] = null;
    });
    var index = move.landings.length - 1;
    state.board[move.landings[index].y][move.landings[index].x] = state.board[y][x];
    state.board[y][x] = null;
  }
}

// TODO
function checkForVictory() {
  if(state.captures.w == 20) {
    state.over = true;
    return 'black wins';
  }
  if(state.captures.b == 20) {
    state.over = true;
    return 'white wins';
  }
  return null;
}

function nextTurn() {
  var tmp = state.turn;
  state.turn = state.enemy;
  state.enemy = tmp;
}

function deselectAll()
{
  var allCheckers = document.querySelectorAll('.selected,.selected-sq,.selected-cap,.droptarget');//document.getElementsByClassName('selected');
  console.log("len: " + allCheckers.length);
  console.log(allCheckers);

  for (var i = allCheckers.length-1; i >= 0 ; i--)
  {
    allCheckers[i].classList.remove('selected');
    allCheckers[i].classList.remove('selected-sq');
    allCheckers[i].classList.remove('selected-cap');
    allCheckers[i].classList.remove('droptarget');
  }
}

function checkHorizontalR(x, y)
{
  var streak = 0;
  var possible = false;
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


function checkHorizontalL(x, y)
{
  var streak = 0;
  var possible = false;
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


function checkVerticalD(x, y)
{
  var streak = 0;
  var possible = false;
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

function checkVerticalU(x, y)
{
  var streak = 0;
  var possible = false;
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


function checkDiagonalSE(x, y) //ok
{
  var streak = 0;
  var possible = false;
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

function checkDiagonalSW(x, y)
{
  var streak = 0;
  var possible = false;
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

function checkDiagonalNE(x, y)
{
  var streak = 0;
  var possible = false;
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

function checkDiagonalNW(x, y)
{
  var streak = 0;
  var possible = false;
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

function highlightPossibleMove(x, y)
{
  var square = document.getElementById('square-' + x + "-" + y);
  square.classList.add('possible');
  /*var checker = document.createElement('div');
  checker.classList.add('checker');  
  checker.classList.add('possible');
  square.appendChild(checker);*/
}

function getPossibleMoves()
{
  for (var i = 0; i < state.board.length; i++)
  {
    for (var j = 0; j < state.board[i].length; j++)
    {
      if (state.board[i][j])
        continue;

      var pieces = checkHorizontalR(i, j);
      pieces = pieces.concat(checkHorizontalL(i, j));
      pieces = pieces.concat(checkVerticalD(i, j));
      pieces = pieces.concat(checkVerticalU(i, j));
      pieces = pieces.concat(checkDiagonalSE(i, j));
      pieces = pieces.concat(checkDiagonalSW(i, j));      
      pieces = pieces.concat(checkDiagonalNW(i, j));
      pieces = pieces.concat(checkDiagonalNE(i, j));
      if (pieces.length > 0)
      {
        pieces.forEach(function(piece) {
          console.log(i + " " + j);
          highlightPossibleMove(i, j)
        });
      }
    }
  }
}

function handleSquareClick(event)
{  
  event.preventDefault();
  var x = parseInt(event.target.id.charAt(7));
  var y = parseInt(event.target.id.charAt(9));
  console.log("click: x: " + x + " y: " + y);
}

// ok
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
      if (state.board[i][j])
      {
        var checker = document.createElement('div');
        checker.classList.add('checker');
        checker.classList.add('checker-' + state.board[i][j]);
        //checker.onclick = handleCheckerClick; // TODO
        square.appendChild(checker);
      }
      board.appendChild(square);
    }
  }
}

setup();