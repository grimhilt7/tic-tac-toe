const playerSelectScreen = document.querySelector('.player-select');
const humanSelectButton = document.querySelector('#human');
const robotSelectButton = document.querySelector('#robot');
const playerOneIndicator = document.querySelector('.player-1');
const playerTwoIndicator = document.querySelector('.player-2');
const resultIndicator = document.querySelector('.result');
const restartButton = document.querySelector('#restart');
const mainButton = document.querySelector('#main');
const tiles = document.querySelectorAll('.tile');

// player generator
const Player = (name, element) => {
  const playerName = name;
  const indicator = element;
  const markers = [];
  const addMarker = str => {
    markers.push(str);
  }
  return { playerName, indicator, markers, addMarker };
}

// board controller
const board = (() => ({
  players: [],

  winningRows: [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9'], ['1', '5', '9'], ['3', '5', '7']],

  determineWinner(player) {
    return this.winningRows.some(winningRow => winningRow.every(el => player.markers.includes(el))); // winner determining algorithm
  },

  endTheGame(result) {
    const text = result ? `${this.getCurrentPlayer().indicator.textContent} win!` : 'Draw!' // true -> current player wins, false -> draw
    resultIndicator.textContent = text;
    resultIndicator.classList.add('visible'); // make the indicator visible
    
    tiles.forEach(tile => {
      tile.removeEventListener('click', enableClickEffect);
      tile.removeEventListener('mouseover', enableMouseoverEffect);
      tile.removeEventListener('mouseout', enableMouseoutEffect);
      tile.style.cursor = 'default';
    }) // make tiles non-clickable, set the cursor default
    
    board.getCurrentPlayer().indicator.classList.remove('highlighted');
    // hide player indicators
  },

  markers: [],
  turn: true, // crucial to determine several functions within

  flipTurn() {
    this.getCurrentPlayer().indicator.classList.remove('highlighted');
    this.turn = !this.turn;
    this.getCurrentPlayer().indicator.classList.add('highlighted');
  },

  getCurrentPlayer() {
    return this.turn ? this.players[0] : this.players[1];
  },

  getWaitingPlayer() {
    return !this.turn ? this.players[0] : this.players[1];
  },

  getSign() { return this.turn ? 'x' : 'o' },

  getTileNumber(object) { return object.classList[1].slice(-1)}
}))();

// initialize function
function initialize() {
  board.getCurrentPlayer().indicator.classList.remove('highlighted');
  board.turn = Math.random() > 0.5; // randomly choose one of the players
  board.getCurrentPlayer().indicator.classList.add('highlighted');
  [board.players[0].markers, board.players[1].markers] = [[], []];
  board.markers = [];
  updateDisplay();
  tiles.forEach(tile => {
    tile.addEventListener('click', enableClickEffect);
    tile.addEventListener('mouseover', enableMouseoverEffect);
    tile.addEventListener('mouseout', enableMouseoutEffect);
    tile.style.cursor = 'pointer';
  })
  resultIndicator.classList.remove('visible');
}

// UI event handlers
// human mode
humanSelectButton.addEventListener('click', () => {
  playerSelectScreen.classList.toggle('slide'); // player select screen slide up animation

  playerSelectScreen.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'transform') {
      initialize();
    }
  });

  const playerOne = Player('playerOne', playerOneIndicator);
  const playerTwo = Player('playerTwo', playerTwoIndicator);
  board.players = [playerOne, playerTwo];

  playerOneIndicator.textContent = 'Player X';
  playerTwoIndicator.textContent = 'Player O';
});

// robot mode
robotSelectButton.addEventListener('click', () => {

});

// restart
restartButton.addEventListener('click', () => {
  initialize();
  updateDisplay();
})

// back to the main menu
mainButton.addEventListener('click', () => {
  playerSelectScreen.classList.toggle('slide'); // player select screen slide up animation
  // board.getCurrentPlayer().indicator.classList.remove('highlighted');// hide player indicators
});

// tile setup
function updateDisplay() {
  tiles.forEach((tile, idx) => {
    const factor = (idx+1).toString();

    if (board.players[0].markers.includes(factor)) {
      tile.style.backgroundImage = `url('./images/x-sign.svg')`;
    } else if (board.players[1].markers.includes(factor)) {
      tile.style.backgroundImage = `url('./images/o-sign.svg')`;
    } else {
      tile.style.backgroundImage = ``;
    }
  })
}

function enableClickEffect() {
  const number = board.getTileNumber(this);
  if (!board.markers.includes(number)) { // check if the marker has been selected, it's a string number tho e.g., '5'
    board.markers.push(number);
    board.getCurrentPlayer().markers.push(number);

    updateDisplay();

    if (!board.determineWinner(board.getCurrentPlayer()) && (board.markers.length === 9)) { // check if the winner has been determined
      board.endTheGame(false); // draw the game
    } else if (board.determineWinner(board.getCurrentPlayer())) {
      board.endTheGame(true); // the current player wins
    } else {
      board.flipTurn();
    }
  }
};

function enableMouseoverEffect() {
  const number = board.getTileNumber(this);
  if (!board.markers.includes(number)) {
    this.style.backgroundImage = `url('./images/${board.getSign()}-sign.svg')`;
  }

}

function enableMouseoutEffect() {
  const number = board.getTileNumber(this);
  if (!board.markers.includes(number)) {
    this.style.backgroundImage = "";
  }
}

// --AI--
function getPossibleWinningRows(player) {
  const objOne = {};
  const objTwo = {};
 
  // player one's winning rows
  board.players[0].markers.forEach(marker => {
    board.winningRows.forEach(row => {
      if (row.includes(marker)) {
        objOne[row] = (objOne[row] || 0) + 1;
      }
    })
  })

  // player two's winning rows
  board.players[1].markers.forEach(marker => {
    board.winningRows.forEach(row => {
      if (row.includes(marker)) {
        objTwo[row] = (objTwo[row] || 0) + 1;
      }
    })
  })

  if (player === board.players[0]) {
    return Object.keys(objOne).reduce((acc, cur) => !Object.keys(objTwo).includes(cur) ? { ...acc, [cur]: objOne[cur]} : acc, {});
  } 
    return Object.keys(objTwo).reduce((acc, cur) => !Object.keys(objOne).includes(cur) ? { ...acc, [cur]: objTwo[cur]} : acc, {});
  // returns possible winning rows with priority given the markers that have been chosen
};

function tellIfImWinning(player) {
  const tempOne = Math.max(...Object.values(getPossibleWinningRows(playerOne)));
  const tempTwo = Math.max(...Object.values(getPossibleWinningRows(playerTwo)));

  if (tempOne === tempTwo) {
    return 0;
  }

  if (tempOne > tempTwo) {
    return player === playerOne;
  } 
  
  return player === playerTwo; // if tempTwo is bigger
  
} // returns true -> attack, false -> block, 0 -> attack and block

function chooseTile(player) {
  if (tellIfImWinning(player) === 0) {
    attackAndBlock(player)
  }

  if (tellIfImWinning(player)) {
    exert(player);
  } else {
    exert(board.returnTheOpponent(player));
  }

} // returns str 

function attackAndBlock(arr) {

  exert(player)

}

function exert(arr) {

}