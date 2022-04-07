import { mapData, subX, subZ } from "../../data/index.js";
import config from "../../config.js";
import { mulberry32 } from "./prng.js";

const gardenSpacing = config.gardenSpacing;
let placeX = 0;
let placeZ = 0;
let loopCount = 0;
let prng = mulberry32(config.sculptureSpacingSeed);

export function placeSculptures(scene, sculptures, pedestal) {
  
  let pedestalMesh = BABYLON.Mesh.MergeMeshes(pedestal.meshes.slice(1), true,
  true,
  undefined,
  false,
  true);

  sculptures.forEach((sculpture, index) => {
    let pedestalInstance = pedestalMesh.createInstance("pedestal" + index);
    let location = locateSculpture(index);
    // console.log(location);
    let model = sculpture.meshes[1];
    model.parent = null;
    let bounding = model.getBoundingInfo().boundingBox.minimum;
    let pedestalBounding = pedestalInstance.getBoundingInfo().boundingBox.maximum;
    let yLocation = mapData[getY(location.x, location.z)];
    console.log(pedestalBounding.y);
    pedestalInstance.position.x = location.x;
    pedestalInstance.position.z = location.z;
    pedestalInstance.position.y = yLocation - 2;
    model.position.x = location.x;
    model.position.z = location.z;
    model.position.y = yLocation + pedestalBounding.y -2 + -bounding.y;
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

  return randomizeLocation({ x: placeX, z: placeZ });
}

function randomizeLocation(location) {
  const boundingArea = gardenSpacing / 2;
  let randomX =
    Math.random() > 0.5
      ? location.x - prng() * boundingArea
      : location.x + prng() * boundingArea;
  let randomZ =
    Math.random() > 0.5
      ? location.z - prng() * boundingArea
      : location.z + prng() * boundingArea;
  return { x: parseInt(randomX), z: parseInt(randomZ) };
}
