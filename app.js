const playerSelectScreen = document.querySelector('.player-select');
const humanButton = document.querySelector('#human');
const robotButton = document.querySelector('#robot');
const playerOneIndicator = document.querySelector('.player-1');
const playerTwoIndicator = document.querySelector('.player-2');
const winnerIndicator = document.querySelector('.winner');
const restartButton = document.querySelector('#restart');
const mainButton = document.querySelector('#main');
const tiles = document.querySelectorAll('.tile');

// UI events handlers
function slideTheScreen() {
  playerSelectScreen.classList.toggle('slide');
}

// human mode
humanButton.addEventListener('click', () => {
  slideTheScreen();
  playerOneIndicator.textContent = 'Player X';
  playerTwoIndicator.textContent = 'Player O';
  playerOneIndicator.classList.add('slide-up');
});

// robot mode
robotButton.addEventListener('click', () => {
  slideTheScreen();
  playerOneIndicator.textContent = 'You';
  playerTwoIndicator.textContent = 'Bot';
  playerOneIndicator.classList.add('slide-up');
});

// restart
restartButton.addEventListener('click', () => {
  playerOneIndicator.classList.add('slide-up');
});

// back to the main menu
mainButton.addEventListener('click', () => {
  slideTheScreen();
  document.querySelector('.slide-up').classList.remove('slide-up'); // confiscate the class from the element that has it
});

// player generator
const Player = name => {
  const playerName = name;
  const markers = [];
  const addMarker = function(str) {
    markers.push(str)
  }
  return { playerName, markers, addMarker };
}
const playerOne = Player('playerOne');
const playerTwo = Player('playerTwo');

// board controller
const board = (() => ({
  winingRows: [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9'], ['1', '5', '9'], ['3', '5', '7']],

  determineWinner(player) {
    const rlt = this.winingRows.some(winningRow => winningRow.every(el => player.markers.includes(el))); // winner determining algorithm
    if (rlt) {
      this.endTheGame();
    }
  },

  endTheGame() {
    document.querySelector('.slide-up').classList.remove('slide-up'); // confiscate the class from the element that has it
    const winnerName = this.getCurrentPlayer().playerName === 'playerOne' ? playerOneIndicator.textContent : playerTwoIndicator.textContent;
    winnerIndicator.textContent = `${winnerName} win!`;
    winnerIndicator.classList.add('win');
  },

  occupiedMarkers: [],
  whoseTurn: true,

  flipTurn() {
      if (this.whoseTurn) {
        playerOneIndicator.classList.remove('slide-up');
        playerTwoIndicator.classList.add('slide-up');
      } else {
        playerOneIndicator.classList.add('slide-up');
        playerTwoIndicator.classList.remove('slide-up');
      }
    this.whoseTurn = !this.whoseTurn;
  },

  getCurrentPlayer() {
    return this.whoseTurn ? playerOne : playerTwo;
  },

  getSign() { return this.whoseTurn ? 'x' : 'o' },

  getTileNumber(object) { return object.classList[1].slice(-1)}
}))();

// --tile setup--
// tile click effect
tiles.forEach(tile => tile.addEventListener('click', function() {
  const number = board.getTileNumber(this);

  board.occupiedMarkers.push(number);
  board.getCurrentPlayer().markers.push(number);

  this.style.backgroundImage = `url('./images/${board.getSign()}-sign.svg')`;
  
  board.determineWinner(board.getCurrentPlayer());
  
  board.flipTurn();
}));

// tile hover effect
tiles.forEach(tile => tile.addEventListener('mouseover', function() {
  const number = board.getTileNumber(this);
  if (!board.occupiedMarkers.includes(number)) {
    this.style.backgroundImage = `url('./images/${board.getSign()}-sign.svg')`;
  }
}))

tiles.forEach(tile => tile.addEventListener('mouseout', function() {
  const number = board.getTileNumber(this);
  if (!board.occupiedMarkers.includes(number)) {
    this.style.backgroundImage = "";
  }
}))