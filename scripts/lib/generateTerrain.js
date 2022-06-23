import { mapData, subX, subZ } from "../../data/index.js";
import config from "../../config.js";
import { mulberry32 } from "./prng.js";
let prng = mulberry32(config.foliageLocationSeed);

export function generateTerrain(scene, grass, treeglb, grassglb) {
  let terrain;
  let treeMesh = generateMergedMesh(treeglb, true, 0);
  let grassMesh = generateMergedMesh(grassglb, true, 0);
  treeMesh.setParent(null);
  grassMesh.setParent(null);
  scene.shadowGenerator.addShadowCaster(treeMesh);
  // scene.shadowGenerator.addShadowCaster(grassMesh);
  treeMesh.receiveShadows = true;
  grassMesh.receiveShadows = true;

  for (var i = 0; i < 1000; i++) {
    let instance = treeMesh.createInstance("trees" + i);
    scene.shadowGenerator.addShadowCaster(instance);
  }

  for (var i = 0; i < 5000; i++) {
    let instance = grassMesh.createInstance("grass" + i);
    // scene.shadowGenerator.addShadowCaster(instance);
  }

  treeMesh.setEnabled(false);
  grassMesh.setEnabled(false);

  var sourceMeshes = [treeMesh, grassMesh];

  let createTerrain = function () {
    let instanceMapData = generateInstanceMap();

    // mergedTree.dispose();

    var options = {
      terrainSub: 250,
      mapData: mapData, // the generated data received
      mapSubX: subX,
      mapSubZ: subZ,
      instanceMapData: instanceMapData,
      sourceMeshes: sourceMeshes,
    };
    terrain = new BABYLON.DynamicTerrain("dt", options, scene);

    grass.uScale = 20.0;
    grass.vScale = grass.uScale;

    let terrainMaterial = new BABYLON.StandardMaterial("materialGrass", scene);
    terrainMaterial.diffuseTexture = grass;
    terrain.mesh.material = terrainMaterial;
    // terrain.subToleranceX = 5;
    // terrain.subToleranceZ = 5;
    // terrain.LODLimits = [4];

    let terrainCreated = true;
    console.log(terrain);
    terrain.mesh.receiveShadows = true;

    let camElevation = 2.0;
    let camAltitude = 0.0;
    scene.shadowGenerator.recreateShadowMap();
    scene.registerBeforeRender(function () {
      if (terrainCreated) {
        terrain.update(true);
        let currentCamera = scene.activeCamera;
        camAltitude =
          terrain.getHeightFromMap(
            currentCamera.position.x,
            currentCamera.position.z
          ) + camElevation;
        currentCamera.position.y = camAltitude;
      }
    });
  };

  createTerrain();
}

function generateMergedMesh(glbFile, hasTransparency, meshWithTransparency) {
  let meshes = glbFile.meshes;

  let mergedMesh = BABYLON.Mesh.MergeMeshes(
    meshes.slice(1),
    true,
    true,
    undefined,
    false,
    true
  );

  // meshWithTransparency.forEach(meshIndex => {
  //   if(hasTransparency) mergedMesh.material.subMaterials[meshIndex].transparencyMode = 3;
  // })

  if (hasTransparency)
    mergedMesh.material.subMaterials[meshWithTransparency].transparencyMode = 3;

  // console.log(mergedMesh.subMeshes[0]._mesh.material.transparencyMode)

  return mergedMesh;
}

function generateInstanceMap() {
  let instanceMapData = [[], []];
  let SPlength = 2;
  let loopLocation = 1;

  for (let l = 0; l < subZ; l++) {
    for (let w = 0; w < subX; w++) {
      // objects of the map
      let index = l * subX + w;
      let xp = (w - subX * 0.5) * 2;
      let zp = (l - subZ * 0.5) * 2;
      let yp = mapData[loopLocation];
      // let yp = 12;
      let ry = prng() * 3.6;
      let scale = 0.9 + prng();
      if (index % SPlength === 0) {
        if (prng() > 0.997) {
          instanceMapData[index % SPlength].push(
            xp,
            yp,
            zp,
            0,
            ry,
            0,
            scale,
            scale,
            scale
          );
        }
      } else if (index % SPlength === 1) {
        if (prng() > 0.9) {
          let randomized = randomizeLocation({ x: xp, z: zp });
          instanceMapData[index % SPlength].push(
            randomized.x,
            yp,
            randomized.z,
            0,
            ry,
            0,
            scale,
            scale,
            scale
          );
        }
      }
      loopLocation += 3;
    }
  }
  return instanceMapData;
}

function randomizeLocation(location) {
  const boundingArea = 1;
  let randomX =
    Math.random() > 0.5
      ? location.x - prng() * boundingArea
      : location.x + prng() * boundingArea;
  let randomZ =
    Math.random() > 0.5
      ? location.z - prng() * boundingArea
      : location.z + prng() * boundingArea;
  return { x: randomX, z: randomZ };
}
