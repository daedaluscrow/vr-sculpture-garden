import { generateTerrain } from "./generateTerrain.js";

export function loadAssets(scene) {
    let assetsManager = new BABYLON.AssetsManager(scene);

    let bgMusic = new BABYLON.Sound("Background Music", "../../sounds/vsg_bg_music.mp3", scene, null, {
        loop: true,
        autoplay: false
    });

    let textureTask = assetsManager.addTextureTask("vsg_grass_tile", "../../textures/terrain/vsg_grass_tile-1024.jpg");


    assetsManager.onTaskSuccess = function(task) {
        console.log(task);
        generateTerrain(scene, task.texture)
	};

	assetsManager.onTaskError = function(task) {
		console.log(task.errorObject);
	};

    assetsManager.load();
}