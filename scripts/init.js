import { makeSkybox, loadAssets } from "./lib/index.js";
// import { generateMap } from "../utils/generateMap.js";

const canvas = document.getElementById("renderCanvas");
let engine = null;
let scene = null;
let sceneToRender = null;

let createDefaultEngine = function() {
 return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
}

async function createScene(){
    const scene = new BABYLON.Scene(engine);
    // scene.useRightHandedSystem = true;

    let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10),
    scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    camera.maxZ = 450;

    let light = new BABYLON.DirectionalLight("directLight", new BABYLON.Vector3(1, -2, 1), scene);
    light.position = new BABYLON.Vector3(20, 40, 20);
    light.intensity = 1.5;

    // let shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    // shadowGenerator.getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE; 
    // shadowGenerator.bias = 0.001;
    // shadowGenerator.normalBias = 0.02;
    // light.shadowMaxZ = 100;
    // light.shadowMinZ = 10;
    // shadowGenerator.useContactHardeningShadow = true;
    // shadowGenerator.contactHardeningLightSizeUVRatio = 0.05;
    // shadowGenerator.setDarkness(0.5);
    // shadowGenerator.useExponentialShadowMap = true;
    // light.autoUpdateExtends = false;
    // scene.shadowGenerator = shadowGenerator;
    loadAssets(scene);
    makeSkybox(scene); 

    // here we add XR support
    const xr = await scene.createDefaultXRExperienceAsync({
      // floorMeshes: [env.ground],
      uiOptions: {
        onError: (error) => {
          console.log(error);
        },
      },
    });

    // scene.debugLayer.show()
    // generateMap();
    
    return scene;
}

window.initFunction = async function() {  
  let asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!window.engine) throw "engine should not be null.";
  window.scene = createScene();
}

window.initFunction().then(() => {
  window.scene.then((returnedScene) => {
    sceneToRender = returnedScene;
  });

  window.engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
});

window.addEventListener("resize", function () {
  window.engine.resize();
});