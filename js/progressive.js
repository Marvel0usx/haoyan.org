window.onload = init;

var nextImgIdx = 0;
var lazyLoadObserver, category;
var cols, sentinels = [];

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

function init() {
    const obsOptions = {
        root: document.querySelector("main"),
        rootMargin: "0px 0px 50px 0px"
    };
    category = sessionStorage.getItem("galleryCategory");
    if (!category) {
        category = "recent";
        sessionStorage.setItem("galleryCategory", category);
    }
    lazyLoadObserver = new IntersectionObserver(onIntersection, obsOptions);
    cols = document.querySelectorAll("div.gallery-frame div.gallery-col");
    cols.forEach(function(_, colIdx) { setSentinel(colIdx); });
}

function onIntersection(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting)
            return;
        let thisSentinel = entry.target.sentinel;
        let imgData = thisSentinel.imgData;
        observer.unobserve(entry.target);
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
    for (var idx = 0; idx < sentinels.length; idx++) {
        if (sentinels[idx] === sentinel) {
            sentinels.splice(idx, 1);
            return;
        }
    }
}