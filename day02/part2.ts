import { input } from "./part2Input.ts";

/**
 * In addition to horizontal position and depth, you'll also need to track a third value, aim, which also starts at 0. The commands also mean something entirely different than you first thought:

    down X increases your aim by X units.
    up X decreases your aim by X units.
    forward X does two things:
        It increases your horizontal position by X units.
        It increases your depth by your aim multiplied by X.

 */
const getDestination = (path: Array<["forward" | "down" | "up", number]>) => {
  let depth = 0;
  let horizontalPosition = 0;
  let aim = 0;
  path.forEach(([direction, distance]) => {
    if (direction === "down") aim += distance;
    if (direction === "up") aim -= distance;
    if (direction === "forward") {
      horizontalPosition += distance;
      depth += aim * distance;
    }
  });
  return [horizontalPosition, depth] as const;
};

const finalPosition = getDestination(input);
const solution = finalPosition[0] * finalPosition[1];
console.log(solution); // 1954293920
