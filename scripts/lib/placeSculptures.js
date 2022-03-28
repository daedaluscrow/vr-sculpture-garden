import { mapData, subX, subZ } from "../../data/index.js";

export function placeSculptures(scene, sculptures) {
//   console.log(sculptures);
  sculptures.forEach((sculpture, index) => {
    let model = sculpture.meshes[1];
    // console.log(model);

    let bounding = model.getBoundingInfo().boundingBox.minimum;
    let location = 15 * (index + 1);
    // console.log(bounding);
    model.position.x = location;
    model.position.z = location;
    model.position.y = mapData[getY(location, location)] + -bounding.y;
  })
}

function getY(x, z) {
  return ((x - -(subZ / 2)) * subX + (z - -(subX / 2))) * 3 + 1;
}
