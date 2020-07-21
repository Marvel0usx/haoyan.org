var pageIdx = 0;
var pageNames = ["home.html", "projects.html", "gallery.html", "calendar.html", "about.html", "misc.html"];
var mobileQuery = window.matchMedia("(max-width: 620px)");
var touchStartPtX, touchEndPtX;
window.addEventListener("DOMContentLoaded", () => {
    function prompt(evt) {
        if (!mobileQuery.matches) {
            return;
        } else {
            alert("Swipe to navigate between pages!");
            window.removeEventListener("touchstart", prompt, false);
        }
    }
    window.addEventListener("touchstart", prompt);
    window.addEventListener("touchstart", (evt) => {
        touchStartPtX = evt.touches[0].clientX;
    }, false);
    window.addEventListener("touchend", (evt) => {
        touchEndPtX = evt.changedTouches[0].clientX;
        if (touchEndPtX - touchStartPtX > 50) {
            pageIdx = (pageIdx + 1 >= pageNames.length) ? 0 : pageIdx + 1;
            window.location.replace(pageNames[pageIdx]);
        } else if (touchEndPtX - touchStartPtX < -50) {
            pageIdx = (pageIdx - 1 < 0) ? pageNames.length - 1 : pageIdx - 1;
            window.location.replace(pageNames[pageIdx]);
        }
    }, false);
});