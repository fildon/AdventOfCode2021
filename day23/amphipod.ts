import { getInputStrings } from "../utils/inputparsing.ts";

/**
 * There are 19 possible locations
 *
 * We denote each location with a string
 *
 * Hallway locations are H00 - H10 (reading left to right)
 *
 * Burrow locatinos are A1, A2, B1, B2 ... etc.
 * With A1 being 'higher' than A2
 *
 * ```txt
 * #############
 * #...........#
 * ###.#.#.#.###
 *   #.#.#.#.#
 *   #########
 * ```
 */
type Location =
  | "H00"
  | "H01"
  | "H02"
  | "H03"
  | "H04"
  | "H05"
  | "H06"
  | "H07"
  | "H08"
  | "H09"
  | "H10"
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2"
  | "D1"
  | "D2";

/**
 * Given a location, which other locations are adjacent?
 */
export const adjacencyMap: Record<Location, Array<Location>> = {
  H00: ["H01"],
  H01: ["H00", "H02"],
  H02: ["H01", "H03", "A1"],
  H03: ["H02", "H04"],
  H04: ["H03", "H05", "B1"],
  H05: ["H04", "H06"],
  H06: ["H05", "H07", "C1"],
  H07: ["H06", "H08"],
  H08: ["H07", "H09", "D1"],
  H09: ["H08", "H10"],
  H10: ["H09"],
  A1: ["A2", "H02"],
  A2: ["A1"],
  B1: ["B2", "H04"],
  B2: ["B1"],
  C1: ["C2", "H06"],
  C2: ["C1"],
  D1: ["D2", "H08"],
  D2: ["D1"],
};

/**
 * Models the full state of amphipod locations at some given point in time
 */
export type Burrows = {
  // State is fully defined by the set of locations of all amphipods
  a: [Location, Location];
  b: [Location, Location];
  c: [Location, Location];
  d: [Location, Location];
};

/**
 * Serialize a location pair
 *
 * Note that we need a canonical ordering to ignore order differences in the input
 *
 * The choice of canonical order in particular doesn't matter... so long as it is consistent
 */
const serializeLocations = ([x, y]: [Location, Location]) =>
  [x, y].sort((a, b) => a.localeCompare(b)).join("");

/**
 * Serialize a burrows state.
 *
 * The particular choice of serialization is not important, so long as it is
 * bijective. But remember that we don't distinguish states with differently ordered pairs
 */
const serialize = ({ a, b, c, d }: Burrows) =>
  [a, b, c, d].map(serializeLocations).join("");

export const equals = (a: Burrows) =>
  (b: Burrows) => serialize(a) === serialize(b);

/**
 * The shortest path distance from x to y
 */
export const distance = (x: Location, y: Location) => {
  if (x === y) return 0;
  if (adjacencyMap[x].includes(y)) return 1;

  // The following implements a breadth first search for distance
  const visited = new Set<Location>([x]);
  let distance = 0;
  while (!visited.has(y)) {
    // Get the set of all neighbours to currently visited locations
    // Excluding any visited already
    const newVisited = [...visited.values()].flatMap((location) =>
      adjacencyMap[location]
    ).filter((location) => !visited.has(location));

    if (newVisited.length === 0) {
      // We are not able to progress towards our destination.
      // This can only happen if there is no path between x and y
      return Infinity;
    }

    newVisited.forEach((location) => visited.add(location));
    distance++;
  }
  return distance;
};

/**
 * Heuristic cost function, estimating the cost to get from state 'a' to state 'b'
 *
 * TODO the second arg is probably unnecessary since the goal state can be hardcoded
 */
const hCost = (a: Burrows, b: Burrows) => {
  // TODO
  return -1;
};

/**
 * Given a burrows state, returns all states we can get to from here
 * in one move, and additionally return how much the given move cost
 */
const getNeighbours = (current: Burrows): Array<{
  cost: number;
  state: Burrows;
}> => {
  // TODO
  return [];
};

/**
 * Key-value store from burrow states to costs
 */
const burrowCostStore = () => {
  const map: Partial<Record<string, number>> = {};
  return {
    get: (burrows: Burrows) => map[serialize(burrows)] ?? Infinity,
    set: (burrows: Burrows, cost: number) => {
      map[serialize(burrows)] = cost;
    },
  };
};

/**
 * Notes: so this is path finding again
 *
 * We can model the whole state as one node, amphipod movements represent
 * transitions from one state to another. Then we path find from our starting
 * state to some goal state.
 *
 * The amphipod constraints are directly constraints on adjacent states
 *
 * We'll borrow a lot of the aStar implementation from day15
 */
const aStarSearch = (start: Burrows) => {
  const goal: Burrows = {
    a: ["A1", "A2"],
    b: ["B1", "B2"],
    c: ["C1", "C2"],
    d: ["D1", "D2"],
  };
  const openSet: Array<Burrows> = [start];

  // Set from states to cost _to reach that point from the start_
  const gScore = burrowCostStore();
  gScore.set(start, 0);

  // Set from states to current best estimate for total cost of a complete path through that state
  const fScore = burrowCostStore();
  fScore.set(start, hCost(start, goal));

  while (openSet.length > 0) {
    // Pops off the lowest fScore openSet member
    const current = openSet.sort((a, b) => fScore.get(b) - fScore.get(a)).pop();
    if (!current) throw new Error("Popped nothing!");

    // We have reached the goal!
    if (equals(current)(goal)) return gScore.get(current);

    const neighbours = getNeighbours(current);
    neighbours.forEach((neighbour) => {
      const tentativeGScore = gScore.get(current) + neighbour.cost;
      const previousScoreForNeighbour = gScore.get(neighbour.state) ?? Infinity;

      // We already know a better path to this point
      if (tentativeGScore >= previousScoreForNeighbour) return;

      // Update path costs
      gScore.set(neighbour.state, tentativeGScore);
      fScore.set(
        neighbour.state,
        tentativeGScore + hCost(neighbour.state, goal),
      );

      // Only add this neighbour if it is not already in our openSet
      if (!openSet.some(equals(neighbour.state))) {
        openSet.push(neighbour.state);
      }
    });
  }
  throw new Error("Failed to reach goal!");
};

const parseInput = (inputStrings: Array<string>): Burrows => {
  // TODO
  throw new Error("not implemented");
};

export const solvePart1 = (filePath: string) =>
  aStarSearch(parseInput(getInputStrings(filePath)));
