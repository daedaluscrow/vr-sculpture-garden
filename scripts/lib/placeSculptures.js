import { mapData, subX, subZ } from "../../data/index.js";

export function placeSculptures(scene, sculptureTasks) {
    console.log(sculptureTasks);
    let cube = sculptureTasks[0].loadedMeshes[1];
    cube.position.x = 10;
    cube.position.z = 10;
    cube.position.y = mapData[getY(10,10)];
    console.log(getY(10,10));
    console.log(mapData[getY(10,10)]);

}

function getY (x, z) {
    return (((subX/2) + x) * subZ + (-subZ/2 + x)) * 3 + 1
}