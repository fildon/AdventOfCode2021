import { input } from "./part1Input.ts";

const getDestination = (path: Array<["forward" | "down" | "up", number]>) => {
  let depth = 0;
  let horizontalPosition = 0;
  path.forEach(([direction, distance]) => {
    if (direction === "forward") horizontalPosition += distance;
    if (direction === "down") depth += distance;
    if (direction === "up") depth -= distance;
  });
  return [horizontalPosition, depth] as const;
};

const finalPosition = getDestination(input);
const solution = finalPosition[0] * finalPosition[1];
console.log(solution); // 1670340
