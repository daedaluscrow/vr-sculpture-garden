export function makeSkybox(scene) {
    let skybox = BABYLON.MeshBuilder.CreateBox("vsg_skybox", { size: 500.0 }, scene);
    let skyboxMaterial = new BABYLON.StandardMaterial("vsg_skybox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/vsg_skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial;
}