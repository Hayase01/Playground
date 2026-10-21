const colors = [
    { name: "Rouge", value: "#ef4444" },
    { name: "Bleu", value: "#3b82f6" },
    { name: "Vert", value: "#22c55e" },
    { name: "Jaune", value: "#facc15" },
    { name: "Violet", value: "#a855f7" },
    { name: "Orange", value: "#f97316" }
];

const board = document.getElementById("board");
const attemptsDisplay = document.getElementById("attempts");
const message = document.getElementById("message");
const currentGuessDisplay = document.getElementById("currentGuess");
const colorChoices = document.getElementById("colorChoices");
const submitButton = document.getElementById("submitGuess");
const clearButton = document.getElementById("clearGuess");
const restartButton = document.getElementById("restart");

const codeLength = 4;
const maxAttempts = 10;

let secretCode = [];
let currentGuess = [];
let attempts = 0;
let gameOver = false;

function generateSecretCode() {
    const code = [];

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * colors.length);
        code.push(randomIndex);
    }

    return code;
}

function renderColorChoices() {
    colorChoices.innerHTML = "";

    colors.forEach(function (color, index) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "color-button";
        button.style.backgroundColor = color.value;
        button.title = color.name;
        button.setAttribute("aria-label", color.name);

        button.addEventListener("click", function () {
            if (gameOver || currentGuess.length >= codeLength) {
                return;
            }

            currentGuess.push(index);
            renderCurrentGuess();
        });

        colorChoices.appendChild(button);
    });
}

function renderCurrentGuess() {
    currentGuessDisplay.innerHTML = "";

    currentGuess.forEach(function (colorIndex) {
        const peg = document.createElement("div");

        peg.className = "peg";
        peg.style.backgroundColor = colors[colorIndex].value;

        currentGuessDisplay.appendChild(peg);
    });

    submitButton.disabled =
        gameOver || currentGuess.length !== codeLength;

    clearButton.disabled =
        gameOver || currentGuess.length === 0;
}

function evaluateGuess(guess) {
    let black = 0;
    let white = 0;

    const secretRemaining = [];
    const guessRemaining = [];

    for (let i = 0; i < codeLength; i++) {
        if (guess[i] === secretCode[i]) {
            black++;
        } else {
            secretRemaining.push(secretCode[i]);
            guessRemaining.push(guess[i]);
        }
    }

    guessRemaining.forEach(function (colorIndex) {
        const matchingIndex = secretRemaining.indexOf(colorIndex);

        if (matchingIndex !== -1) {
            white++;
            secretRemaining.splice(matchingIndex, 1);
        }
    });

    return { black, white };
}

function renderAttempt(guess, feedback, attemptNumber) {
    const row = document.createElement("div");
    row.className = "guess-row";

    const number = document.createElement("span");
    number.className = "guess-number";
    number.textContent = attemptNumber + ".";

    const pegs = document.createElement("div");
    pegs.className = "pegs";

    guess.forEach(function (colorIndex) {
        const peg = document.createElement("div");

        peg.className = "peg";
        peg.style.backgroundColor = colors[colorIndex].value;

        pegs.appendChild(peg);
    });

    const feedbackDisplay = document.createElement("div");
    feedbackDisplay.className = "feedback";

    for (let i = 0; i < feedback.black; i++) {
        const peg = document.createElement("div");
        peg.className = "feedback-peg black";
        feedbackDisplay.appendChild(peg);
    }

    for (let i = 0; i < feedback.white; i++) {
        const peg = document.createElement("div");
        peg.className = "feedback-peg white";
        feedbackDisplay.appendChild(peg);
    }

    row.append(number, pegs, feedbackDisplay);
    board.prepend(row);
}

function submitGuess() {
    if (gameOver || currentGuess.length !== codeLength) {
        return;
    }

    const guess = [...currentGuess];
    const feedback = evaluateGuess(guess);

    attempts++;

    renderAttempt(guess, feedback, attempts);

    attemptsDisplay.textContent = maxAttempts - attempts;

    if (feedback.black === codeLength) {
        message.textContent = "Bravo ! Tu as trouvé la combinaison !";
        gameOver = true;
    } else if (attempts >= maxAttempts) {
        message.textContent =
            "Perdu ! La combinaison était : " +
            secretCode.map(function (index) {
                return colors[index].name;
            }).join(", ");

        gameOver = true;
    } else {
        message.textContent =
            feedback.black + " bien placé(s), " +
            feedback.white + " mal placé(s).";
    }

    currentGuess = [];
    renderCurrentGuess();

    if (gameOver) {
        submitButton.disabled = true;
        clearButton.disabled = true;
    }
}

function clearGuess() {
    if (gameOver) {
        return;
    }

    currentGuess = [];
    renderCurrentGuess();
}

function startGame() {
    secretCode = generateSecretCode();
    currentGuess = [];
    attempts = 0;
    gameOver = false;

    board.innerHTML = "";
    attemptsDisplay.textContent = maxAttempts;
    message.textContent = "Choisis 4 couleurs pour commencer.";

    renderColorChoices();
    renderCurrentGuess();
}

submitButton.addEventListener("click", submitGuess);
clearButton.addEventListener("click", clearGuess);
restartButton.addEventListener("click", startGame);

startGame();
