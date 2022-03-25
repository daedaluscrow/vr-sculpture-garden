import { mapData, subX, subZ } from "../../data/index.js";
import { sculptures } from "../../data/sculptures.js";

export function loadSculptures(scene) {
  sculptures.forEach((sculpture, index) => {
    BABYLON.SceneLoader.ImportMesh(
      "",
      "../../models/sculptures/",
      sculpture.filename,
      scene,
      function (meshes) {
        placeSculptures(scene, meshes[1], index);
      }
    );
  });
}

function placeSculptures(scene, sculpture, index) {
  console.log(sculpture);
  let model = sculpture;
  console.log(model);

  let bounding = model.getBoundingInfo().boundingBox.minimum;
  let location = 15 * (index + 1);
  console.log(bounding);
  model.position.x = location;
  model.position.z = location;
  model.position.y = mapData[getY(location, location)] + -bounding.y;
}

function getY(x, z) {
  return ((x - -(subZ / 2)) * subX + (z - -(subX / 2))) * 3 + 1;
}
