var currPage, nextPage;

window.addEventListener("DOMContentLoaded", () => {
    currPage = document.querySelector("iframe#current");
    nextPage = document.querySelector("iframe#next");

    currPage.addEventListener("message", receiveMsg);
});

function receiveMsg(evt) {
    if (event.origin !== window.origin) return;
    console.log(evt.data);
}