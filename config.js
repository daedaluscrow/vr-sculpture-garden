export default {
  gardenSpacing: 75, // The spacing between each sculpture's 'plot' of land. Increasing this number will make the garden more spread out. Lowering it will make it more compressed
  sculptureSpacingSeed: "VirginiaTech",
  foliageLocationSeed: "VTDogwood",
  mapFactor: 2, // This is the factor you have grown the map while generating the mapData from the mapHeight. If you use the function provided, this is 2
  pedestalHeight: 3, // The higher the number, the lower the pedestals sit in the ground
  gravityConstant: 0.15, // How quickly the camera falls back to the ground. Higher means it falls faster
  jumpForce: 0.35, // How much force is put into the jump action. Higher means a higher jump
  camElevation: 2.0, // Height of camera off the ground in units
  jumpTime: 5, // Amount of time jumping happens. Higher number means higher jumps.
};
