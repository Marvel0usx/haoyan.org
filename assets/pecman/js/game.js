window.addEventListener("load", init);

var canvas, ctx;
var h, w, x_prev, y_prev;
var fury;

const PECMAN_RADIUS = 30;

function init() {
    // initialize environment
    canvas = document.querySelector("#gameCvs");
    canvas.height = window.innerHeight;
    canvas.width  = window.innerWidth;
    ctx = canvas.getContext("2d");
    
    h = canvas.height;
    w = canvas.width;
    fury = false;
    x_prev = 0;
    y_prev = 0;

    canvas.addEventListener("mousemove", function(evt) {
        console.log(evt.clientX);
        console.log(evt.clientY);
        drawPecman(evt.clientX, evt.clientY);
    });

    drawPecman();
    drawSprite();
}

function drawPecman(x, y) {
    var color;
    ctx.clearRect(0, 0, w, h);
    
    // save the current canvas settings.
    ctx.save()
    
    if (fury) {
        color = "red";
    } else {
        color = "yellow";
    }

    // translate canvas origin, let (x, y) map to (0, 0).
    ctx.translate(x, y);

    // align the pec-man with the trace of mouse
    var degree = Math.atan2(y - y_prev, x - x_prev);
    ctx.rotate(degree);

    // draw pec-man
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, PECMAN_RADIUS, Math.PI / 7, -Math.PI / 7, false);
    ctx.lineTo(PECMAN_RADIUS/12, PECMAN_RADIUS/15)
    ctx.fill();

    // restore the saved settings to avoid local settings changing global.
    ctx.restore()
    
    // update mouse coordinates.
    x_prev = x;
    y_prev = y;
}