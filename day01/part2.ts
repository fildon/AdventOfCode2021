import { input } from "./part2Input.ts";

/**
 * Task: Your goal now is to count the number of times the sum of
 * measurements in this sliding window increases from the previous
 * sum.
 *
 * Solution approach:
 * When comparing adjacent rolling windows, shared values can be
 * ignored. Only the first value in the prior window and the last
 * value in the current window matter. So we can compare these values
 * directly.
 */
const countWindowIncreases = (depthMeasurements: number[]): number => {
  let increases = 0;
  // Skip first two entries
  for (let i = 3; i < depthMeasurements.length; i++) {
    if (depthMeasurements[i] > depthMeasurements[i - 3]) increases++;
  }
  return increases;
};

const solution = countWindowIncreases(input);

console.log(solution); // 1346

const oneLinerSolution = input
  .flatMap<{ prior: number; current: number }>((depth, index, depths) =>
    index < 3 ? [] : { prior: depths[index - 3], current: depth }
  )
  .filter(({ prior, current }) => current > prior).length;

console.log(oneLinerSolution); // 1346
