
const boardSize = 8;
const shipSizes = [4, 3, 2];

const playerBoardElement = document.getElementById("player-board");
const enemyBoardElement = document.getElementById("enemy-board");
const messageElement = document.getElementById("message");
const turnElement = document.getElementById("turn");
const restartButton = document.getElementById("restart-button");

let playerBoard = [];
let enemyBoard = [];

let playerShips = [];
let enemyShips = [];

let playerHits = 0;
let enemyHits = 0;

let gameOver = false;
let playerTurn = true;

function createBoard() {
    return Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => ({
            ship: null,
            shot: false
        }))
    );
}

function placeShips(board) {
    const ships = [];

    shipSizes.forEach((size, shipId) => {
        let placed = false;

        while (!placed) {
            const horizontal = Math.random() < 0.5;

            const row = Math.floor(Math.random() * boardSize);
            const col = Math.floor(Math.random() * boardSize);

            const cells = [];

            for (let i = 0; i < size; i++) {
                const r = row + (horizontal ? 0 : i);
                const c = col + (horizontal ? i : 0);

                if (r >= boardSize || c >= boardSize) {
                    break;
                }

                cells.push({ row: r, col: c });
            }

            if (cells.length !== size) {
                continue;
            }

            const overlaps = cells.some(cell =>
                board[cell.row][cell.col].ship !== null
            );

            if (overlaps) {
                continue;
            }

            cells.forEach(cell => {
                board[cell.row][cell.col].ship = shipId;
            });

            ships.push({
                size: size,
                hits: 0
            });

            placed = true;
        }
    });

    return ships;
}

function renderBoard(board, element, isPlayerBoard) {
    element.innerHTML = "";

    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const button = document.createElement("button");

            button.classList.add("cell");
            button.type = "button";
            button.setAttribute(
                "aria-label",
                `Ligne ${rowIndex + 1}, colonne ${colIndex + 1}`
            );

            // Montre les navires uniquement sur notre propre grille.
            if (isPlayerBoard && cell.ship !== null) {
                button.classList.add("ship");
            }

            if (cell.shot) {
                if (cell.ship !== null) {
                    button.classList.add("hit");
                    button.textContent = "X";
                } else {
                    button.classList.add("miss");
                    button.textContent = "•";
                }
            }

            // Seules les cases ennemies permettent de tirer.
            if (!isPlayerBoard) {
                button.disabled =
                    cell.shot || gameOver || !playerTurn;

                button.addEventListener("click", () => {
                    playerShoot(rowIndex, colIndex);
                });
            } else {
                button.disabled = true;
            }

            element.appendChild(button);
        });
    });
}

function allShipsSunk(ships) {
    return ships.every(ship => ship.hits === ship.size);
}

function playerShoot(row, col) {
    if (gameOver || !playerTurn) {
        return;
    }

    const cell = enemyBoard[row][col];

    if (cell.shot) {
        return;
    }

    cell.shot = true;

    if (cell.ship !== null) {
        enemyShips[cell.ship].hits++;
        playerHits++;

        messageElement.textContent = "Touché ! Bien joué !";
    } else {
        messageElement.textContent = "À l'eau !";
    }

    renderBoard(enemyBoard, enemyBoardElement, false);

    if (allShipsSunk(enemyShips)) {
        endGame(true);
        return;
    }

    playerTurn = false;
    turnElement.textContent = "L'ordinateur réfléchit...";

    renderBoard(enemyBoard, enemyBoardElement, false);

    setTimeout(computerShoot, 700);
}

function computerShoot() {
    if (gameOver) {
        return;
    }

    const availableCells = [];

    playerBoard.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (!cell.shot) {
                availableCells.push({
                    row: rowIndex,
                    col: colIndex
                });
            }
        });
    });

    if (availableCells.length === 0) {
        return;
    }

    const randomIndex = Math.floor(
        Math.random() * availableCells.length
    );

    const target = availableCells[randomIndex];
    const cell = playerBoard[target.row][target.col];

    cell.shot = true;

    if (cell.ship !== null) {
        playerShips[cell.ship].hits++;
        enemyHits++;

        messageElement.textContent =
            "L'ordinateur a touché un de tes navires !";
    } else {
        messageElement.textContent =
            "L'ordinateur a tiré dans l'eau.";
    }

    renderBoard(playerBoard, playerBoardElement, true);

    if (allShipsSunk(playerShips)) {
        endGame(false);
        return;
    }

    playerTurn = true;
    turnElement.textContent = "À toi de jouer !";

    renderBoard(enemyBoard, enemyBoardElement, false);
}

function endGame(playerWon) {
    gameOver = true;
    playerTurn = false;

    if (playerWon) {
        messageElement.textContent =
            "Victoire ! Tu as coulé toute la flotte ennemie !";
    } else {
        messageElement.textContent =
            "Défaite ! L'ordinateur a coulé toute ta flotte.";
    }

    turnElement.textContent = "Partie terminée.";

    renderBoard(playerBoard, playerBoardElement, true);
    renderBoard(enemyBoard, enemyBoardElement, false);
}

function startGame() {
    playerBoard = createBoard();
    enemyBoard = createBoard();

    playerShips = placeShips(playerBoard);
    enemyShips = placeShips(enemyBoard);

    playerHits = 0;
    enemyHits = 0;

    gameOver = false;
    playerTurn = true;

    messageElement.textContent = "Les flottes sont prêtes !";
    turnElement.textContent = "À toi de jouer !";

    renderBoard(playerBoard, playerBoardElement, true);
    renderBoard(enemyBoard, enemyBoardElement, false);
}

restartButton.addEventListener("click", startGame);

startGame();
