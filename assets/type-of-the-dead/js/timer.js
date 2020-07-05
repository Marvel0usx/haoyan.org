var initial = 50;
var count = initial;
var counter;
var initialMillis;

function countDown() {
    if (count <= 0) {
        clearInterval(counter);
        return;
    }
    var current = Date.now();
    
    count = count - (current - initialMillis);
    initialMillis = current;
    displayCountDown(count);
}

function displayCountDown() {
    console.log()
}