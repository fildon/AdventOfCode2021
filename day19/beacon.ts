/**
 * 3D vector of the form [x, y, z]
 */
type Vector = [number, number, number];

type Scanner = {
  /**
   * Position vector assumed relative to some arbitrary origin
   */
  position: Vector;
  /**
   * Which direction this scanner is pointing along
   */
  facing: Vector;
  /**
   * Which direction is "up" for this scanner
   */
  up: Vector;
  /**
   * Beacons this scanner can see
   */
  beacons: Array<Vector>;
};

export const getRotations = ([x, y, z]: Vector): Array<Vector> => [
  // x = 1
  [x, y, z],
  [x, -z, y],
  [x, -y, -z],
  [x, z, -y],

  // y = 1
  [z, x, y],
  [-y, x, z],
  [-z, x, -y],
  [y, x, -z],

  // z = 1
  [y, z, x],
  [-z, y, x],
  [-y, -z, x],
  [z, -y, x],

  // x = -1
  [-x, -z, -y],
  [-x, y, -z],
  [-x, z, y],
  [-x, -y, z],

  // y = -1
  [-y, -x, -z],
  [z, -x, -y],
  [y, -x, z],
  [-z, -x, y],

  // z = -1
  [-z, -y, -x],
  [y, -z, -x],
  [z, y, -x],
  [-y, z, -x],
];
