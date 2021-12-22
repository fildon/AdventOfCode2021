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

const parse = (instruction: string): Instruction => {
  const [command, location] = instruction.split(" ");

  if (command !== "on" && command !== "off") {
    throw new Error("unrecognised command");
  }

  const cuboid = location.split(",")
    .map(toRange);
  if (!isCuboid(cuboid)) throw new Error("Parse error in cuboid");

  return { command, cuboid };
};

export const parseInstructions = (instructions: Array<string>) =>
  instructions.map(parse);

export const inInitializationRegion = (
  {
    cuboid,
  }: Instruction,
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

export const applyInstruction = (
  reactor: Reactor,
  instruction: Instruction,
): Reactor => {
  /**
   * TODO if this new cuboid does not overlap with any other cuboid
   * then add it if and only if it is 'on' otherwise ignore it
   */
  /**
   * TODO if there is any overlap, then break up the overlapped regions
   * into a collection of non-overlapping regions
   */
  // OPTIONAL: merge contiguous cuboids where possible
  throw new Error("not implemented");
};

const product = (acc: number, curr: number) => acc * curr;

export const sizeOf = (
  cuboid: Cuboid,
) => cuboid.map(([min, max]) => max - min + 1).reduce(product);

const countSizes = (count: number, cuboid: Cuboid) => count + sizeOf(cuboid);

export const solvePart1 = (filePath: string) =>
  parseInstructions(getInputStrings(filePath)).filter(
    inInitializationRegion,
  ).reduce(
    applyInstruction,
    [],
  ).reduce(countSizes, 0);
