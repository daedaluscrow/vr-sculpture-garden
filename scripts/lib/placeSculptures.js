import { mapData, subX, subZ } from "../../data/index.js";
import config from "../../config.js";
import { mulberry32 } from "./prng.js";
import { sculptures } from "../../data/sculptures.js";

const gardenSpacing = config.gardenSpacing;
let placeX = 0;
let placeZ = 0;
let loopCount = 0;
let prng = mulberry32(config.sculptureSpacingSeed);

export function placeSculptures(scene, sculptureMeshes, pedestal, welcome) {
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

  sculptureMeshes.forEach(async (sculptureMesh, index) => {
    let pedestalInstance = pedestalMesh.createInstance("pedestal" + index);

    let location = locateSculpture(index);
    location.xFinal = config.mapFactor * location.x;
    location.zFinal = config.mapFactor * location.z;

    // console.log(location);
    let model = sculptureMesh.meshes[1];
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

    const plane = BABYLON.MeshBuilder.CreatePlane("plane", {height: 2, width: 4}, scene);
    plane.index = index;
    // plane.parent = pedestalInstance;
    plane.position.x = pedestalInstance.position.x
    plane.position.z = pedestalInstance.position.z + 2.5;
    plane.position.y = pedestalInstance.position.y + 5;
    plane.rotation.y = Math.PI;
    console.log(plane.rotation);
    
    const mat = new BABYLON.StandardMaterial("Mat", scene);
    const signage = BABYLON.GUI.AdvancedDynamicTexture.CreateForMeshTexture(plane, 1463, 768);
    await signage.parseFromURLAsync("./textures/nameplate.json");
    signage.rootContainer.children[1].text = sculptures[index].name
    signage.rootContainer.children[2].text = sculptures[index].description
    signage.rootContainer.children[3].text = sculptures[index].artist
    mat.diffuseTexture = signage;
    plane.material = mat;

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
