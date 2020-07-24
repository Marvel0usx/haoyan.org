// Write JavaScript here 
window.onload = init;

var progressBar;
var progressPercent;

function init() {
  progressBar = document.querySelector(".progress > div");
  progressPercent = document.querySelector(".percent");
  
  window.addEventListener("scroll", function(evt) {
    var max = document.body.scrollHeight - window.innerHeight;
    var percent = (window.pageYOffset / max) * 100;
    progressBar.style.width = percent + "%";
    progressPercent.innerHTML = Math.round(percent) + "%";
  });
}