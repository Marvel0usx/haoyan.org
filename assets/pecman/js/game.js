window.addEventListener("load", init);

const PECMAN_RADIUS = 30;
const SNACK_INIT_NUM = 3;
const SNACK_INIT_RADIUS = 5;
var LEVEL = 6;
var canvas, ctx;
var h, w;
var clock = 6;

var player = {
    x: undefined,
    y: undefined,
    xPrev: 0,
    yPrev: 0,
    fury: false,
    degree: 0
}

var snacks = []

function init() {
    // initialize canvas
    canvas = document.querySelector("#gameCvs");
    canvas.height = window.innerHeight;
    canvas.width  = window.innerWidth;
    ctx = canvas.getContext("2d");
    
    // initialize environment
    h = canvas.height;
    w = canvas.width;
    fury = false;
    
    canvas.addEventListener("mousemove", function(evt) {
        player.x = evt.clientX;
        player.y = evt.clientY;
    });

    canvas.addEventListener("mousedown", function(evt) {
        player.fury = true;
    });

    canvas.addEventListener("mouseup", function(evt) {
        player.fury = false;
    });
    
    generateSnacks();
    mainloop();
}

function mainloop() {
    ctx.clearRect(0, 0, w, h);
    snacks.forEach(function(s) {drawSnack(s);});
    snacks.forEach(function(s, index) {moveSnack(s, index)});
    drawPecman();
    requestAnimationFrame(mainloop);
}

function drawPecman() {
    // save the current canvas settings.
    ctx.save()

    // translate canvas origin, let (x, y) map to (0, 0).
    ctx.translate(player.x, player.y);

    // align the pec-man with the trace of mouse
    var newDegree = Math.atan2(player.y - player.yPrev, player.x - player.xPrev);
    clock--;
    if (player.x !== player.xPrev || player.y !== player.yPrev) {
        if (Math.abs(newDegree - player.degree) > Math.PI / 180) {
            if (clock <= 0) {
                player.degree = newDegree;
                clock = 6;   
            }
        }
    }
    ctx.rotate(player.degree);

    // draw pec-man
    if (player.fury)
        ctx.fillStyle = "#e63946";
    else
        ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(0, 0, PECMAN_RADIUS, Math.PI / 7, -Math.PI / 7, false);
    ctx.lineTo(PECMAN_RADIUS/12, PECMAN_RADIUS/15)
    ctx.fill();

    // restore the saved settings to avoid local settings changing global.
    ctx.restore()
    
    // update mouse coordinates.
    player.xPrev = player.x;
    player.yPrev = player.y;
}

function generateSnacks() {
    for (var i = 0; i < LEVEL + SNACK_INIT_NUM; i++) {
        var s = {
            x: w/2,
            y: h/2,
            xSpeed: 2 * LEVEL * Math.random() - LEVEL,
            ySpeed: 2 * LEVEL * Math.random() - LEVEL,
            color: randColor(),
            r: randSize(),
            poison: !!Math.round(Math.random())
        }
        snacks.push(s);
    }
}

function randColor() {
    var colors = ["#70d6ff", "#ff70a6", "#ff9770", "#ffd670", "#e9ff70",
                  "#2ec4b6", "#deaaff", "#f77f00", "#8338ec", "white"];
    var cIdx = Math.round(Math.random() * (colors.length - 1));
    return colors[cIdx];
}

function randSize() {
    return Math.round(Math.random() * (SNACK_INIT_RADIUS + LEVEL)) + SNACK_INIT_RADIUS;
}

function drawSnack(s) {
    ctx.save();
    ctx.fillStyle = s.color;
    ctx.translate(s.x, s.y);
    ctx.beginPath();
    ctx.arc(0, 0, s.r, 0, 2*Math.PI);
    ctx.fill();
    ctx.restore();
}

function moveSnack(s, index) {
    s.x += s.xSpeed;
    s.y += s.ySpeed;

    detectCollisionWithWalls(s);
    detectCollisionWithPlayer(s, index);
}

function detectCollisionWithWalls(s) {
    // collision w/ left or right
    if (s.x - s.r < 0) {
        // change direction
        s.xSpeed = -s.xSpeed;
        s.x = s.r;
    } else if (s.x + s.r > w) {
        s.xSpeed = -s.xSpeed;
        // reset position at collision point
        s.x = w - s.r;
    }
    // collision w/ top or bottom
    if (s.y - s.r < 0) {
        s.ySpeed = -s.ySpeed;
        s.y = s.r;
    } else if (s.y + s.r > h) {
        s.ySpeed = -s.ySpeed;
        s.y = h - s.r;
    }
}

function detectCollisionWithPlayer(s, index) {
    var distanceBtwCenter = Math.sqrt(Math.pow(player.x - s.x, 2) + Math.pow(player.y - s.y, 2));
    if (distanceBtwCenter < s.r + PECMAN_RADIUS) {
        snacks.splice(index, 1);
    }
}