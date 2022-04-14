// Create the map from the height map and call the callback function when done
var hmURL = "../../textures/heightmap.png"; // heightmap file URL
let subX = 1000;
let subZ = 800;

const outputMap = (mapData) => {
  console.log(mapData)
}

var hmOptions = {
  width: 2000,
  height: 1600, // map size in the World
  subX: subX,
  subZ: subZ, // number of points on map width and height
  maxHeight: 15,
  minHeight: -1,
  onReady: outputMap, // callback function declaration
};
var mapData = new Float32Array(subX * subZ * 3); // the array that will store the generated data
export function generateMap() {
  let ground = BABYLON.DynamicTerrain.CreateMapFromHeightMapToRef(
    hmURL,
    hmOptions,
    mapData,
    scene
  );
} 

