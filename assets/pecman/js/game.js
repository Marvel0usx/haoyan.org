window.addEventListener("load", init);

const PECMAN_RADIUS = 30;
const SNACK_INIT_RADIUS = 5;
var canvas, ctx;
var h, w;

var player = {
    x: undefined,
    y: undefined,
    xPrev: 0,
    yPrev: 0,
    color: "yellow",
    degree: 0
}

var snacks = [{
    x: undefined,
    y: undefined,
    xSpeed: 1,
    ySpeed: 2,
    color: undefined,
    r: SNACK_INIT_RADIUS,
    poison: false
}]

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
    
    generateSnacks();
    mainloop();
}

function mainloop() {
    ctx.clearRect(0, 0, w, h);
    drawPecman();
    snacks.forEach(function(s) {drawSnack(s);});
    snacks.forEach(function(s) {moveSnack(s);});
    requestAnimationFrame(mainloop);
}

function drawPecman() {
    // save the current canvas settings.
    ctx.save()

    // translate canvas origin, let (x, y) map to (0, 0).
    ctx.translate(player.x, player.y);

    // align the pec-man with the trace of mouse
    if (player.x !== player.xPrev || player.y !== player.yPrev) {
        player.degree = Math.atan2(player.y - player.yPrev, player.x - player.xPrev);
    }
    ctx.rotate(player.degree);

    // draw pec-man
    ctx.fillStyle = player.color;
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
    snacks[0].color = "yellow";
    snacks[0].x = w/2;
    snacks[0].y = h/2;
    snacks.push({x: w/2, y: h/2, xSpeed: 3, ySpeed: 5, color: "red",
                r: 6, poison: true});
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

function moveSnack(s) {
    s.x += s.xSpeed;
    s.y += s.ySpeed;

    detectCollisionWithWalls(s);
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