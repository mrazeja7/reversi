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
    [null, 'w', null, null, 'b', 'w', null, null],
    [null, null, null, null, null, null, null, null]
  ],
  captures: {w: 0, b: 0}
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
  var allCheckers = document.querySelectorAll('.possible');//document.getElementsByClassName('selected');
  //console.log("len: " + allCheckers.length);
  //console.log(allCheckers);

  for (var i = allCheckers.length-1; i >= 0 ; i--)
  {
    allCheckers[i].classList.remove('possible');
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

function highlightMove(x, y)
{
  var square = document.getElementById('square-' + x + "-" + y);
  square.classList.add('possible');
}

function highlightOnHover(event)
{
  deselectAll();
  var x = parseInt(event.target.id.charAt(7));
  var y = parseInt(event.target.id.charAt(9));
  if (isNaN(x))
    return;
  if (state.board[x][y])
    return;
  //console.log("Hovering over " + x + " " + y);
  var pieces = getEnemyPieces(x, y);

  pieces.forEach(function(piece) {
    highlightMove(piece.x, piece.y);
  });

  if (pieces.length > 0)
    highlightMove(x, y);

}

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

function flipChecker(x, y)
{
  var square = document.getElementById('square-' + x + "-" + y);
  var checker = square.childNodes.item('checker');
  checker.classList.remove('checker-' + state.enemy);
  checker.classList.add('checker-' + state.turn);
  state.board[x][y] = state.turn;
}

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

  nextTurn();
}

function handleSquareClick(event)
{  
  event.preventDefault();
  var x = parseInt(event.target.id.charAt(7));
  var y = parseInt(event.target.id.charAt(9));
  if (state.board[x][y] != null)
    return;

  applyMove(event, x, y);
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
      square.onmouseover = highlightOnHover;
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
}

setup();