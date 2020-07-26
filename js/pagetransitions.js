var currPage, nextPage;
var currPageAnimEnd, nextPageAnimEnd;
var isAnimating;

window.addEventListener("DOMContentLoaded", () => {
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
    currPageAnimEnd = false;
    nextPageAnimEnd = false;
    currPage.className = "pt-page pt-next-page";
    nextPage.className = "pt-page pt-current-page";
    currPage.innerHTML = "";
    isAnimating = false;
}