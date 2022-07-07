export function setControls(scene) {
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
          case BABYLON.KeyboardEventTypes.KEYDOWN:
            if(kbInfo.event.key === " "){
              console.log("KEY DOWN");
              let camera = scene.getCameraByName("camera1");
              camera.position.y += 5;
            }
            else if(kbInfo.event.key === "f") {
              scene.fly = !scene.fly;
            }
            else {
              console.log("Key = " + kbInfo.event.key);
            }
            break;
        }
      });
}