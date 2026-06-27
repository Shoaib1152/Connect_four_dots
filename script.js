const ROWS = 6;
const COLS = 7;

let board = [];
let currentPlayer = "red";
let gameOver = false;

let redScore = 0;
let yellowScore = 0;
let drawScore = 0;

let timer = 15;
let timerInterval;

// Elements
const cells = document.querySelectorAll(".cell");
const currentPlayerText = document.getElementById("current-player");
const timerText = document.getElementById("timer");

const redScoreText = document.getElementById("red-score");
const yellowScoreText = document.getElementById("yellow-score");
const drawScoreText = document.getElementById("draw-score");

const restartBtn = document.getElementById("restart-btn");
const themeBtn = document.getElementById("theme-toggle");

const modal = document.getElementById("winner-modal");
const winnerText = document.getElementById("winner-text");
const playAgainBtn = document.getElementById("play-again");

// Initialize Board
function initBoard() {
    board = [];

    for (let r = 0; r < ROWS; r++) {
        board.push([]);
        for (let c = 0; c < COLS; c++) {
            board[r].push("");
        }
    }

    cells.forEach(cell => {
        cell.classList.remove("red", "yellow", "win");
    });

    gameOver = false;
    currentPlayer = "red";

    updateTurnText();
    startTimer();
}

// Turn Display
function updateTurnText() {
    if (currentPlayer === "red") {
        currentPlayerText.textContent = "🔴 Red";
        currentPlayerText.className = "red-player";
    } else {
        currentPlayerText.textContent = "🟡 Yellow";
        currentPlayerText.className = "yellow-player";
    }
}

// Timer
function startTimer() {
    clearInterval(timerInterval);

    timer = 15;
    timerText.textContent = timer;

    timerInterval = setInterval(() => {
        timer--;
        timerText.textContent = timer;

        if (timer <= 0) {
            switchPlayer();
        }
    }, 1000);
}

// Switch Player
function switchPlayer() {
    clearInterval(timerInterval);

    currentPlayer =
        currentPlayer === "red"
            ? "yellow"
            : "red";

    updateTurnText();
    startTimer();
}

// Find Lowest Empty Row
function getAvailableRow(col) {

    for (let row = ROWS - 1; row >= 0; row--) {

        if (board[row][col] === "") {
            return row;
        }
    }

    return -1;
}

// Place Coin
function placeCoin(col) {

    if (gameOver) return;

    const row = getAvailableRow(col);

    if (row === -1) return;

    board[row][col] = currentPlayer;

    const cellIndex = row * COLS + col;

    cells[cellIndex].classList.add(currentPlayer);

    if (checkWinner(row, col)) {

        gameOver = true;
        clearInterval(timerInterval);

        if (currentPlayer === "red") {
            redScore++;
            redScoreText.textContent = redScore;
            winnerText.textContent =
                "🎉 Red Player Wins!";
        } else {
            yellowScore++;
            yellowScoreText.textContent =
                yellowScore;
            winnerText.textContent =
                "🎉 Yellow Player Wins!";
        }

        modal.classList.add("show");

        if (typeof confetti === "function") {
            confetti({
                particleCount: 250,
                spread: 120,
                origin: { y: 0.6 }
            });
        }

        return;
    }

    if (isDraw()) {

        gameOver = true;

        clearInterval(timerInterval);

        drawScore++;
        drawScoreText.textContent = drawScore;

        winnerText.textContent =
            "🤝 Match Draw!";

        modal.classList.add("show");

        return;
    }

    switchPlayer();
}

// Draw Check
function isDraw() {

    for (let r = 0; r < ROWS; r++) {

        for (let c = 0; c < COLS; c++) {

            if (board[r][c] === "") {
                return false;
            }
        }
    }

    return true;
}

// Winner Check
function checkWinner(row, col) {

    return (
        checkDirection(row, col, 0, 1) || // horizontal
        checkDirection(row, col, 1, 0) || // vertical
        checkDirection(row, col, 1, 1) || // diagonal \
        checkDirection(row, col, 1, -1)   // diagonal /
    );
}

// Direction Check
function checkDirection(row, col, rowDir, colDir) {

    let count = 1;

    let winningCells = [
        [row, col]
    ];

    // Forward
    let r = row + rowDir;
    let c = col + colDir;

    while (
        r >= 0 &&
        r < ROWS &&
        c >= 0 &&
        c < COLS &&
        board[r][c] === currentPlayer
    ) {
        count++;
        winningCells.push([r, c]);

        r += rowDir;
        c += colDir;
    }

    // Backward
    r = row - rowDir;
    c = col - colDir;

    while (
        r >= 0 &&
        r < ROWS &&
        c >= 0 &&
        c < COLS &&
        board[r][c] === currentPlayer
    ) {
        count++;
        winningCells.push([r, c]);

        r -= rowDir;
        c -= colDir;
    }

    if (count >= 4) {

        winningCells.forEach(([rr, cc]) => {

            const index = rr * COLS + cc;

            cells[index].classList.add("win");
        });

        return true;
    }

    return false;
}

// Click Events
cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const col =
            parseInt(cell.dataset.col);

        placeCoin(col);
    });
});

// Restart Game
function resetBoardOnly() {

    board = [];

    for (let r = 0; r < ROWS; r++) {

        board.push([]);

        for (let c = 0; c < COLS; c++) {
            board[r].push("");
        }
    }

    cells.forEach(cell => {

        cell.classList.remove(
            "red",
            "yellow",
            "win"
        );
    });

    gameOver = false;
    currentPlayer = "red";

    updateTurnText();

    modal.classList.remove("show");

    startTimer();
}

restartBtn.addEventListener(
    "click",
    resetBoardOnly
);

playAgainBtn.addEventListener(
    "click",
    resetBoardOnly
);

// Theme Toggle
themeBtn.addEventListener(
    "click",
    () => {
        document.body.classList.toggle(
            "light"
        );
    }
);

// Start Game
initBoard();