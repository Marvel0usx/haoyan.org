window.addEventListener("load", init);

const PECMAN_RADIUS = 30;
var canvas, ctx;
var h, w;
var fury;
var cursor = {
    x: 0,
    y: 0,
    x_prev: 0,
    y_prev: 0
}

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
        cursor.x = evt.clientX;
        cursor.y = evt.clientY;
    });
    
    // alternative for setInterval(animate, 100)
    requestAnimationFrame(animate);
}

function animate() {
    drawPecman();
    requestAnimationFrame(animate);
}

function drawPecman() {
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
    ctx.translate(cursor.x, cursor.y);

    // align the pec-man with the trace of mouse
    var degree = Math.atan2(cursor.y - cursor.y_prev, cursor.x - cursor.x_prev);
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
    cursor.x_prev = cursor.x;
    cursor.y_prev = cursor.y;
}