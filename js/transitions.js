window.onload = init;

var arrNavText, arrNavLink, arrNavDot;

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
        listenToChangeNavText(dot, arrNavText[idx]);
    });
    arrNavLink.forEach(function(lnk, idx) {
        listenToHideNavText(lnk, arrNavText[i]);
    });
}

function listenToChangeNavText(dot, textBinding) {
    dot.addEventListener("transitionend", function() {});
}

function listenToHideNavText(lnk, textBinding) {
    lnk.addEventListener("leave", function() {
        textBinding.textContent = "";
    textBinding.style.display = "none";
    });
}