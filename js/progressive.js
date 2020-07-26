var nextImgIdx = 0;
var lazyLoadObserver, category;
var cols, sentinels = [];

const obsOptions = {
    root: document.querySelector("main"),
    rootMargin: "0px 0px 10px 0px",
    threshold: 0.05
};

class Sentinel {
    constructor(colIdx) {
        this.colIdx = colIdx;
        this.colWidth = parseFloat(cols[colIdx].clientWidth);
        this.imgIdx = nextImgIdx++;
        this.bindImg();
    }

    bindImg() {
        this.imgEle = document.createElement("img");
        this.imgEle.draggable = false;
        this.imgEle.sentinel = this;
        this.imgEle.classList.add("lazy-load");
        cols[this.colIdx].appendChild(this.imgEle);
        this.imgEle.style.height = this.calcOffsetHeight();
    }

    calcOffsetHeight() {
        let ow = IMG_SRC[category][this.imgIdx].width;
        let oh = IMG_SRC[category][this.imgIdx].height;
        let ch = oh * this.colWidth / ow;
        return Math.round(ch).toString() + "px" /* very important */;
    }

    get imgData() {
        return IMG_SRC[category][this.imgIdx];
    }
}

function lazyLoad() {
    nextImgIdx = 0;
    while (sentinels.length !== 0) {
        let s = sentinels.pop();
        if (lazyLoadObserver)
            lazyLoadObserver.unobserve(s.imgEle);
    }
    lazyLoadObserver = new IntersectionObserver(onIntersection, obsOptions);
    category = sessionStorage.getItem("secNav");
    if (!category) {
        category = "still";
        sessionStorage.setItem("secNav", category);
    }
    cols = document.querySelectorAll("div.lazy-load div.lazy-col");
    cols.forEach(function (col, colIdx) { col.innerHTML = ""; setSentinel(colIdx); });
}

function onIntersection(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting)
            return;
        // if (mq1.matches)
        //     return;
        let thisSentinel = entry.target.sentinel;
        if (!thisSentinel) return;
        let imgData = thisSentinel.imgData;
        entry.target.src = imgData.src;
        entry.target.classList.remove("lazy-load");
        entry.target.classList.add("loaded");
        setSentinel(thisSentinel.colIdx);
        removeSentinel(thisSentinel);
        entry.target.sentinel = undefined;
    });
}

function setSentinel(colIdx) {
    if (nextImgIdx < IMG_SRC[category].length) {
        let s = new Sentinel(colIdx);
        sentinels.push(s);
        lazyLoadObserver.observe(s.imgEle);
    }
}

function removeSentinel(sentinel) {
    for (var idx = 0; idx < sentinels.length; idx++) {
        if (sentinels[idx] === sentinel) {
            sentinels.splice(idx, 1);
            return;
        }
    }
}

function sectionChange() {
    lazyLoad();
}

/* media queries */
var mq1 = window.matchMedia("(max-width: 900px)");
var mq2 = window.matchMedia("(min-width: 901px)");

window.addEventListener("DOMContentLoaded", () => {
    if (mq1.matches) {
        let cs = document.querySelectorAll("div.gallery-col");
        cs[2].parentNode.removeChild(cs[2]);
        cs[1].parentNode.removeChild(cs[1]);
    }
    lazyLoad();
});

window.addEventListener("resize", () => {
    if (mq1.matches) {
        oneColView();
    }
    if (mq2.matches) {
        threeColView();
    }
});

function oneColView() {
    let cols = document.querySelectorAll("div.gallery-col");
    if (cols.length != 1) {
        lazyLoadObserver.disconnect();
        sentinels.forEach(function (s) {
            s.imgEle.parentNode.removeChild(s.imgEle);
        });
        sentinels = [];
        var imgs = document.querySelectorAll("div.gallery-frame img:not(.lazy-load)");
        imgs.forEach((img) => {
            cols[0].appendChild(img);
        });
        cols[2].parentNode.removeChild(cols[2]);
        cols[1].parentNode.removeChild(cols[1]);
        nextImgIdx -= 3;
        setSentinel(0);
    }
}

function threeColView() {
    let cols = document.querySelectorAll("div.gallery-col");
    let gallery = document.querySelector("div.gallery-frame");

    if (cols.length != 3) {
        lazyLoadObserver.disconnect();
        sentinels.forEach((s) => {
            s.imgEle.parentNode.removeChild(s.imgEle);
        });
        sentinels = [];
        for (let idx = 0; idx < 2; idx++) {
            var newCol = document.createElement("div");
            newCol.classList.add("gallery-col");
            newCol.classList.add("lazy-col");
            gallery.appendChild(newCol);

        }
        cols = document.querySelectorAll("div.gallery-frame > div.gallery-col");
        var colIdx = 2;
        var imgs = document.querySelectorAll("div.gallery-frame img:not(.lazy-load)");
        imgs.forEach((img) => {
            cols[colIdx--].appendChild(img);
            colIdx = (colIdx < 0) ? 2 : colIdx;
        });
        for (let colIdx = 0; colIdx < 3; colIdx++) {
            setSentinel(colIdx);
        }
    }
}