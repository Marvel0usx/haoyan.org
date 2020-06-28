window.addEventListener("load", init);

// canvas and access object.
var canvas, ctx;
// score board element.
var score, lives, cds;
// height and width of the canvas.
var h, w;
// update the heading of player after 6 ticks.
var clock = 6;
// array of snacks on the canvas.
var snacks = [];
// game state.
var gameRunning = false;

// game settings.
var numPoisonSnacks = 0, numGoodSnacks = 0;
var liveUpRound = 3;
const colors = ["#70d6ff", "#ff70a6", "#ff9770", "#ffd670", "#e9ff70",
                "#2ec4b6", "#deaaff", "#f77f00", "#8338ec", "#ffffff"];
var colorToEat = undefined;
const PECMAN_RADIUS = 30;
const SNACK_INIT_NUM = 3;
const SNACK_INIT_RADIUS = 5;
const ROUND_PER_FURY_MARK = 5;
const LEVEL_MAX = 18;
var LEVEL = 0;

// sound effects.
var soundHitWall;
var soundLevelUp;
var soundPoison;
var soundScoreUp;
var soundWin;
var soundLose;

var player = {
    x: undefined,
    y: undefined,
    xPrev: 0,
    yPrev: 0,
    fury: false,
    furyCds: 0,
    degree: 0,
    lives: 3,
    score: 0,
    draw: function() {
        // save the current canvas settings.
        ctx.save()

        // translate canvas origin, let (x, y) map to (0, 0).
        ctx.translate(this.x, this.y);

        // align the pec-man with the trace of mouse
        var newDegree = Math.atan2(this.y - this.yPrev, this.x - this.xPrev);
        clock--;
        if (this.x !== this.xPrev || this.y !== this.yPrev) {
            if (Math.abs(newDegree - this.degree) > Math.PI / 180) {
                if (clock <= 0) {
                    this.degree = newDegree;
                    clock = 6;   
                }
            }
        }
        ctx.rotate(this.degree);

        // draw pec-man
        if (this.fury)
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
        this.xPrev = this.x;
        this.yPrev = this.y;
    }
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
    score = document.querySelector("#score");
    lives = document.querySelector("#lives");
    cds = document.querySelector("#fury-cd");
    setUpSoundEffects();
    resetEnv();
    
    // event bindings
    document.querySelector("#btn-start").addEventListener("click", function() {
        document.querySelector("#game").style.display = "flex";
        this.parentNode.style.display = "none";
        levelUp();
        mainloop();
    });
    
    canvas.addEventListener("mousemove", function(evt) {
        player.x = evt.clientX;
        player.y = evt.clientY;
        if (player.score < 0)
        player.fury = false;
    });
    
    canvas.addEventListener("mousedown", function(evt) {
        if (player.furyCds > 0 && !player.fury) {
            player.fury = true;
            player.furyCds--;
        } else if (player.score < 0) {
            player.fury = false;
        }
    });
    
    canvas.addEventListener("mouseup", function(evt) {
        player.fury = false;
    });

    document.querySelector(".btn-again.win").addEventListener("click", function() {
        document.querySelector("#win").style.display = "none";
        document.querySelector("#game").style.display = "flex";
        resetEnv();
        levelUp();
        mainloop();
    });

    document.querySelector(".btn-again.lose").addEventListener("click", function() {
        document.querySelector("#lose").style.display = "none";
        document.querySelector("#game").style.display = "flex";
        resetEnv();
        levelUp();
        mainloop();
    });
}

function setUpSoundEffects() {
    soundHitWall = new Howl({
        src: ["./sound/plop.mp3"],
        onload: function() {
            console.log("Loaded sound.");
        }
    });
    soundLevelUp = new Howl({
        src: ["./sound/level-up.mp3"],
        volume: 0.3
    });
    soundScoreUp = new Howl({
        src: ["./sound/score-up.mp3"],
        volume: 0.3
    });
    soundPoison = new Howl({
        src: ["./sound/poison.mp3"],
        volume:0.4
    });
    soundWin = new Howl({
        src: ["./sound/win.mp3"],
        volume: 0.6
    });
    soundLose = new Howl({
        src: ["./sound/lose.mp3"],
        volume: 0.6
    });
}

function levelUp() {
    LEVEL++;
    snacks = [];
    if (LEVEL % liveUpRound == 0)
        player.lives++;
    if (LEVEL % ROUND_PER_FURY_MARK === 0)
        player.furyCds++;
    player.fury = false;
    generateSnacks();
    numGoodSnacks = -1;
    gameRunning = true;
}

function countSnacks() {
    snacks.sort(function compare(s1, s2) {
        var c1 = s1.color.toUpperCase();
        var c2 = s2.color.toUpperCase();
        if (c1 < c1) {
            return -1;
        }
        if (c1 > c1) {
            return 1;
        }
        return 0;
    });
    colorToEat = snacks[0].color;
    numGoodSnacks = 0;
    snacks.forEach(function(s) {
        if (s.color !== colorToEat) {
            numPoisonSnacks++;
        } else {
            numGoodSnacks++;
        }
    });
}

