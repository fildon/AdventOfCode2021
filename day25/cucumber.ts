import { getInputStrings } from "../utils/inputparsing.ts";

type Cucumbers = Array<string>;

export const equals = (a: Cucumbers, b: Cucumbers): boolean =>
  a.length === b.length && a.every((str, index) => str === b[index]);

export const step = (current: Cucumbers): Cucumbers => {
  throw new Error("TODO");
};

/**
 * Repeatedly update cucumber state until it stops changing,
 * returns the number of steps taken
 */
export const stepsToStop = (
  initial: Cucumbers,
): number => {
  // TODO
  throw new Error("not implemented");
};

const nonEmpty = (input: { length: number }) => input.length > 0;

export const solvePart1 = (filePath: string) =>
  stepsToStop(getInputStrings(filePath).filter(nonEmpty));
