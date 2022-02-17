import { generateTerrain } from "./generateTerrain.js";
import { generateFog } from "./generateFog.js";

export function loadAssets(scene) {
    let assetsManager = new BABYLON.AssetsManager(scene);

    let bgMusic = new BABYLON.Sound("Background Music", "../../sounds/vsg_bg_music.mp3", scene, null, {
        loop: true,
        autoplay: false
    });

    let textureTask = assetsManager.addTextureTask("vsg_grass_tile", "../../textures/terrain/vsg_grass_tile-1024.jpg");
    let treeTask = assetsManager.addContainerTask("dogwood", "", "../../models/tree/", "dogwood-material.glb")
    let grassTask = assetsManager.addContainerTask("grass", "", "../../models/grass/", "grass.glb")
    let fogTask = assetsManager.addTextureTask("fog", "../../textures/fog.png");


    assetsManager.onFinish = function(tasks) {
        console.log(tasks);
        generateTerrain(scene, tasks[0].texture, tasks[1], tasks[2]);
        let fogPS = generateFog(scene, tasks[3].texture);
    };

	assetsManager.onTaskError = function(task) {
		console.log(task.errorObject);
	};

    assetsManager.load();
}