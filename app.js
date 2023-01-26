const playerSelectScreen = document.querySelector('.player-select');
const humanButton = document.querySelector('#human');
const robotButton = document.querySelector('#robot');
const playerOne = document.querySelector('.player-1')
const playerTwo = document.querySelector('.player-2')
const mainButton = document.querySelector('#main')

function slideTheScreen() {
  playerSelectScreen.classList.toggle('slide');
}

humanButton.addEventListener('click', () => {
  slideTheScreen();
  playerOne.textContent = 'Player X';
  playerTwo.textContent = 'Player O';
});

robotButton.addEventListener('click', () => {
  slideTheScreen();
  playerOne.textContent = 'You';
  playerTwo.textContent = 'Bot';
});

mainButton.addEventListener('click', slideTheScreen);