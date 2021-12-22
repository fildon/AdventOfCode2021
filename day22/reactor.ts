import { getInputStrings } from "../utils/inputparsing.ts";

/**
 * An inclusive range with the first value being minimum and second
 * value maximum
 */
type Range = [number, number];

type Cuboid = {
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number];
};

/**
 * A single reactor instruction
 */
type Instruction = {
  command: "on" | "off";
  cuboid: Cuboid;
};

/**
 * We represent the Reactor's state solely in terms of "on" cuboids
 */
type Reactor = Array<Cuboid>;

const isRange = (numbers: unknown): numbers is Range =>
  Array.isArray(numbers) && numbers.length === 2 &&
  typeof numbers[0] === "number" && typeof numbers[1] === "number";

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

  const [xRange, yRange, zRange] = location.split(",")
    .map(toRange);

  return { command, cuboid: { xRange, yRange, zRange } };
};

export const parseInstructions = (instructions: Array<string>) =>
  instructions.map(parse);

export const inInitializationRegion = (
  {
    cuboid: {
      xRange: [xMin, xMax],
      yRange: [yMin, yMax],
      zRange: [zMin, zMax],
    },
  }: Instruction,
) => {
  if (xMin > 50) return false;
  if (xMax < -50) return false;
  if (yMin > 50) return false;
  if (yMax < -50) return false;
  if (zMin > 50) return false;
  if (zMax < -50) return false;
  /**
   * I assume instructions are either fully in or fully out of the
   * initialization region. If there are any counter examples I want
   * to know about it.
   */
  if (
    [xMin, xMax, yMin, yMax, zMin, zMax].some((val) => val < -50 || 50 < val)
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
  // TODO
  throw new Error("not implemented");
};

const sizeOf = (cuboid: Cuboid) => {
  // TODO
  return 0;
};

const countSizes = (count: number, cuboid: Cuboid) => {
  // TODO
  return 0;
};

export const solvePart1 = (filePath: string) =>
  parseInstructions(getInputStrings(filePath)).filter(
    inInitializationRegion,
  ).reduce(
    applyInstruction,
    [],
  ).reduce(countSizes, 0);
