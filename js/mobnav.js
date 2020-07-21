var pageNames = ["/home.html", "/projects.html", "/gallery.html", "/calendar.html", "/about.html", "/misc.html"];
var mobileQuery = window.matchMedia("(max-width: 620px)");
var touchStartPtX, touchEndPtX;

if (!sessionStorage.getItem("pageIdx")) {
    let thisUrl = window.location.pathname;
    if (thisUrl === "/") {
        sessionStorage.setItem("pageIdx", "0");
        pageIdx = 0;
    } else {
        pageNames.forEach((url, idx) => {
            if (thisUrl === url) {
                sessionStorage.setItem("pageIdx", idx.toString());
                pageIdx = idx;
            }
        });
    }
} else {
    pageIdx = parseInt(sessionStorage.getItem("pageIdx"));
}

window.addEventListener("DOMContentLoaded", () => {
    function prompt(evt) {
        if (!mobileQuery.matches) {
            return;
        } else {
            if (!sessionStorage.getItem("prompted")) {
                sessionStorage.setItem("prompted", true);
                alert("Swipe to navigate between pages!");
                window.removeEventListener("touchstart", prompt, false);
            }
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
            sessionStorage.setItem("pageIdx", pageIdx.toString());
            window.location.replace(pageNames[pageIdx]);
        } else if (touchEndPtX - touchStartPtX < -50) {
            pageIdx = (pageIdx - 1 < 0) ? pageNames.length - 1 : pageIdx - 1;
            sessionStorage.setItem("pageIdx", pageIdx.toString());
            window.location.replace(pageNames[pageIdx]);
        }
    }, false);
});