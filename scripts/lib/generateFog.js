export function generateFog(scene, fogTexture) {
    console.log(fogTexture);
    let particleSystem = new BABYLON.ParticleSystem("particles", 5000 , scene);
    particleSystem.manualEmitCount = particleSystem.getCapacity();
        
    particleSystem.particleTexture = fogTexture.clone();
    particleSystem.createCylinderEmitter(125, 5, 0, 0);
    
    particleSystem.color1 = new BABYLON.Color4(0.8, 0.8, 0.8, 0.1);
    particleSystem.color2 = new BABYLON.Color4(.95, .95, .95, 0.15);
    particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1);
    particleSystem.minSize = 3.5;
    particleSystem.maxSize = 5.0;
    particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
    particleSystem.emitRate = 50000;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);
    particleSystem.minAngularSpeed = -2;
    particleSystem.maxAngularSpeed = 2;
    particleSystem.minEmitPower = .5;
    particleSystem.maxEmitPower = 1;
    particleSystem.updateSpeed = 0.01;
    particleSystem.isLocal = true;

    particleSystem.start();

    particleSystem.emitter.y = 4;

    scene.registerBeforeRender(() => {
        particleSystem.emitter.x = scene.cameras[0].position.x;
        particleSystem.emitter.z = scene.cameras[0].position.z;
    })

    return particleSystem;
}