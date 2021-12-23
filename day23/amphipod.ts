import { getInputStrings } from "../utils/inputparsing.ts";

/**
 * Models the full state of amphipod locations at some given point in time
 */
type Burrows = {
  // TODO
};

const equals = (a: Burrows) =>
  (b: Burrows) => {
    // TODO
    return false;
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
 * Key-value store from states to costs
 */
const buildLocationCostMap = () => {
  // TODO
  return {
    get: (burrows: Burrows) => 0,
    set: (burrows: Burrows, cost: number) => buildLocationCostMap(),
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
  const goal: Burrows = {};
  const openSet: Array<Burrows> = [start];

  // Set from states to cost _to reach that point from the start_
  let gScore = buildLocationCostMap().set(start, 0);

  // Set from states to current best estimate for total cost of a complete path through that state
  let fScore = buildLocationCostMap().set(start, hCost(start, goal));

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
      gScore = gScore.set(neighbour, tentativeGScore);
      fScore = fScore.set(
        neighbour,
        tentativeGScore + hCost(neighbour, goal),
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
