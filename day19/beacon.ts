import { getInputStrings } from "../utils/inputparsing.ts";

/**
 * 3D vector of the form [x, y, z]
 */
type Vector = [number, number, number];
type Scanner = Array<Vector>;
type LockResult = { scanner: Scanner; offset: Vector };

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
  (offset: Vector) => ({ scanner: scanner.map(add(offset)), offset });

const withOffsets = (scannerA: Scanner) =>
  (scannerB: Scanner) =>
    scannerB.flatMap(createOffsets(scannerA)).map(
      applyOffset(scannerB),
    );

const overlaps = (scannerA: Scanner) =>
  ({ scanner: scannerB }: LockResult) =>
    countOverlaps(scannerA, scannerB) >= 12;

/**
 * Attempts to lock scannerB relative to scannerA
 *
 * Returns scannerB's probes in scannerA's reference frame if a lock can be
 * found, otherwise returns undefined
 */
export const lockPair = (
  scannerA: Array<Vector>,
  scannerB: Array<Vector>,
) =>
  rotations(scannerB).flatMap(withOffsets(scannerA)).find(overlaps(scannerA));

/**
 * Parses scanners from input lines
 */
export const parseInputLines = (
  inputLines: Array<string>,
): Array<Scanner> => {
  const scanners: Array<Scanner> = [];
  let currentScanner: Scanner = [];
  for (const line of inputLines) {
    if (line.includes("---")) {
      if (currentScanner.length === 0) continue;
      scanners.push([...currentScanner]);
      currentScanner = [];
      continue;
    }
    if (line.length === 0) continue;
    currentScanner.push(line.split(",").map((n) => parseInt(n)) as Vector);
  }
  scanners.push(currentScanner);
  return scanners;
};

export const countBeacons = (scanners: Array<Scanner>) => {
  const seen: Array<Vector> = [];
  scanners.flat().forEach((beacon) =>
    !seen.some(equals(beacon)) && seen.push(beacon)
  );
  return seen.length;
};

export const solvePart1 = (filePath: string) => {
  const scanners = parseInputLines(getInputStrings(filePath));

  // We treat scanner 0 as being our origin and common reference frame
  const lockedScanners = [scanners[0]];
  const offsets: Array<Vector> = [[0, 0, 0]];
  let unlockedScanners = scanners.slice(1);

  while (unlockedScanners.length > 0) {
    searchLockPair:
    for (let i = 0; i < lockedScanners.length; i++) {
      for (let j = 0; j < unlockedScanners.length; j++) {
        const result = lockPair(lockedScanners[i], unlockedScanners[j]);
        if (!result) continue;
        // We found a lock result! Add it to the known lock set
        lockedScanners.push(result.scanner);
        offsets.push(result.offset);
        // And remove its corresponding unlocked version
        unlockedScanners = [
          ...unlockedScanners.slice(0, j),
          ...unlockedScanners.slice(j + 1),
        ];
        break searchLockPair;
      }
    }
  }

  return countBeacons(lockedScanners);
};
