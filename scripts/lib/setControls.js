import config from '../../config.js';

export function setControls(scene) {
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
          case BABYLON.KeyboardEventTypes.KEYDOWN:
            if(kbInfo.event.key === " "){
              console.log("KEY DOWN");
              console.log(scene.terrain);
              if(scene.activeCamera.position.y <= scene.terrain.getHeightFromMap(scene.activeCamera.position.x,scene.activeCamera.position.z) + config.camElevation && !scene.jump) jump(scene);
            }
            else if(kbInfo.event.key === "f") {
              scene.fly = !scene.fly;
              if (scene.fly) scene.jump = true;
            }
            else {
              console.log("Key = " + kbInfo.event.key);
            }
            break;
        }
      });
}

function jump(scene) {
  let time = 0;
  scene.jump = true;
  scene.registerBeforeRender(function moveUp() {
    if (time < config.jumpTime) {
      scene.activeCamera.position.y += config.jumpForce; // use cos or sin instead?
      time += scene.deltaTime * 0.01
    } else {
      console.log("unregistered")
      scene.unregisterBeforeRender(moveUp);
    }
  })
}