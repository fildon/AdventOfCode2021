/**
 * 3D vector of the form [x, y, z]
 */
type Vector = [number, number, number];
type Scanner = Array<Vector>;

const equals = ([a, b, c]: Vector) =>
  ([x, y, z]: Vector) => a === x && b === y && c === z;

const inCollection = (vectors: Array<Vector>) =>
  (vector: Vector) => vectors.some(equals(vector));

const count = <T>(
  collection: Array<T>,
  condition: (element: T) => boolean,
) => collection.filter(condition).length;

export const countOverlaps = (
  scannerA: Scanner,
  scannerB: Scanner,
) => count(scannerA, inCollection(scannerB));

/**
 * Given a scanner returns its 24 rotational equivalent forms
 */
const rotations = (scanner: Scanner): Array<Scanner> => [
  scanner,
  scanner.map(([x, y, z]) => [x, -z, y]),
  scanner.map(([x, y, z]) => [x, -y, -z]),
  scanner.map(([x, y, z]) => [x, z, -y]),
  scanner.map(([x, y, z]) => [z, x, y]),
  scanner.map(([x, y, z]) => [-y, x, z]),
  scanner.map(([x, y, z]) => [-z, x, -y]),
  scanner.map(([x, y, z]) => [y, x, -z]),
  scanner.map(([x, y, z]) => [y, z, x]),
  scanner.map(([x, y, z]) => [-z, y, x]),
  scanner.map(([x, y, z]) => [-y, -z, x]),
  scanner.map(([x, y, z]) => [z, -y, x]),
  scanner.map(([x, y, z]) => [-x, -z, -y]),
  scanner.map(([x, y, z]) => [-x, y, -z]),
  scanner.map(([x, y, z]) => [-x, z, y]),
  scanner.map(([x, y, z]) => [-x, -y, z]),
  scanner.map(([x, y, z]) => [-y, -x, -z]),
  scanner.map(([x, y, z]) => [z, -x, -y]),
  scanner.map(([x, y, z]) => [y, -x, z]),
  scanner.map(([x, y, z]) => [-z, -x, y]),
  scanner.map(([x, y, z]) => [-z, -y, -x]),
  scanner.map(([x, y, z]) => [y, -z, -x]),
  scanner.map(([x, y, z]) => [z, y, -x]),
  scanner.map(([x, y, z]) => [-y, z, -x]),
];

const add = ([a, b, c]: Vector) =>
  ([x, y, z]: Vector): Vector => [a + x, b + y, c + z];

const negate = ([a, b, c]: Vector): Vector => [-a, -b, -c];

const minus = (v: Vector) => add(negate(v));

const createOffsets = (scanner: Scanner) =>
  (vector: Vector) => scanner.map(minus(vector));

const applyOffset = (scanner: Scanner) =>
  (offSet: Vector) => scanner.map(add(offSet));

const offsets = (scannerA: Scanner) =>
  (scannerB: Scanner): Array<Scanner> =>
    scannerB.flatMap(createOffsets(scannerA)).map(
      applyOffset(scannerB),
    );

const overlaps = (scannerA: Scanner) =>
  (scannerB: Scanner) => countOverlaps(scannerA, scannerB) >= 12;

/**
 * Attempts to lock scannerB relative to scannerA
 *
 * Returns scannerB's probes in scannerA's reference frame if a lock can be
 * found, otherwise returns undefined
 */
export const lockPair = (
  scannerA: Array<Vector>,
  scannerB: Array<Vector>,
): Array<Vector> | undefined =>
  rotations(scannerB).flatMap(offsets(scannerA)).find(overlaps(scannerA));