function mainloop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, w, h);
        updateBanner();
        updateScoreBoard();
        snacks.forEach(function(s) {drawSnack(s);});
        snacks.forEach(function(s, index) {moveSnack(s, index)});
        player.draw();

        // game state update
        if (player.lives <= -1) {
            gameRunning = false;
            effectLoseSound();
            showScreen("#lose");
        } else if (LEVEL >= LEVEL_MAX) {
            gameRunning = false;
            effectWinSound();
            showScreen("#win");
        }
        if (numGoodSnacks === 0) {
            levelUp();
            effectLevelUpSound();
        }
        requestAnimationFrame(mainloop);
    }
}

function generateSnacks() {
    setTimeout(function() {
        for (var i = 0; i < LEVEL + SNACK_INIT_NUM; i++) {
            var s = {
                x: w/2,
                y: h/2,
                xSpeed: 2 * LEVEL * Math.random() - LEVEL,
                ySpeed: 2 * LEVEL * Math.random() - LEVEL,
                color: randColor(),
                r: randSize()
            };
            snacks.push(s);
        }
        countSnacks();
    }, 1300);
}

function updateBanner() {
    var colorText;
    switch(colorToEat) {
        case "#70d6ff": colorText = "Maya Blue"; break;
        case "#ff70a6": colorText = "Tickle Me Pink"; break;
        case "#ff9770": colorText = "Atomic Tangerine"; break;
        case "#ffd670": colorText = "Salomie"; break;
        case "#e9ff70": colorText = "Honeysuckle"; break;
        case "#2ec4b6": colorText = "Light Sea Green"; break;
        case "#deaaff": colorText = "Mauve"; break;
        case "#f77f00": colorText = "Tangerine"; break;
        case "#8338ec": colorText = "Blue Violet"; break;
        case "#ffffff": colorText = "white"; break;
        default: colorText = "XXX";
    }
    document.querySelector(".game > h2").textContent = "Eat " + colorText + "!";
    document.querySelector(".game > h2").style.color = colorToEat;
}

function randColor() {
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
    var collide = false;
    // collision w/ left or right
    if (s.x - s.r < 0) {
        // change direction
        s.xSpeed = -s.xSpeed;
        s.x = s.r;
        collide = true;
    } else if (s.x + s.r > w) {
        s.xSpeed = -s.xSpeed;
        // reset position at collision point
        s.x = w - s.r;
        collide = true;
    }
    // collision w/ top or bottom
    if (s.y - s.r < 0) {
        s.ySpeed = -s.ySpeed;
        s.y = s.r;
        collide = true;
    } else if (s.y + s.r > h) {
        s.ySpeed = -s.ySpeed;
        s.y = h - s.r;
        collide = true;
    }
    if (collide) {
        effectCollideWallSound(s);
    }
}

function detectCollisionWithPlayer(s, index) {
    var distanceBtwCenter = Math.sqrt(Math.pow(player.x - s.x, 2) + Math.pow(player.y - s.y, 2));
    if (distanceBtwCenter < s.r + PECMAN_RADIUS) {
        snacks.splice(index, 1);
        if (s.color !== colorToEat) {
            if (player.fury) {
                player.score -= 100;
                numPoisonSnacks--;
            } else {
                effectEatPoison();
                player.lives--;
                numPoisonSnacks--;
            }
        } else {
            if (player.fury) {
                numGoodSnacks--;
                player.score += 10;
            } else {
                player.score += 100;
                numGoodSnacks--;
            }
        }
        effectScoreChange();
    }
}

function updateScoreBoard() {
    score.textContent = player.score;
    if (cds.childElementCount !== player.furyCds) {
        cds.innerHTML = "";
        for (var i = 0; i < player.furyCds; i++) {
            var img = document.createElement("img");
            img.src = "./images/ready.png";
            cds.append(img);
        }
    }
    if (lives.childElementCount !== player.lives) {
        lives.innerHTML = "";
        for (var i = 0; i < player.lives; i++) {
            var img = document.createElement("img");
            img.src = "./images/pecman.png";
            lives.append(img);
        }
    }
}

/*
 * Helper function to show win/lose screen.
 */
function showScreen(query) {
    document.querySelector("#game").style.display = "none";
    document.querySelector(query).style.display = "block";
    document.querySelector(query + " > p.score").textContent = "Your score is " + player.score;
}

/*
 * Reset environment when restart.
 */
function resetEnv() {
    LEVEL = 0;
    player.fury = false;
    player.furyCds = 0;
    player.score = 0;
    player.lives = 3;
    player.x = w/2;
    player.y = h - PECMAN_RADIUS * 4;
    numGoodSnacks = 0;
    numPoisonSnacks = 0;
    colorToEat = undefined;
}

/*
 * Sound effects are free under the Creative Common 0 License.
 * Credit to http://www.theallsounds.com/
 */
function effectCollideWallSound(s) {
    let volume = 0.005 * s.r;
    let id = soundHitWall.play();
    soundHitWall.volume(volume, id);
}

function effectEatPoison() {
    soundPoison.play();
    canvas.setAttribute("class", "shake");
    canvas.style.border = "5px dashed red";
    setTimeout(function() {
        canvas.style.border = "5px dashed white";
        canvas.removeAttribute("class");
    }, 300);
}

function effectScoreChange() {
    soundScoreUp.play();
    score.style.color = "yellow";
    setTimeout(function() {
        score.style.color = "white";
    }, 300);
}

function effectLevelUpSound() {
    soundLevelUp.play();
}

function effectWinSound() {
    soundWin.play();
}

function effectLoseSound(){
    soundLose.play();
}

//TODO: invert color and prompt text

//TODO: add language support