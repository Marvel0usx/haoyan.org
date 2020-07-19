window.addEventListener("DOMContentLoaded", initNavbar);

var navTextEles, navDots, navLnks, audioCtrl, sectionNavs;
var shuffledCount, shuffleTextIdx, shuffleChIdx;
const shuffleTimes = 2;
const navTextCnts = ["Home", "Projects", "Gallery", "Calendar", "About", "Misc"];
var onhover = [false, false, false, false, false, false];

function initNavbar() {
    setBindings();
    setListeners();
    syncPageSettings();
}

function setBindings() {
    navTextEles = document.querySelectorAll("ul.nav-list div.text");
    navLnks = document.querySelectorAll("ul.nav-list a");
    navDots = document.querySelectorAll("ul.nav-list div.nav-dot");
    audioCtrl = document.querySelector("div.toolbar a.music");
    sectionNavs = document.querySelectorAll("header.top a.title");
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
        lnk.addEventListener("mouseleave", function(evt) {
            if (evt.target.dataset.navActive == "true")
                return;
            /* hide text when mouse leaves */
            onhover[textIdx] = false;
            navTextEles[textIdx].textContent = "";
            navTextEles[textIdx].style.display = "none";
            let lnk = document.querySelector("[data-nav-active='hold']");
            if (lnk) {
                lnk.dataset.navActive = "true";
                let t = document.querySelector("[data-nav-active='true'] div.text");
                let idx = findLiIdx(t.parentElement.parentElement);
                shuffleTextIdx = idx;
                shuffledCount = 0;
                shuffleChIdx = 0;
                t.style.display = "block";
                shuffleText(t, "", idx);
                setTimeout(function() {
                    t.textContent = navTextCnts[idx];
                }, 200);
            }
        });

        lnk.addEventListener("mouseenter", function(evt) {
            /* enabling shuffle */
            onhover[textIdx] = true;
            if (evt.target.dataset.navActive == "false") {
                navLnks.forEach(function(lnk) {
                    if (lnk.dataset.navActive == "true") {
                        lnk.dataset.navActive = "hold";
                        lnk.querySelector("div.text").style.display = "none";
                    }
                });
            }
        });
    });

    audioCtrl.addEventListener("click", function(evt) {
        evt.preventDefault();
        audioCtrl.classList.toggle("on");
        toggleAudio();
    });

    sectionNavs.forEach((nav) => {
        nav.addEventListener("click", () => {
            nav.classList.toggle("on", true);
            sessionStorage.setItem("secNav", nav.dataset.secNav);
            sectionNavs.forEach((other) => {
                if (other !== nav)
                    other.classList.toggle("on", false);
            });
            sectionChange();
        });
    });
}

function findLiIdx(li) {
    let idx = 0;
    let ul = li.parentElement;
    while (li !== ul.children[idx])
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

function toggleAudio() {
    let state = sessionStorage.getItem("audioCtrl");
    if (!state) {
        sessionStorage.setItem("audioCtrl", "pause");
    } else {
        if (state === "play")
            sessionStorage.setItem("audioCtrl", "pause");
        else if (state === "pause")
            sessionStorage.setItem("audioCtrl", "play");
        else
            sessionStorage.setItem("audioCtrl", "pause");
    }
}

function syncPageSettings() {
    // sync playback settings
    let playbackState = sessionStorage.getItem("audioCtrl");
    if (playbackState) {
        if (playbackState === "play")
            audioCtrl.classList.toggle("on", true);
        else if (playbackState === "pause")
            audioCtrl.classList.toggle("on", false);
    }

    let navActive = sessionStorage.getItem("secNav");
    if (navActive) {
        switch (navActive) {
            case "still":
                sectionNavs[0].classList.toggle("on", true);
                break;
            case "nature":
                sectionNavs[1].classList.toggle("on", true);
                break;
            case "city":
                sectionNavs[2].classList.toggle("on", true);
                break;
            case "landscape":
                sectionNavs[3].classList.toggle("on", true);
                break;
        }
    } else {
        sessionStorage.setItem("secNav", "still");
        sectionNavs[0].classList.toggle("on", true);
    }        
}