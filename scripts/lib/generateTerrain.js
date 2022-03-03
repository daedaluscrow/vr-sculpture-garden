export function generateTerrain(scene, grass, treeglb, grassglb) {
// Declare a callback function that will be executed once the heightmap file is downloaded
    // This function is passed the generated data and the number of points on the map height and width
    let terrain;

    let floraMeshes = generateFloraMeshes(treeglb, grassglb);

    var createTerrain = function(mapData, mapSubX, mapSubZ) {
          // SPS to depict the objects the SPMap
  
          let sps = new BABYLON.SolidParticleSystem("sps", scene, {
            // useModelMaterial: true,
            // enableMultiMaterial: true,
          });
  
          let treeParticle = sps.addShape(floraMeshes.trees, 1000);
          // let treeParticle = sps.addShape(treeTrunk, 1000);
          // let grassParticle = sps.addShape(floraMeshes.grass, 1000);
          // let grassParticle = sps.addShape(grass3, 1000);
          
          sps.buildMesh();
  
          // mergedTree.dispose();        
        
        var options = {
            terrainSub: 200,  // 100 x 100 quads
            mapData: mapData, // the generated data received
            mapSubX: mapSubX,
            mapSubZ: mapSubZ, // the map number of points per dimension
            // SPmapData: SPmapData,          
            // sps: sps,
        };
        terrain = new BABYLON.DynamicTerrain("dt", options, scene);
        console.log(terrain.getHeightFromMap(0,0))
        floraMeshes.trees.position.y = terrain.getHeightFromMap(0,0);
        let SPmapData = generateSPMap(terrain, mapSubX, mapSubZ);
        terrain._sps = sps;
        terrain._SPmapData = SPmapData;
        terrain._updateTerrain(true);
        console.log(terrain);

        grass.uScale = 4.0;
        grass.vScale = grass.uScale;

        let terrainMaterial = new BABYLON.StandardMaterial("materialGrass", scene);
        terrainMaterial.diffuseTexture = grass;
        terrain.mesh.material = terrainMaterial;
        terrain.subToleranceX = 20;
        terrain.subToleranceZ = 20;
        terrain.LODLimits = [4, 3, 2, 1, 1];

        let terrainCreated = true;
    

        let camElevation = 2.0;
        let camAltitude = 0.0;
        scene.registerBeforeRender(function() {
            if (terrainCreated) {
                let currentCamera = scene.activeCamera;
                camAltitude = terrain.getHeightFromMap(currentCamera.position.x, currentCamera.position.z) + camElevation;
                currentCamera.position.y = camAltitude;
            }
        });
        // terrain.updateCameraLOD = function(camera) { ... }
    };

    // Create the map from the height map and call the callback function when done
    var hmURL = "../../textures/heightmap.png";  // heightmap file URL
    var hmOptions = {
            width: 1000, height: 800,          // map size in the World 
            subX: 1000, subZ: 800,              // number of points on map width and height
            maxHeight: 15,
            minHeight: -1,
            onReady: createTerrain              // callback function declaration
    };
    var mapData = new Float32Array(1000 * 800 * 3); // the array that will store the generated data
    let ground = BABYLON.DynamicTerrain.CreateMapFromHeightMapToRef(hmURL, hmOptions, mapData, scene);
}

function generateFloraMeshes(treeglb, grassglb) {
  let treeMeshes = treeglb.loadedMeshes;
  let grassMeshes = grassglb.loadedMeshes;

  let treeCanopy = BABYLON.Mesh.MergeMeshes(
    [
      // treeMeshes[1],
      treeMeshes[3],
      treeMeshes[5],
      treeMeshes[8],
    ],
    // true,
    // true
  );

  let treeTrunk = BABYLON.Mesh.MergeMeshes(
    [treeMeshes[2], treeMeshes[4], treeMeshes[6], treeMeshes[7]],
    // true,
    // true
  );

  // let mergedTree = BABYLON.Mesh.MergeMeshes([treeMeshes[1], treeMeshes[2], treeMeshes[3], treeMeshes[4], treeMeshes[5], treeMeshes[6], treeMeshes[7], treeMeshes[8]], true, true);
  let grass1, grass2, grass3;
  grass1 = grassMeshes[1];
  grass2 = grassMeshes[2];
  grass3 = grassMeshes[3];

  let grassMaterial = grassglb.loadedContainer.materials[0];
  grassMaterial.transparencyMode = 3;
  console.log(grassMaterial.transparencyMode);

  grass1.material = grassMaterial;
  grass2.material = grassMaterial;
  grass3.material = grassMaterial;

  let mergedGrass = BABYLON.Mesh.MergeMeshes(
    [grass1, grass2, grass3],
    true,
    true,
    undefined,
    false,
    true
  );
  // let mergedGrass = BABYLON.Mesh.MergeMeshes([grassMeshes[1], grassMeshes[2], grassMeshes[3]], true, true);
  // mergedGrass.material = grassglb.loadedContainer.materials[0];

  let canopyMaterial = treeglb.loadedContainer.materials[0];
  canopyMaterial.transparencyMode = 3;
  console.log(canopyMaterial.transparencyMode);
  // treeTrunk.material = treeglb.loadedContainer.materials[1];
  // treeCanopy.material = canopyMaterial;

  // treeCanopy.material.diffuseTexture.hasAlpha = true;
  
  // let mergedTree = BABYLON.Mesh.MergeMeshes(
  //   [treeTrunk, treeCanopy],
  //   true,
  //   true,
  //   undefined,
  //   false,
  //   true
  // );

  let mergedTree = treeMeshes[1];

  return {trees: mergedTree, grass: mergedGrass}
}

function generateSPMap(terrain, mapSubX, mapSubZ) {
  let SPmapData = [[], []];
  let SPlength = 1;

  for (var l = 0; l < mapSubZ; l++) {
      for (var w = 0; w < mapSubX; w++) {
          // objects of the map
          let index = l * mapSubX + w;
          let xp = (w - mapSubX * 0.5) * 2.0;
          let zp = (l - mapSubZ * 0.5) * 2.0;
          // let yp = terrain.getHeightFromMap(xp, zp);
          let yp = 10;
          let ry = Math.random() * 3.6;
          let scale = 0.9 + Math.random();

          // let's populate randomly
          if (index % SPlength === 0) {
              if (Math.random() > 0.9999) {                        
                  SPmapData[index % SPlength].push(xp, yp, zp, 0, ry, 0, scale, scale, scale);
              }
          } else if (index % SPlength === 1) {
              if (Math.random() > 0.65) {                        
                  SPmapData[index % SPlength].push(xp, yp, zp, 0, ry, 0, scale, scale, scale);
              }
          }
      }
  }

  return SPmapData;
}
