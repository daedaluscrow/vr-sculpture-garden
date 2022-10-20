export class CustomLoadingScreen {

    constructor() {

    }

    displayLoadingUI() {
        window.engine.resize();
    }

    loadingUIReady() {
        const loadingText = document.getElementById("loading-text");
        const loadingButton = document.getElementById('loading-button');
        loadingButton.style.display = "flex";
        loadingButton.addEventListener("click", function(event) {
            window.engine.hideLoadingUI();
        })
        loadingText.innerHTML = "Ready!";

    }

    hideLoadingUI() {
        const loadElement = document.getElementById("loadingScreen");
        const canvas = document.getElementById("renderCanvas");
        loadElement.style.display = "none";
        canvas.style.display = "flex";
        window.engine.resize();
    }
}
