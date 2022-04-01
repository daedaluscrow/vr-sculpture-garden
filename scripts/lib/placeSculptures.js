import { mapData, subX, subZ } from "../../data/index.js";
import config from "../../config.js";

const gardenSpacing = config.gardenSpacing;
let placeX = 0;
let placeZ = 0;
let loopCount = 0;

export function placeSculptures(scene, sculptures) {
  sculptures.forEach((sculpture, index) => {
    let location = locateSculpture(index);
    console.log(location);
    let model = sculpture.meshes[1];
    let bounding = model.getBoundingInfo().boundingBox.minimum;
    model.position.x = location.x;
    model.position.z = location.z;
    model.position.y = mapData[getY(location.x, location.z)] + -bounding.y;
  });
}

function getY(x, z) {
  return ((z - -(subZ / 2)) * subX + (x - -(subX / 2))) * 3 + 1;
}

function locateSculpture(index) {
  let gardenSpacingIndex = gardenSpacing * loopCount;

  switch (true) {
    case placeZ === gardenSpacingIndex && placeX !== -gardenSpacingIndex:
      placeX -= gardenSpacing;
      break;
    case placeX === -gardenSpacingIndex && placeZ !== -gardenSpacingIndex:
      placeZ -= gardenSpacing;
      break;
    case placeZ === -gardenSpacingIndex && placeX !== gardenSpacingIndex:
      placeX += gardenSpacing;
      break;
    case placeX === gardenSpacingIndex && placeZ !== gardenSpacingIndex:
      placeZ += gardenSpacing;
      break;
  }

  if (placeX === gardenSpacingIndex && placeZ === gardenSpacingIndex) {
    loopCount += 1;
    placeX += gardenSpacing;
    placeZ += gardenSpacing;
    return { x: placeX, z: placeZ };
  }

  return { x: placeX, z: placeZ };
}
