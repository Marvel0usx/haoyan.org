var nextImgIdx = 0;
var lazyLoadObserver, category;
var cols, sentinels = [];

const obsOptions = {
    root: document.querySelector("main"),
    rootMargin: "0px 0px 200px 0px"
};

class Sentinel {
    constructor(colIdx) {
        this.colIdx = colIdx;
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
        const cw = this.imgEle.offsetWidth;
        let ch = oh * cw / ow;
        return ch;
    }

    get imgData() {
        return IMG_SRC[category][this.imgIdx];
    }
}

window.addEventListener("DOMContentLoaded", lazyLoad);

function lazyLoad() {
    nextImgIdx = 0;
    while(sentinels.length !== 0) {
        removeSentinel(sentinels.pop());
    }
    lazyLoadObserver = new IntersectionObserver(onIntersection, obsOptions);
    category = sessionStorage.getItem("secNav");
    if (!category) {
        category = "still";
        sessionStorage.setItem("secNav", category);
    }
    cols = document.querySelectorAll("div.gallery-frame div.gallery-col");
    cols.forEach(function (col, colIdx) { col.innerHTML = ""; setSentinel(colIdx); });
}

function onIntersection(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting)
            return;
        let thisSentinel = entry.target.sentinel;
        let imgData = thisSentinel.imgData;
        entry.target.src = imgData["src"];
        entry.target.classList.remove("lazy-load");
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
    if (lazyLoadObserver)
        lazyLoadObserver.unobserve(sentinel.imgEle);
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