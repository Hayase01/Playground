
const timer = document.getElementById("timer");
const modeText = document.getElementById("mode");
const message = document.getElementById("message");

const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const changeModeButton = document.getElementById("changeMode");

let isWorkSession = true;
let remainingSeconds = 25 * 60;
let intervalId = null;

function updateDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    timer.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");

    modeText.textContent = isWorkSession
        ? "Session de travail"
        : "Pause";
}

function startTimer() {
    if (intervalId !== null) {
        return;
    }

    if (remainingSeconds === 0) {
        message.textContent = "Réinitialise le timer pour continuer.";
        return;
    }

    message.textContent = "Le compte à rebours est lancé !";

    intervalId = setInterval(function () {
        remainingSeconds--;

        updateDisplay();

        if (remainingSeconds <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            message.textContent = isWorkSession
                ? "Session terminée ! Prends une pause."
                : "Pause terminée ! Au travail.";

            alert(message.textContent);
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(intervalId);
    intervalId = null;

    message.textContent = "Timer en pause.";
}

function resetTimer() {
    clearInterval(intervalId);
    intervalId = null;

    remainingSeconds = isWorkSession ? 25 * 60 : 5 * 60;

    updateDisplay();
    message.textContent = "Timer réinitialisé.";
}

function changeMode() {
    clearInterval(intervalId);
    intervalId = null;

    isWorkSession = !isWorkSession;
    remainingSeconds = isWorkSession ? 25 * 60 : 5 * 60;

    updateDisplay();
    message.textContent = "Mode changé.";
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
changeModeButton.addEventListener("click", changeMode);

updateDisplay();
