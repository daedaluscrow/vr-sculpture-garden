export default {
  gardenSpacing: 75, // The spacing between each sculpture's 'plot' of land. Increasing this number will make the garden more spread out. Lowering it will make it more compressed
  sculptureSpacingSeed: "VirginiaTech",
  foliageLocationSeed: "VTDogwood",
  mapFactor: 2, // This is the factor you have grown the map while generating the mapData from the mapHeight. If you use the function provided, this is 2
  pedestalHeight: 3, // The higher the number, the lower the pedestals sit in the ground
  gravityConstant: 0.08, // How quickly the camera falls back to the ground. Higher means it falls faster
  jumpForce: 8, // How much force is put into the jump action. Higher means a higher jump
  camElevation: 2.0, // Height of camera off the ground in units
  speed: 2.0, // movement speed. Default = 0.5. Higher number means the camera moves faster
  grassInstances: 3000, // number of grass instances available per screen. If you lower it too much, you won't have enough grass for the entire visible area
  treeInstances: 750, // number of tree instances available per screen. If you lower it too much, you won't have enough trees for the entire visible area
  grassDensity: 0.9, // The density of grass. Higher is less dense. Don't go past 1.0.
  treeDensity: 0.997, // The density of trees. Higher is less dense. Don't go past 1.0.
};
