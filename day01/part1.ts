import { input } from "./part1Input.ts";

/**
 * count the number of times a depth measurement increases from the previous measurement.
 * (There is no measurement before the first measurement.)
 */
const countDepthIncreases = (depthMeasurements: number[]): number => {
  let increases = 0;
  // Start at 1 to skip first measurement
  for (let i = 1; i < depthMeasurements.length; i++) {
    if (depthMeasurements[i] > depthMeasurements[i - 1]) increases++;
  }
  return increases;
};

export const solve = () => {
  return countDepthIncreases(input);
};

console.log(solve()); // 1301
