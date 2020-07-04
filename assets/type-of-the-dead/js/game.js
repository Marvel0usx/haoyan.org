document.addEventListener("DOMContentLoaded", init);

var homePage, countDownPage, gamePage, winPage, losePage, statsDisplay;
var wpmDisp, accuracyDisp, levelDisp, wordToTypeDisp, wordTypedDisp, typoDisp, progressBar;
var isRunning, dictionary;
var presented = new Set();
var timer;
var wordToType;
var chIdx = 0;
var LEVEL = 1;
var MAX_LEVEL = 3;
var startTime;
var totalNumChar;
var totalTypo;
var totalTimeElapsed;

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
    wpmDisp = document.querySelector("#wpm");
    accuracyDisp = document.querySelector("#accuracy");
    levelDisp = document.querySelector("#level-disp");
    wordToTypeDisp = document.querySelector(".prompt");
    wordTypedDisp = document.querySelector(".typed");
    typoDisp = document.querySelector(".typo");
    progressBar = document.querySelector(".progress");
}

function setupListeners() {
    window.addEventListener("keydown", updateGameState);
    document.querySelector("#start-game").addEventListener("click", function() {
        setDictionary();
        onCountDownPage();
    });
}


function onHomePage() {
    isRunning = false;
    presented.clear();
    totalTimeElapsed = 0;
    totalNumChar = 0;
    totalTypo = 0;
    progressBar.style.display = "block";
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
    setDictionary();
    randWord();
    wordToTypeDisp.textContent = wordToType;
    isRunning = true;
    newTimer();
    updateStats();
}

function setDictionary() {
    let diff = document.querySelector("#diff-select");
    dictionary = wordBank[diff.options[diff.selectedIndex].value];
}

function isValidCh(ch) {
    var charCode = ch.charCodeAt(0);
    if (65 <= charCode <= 90 || 97<= charCode <= 122 || charCode === 32 /* space */)
        return true;
    return false;
}

function randWord() {
    numTypo = 0;
    do {
        if (presented.size === dictionary[LEVEL].length) {
            // dictionary depleted
            LEVEL++;
            presented.clear();
            wordToType = randWord();
        }
        var w = dictionary[LEVEL][Math.round(Math.random() * (dictionary[LEVEL].length - 1))];
    } while (presented.has(w));
    presented.add(w);
    wordToType = w;
}

function updateGameState(evt) {
    if (!isRunning)
        return;
    let ch = evt.key;
    if (ch === wordToType.charAt(chIdx)) {
        chIdx++;
        totalNumChar++;
        typoDisp.textContent = "";
        wordTypedDisp.textContent += ch;
        shiftAnchor();
    } else {
        totalTypo++;
        typoDisp.textContent = ch;
    }
    if (chIdx >= wordToType.length) {
        // next word
        let endTime = new Date();
        //in ms
        let timeDiff = endTime - startTime;
        totalTimeElapsed += timeDiff;
        clearTimeout(timer);
        chIdx = 0;
        wordTypedDisp.textContent = "";
        shiftAnchor();
        randWord();
        wordToTypeDisp.textContent = wordToType
        newTimer();
    }
}

function shiftAnchor() {
    let length = wordToTypeDisp.textContent.length;
    let unitPercent = 100 / length;
    let anchor = document.querySelector(".anchor");
    if (anchor.style.display !== "relative")
        anchor.style.display = "relative";
    if (!anchor.style.length)
        anchor.style.left = "0%";
    else {
        anchor.style.left = (chIdx * unitPercent).toString() + "%";
    }
}

function onWinPage() {
    setDisplay(winPage, "block");
    setDisplay(gamePage, "none");
    levelDisp.textContent = "Game Is Over";
    progressBar.style.display = "none";
}

function onLosePage() {
    setDisplay(losePage, "block");
    setDisplay(gamePage, "none");
    levelDisp.textContent = "Game Is Over";
    progressBar.style.display = "none";
}

function displayPage(which) {
    switch(which) {}
}

function updateStats() {
    if (!isRunning)
        return;
    levelDisp.textContent = ["Level", LEVEL, "-", dictionary.name].join(" ");
    let accuracy = 1 - totalTypo / totalNumChar;
    accuracyDisp.textContent = accuracy > 0 ? (accuracy * 100).toFixed(1).toString() + "%" : "0%";
    let speed = Math.round(totalNumChar / 6 / totalTimeElapsed * 60000);
    if (speed !== speed) {
        wpmDisp.textContent = "0wpm";
    } else if (speed === Infinity) {
        wpmDisp.textContent = "100wpm";
    } else {
        wpmDisp.textContent = speed + "wpm";
    }
    requestAnimationFrame(updateStats);
}

function updateTimer(sec, milisec) {
    document.querySelector("#sec").textContent = sec;
    document.querySelector("#milisec").textContent = milisec;
}

function newTimer() {
    startTime = new Date();
    timer = setTimeout(function() {
        isRunning = false;
        onLosePage();
    }, 5000);
}