/*
 * to display the result, add an tag with class="keys" in html file
 */

window.addEventListener("keydown", recordKey);

function recordKey(evt) {
    var display = "Key pressed: " + evt.key + "\tKey Code: " + evt.keyCode +
        "\tModifier: ";
    document.querySelector(".keys").innerHTML = display;
  
    var modifier = "";
    if (evt.altKey)
        modifier += "ALT ";
    if (evt.ctrlKey)
        modifier += "CTRL ";
    if (evt.shiftKey)
        modifier += "SHIFT "; 
    if (modifier === "")
        modifier = "NONE";
  
    document.querySelector(".keys").innerHTML += modifier;
}
