import { mapData, subX, subZ } from "../../data/index.js";
const jumpNumber = 50;
let placeX = 0;
let placeZ = 0;
let loopCount = 0;

export function placeSculptures(scene, sculptures) {
  sculptures.forEach((sculpture, index) => {
    let location = locateSculpture(index);
    console.log(location);
    let model = sculpture.meshes[1];
    let bounding = model.getBoundingInfo().boundingBox.minimum;
    model.position.x = location.x;
    model.position.z = location.z;
    model.position.y = mapData[getY(location.x, location.z)] + -bounding.y;
    console.log(
      `x=${location.x}, z=${location.z}, y=${
        mapData[getY(location.x, location.z)]
      }, yindex=${getY(location.x, location.z)}`
    );
  });
}

function getY(x, z) {
  return ((z - -(subZ / 2)) * subX + (x - -(subX / 2))) * 3 + 1;
}

function locateSculpture(index) {
  let jumpIndex = jumpNumber * loopCount;

  switch (true) {
    case placeZ === jumpIndex && placeX !== -jumpIndex:
      placeX -= jumpNumber;
      break;
    case placeX === -jumpIndex && placeZ !== -jumpIndex:
      placeZ -= jumpNumber;
      break;
    case placeZ === -jumpIndex && placeX !== jumpIndex:
      placeX += jumpNumber;
      break;
    case placeX === jumpIndex && placeZ !== jumpIndex:
      placeZ += jumpNumber;
      break;
  }

  if (placeX === jumpIndex && placeZ === jumpIndex) {
    loopCount += 1;
    placeX += jumpNumber;
    placeZ += jumpNumber;
    return { x: placeX, z: placeZ };
  }

  return { x: placeX, z: placeZ };
}
