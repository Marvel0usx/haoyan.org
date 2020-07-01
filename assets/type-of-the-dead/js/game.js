document.addEventListener("DOMContentLoaded", init);

var homePage, countDownPage, gamePage, winPage, losePage, statsDisplay;
var speedDisp, rateDisp, levelDisp, wordToTypeDisp, wordTypedDisp, timeDisp, typoDisp;
var speed, rate, isRunning, dictionary;
var buffer = [];

function init() {
    setupBindings();
    setupListeners();
    onHomePage();
}

function setupBindings() {
    homePage = document.querySelector("#home");
    countDownPage = document.querySelector("#countdown");
    gamePage = document.querySelector("#game");
    winPage = document.querySelector("#win");
    losePage = document.querySelector("#lose");
    statsDisplay = document.querySelector("#stats");
    speedDisp = document.querySelector("#speed");
    rateDisp = document.querySelector("#rate");
    levelDisp = document.querySelector("#level");
    wordToTypeDisp = document.querySelector("#prompt");
    timeDisp = document.querySelector("#time");
    wordTypedDisp = document.querySelector("#typed");
    typoDisp = document.querySelector("#typo");
}

function setupListeners() {
    window.addEventListener("keydown", recordKey);
    document.querySelector("#start-game").addEventListener("click", function() {
        setDictionary();
        onCountDownPage();
    });
}

function setDictionary() {
    var diff = document.querySelector("#diff-select");
    dictionary = wordBank[diff.options[diff.selectedIndex].value];
}

function onHomePage() {
    isRunning = false;
    speed = 0;
    rate = 0;
    buffer = [];
    setDisplay(homePage, "block");
    setDisplay(losePage, "none");
    setDisplay(winPage, "none");
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
    isRunning = true;
    mainloop();
}

function mainloop() {
    var chIdx = 0;
    for (var i = 0; i < 5; i++) {
        var wordToType = randWord();
        var pass = false;
        while (!pass) {
            while (buffer.length) {
                var ch = buffer.shift();
                if (ch == wordToType[chIdx]) {
                    updateTypoDisp("");
                    chIdx++;
                    wordTypedDisp.textContent += ch;
                } else if (isValidCh(ch)) {
                    typoDisp.textContent = ch;
                }
            }
        }
        buffer = [];
    }

}

function isValidCh(ch) {
    var charCode = ch.charCodeAt(0);
    if (65 <= charCode <= 90 || 97<= charCode <= 122)
        return true;
    return false;
}


function randWord() {
    return dictionary[Math.round(Math.random() * (dictionary.length - 1))];
}

function recordKey(evt) {
    if (!isRunning)
        return;
    buffer.push(evt.key);
}

