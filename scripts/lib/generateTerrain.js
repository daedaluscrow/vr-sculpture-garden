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

  // let time = 0.0;
  let createTerrain = function () {
    let instanceMapData = generateInstanceMap();

    // mergedTree.dispose();

    const options = {
      terrainSub: 250,
      mapData: mapData, // the generated data received
      mapSubX: subX,
      mapSubZ: subZ,
      instanceMapData: instanceMapData,
      sourceMeshes: sourceMeshes,
    };
    terrain = new BABYLON.DynamicTerrain("dt", options, scene);
    const water = new BABYLON.DynamicTerrain("water", {terrainSub: 250}, scene);

    const waterMaterial = new BABYLON.StandardMaterial("materialWater", scene);
    waterMaterial.diffuseColor = new BABYLON.Color3(0.37, 0.67, 0.96);
    waterMaterial.alpha = 0.5;
    water.mesh.material = waterMaterial;

    // water.useCustomVertexFunction = true;
    // water.computeNormals = true;
    // water.refreshEveryFrame = true;
    // water.updateVertex = function(vertex, i, j) {
    //     vertex.position.y = 0.05 * Math.sin((vertex.position.x + time) / 0.2)  *  Math.cos((vertex.position.z +  5 * time) / 0.2);
    // };

    grass.uScale = 20.0;
    grass.vScale = grass.uScale;

    const terrainMaterial = new BABYLON.StandardMaterial("materialGrass", scene);
    terrainMaterial.diffuseTexture = grass;
    terrain.mesh.material = terrainMaterial;
    // terrain.subToleranceX = 5;
    // terrain.subToleranceZ = 5;
    // terrain.LODLimits = [4];

    let terrainCreated = true;
    let fly = false;
    scene.fly = fly;
    terrain.mesh.receiveShadows = true;
    
    scene.terrain = terrain;
    scene.shadowGenerator.recreateShadowMap();
    scene.onReadyObservable.addOnce(() => {
      if(terrainCreated) {terrain.update(true); console.log("Scene ready...")}
    });
    scene.registerBeforeRender(function () {
      // time += 0.005;
      if (terrainCreated && !scene.fly) {
        const height = terrain.getHeightFromMap(scene.activeCamera.position.x,scene.activeCamera.position.z) + config.camElevation;
        scene.activeCamera.position.y > height ? scene.activeCamera.position.y -= config.gravityConstant: scene.activeCamera.position.y = height-0.1;
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
        if (prng() > 0.997 && yp > 0) {
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
        if (prng() > 0.9 && yp > 0) {
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
