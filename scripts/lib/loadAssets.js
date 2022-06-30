import { generateTerrain, generateFog, placeSculptures } from "./index.js";
import { sculptures } from "../../data/sculptures.js";

export function loadAssets(scene) {
  let assetsManager = new BABYLON.AssetsManager(scene);

  let bgMusic = new BABYLON.Sound(
    "Background Music",
    "../../sounds/vsg_bg_music.mp3",
    scene,
    null,
    {
      loop: true,
      autoplay: false,
    }
  );

  let textureTask = assetsManager.addTextureTask(
    "vsg_grass_tile",
    "../../textures/terrain/vsg_grass_tile-1024.jpg"
  );
  let treeTask = BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "../../models/tree/",
    "dogwood-material.glb",
    scene
  );
  let grassTask = BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "../../models/grass/",
    "grass.glb",
    scene
  );
  let pedestalTask = BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "../../models/pedestal/",
    "pedestal.glb",
    scene
  );
  let welcomeTask = BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "../../models/welcome/",
    "welcome-center.glb",
    scene
  );
  let fogTask = assetsManager.addTextureTask("fog", "../../textures/fog.png");
  let sculptureTasks = sculptures.map((sculpture, index) => {
    return BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "../../models/sculptures/",
      sculpture.filename,
      scene
    );
  });

  assetsManager.onFinish = function (tasks) {
    Promise.all([treeTask, grassTask, pedestalTask, welcomeTask]).then(
      (assets) => {
        generateTerrain(scene, tasks[0].texture, assets[0], assets[1]);
        Promise.all(sculptureTasks).then((sculptures) => {
          placeSculptures(scene, sculptures, assets[2], assets[3]);
        });
      }
    );
    // let fogPS = generateFog(scene, tasks[3].texture);
  };

  assetsManager.onTaskError = function (task) {
    console.log(task.errorObject);
  };

  assetsManager.load();
}
