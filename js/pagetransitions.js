var currPage, nextPage;
var currPageAnimEnd, nextPageAnimEnd;
var isAnimating;
const TIMEOUT = 200;
const HOME_ROUTE = "/home.html";

window.addEventListener("DOMContentLoaded", () => {
    showGreetingAndLoadHome();
    window.addEventListener("message", receiveMsg);
});

function receiveMsg(evt) {
    if (evt.origin !== window.origin) return;
    currPage = document.querySelector("iframe.pt-current-page");
    nextPage = document.querySelector("iframe.pt-next-page");
    /* load next page */
    nextPage.src = evt.data.target;
    slideDirection(evt.data.direction);
}

function slideDirection(direction) {
    if (isAnimating) return;
    isAnimating = true;
    var nextPageAnimClass, currentPageAnimClass;
    if (direction == "left") {
        nextPageAnimClass = "pt-page-moveFromRight";
        currentPageAnimClass = "pt-page-moveToLeft";
    } else {
        nextPageAnimClass = "pt-page-moveFromLeft";
        currentPageAnimClass = "pt-page-moveToRight";
    }
    currPage.classList.add(currentPageAnimClass);
    currPage.addEventListener("animationend", function _() {
        currPage.removeEventListener("animationend", _);
        currPageAnimEnd = true;
        if (nextPageAnimEnd) {
            resetPages();
        }
    });

    nextPage.className = "pt-page pt-current-page " + nextPageAnimClass;
    nextPage.addEventListener("animationend", function _() {
        nextPage.removeEventListener("animationend", _);
        nextPageAnimEnd = true;
        if (currPageAnimEnd) {
            resetPages();
        }
    });
}

function resetPages() {
    currPage.innerHTML = "";
    currPageAnimEnd = false;
    nextPageAnimEnd = false;
    currPage.className = "pt-page pt-next-page";
    nextPage.className = "pt-page pt-current-page";
    isAnimating = false;
}

var haltWriting = false;

function showGreetingAndLoadHome() {
    const h2Str = "Ahoy! Stranger";
    const h3Arr = ["Welcome to this cyberland", "It's a pleasure to meet you 😄"];
    let body = document.querySelector("body");
    let btn = document.querySelector("#go");
    let typewriterH2 = document.querySelector("section.greetings h2.typewriter");
    let typewriterH3 = document.querySelector("section.greetings h3.typewriter");
    typewriterH3.style.display = "none";
    let eraseTimeout, writeTimeout;
    writeTimeout = write(typewriterH2, h2Str) * TIMEOUT;
    setTimeout(() => {
        typewriterH2.classList.add("done");
        typewriterH3.style.display = "block";
        loopWrite(typewriterH3, h3Arr, 0);
    }, writeTimeout);

    btn.addEventListener("click", () => {
        haltWriting = true;
        body.removeChild(document.querySelector("section.greetings"));
        document.querySelectorAll("iframe.pt-page").forEach((p) => p.style.display = "block");
        document.querySelector("iframe.pt-current-page").src = HOME_ROUTE;
    });
}

function erase(tw) {
    let eraseLen = tw.textContent.length;
    for (let i = 0; i < eraseLen; i++) {
        setTimeout(() => {
            tw.textContent.length--;
        }, i * TIMEOUT);
    }
    return eraseLen;
}

function write(tw, txt) {
    let writeLen = txt.length;
    for (let i = 0; i < writeLen; i++) {
        setTimeout(() => {
            tw.textContent += txt[i];
        }, i * TIMEOUT);
    }
    return writeLen;
}

function loopWrite(tw, txtArr, idx) {
    let eraseTimeout = erase(tw) * TIMEOUT;
    setTimeout(() => {
        let writeTimeout = write(tw, txtArr[idx]) * TIMEOUT;
        setTimeout(() => {
            loopWrite(tw, txtArr, (idx + 1 >= txtArr.length) ? 0 : idx++);
        }, writeTimeout);
    }, eraseTimeout);
}