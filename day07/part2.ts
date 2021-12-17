import { getInputStrings } from "../utils/inputparsing.ts";

const getMedianValue = (numbers: Array<number>) => {
  // There's an interesting parity problem here,
  // but it doesn't affect the final answer we need so it's fine
  return numbers.sort((a, b) => a - b)[Math.floor(numbers.length / 2)];
};

/**
 * "As it turns out, crab submarine engines don't burn fuel at a constant rate.
 * Instead, each change of 1 step in horizontal position costs 1 more unit of
 * fuel than the last: the first step costs 1, the second step costs 2, the
 * third step costs 3, and so on."
 *
 * Pretty sure this is triangular numbers on the diff
 */
const costToMoveFromTo = (position: number, target: number) => {
  const diff = Math.abs(position - target);
  // Triangular number formula
  return 0.5 * diff + 0.5 * diff * diff;
};

/**
 * Compute the cost of each of
 * - Moving up by one
 * - Staying at current position
 * - Moving down by one
 */
const getLocalCostGradient = (
  numbers: Array<number>,
  currentPosition: number,
) => {
  const up = numbers
    .map((num) => costToMoveFromTo(num, currentPosition + 1))
    .reduce((a, b) => a + b);
  const stay = numbers
    .map((num) => costToMoveFromTo(num, currentPosition))
    .reduce((a, b) => a + b);
  const down = numbers
    .map((num) => costToMoveFromTo(num, currentPosition - 1))
    .reduce((a, b) => a + b);
  return { up, stay, down };
};

/**
 * I'm going to try starting heuristically at the median
 * And then gradient descent to the solution
 * This assumes the cost curve has no local minima
 */
const solve = (inputPath: string) => {
  const crabPositions = getInputStrings(inputPath)
    .filter((str) => str.length > 0)
    .map((str) => str.split(","))
    .flat()
    .map((str) => parseInt(str));

  let target = getMedianValue(crabPositions);
  let up: number, stay: number, down: number;

  // In this loop we repeatedly step towards lower cost target positions
  // Until we find ourselves at a local minimum.
  do {
    // Definitely some redundant computation in here
    // Adjacent local gradients share two values... but I always recompute all
    const gradient = getLocalCostGradient(crabPositions, target);
    up = gradient.up;
    stay = gradient.stay;
    down = gradient.down;
    // Step target towards smallest value
    target = up < down ? target + 1 : target - 1;
    // While 'stay' is not minimal
  } while (stay > up || stay > down);

  // Stay is the cost of the current target position which is a local minimum
  return stay;
};

console.log(solve("day07/input.txt")); // 99540554
