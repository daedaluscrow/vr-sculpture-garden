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
  scene.animRunning = false;
  if (scene.jump) return;
  console.log("Jump!");
  let animationJump = new BABYLON.Animation("jumpEasingAnimation", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
  let start = new BABYLON.AnimationEvent(
    0,
    function () {
      scene.animRunning = true;
    },
    true,
  );
  let end = new BABYLON.AnimationEvent(70, function() { scene.animRunning = false;}, true);
  animationJump.addEvent(start);
  animationJump.addEvent(end);
  let cameraPos = scene.activeCamera.position.y;
  let keys = [];
  keys.push({ frame: 0, value: cameraPos });
  keys.push({ frame: 70, value: cameraPos + config.jumpForce });
  animationJump.setKeys(keys);
  let easingFunction = new BABYLON.CubicEase();
  easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
  animationJump.setEasingFunction(easingFunction);
  scene.activeCamera.animations.push(animationJump);
  scene.jump = true;
  scene.beginAnimation(scene.activeCamera, 0, 70, false);
}