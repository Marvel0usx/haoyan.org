window.onload = init;

var navTextEles, navDots, navLnks;
var shuffledCount, shuffleTextIdx, shuffleChIdx;
const shuffleTimes = 2;
const navTextCnts = ["Home", "Projects", "Gallery", "Calendar", "About", "Misc"];
var onhover = [false, false, false, false, false, false];

function init() {
    setBindings();
    setListeners();
}

function setBindings() {
    navTextEles = document.querySelectorAll("ul.nav-list div.text");
    navLnks = document.querySelectorAll("ul.nav-list a");
    navDots = document.querySelectorAll("ul.nav-list div.nav-dot");
}

function setListeners() {
    navDots.forEach(function(dot, textIdx) {
        dot.addEventListener("transitionend", function(evt) {
            /* IMPORTANT: continue iff. this event is fired 
               by the last transition: transform */
            if (evt.propertyName !== "transform")
                return;
            if (!onhover[textIdx])
                return;
            /* show text during and after transition */
            navTextEles[textIdx].style.display = "block";
            /* setup shuffle */
            shuffleTextIdx = textIdx;
            shuffledCount = 0;
            shuffleChIdx = 0;
            shuffleText(navTextEles[textIdx], "", textIdx);
        });
    });
            
    navLnks.forEach(function(lnk, textIdx) {
        lnk.addEventListener("mouseleave", function() {
            /* hide text when mouse leaves */
            onhover[textIdx] = false;
            navTextEles[textIdx].textContent = "";
            navTextEles[textIdx].style.display = "none";
            let lnk = document.querySelector("[data-nav-active='hold']");
            if (lnk) {
                lnk.dataset.navActive = "true";
                let t = document.querySelector("[data-nav-active='true'] div.text");
                let idx = findLiIdx(t);
                shuffleTextIdx = idx;
                shuffledCount = 0;
                shuffleChIdx = 0;
                shuffleText(t, "", idx);
            }
        });

        lnk.addEventListener("mouseenter", function(evt) {
            /* enabling shuffle */
            onhover[textIdx] = true;
            if (evt.target.dataset.navActive == "false") {
                navLnks.forEach(function(lnk) {
                    if (lnk.dataset.navActive == "true") {
                        lnk.dataset.navActive = "hold";
                    }
                });
            }
        });
    });
}

function findLiIdx(text) {
    let idx = 0;
    let ul = text.parentElement.parentElement;
    while (text.parentElement !== ul.children[idx])
        idx++;
    return idx;
}
    
function shuffleText(textEle, textCnt, textIdx) {
    if (shuffledCount >= shuffleTimes) {
        shuffledCount = 0;
        textCnt += navTextCnts[shuffleTextIdx][shuffleChIdx];
        textEle.textContent = textCnt;
        shuffleChIdx++;
    }
    if (shuffleChIdx >= navTextCnts[shuffleTextIdx].length) {
        return;
    }
    shuffledCount++;
    textEle.textContent = textCnt + randChar();
    requestAnimationFrame(function() {shuffleText(textEle, textCnt, textIdx)});
}

function randChar() {
    return String.fromCharCode(Math.round(Math.random() * 87) + 35);
}