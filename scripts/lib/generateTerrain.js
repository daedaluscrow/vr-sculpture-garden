import {noise} from './noise.js';

export function generateTerrain(scene, grass, treeglb, grassglb) {

    // Map data creation
        // The map is a flat array of successive 3D coordinates (x, y, z).
        // It's defined by a number of points on its width : mapSubX
        // and a number of points on its height : mapSubZ

        let treeMeshes = treeglb.loadedMeshes;
        let grassMeshes = grassglb.loadedMeshes;
        

        var mapSubX = 1000;             // point number on X axis
        var mapSubZ = 1000;              // point number on Z axis
        var seed = 0.3;                 // seed
        var noiseScale = 0.03;         // noise frequency
        var elevationScale = 4.5;
        noise.seed(seed);
        var mapData = new Float32Array(mapSubX * mapSubZ * 3); // x3 float values per point : x, y and z

        // SPMap with 3 object types
        let SPmapData = [[], []];
        let SPlength = 1;
        let radians = BABYLON.Tools.ToRadians(90);

        for (var l = 0; l < mapSubZ; l++) {
            for (var w = 0; w < mapSubX; w++) {
                var x = (w - mapSubX * 0.5) * 2.0;
                var z = (l - mapSubZ * 0.5) * 2.0;
                var y = noise.simplex2(x * noiseScale, z * noiseScale);               // altitude
                y *= (0.5 + y) * y * elevationScale; 

                mapData[3 *(l * mapSubX + w)] = x;
                mapData[3 * (l * mapSubX + w) + 1] = y;
                mapData[3 * (l * mapSubX + w) + 2] = z;

            // objects of the map
            let index = l * mapSubX + w;
            
                // let's populate randomly
                if (index % SPlength === 0) {
                    if (Math.random() > 0.99) {
                        let xp = x;
                        let yp = y;
                        let zp = z;
                        
                        let ry = Math.random() * 3.6;
                        let scale = 0.9 + Math.random();
                        
                        SPmapData[index % SPlength].push(xp, yp, zp, 0, ry, 0, scale, scale, scale);
                    }
                } else if (index % SPlength === 1) {
                    if (Math.random() > 0.35) {
                        let xp = x;
                        let yp = y;
                        let zp = z;
                        
                        let ry = Math.random() * 3.6;
                        let scale = 0.9 + Math.random();
                        
                        SPmapData[index % SPlength].push(xp, yp, zp, 0, ry, 0, scale, scale, scale);
                    }
                }
                
            }
        }

        let mergedTree = BABYLON.Mesh.MergeMeshes([treeMeshes[1], treeMeshes[2], treeMeshes[3], treeMeshes[4], treeMeshes[5], treeMeshes[6], treeMeshes[7], treeMeshes[8]], true, true);
        let mergedGrass = BABYLON.Mesh.MergeMeshes([grassMeshes[1], grassMeshes[2], grassMeshes[3]], true, true);
        mergedGrass.material = grassglb.loadedContainer.materials[0];

        let multimat = new BABYLON.MultiMaterial("treeWhole", scene);
        multimat.subMaterials.push(treeglb.loadedContainer.materials[0]);
        multimat.subMaterials.push(treeglb.loadedContainer.materials[1]);

        // SPS to depict the objects the SPMap

        let sps = new BABYLON.SolidParticleSystem("sps", scene);
        let treeParticle = sps.addShape(mergedTree, 1000);
        // let grassParticle = sps.addShape(mergedGrass, 1000);
        // var typ3 = sps.addShape(model3, 1000);
        
        sps.buildMesh();

        mergedTree.dispose();

        // sps.mesh.material = multimat;
        sps.mesh.material = treeglb.loadedContainer.materials[1];
        // sps.mesh.material = treeglb.loadedContainer.materials[0];

    grass.uScale = 4.0;
    grass.vScale = grass.uScale;

    console.log(sps)

    // terrain creation
    
    let terrainSub = 100;
    let params = {
        mapData: mapData,
        mapSubX: mapSubX,
        mapSubZ: mapSubZ,
        SPmapData: SPmapData,          
        sps: sps, 
        terrainSub: terrainSub
    };

    // console.log(params.sps);

    let terrain = new BABYLON.DynamicTerrain("terrain", params, scene);
    let terrainMaterial = new BABYLON.StandardMaterial("materialGrass", scene);
    terrainMaterial.diffuseTexture = grass;
    terrain.mesh.material = terrainMaterial;
    terrain.subToleranceX = 8;
    terrain.subToleranceZ = 8;
    terrain.LODLimits = [4, 3, 2, 1, 1];
    let terrainCreated = true;

    let camElevation = 2.0;
    let camAltitude = 0.0;
    scene.registerBeforeRender(function() {
        if (terrainCreated) {
            let currerntCamera = scene.activeCamera;
            camAltitude = terrain.getHeightFromMap(currerntCamera.position.x, currerntCamera.position.z) + camElevation;
            currerntCamera.position.y = camAltitude;
        }
    });
}