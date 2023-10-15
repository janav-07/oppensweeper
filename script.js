const board = document.getElementById('board');
const restartButton = document.getElementById('restart-button');
const rows = 10;
const cols = 10;
const numMines = 15;
const statusMessage = document.getElementById('status-message');
const audio = new Audio("./assets/i-am-become-death-youtube.mp3");
let mines = [];
let gameOver = false;

// Generate random mine positions
function generateMines() {
    mines = [];
    while (mines.length < numMines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!mines.some(mine => mine.row === row && mine.col === col)) {
            mines.push({ row, col });
        }
    }
}

// Create the Minesweeper board
function createBoard() {
    board.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            board.appendChild(cell);
        }
    }
}

function initGame() {
    generateMines();
    createBoard();
    gameOver = false;
    minesRemaining = numMines;
    document.getElementById('mines-remaining').textContent = `Total Mines: ${minesRemaining}`;
    statusMessage.textContent = ""; // Clear the status message
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', (event) => {
            if (!gameOver) {
                revealCell(cell, event);
            }
        });
        cell.addEventListener('contextmenu', event => event.preventDefault());
    });
    restartButton.addEventListener('click', restartGame);
}


// Reveal a cell
function revealCell(cell, event) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (event.button === 0 && !gameOver) { // Left click
        if (mines.some(mine => mine.row === row && mine.col === col)) {
            cell.classList.add('mine', 'clicked');
            showAllMines();
        } else {
            const count = countAdjacentMines(row, col);
            cell.textContent = count;
            cell.classList.add('clicked');
            if (count === 0) {
                revealAdjacentCells(row, col);
            }
        }
    }
}


// Count adjacent mines
function countAdjacentMines(row, col) {
    let count = 0;
    for (const mine of mines) {
        if (Math.abs(mine.row - row) <= 1 && Math.abs(mine.col - col) <= 1) {
            count++;
        }
    }
    return count;
}

// Reveal adjacent cells
function revealAdjacentCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            const cell = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
            if (cell && !cell.classList.contains('clicked')) {
                revealCell(cell);
            }
        }
    }
}

// Show all mines when game is over
function showAllMines() {
    gameOver = true;
    mines.forEach(mine => {
        const cell = document.querySelector(`.cell[data-row="${mine.row}"][data-col="${mine.col}"]`);
        cell.classList.add('mine');
        cell.innerHTML = '💥'; // Bomb emoji
    });
    statusMessage.textContent = "And Now I am Become Death, The Destroyer of Worlds...";
}

// Display a message
function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = "message";
    messageDiv.textContent = message;
    board.appendChild(messageDiv);
    audio.play();
}

// Restart the game
function restartGame() {
    board.innerHTML = '';
    mines = [];
    initGame();
}

// Start the game
initGame();