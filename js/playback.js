const CTRL_CHECK_TIMEOUT = 30;
const FADE_IN_OUT_TIMEOUT = 25;
var ctrlChkCntDown = 0;

window.onload = function () {
    sessionStorage.setItem("audioCtrl", "pause");
    var audio = document.querySelector("audio", document.querySelector("audio"));
    observeAudioCtrl(audio, undefined);
};

function observeAudioCtrl(audio, currState) {
    if (ctrlChkCntDown <= 0) {
        ctrlChkCntDown = CTRL_CHECK_TIMEOUT;
        // console.log("checking ctrl status: " + sessionStorage.getItem("audioCtrl"));
        let ctrl = sessionStorage.getItem("audioCtrl");
        if (currState !== ctrl && ctrl === "play") {
            fadeIn(audio);
            currState = ctrl;
        } else if (currState !== ctrl && ctrl === "pause") {
            fadeOut(audio);
            currState = ctrl;
        }
    }
    requestAnimationFrame(function () {
        ctrlChkCntDown--;
        observeAudioCtrl(audio);
    });
}

let volumeStep = 1 / FADE_IN_OUT_TIMEOUT;

function fadeIn(audio) {
    if (audio.paused) {
        audio.volume = 0;
        audio.play();
    }
    if (audio.volume + volumeStep < 1) {
        audio.volume += volumeStep;
    } else {
        audio.volume = 1;
        return;
    }
    requestAnimationFrame(function () { fadeIn(audio); });
}

function fadeOut(audio) {
    if (audio.volume - volumeStep > 0) {
        audio.volume -= volumeStep;
    } else {
        audio.volume = 0;
        audio.pause();
        return;
    }
    requestAnimationFrame(function () { fadeOut(audio); });
}