export function generateTerrain(scene, grass) {
    console.log(grass);

    let mapSubX = 500;
    let mapSubZ = 300;
    let terrainSub = 100;

    // map creation
    let mapData = new Float32Array(mapSubX * mapSubZ * 3);   
    for (let l = 0; l < mapSubZ; l++) {           
        for (let w = 0; w < mapSubX; w++) {                
            mapData[3 *(l * mapSubX + w)] = (w - mapSubX * 0.5) * 2.0;
            mapData[3 * (l * mapSubX + w) + 1] = w / (l +1) * Math.sin(l / 2) * Math.cos(w / 2) * 2.0;
            mapData[3 * (l * mapSubX + w) + 2] = (l - mapSubZ * 0.5) * 2.0;
        }            
    }

    // terrain creation
    let params = {
        mapData: mapData,
        mapSubX: mapSubX,
        mapSubZ: mapSubZ,
        terrainSub: terrainSub
    };

    terrain = new BABYLON.DynamicTerrain("terrain", params, scene);
    // let terrainMesh = terrain.mesh;
    let terrainMaterial = new BABYLON.StandardMaterial("materialGrass", scene);
    // terrainMaterial.diffuseTexture = new BABYLON.Texture("../../textures/terrain/vsg_grass_tile-1024.jpg", scene);
    terrainMaterial.wireframe = true;
    terrain.mesh.material = terrainMaterial;
    terrain.subToleranceX = 8;
    terrain.subToleranceZ = 8;
    terrain.LODLimits = [4, 3, 2, 1, 1];
    terrainCreated = true;

    let camElevation = 2.0;
    let camAltitude = 0.0;
    scene.registerBeforeRender(function() {
        if (terrainCreated) {
            camAltitude = terrain.getHeightFromMap(camera.position.x, camera.position.z) + camElevation;
            camera.position.y = camAltitude;
        }
    });
}