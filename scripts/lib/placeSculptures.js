import { mapData, subX, subZ } from "../../data/index.js";
import config from "../../config.js";
import { mulberry32 } from "./prng.js";

const gardenSpacing = config.gardenSpacing;
let placeX = 0;
let placeZ = 0;
let loopCount = 0;
let prng = mulberry32(config.sculptureSpacingSeed);

export function placeSculptures(scene, sculptures, pedestal, welcome) {
  let pedestalMesh = BABYLON.Mesh.MergeMeshes(
    pedestal.meshes.slice(1),
    true,
    true,
    undefined,
    false,
    true
  );

  pedestalMesh.receiveShadows = true;
  scene.shadowGenerator.addShadowCaster(pedestalMesh);

  sculptures.forEach((sculpture, index) => {
    let pedestalInstance = pedestalMesh.createInstance("pedestal" + index);

    let location = locateSculpture(index);
    location.xFinal = config.mapFactor * location.x;
    location.zFinal = config.mapFactor * location.z;

    // console.log(location);
    let model = sculpture.meshes[1];
    model.parent = null;
    let bounding = model.getBoundingInfo().boundingBox.minimum;
    let pedestalBounding =
      pedestalInstance.getBoundingInfo().boundingBox.maximum;
    let yLocation = mapData[getY(location.x, location.z)];
    // console.log(getY(location.x, location.z));
    // console.log(pedestalBounding.y);
    pedestalInstance.position.x = location.xFinal;
    pedestalInstance.position.z = location.zFinal;
    pedestalInstance.position.y = yLocation - config.pedestalHeight;
    model.position.x = location.xFinal;
    model.position.z = location.zFinal;
    model.position.y = yLocation + pedestalBounding.y - config.pedestalHeight + -bounding.y;
    scene.shadowGenerator.addShadowCaster(pedestalInstance);
    scene.shadowGenerator.addShadowCaster(model);
  });

  placeWelcome(welcome);
}

function getY(x, z) {
  // console.log(`The values of x is ${x} and z is ${z}`);
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
  const boundingArea = gardenSpacing / 2.5;
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

function placeWelcome(welcome) {
  let welcomeMesh = BABYLON.Mesh.MergeMeshes(
    welcome.meshes.slice(1),
    true,
    true,
    undefined,
    false,
    true
  );

  welcomeMesh.position.x = 0;
  welcomeMesh.position.z = 0;
  welcomeMesh.position.y = 9.5;
  welcomeMesh.checkCollisions = true;
}
