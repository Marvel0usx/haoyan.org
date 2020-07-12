window.onload = init;

var arrNavText, arrNavLink, arrNavDot;

const navText = ["Home", "Project", "Gallery", "Calendar", "About", "Misc"];

function init() {
    setBindings();
    setListeners();
}

function setBindings() {
    for (var i = 1; i <= 6; i++) {
        arrNavText.push(document.querySelector(".nav-list:nth-child(" + i + ") div.text"));
        arrNavLink.push(document.querySelector(".nav-list:nth-child(" + i + ") a"));
        arrNavDot.push(document.querySelector(".nav-list:nth-child(" + i + ") div.nav-dot"));
    }
}

function setListeners() {
    arrNavDot.forEach(function(dot, idx) {
        listenToChangeNavText(dot, idx);
    });
    arrNavLink.forEach(function(lnk, idx) {
        listenToHideNavText(lnk, idx);
    });
}

function listenToChangeNavText(dot, idx) {
    dot.addEventListener("transitionend", function() {
        let t = arrNavText[i];
        t.textContent = "";
        for (var i = 0; i < navText[idx].length; i++) {
            setRandChar(idx, i, 600 * i);
            setInterval(function() {
                t.textContent = t.textContent.splice(i, 1, navText[idx][i]);
            }, 600 * i);
        }
    });
}

function listenToHideNavText(lnk, idx) {
    lnk.addEventListener("leave", function() {
        arrNavText[i].style.display = "none";
    });
}

function setRandChar(idx, charIdx, itvl) {
    let pass = Math.round(Math.random() * 20) + 10;
    let subitvl = ((itvl - 50) / pass).toFixed(0);
    for (var i = 0; i < pass; i++) {
        setInterval(function() {
            arrNavText[idx].textContent.splice(charIdx, 1, randChar());
        }, i * subitvl);
    }
}

function randChar() {
    return String.fromCharCode(Math.round(Math.random() * 87) + 35);
}