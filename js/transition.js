const TIMEOUT = 100;

function navlistTransition() {
    const strings = document.querySelectorAll("div.string");
    const navlines = document.querySelectorAll("div.nav-line");
    const navdots = document.querySelectorAll("div.nav-dot");
    const guitar = document.querySelector("div.align-container.guitar");
    const main = document.querySelector("main");
    const toolbarBtns = document.querySelectorAll("div.toolbar a.square");
    const toolbar2 = document.querySelector("div.toolbar-2");
    const secNavs = document.querySelectorAll("a.title");

    secNavs.forEach((nav, idx) => {
        setTimeout(() => nav.classList.toggle("loaded", true), idx * TIMEOUT);
    });
    guitar.classList.toggle("loaded", true);
    toolbarBtns.forEach((btn, idx) => {
        setTimeout(() => btn.classList.toggle("loaded", true), idx * TIMEOUT * 2);
    });
    strings.forEach((str, idx) => {
        setTimeout(() => str.classList.toggle("loaded", true), idx * TIMEOUT);
    });
    navlines.forEach((nav, idx) => {
        setTimeout(() => {
            nav.classList.toggle("loaded", true);
            if (idx < navdots.length) {
                setTimeout(() => {
                    navdots[idx].classList.toggle("loaded", true);
                }, 5 * TIMEOUT);
            }
        }, idx * TIMEOUT);
    });
    toggleScrollBtn();
    setTimeout(() => {
        toolbar2.classList.toggle("loaded", true);
    }, 600);
    main.classList.toggle("loaded", true);
}