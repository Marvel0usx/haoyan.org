var currPage, nextPage;

window.addEventListener("DOMContentLoaded", () => {
    currPage = document.querySelector("iframe#current");
    nextPage = document.querySelector("iframe#next");

    window.addEventListener("message", receiveMsg);
});

function receiveMsg(evt) {
    if (evt.origin !== window.origin) return;
    /* load next page */
    nextPage.src = evt.data.target;
    if (evt.data.direction == "left") {
        slideToLeft();
    } else {
        slideToRight();
    }
}

function slideToLeft() {
    currPage.classList.toggle(".pt-page-moveToLeft");
    nextPage.classList.toggle(".pt-page-moveFromRight");
}

function slideToRight() {
    currPage.classList.toggle(".pt-page-moveToRight");
    nextPage.classList.toggle(".pt-page-moveFromLeft");
}