window.onload = () => {
    document.querySelector("#ignite").addEventListener("click", (button) => {
        document.querySelector("#inf").style.display = "block";
        document.querySelector("#inf").style.zIndex = "-1";
        button.style.display = "none";
    });
};