import config from '../../config.js';

export function setControls(scene) {
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
          case BABYLON.KeyboardEventTypes.KEYDOWN:
            if(kbInfo.event.key === " "){
              console.log("KEY DOWN");
              if(scene.activeCamera.position.y <= scene.terrain.getHeightFromMap(scene.activeCamera.position.x,scene.activeCamera.position.z) + config.camElevation && !scene.jump) jump(scene);
            }
            else if(kbInfo.event.key === "f") {
              scene.fly = !scene.fly;
              scene.fly ? scene.jump = true : scene.lastY = scene.activeCamera.position.y;
            }
            else {
              console.log("Key = " + kbInfo.event.key);
            }
            break;
        }
      });
}

function jump(scene) {
  if (scene.animRunning === true || scene.fly) return;
  
  scene.jump = true;
  
  let cameraPos = scene.activeCamera.position.y;
  let keys = [];
  keys.push({ frame: 0, value: cameraPos });
  keys.push({ frame: 70, value: cameraPos + config.jumpForce });
  
  scene.animationJump.setKeys(keys);
  
  scene.beginAnimation(scene.activeCamera, 0, 70, false);
}