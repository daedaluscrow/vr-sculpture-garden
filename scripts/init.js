
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, {}, true);

async function createScene(){
    const scene = new BABYLON.Scene(engine);

    let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    let sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.position.y = 1;

    const env = scene.createDefaultEnvironment();

    // here we add XR support
    const xr = await scene.createDefaultXRExperienceAsync({
      floorMeshes: [env.ground],
    });

    return scene;
}

(async () => {
    const finalScene = await createScene();
})()
 