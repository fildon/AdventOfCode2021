import { getInputStrings } from "../utils/inputparsing.ts";

export const parseInput = (inputLines: Array<string>) =>
  inputLines
    .filter((line) => line.length > 0)
    .map((line) => [...line].map((char) => parseInt(char)));

type Location = readonly [number, number];

/**
 * Heuristic cost function from the given location to the 'goal'
 *
 * The goal is assumed to be the bottom right corner
 *
 * We use a minimal manhattan distance cost, equivalent to
 * the hamming distance between this location and the goal's location.
 * This (incorrectly) assumes all future edges cost 1.
 * Although incorrect, this satisfies the 'consistent' and 'admissable'
 * properties necessary for a reliable heuristic function.
 */
export const hCost = ([loc_x, loc_y]: Location, [goal_x, goal_y]: Location) =>
  goal_x + goal_y - loc_x - loc_y;

type Path = {
  /**
   * The current head of the path
   */
  location: Location;
  heuristicCostRemaining: number;
};

const buildLocationCostMap = (
  primativeMap: { [x: number]: { [y: number]: number } } = {}
) => {
  return {
    get: ([x, y]: Location) => primativeMap[x]?.[y] ?? Infinity,
    /**
     * Returns a new map with the given key-value set.
     *
     * **WARNING** does not modify the current map.
     */
    set: ([x, y]: Location, cost: number) =>
      buildLocationCostMap({
        ...primativeMap,
        [x]: { ...(primativeMap[x] ?? {}), [y]: cost },
      }),
  };
};

export const solvePart1 = (filePath: string) => {
  const riskMap = parseInput(getInputStrings(filePath));
  const goal: Location = [riskMap[0].length - 1, riskMap.length - 1];
  const [goalX, goalY] = goal;
  const start: Location = [0, 0];
  const openSet: Array<Location> = [start];
  /**
   * Map from location keys to cost to reach that location
   */
  let gScore = buildLocationCostMap().set(start, 0);
  /**
   * Map from location keys to cost to reach that location + heuristic cost to goal
   */
  let fScore = buildLocationCostMap().set(start, hCost(start, goal));

  while (openSet.length > 0) {
    // Pops off the lowest fScore openSet member
    const current = openSet.sort((a, b) => fScore.get(b) - fScore.get(a)).pop();
    if (!current) throw new Error("Popped nothing!");
    const [currentX, currentY] = current;
    if (currentX === goalX && currentY === goalY) return gScore.get(current);
    const neighbours: Array<Location> = [
      [currentX, currentY + 1] as const,
      [currentX, currentY - 1] as const,
      [currentX - 1, currentY] as const,
      [currentX + 1, currentY] as const,
    ].filter(([x, y]) => x >= 0 && y >= 0 && x <= goalX && y <= goalY);
    neighbours.forEach((neighbour) => {
      const [neighbourX, neighbourY] = neighbour;
      const neighbourEntryCost = riskMap[neighbour[1]][neighbour[0]];

      const tentativeGScore = gScore.get(current) + neighbourEntryCost;

      const previousScoreForNeighbour = gScore.get(neighbour) ?? Infinity;

      if (tentativeGScore < previousScoreForNeighbour) {
        gScore = gScore.set(neighbour, tentativeGScore);
        fScore = fScore.set(
          neighbour,
          tentativeGScore + hCost(neighbour, goal)
        );

        // Only add this neighbour if it is not already in our openSet
        if (!openSet.some(([x, y]) => x === neighbourX && y === neighbourY))
          openSet.push(neighbour);
      }
    });
  }
  throw new Error("Failed to reach goal!");
};
