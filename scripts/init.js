import { makeSkybox, loadAssets } from "./lib/index.js";

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

    let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 50, 0), scene);
    light.intensity = 0.8;
    
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