let board;
let cols = 10;
let rows = 10;
let w = 40;
let totalBees = 10;

function setup() {
  createCanvas(400, 400);

  board = createBoard(cols, rows);
  board = placeBees(board, totalBees, cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      countBees(board, board[i][j]);
    }
  }
}

function createBoard(cols, rows) {
  board = [];
  for (let i = 0; i < rows; i++) {
    let rowsTile = [];
    for (let j = 0; j < cols; j++) {
      rowsTile.push(createTile(i, j, w));
    }
    board.push(rowsTile);
  }
  return board;
}

function createTile(i, j, w) {
  return {
    i: i,
    j: j,
    x: j * w,
    y: i * w,
    w: w,
    neighborCount: 0,
    bee: false,
    revealed: false,
  };
}

function placeBees(board, totalBees, cols, rows) {
  let beesCounter = 0;

  while (beesCounter < totalBees) {
    let i = Math.floor(random(0, rows));
    let j = Math.floor(random(0, cols));
    if (board[i][j].bee == false) {
      board[i][j].bee = true;
      beesCounter++;
    }
  }
  return board;
}

function countBees(board, tile) {
  let beesCounter = 0;
  const paddingCoordinate = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  if (tile.bee) {
    tile.neighborCount = -1;
  } else {
    paddingCoordinate.forEach((coordinate) => {
      let i = tile.i + coordinate[0];
      let j = tile.j + coordinate[1];

      if (i > -1 && j > -1 && i < board.length && j < board.length) {
        if (board[i][j].bee) {
          beesCounter++;
        }
      }
    });

    tile.neighborCount = beesCounter;
  }
}

function draw() {
  background(255);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      drawTile(board[i][j]);
    }
  }
}

function drawTile(tile) {
  stroke(0);
  noFill();
  rect(tile.x, tile.y, tile.w, tile.w);

  if (tile.revealed) {
    if (tile.bee) {
      drawBeeTile(tile);
    } else {
      drawNumberTile(tile);
    }
  }
}

function drawBeeTile(tile) {
  fill(125);
  text('🚩', tile.x + tile.w * 0.5, tile.y + tile.w * 0.5);
  //   ellipse(tile.x + tile.w * 0.5, tile.y + tile.w * 0.5, tile.w * 0.5);
}

function drawNumberTile(tile) {
  fill(200);
  rect(tile.x, tile.y, tile.w, tile.w);
  if (tile.neighborCount > 0) {
    textAlign(CENTER, CENTER);
    fill(0);
    text(tile.neighborCount, tile.x + tile.w * 0.5, tile.y + tile.w - 18);
  }
}

function reveal(tile) {
  tile.revealed = true;
  if (tile.neighborCount == 0) {
    floodFill(tile);
  }
}

function floodFill(tile) {
  for (let xoff = -1; xoff <= 1; xoff++) {
    for (let yoff = -1; yoff <= 1; yoff++) {
      let i = tile.i + xoff;
      let j = tile.j + yoff;

      if (i >= 0 && i < cols && j >= 0 && j < rows && !board[i][j].revealed) {
        reveal(board[i][j]);
      }
    }
  }
}

function mousePressed() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (isUnderMouse(board[i][j], mouseX, mouseY)) {
        reveal(board[i][j]);
        if (board[i][j].bee) {
          gameOver(board);
        }
      }
    }
  }
}

function isUnderMouse(tile, x, y) {
  return x >= tile.x && x <= tile.x + tile.w && y >= tile.y && y <= tile.y + tile.w;
  //TODO implement this function
}

function gameOver(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j].revealed = true;
    }
  }
}

module.exports = {
  createBoard,
  createTile,
  placeBees,
  countBees,
  reveal,
  floodFill,
  gameOver,
  isUnderMouse,
};
