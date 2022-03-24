import { generateTerrain, generateFog, placeSculptures } from "./index.js";
import { sculptures } from "../../data/sculptures.js";

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
    let sculptureTasks = sculptures.map((sculpture, index) => {
        return assetsManager.addContainerTask(sculpture.name, "", "../../models/sculptures/", sculpture.filename);
    })

    assetsManager.onFinish = function(tasks) {
        // console.log(tasks);
        generateTerrain(scene, tasks[0].texture, tasks[1], tasks[2]);
        placeSculptures(scene, sculptureTasks)
        // let fogPS = generateFog(scene, tasks[3].texture);
    };

	assetsManager.onTaskError = function(task) {
		console.log(task.errorObject);
	};

    assetsManager.load();
}