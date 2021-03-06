import { getInputStrings } from "../utils/inputparsing.ts";

/**
 * An inclusive range with the first value being minimum and second
 * value maximum
 */
type Range = [number, number];

/**
 * A cuboid as [XRange, YRange, ZRange]
 */
type Cuboid = [Range, Range, Range];

/**
 * A single reactor instruction
 */
export type Instruction = {
  command: "on" | "off";
  cuboid: Cuboid;
};

/**
 * We represent the Reactor's state solely in terms of "on" cuboids
 *
 * The regions are assumed to always be non-overlapping
 */
export type Reactor = Array<Cuboid>;

const isRange = (numbers: unknown): numbers is Range =>
  Array.isArray(numbers) && numbers.length === 2 &&
  typeof numbers[0] === "number" && typeof numbers[1] === "number";

const isCuboid = (ranges: unknown): ranges is Cuboid =>
  Array.isArray(ranges) && ranges.length === 3 && ranges.every(isRange);

/**
 * Converts a string of form "x=10..12" to a range of form [10, 12]
 */
const toRange = (rangeString: string) => {
  const numbers = rangeString.split("=")[1]?.split("..").map((n) =>
    parseInt(n)
  );
  if (!isRange(numbers)) throw new Error("Parse error in number range");
  return numbers;
};

export const parse = (instruction: string): Instruction => {
  const [command, location] = instruction.split(" ");

  if (command !== "on" && command !== "off") {
    throw new Error("unrecognised command");
  }

  const cuboid = location.split(",")
    .map(toRange);
  if (!isCuboid(cuboid)) throw new Error("Parse error in cuboid");

  return { command, cuboid };
};

export const inInitializationRegion = (
  cuboid: Cuboid,
) => {
  // Reject any cuboid that is fully outside the initialization region
  if (cuboid.some(([min, max]) => min > 50 || max < -50)) return false;

  /**
   * I assume instructions are either fully in or fully out of the
   * initialization region. If there are any counter examples I want
   * to know about it.
   */
  if (
    cuboid.some(([min, max]) => min < -50 || 50 < max)
  ) {
    throw new Error(
      "Found instruction that is only partially in the initialization region",
    );
  }
  return true;
};

const rangeOverlap = ([aMin, aMax]: Range, [bMin, bMax]: Range) =>
  bMin <= aMax && aMin <= bMax;

const rangeContainedBy = ([aMin, aMax]: Range, [bMin, bMax]: Range) =>
  bMin <= aMin && bMax >= aMax;

/**
 * Do these cuboids overlap?
 */
export const overlaps = (a: Cuboid, b: Cuboid) =>
  rangeOverlap(a[0], b[0]) && rangeOverlap(a[1], b[1]) &&
  rangeOverlap(a[2], b[2]);

/**
 * Is the first cuboid fully contained by the second cuboid?
 */
const containedBy = (a: Cuboid, b: Cuboid) =>
  rangeContainedBy(a[0], b[0]) && rangeContainedBy(a[1], b[1]) &&
  rangeContainedBy(a[2], b[2]);

/**
 * Given a cuboid, returns a collection of cuboids which collectively represent the set of all
 * 3D points _not_ in the given cuboid.
 */
const getNegatives = (
  [[xMin, xMax], [yMin, yMax], [zMin, zMax]]: Cuboid,
): Array<Cuboid> => [
  // The set of all points with greater x value
  [[xMax + 1, Infinity], [-Infinity, Infinity], [-Infinity, Infinity]],
  // The set of all points with lesser x value
  [[-Infinity, xMin - 1], [-Infinity, Infinity], [-Infinity, Infinity]],
  // Equal x range, but all y values greater
  [[xMin, xMax], [yMax + 1, Infinity], [-Infinity, Infinity]],
  // Equal x range, but all y values lesser
  [[xMin, xMax], [-Infinity, yMin - 1], [-Infinity, Infinity]],
  // Equal x and y ranges, but all z values greater
  [[xMin, xMax], [yMin, yMax], [zMax + 1, Infinity]],
  // Equal x and y ranges, but all z values lesser
  [[xMin, xMax], [yMin, yMax], [-Infinity, zMin - 1]],
];

/**
 * Returns the intersection of two cuboids, or undefined if there is no intersection
 */
const intersect = ([[aXMin, aXMax], [aYMin, aYMax], [aZMin, aZMax]]: Cuboid) =>
  (
    [[bXMin, bXMax], [bYMin, bYMax], [bZMin, bZMax]]: Cuboid,
  ): Cuboid | undefined => {
    const intersection: Cuboid = [
      [Math.max(aXMin, bXMin), Math.min(aXMax, bXMax)],
      [Math.max(aYMin, bYMin), Math.min(aYMax, bYMax)],
      [Math.max(aZMin, bZMin), Math.min(aZMax, bZMax)],
    ];

    // If this intersection was valid, then we return it
    if (intersection.every(([min, max]) => max >= min)) return intersection;

    // In this case however no valid intersection was found
    return undefined;
  };

/**
 * Transforms the given cuboid in accordance with the given instruction
 */
export const combine = (instruction: Instruction) =>
  (cuboid: Cuboid): Cuboid[] => {
    // If the instruction does not overlap at all with the cuboid, then the cuboid is unaffected
    if (!overlaps(cuboid, instruction.cuboid)) return [cuboid];
    // If the cuboid is fully contained in the instruction then the cuboid is fully removed
    if (containedBy(cuboid, instruction.cuboid)) return [];
    /**
     * If the cuboid is partially overlapping with the instruction then it is broken apart into non-overlapping cuboids
     *
     * This is computed as the intersection of cuboid with the _negation_ of the instruction's cuboid
     */
    return getNegatives(instruction.cuboid).map(intersect(cuboid)).filter((
      c,
    ): c is Cuboid => !!c);
  };

/**
 * Combines a new instruction with this Reactor.
 *
 * Does not modify the existing Reactor, but returns a new one.
 */
export const applyInstruction = (
  reactor: Reactor,
  instruction: Instruction,
): Reactor => {
  if (
    instruction.command === "on" &&
    reactor.some((cuboid) => containedBy(instruction.cuboid, cuboid))
  ) {
    // If an on-command is already fully contained by a cuboid, it is a no-op
    return reactor;
  }
  return reactor.flatMap(combine(instruction)).concat(
    // Concat this command only if it was 'on'
    instruction.command === "on" ? [instruction.cuboid] : [],
  );
};

const product = (acc: number, curr: number) => acc * curr;

export const sizeOf = (
  cuboid: Cuboid,
) => cuboid.map(([min, max]) => max - min + 1).reduce(product);

const sum = (acc: number, curr: number) => acc + curr;

export const solvePart1 = (filePath: string) =>
  getInputStrings(filePath).filter((str) => str.length > 0).map(parse).filter((
    instruction,
  ) => inInitializationRegion(instruction.cuboid)).reduce(applyInstruction, [])
    .map(sizeOf).reduce(sum);

export const solvePart2 = (filePath: string) =>
  getInputStrings(filePath).filter((str) => str.length > 0).map(parse).reduce(
    applyInstruction,
    [],
  )
    .map(sizeOf).reduce(sum);
