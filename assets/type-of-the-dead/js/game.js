document.addEventListener("DOMContentLoaded", init);

var homePage, countDownPage, gamePage, winPage, losePage, statsDisplay;
var speedObj, rateObj;
var speed, rate;
var difficulty;

function init() {
    document.querySelector("#start-game").addEventListener("click", onCountDownPage);
    /* setup DOM references */
    homePage = document.querySelector("#home");
    countDownPage = document.querySelector("#countdown");
    gamePage = document.querySelector("#game");
    winPage = document.querySelector("#win");
    losePage = document.querySelector("#lose");
    statsDisplay = document.querySelector("#stats");
    speedObj = document.querySelector("#speed");
    rateObj = document.querySelector("#rate");
}

/*
 * Function that hendles activities in home page.
 */
function onCountDownPage() {
    setDisplay(homePage, "none");
    setDisplay(countDownPage, "block");
    countDown(3, document.querySelector("#seconds"), onGamePage);
}

/*
 * Display countdown in the given element and invoke callback.
 */
function countDown(seconds, element, callback) {
    var countdown = setInterval(function() {
        seconds--;
        element.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(countdown);
            callback();
        }
    }, 1000);
}

/*
 * Helper funtion that toggles display.
 */
function setDisplay(frame, mode) {
    frame.style.display = mode;
}

/*
 * Function that handles typing and updates statistics.
 */
function onGamePage() {
    setDisplay(countDownPage, "none");
    setDisplay(gamePage, "block");
    setDisplay(statsDisplay, "flex");
    gameLogic();
}