/**
 * 3D vector of the form [x, y, z]
 */
type Vector = [number, number, number];

export const getRotations = ([x, y, z]: Vector) => [
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

const equals = ([a, b, c]: Vector) =>
  ([x, y, z]: Vector) => a === x && b === y && c === z;

const inCollection = (vectors: Array<Vector>) =>
  (vector: Vector) => vectors.some(equals(vector));

const count = <T>(
  collection: Array<T>,
  condition: (element: T) => boolean,
) => collection.filter(condition).length;

export const countOverlaps = (
  vectorsA: Array<Vector>,
  vectorsB: Array<Vector>,
) => count(vectorsA, inCollection(vectorsB));
