export function createJumpAnim(scene) {
    let animationJump = new BABYLON.Animation("jumpEasingAnimation", "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
    let start = new BABYLON.AnimationEvent(0, () => {scene.animRunning = true;}, true);
    let end = new BABYLON.AnimationEvent(70, () => { scene.animRunning = false; scene.lastY = scene.activeCamera.position.y;}, true);
    animationJump.addEvent(start);
    animationJump.addEvent(end);
    let easingFunction = new BABYLON.SineEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    animationJump.setEasingFunction(easingFunction);
    scene.activeCamera.animations.push(animationJump);
    scene.animationJump = animationJump;
}