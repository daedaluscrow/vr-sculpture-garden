// import { mapData, subX, subZ } from "../../data/index.js";
import { mapData, subX, subZ, width, height } from "../../data/mapData2.js";
import config from "../../config.js";
import { mulberry32 } from "./prng.js";
let prng = mulberry32(config.foliageLocationSeed);

export function generateTerrain(scene, grass, treeglb, grassglb) {

  let terrain;
  let treeMesh = generateMergedMesh(treeglb, true, 0);
  let grassMesh = generateMergedMesh(grassglb, true, 0);

  treeMesh.isVisible = false;

  for (var i = 0; i < 1000; i++) {
    treeMesh.createInstance("trees" + i);
  }

  for (var i = 0; i < 5000; i++) {
    grassMesh.createInstance("trees" + i);
  }

  var sourceMeshes = [treeMesh, grassMesh];

  let createTerrain = function () {
  
    let instanceMapData = generateInstanceMap(width, height);

    // mergedTree.dispose();

    var options = {
      terrainSub: 250, // 100 x 100 quads
      mapData: mapData, // the generated data received
      mapSubX: subX,
      mapSubZ: subZ, // the map number of points per dimension
      instanceMapData: instanceMapData,
      sourceMeshes: sourceMeshes,
    };
    terrain = new BABYLON.DynamicTerrain("dt", options, scene);
  
    grass.uScale = 4.0;
    grass.vScale = grass.uScale;

    let terrainMaterial = new BABYLON.StandardMaterial("materialGrass", scene);
    terrainMaterial.diffuseTexture = grass;
    terrain.mesh.material = terrainMaterial;
    terrain.subToleranceX = 5;
    terrain.subToleranceZ = 5;
    // terrain.LODLimits = [4];

    let terrainCreated = true;

    let camElevation = 2.0;
    let camAltitude = 0.0;
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

  if(hasTransparency) mergedMesh.material.subMaterials[meshWithTransparency].transparencyMode = 3;

  // console.log(mergedMesh.subMeshes[0]._mesh.material.transparencyMode)

  return mergedMesh;
}

function generateInstanceMap(mapSubX, mapSubZ) {
  let instanceMapData = [[], []];
  let SPlength = 2;
  let loopLocation = 1;

  for (let l = 0; l < mapSubZ; l++) {
    for (let w = 0; w < mapSubX; w++) {
      // objects of the map
      let index = l * mapSubX + w;
      let xp = w - mapSubX * 0.5;
      let zp = l - mapSubZ * 0.5;
      let yp = mapData[loopLocation];
      // let yp = 12;
      let ry = prng() * 3.6;
      let scale = 0.9 + prng();
      // let's populate randomly
      if (index % SPlength === 0) {
        if (prng() > 0.9994) {
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
        if (prng() > 0.90) {
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
      }
      loopLocation += 3;
    }
  }
  return instanceMapData;
}
