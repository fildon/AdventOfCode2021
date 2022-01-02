import { getInputStrings } from "../utils/inputparsing.ts";

/**
 * Models the full state of amphipod locations at some given point in time
 */
export type Burrows = Array<string>;

/**
 * 2D coordinate of the form [row, col]
 */
type Location = [number, number];

export const equals = (a: Burrows) =>
  (b: Burrows) => serialize(a) === serialize(b);

const serialize = (state: Burrows) => state.join("");

const isGoal = (state: Burrows) =>
  state.length === 3 && state[0] === "#...........#" &&
  state[1] === "###A#B#C#D###" && state[2] === "  #A#B#C#D#";

/**
 * Heuristic cost function, estimating the cost to get to the goal
 */
const hCost = (_state: Burrows) => {
  // TODO
  return 0;
};

/**
 * Given a burrows state, return an array of locations occupied by amphipods
 *
 * Location format is [row, col]
 */
export const getAmphipodLocations = (
  state: Burrows,
) =>
  state.flatMap((line, row) =>
    [...line].flatMap((char, col): Array<Location> => {
      if ([".", "#", " "].includes(char)) return [];
      return [[row, col]];
    })
  );

export const getMovesForLocation = (state: Burrows) =>
  ([startRow, startCol]: Location): Array<{ state: Burrows; cost: number }> => {
    const amphipod = state[startRow][startCol];
    const destinationCol = { A: 3, B: 5, C: 7, D: 9 }[amphipod];
    if (!destinationCol) {
      throw new Error(
        "not possible!",
      );
    }
    const costPerStep = {
      A: 1,
      B: 10,
      C: 100,
      D: 1000,
    }[amphipod];
    if (!costPerStep) throw new Error("tried to get cost of non-amphipod");

    // If this location is already happy we bail out
    if (
      startRow > 0 && destinationCol === startCol &&
      state[1][startCol] === amphipod && state[2][startCol] === amphipod
    ) {
      return [];
    }

    const stateWithAmphipodRemoved = state.map((line, row) => {
      if (row !== startRow) return line;
      return line.slice(0, startCol) + "." + line.slice(startCol + 1);
    });

    // Positions we have already checked
    const seen = [[startRow, startCol]];
    // Positions we need to check
    const workingGroup: Array<{ location: Location; cost: number }> = [{
      location: [startRow, startCol],
      cost: 0,
    }];
    // Positions we have successfully moved to
    const results: Array<{ state: Burrows; cost: number }> = [];

    while (workingGroup.length > 0) {
      const current = workingGroup.pop();
      if (!current) throw new Error("popped nothing!");
      const { location: [row, col], cost } = current;

      const candidates = [
        [row - 1, col],
        [row, col - 1],
        [row + 1, col],
        [row, col + 1],
      ].filter(([r, c]) => 0 <= r && r <= 2 && 0 <= c && c <= 12) as Array<
        Location
      >;
      candidates.forEach(([r, c]) => {
        const cell = state[r][c];
        if (cell !== ".") return;
        if (
          // If this candidate is not already seen...
          !seen.some(([sr, sc]) => sr === r && sc === c)
        ) {
          // ...then add it to the working group
          workingGroup.push({ location: [r, c], cost: cost + costPerStep });
          // ...and seen group
          seen.push([r, c]);
        } else return;
        // don't stop outside a room
        if (r === 0 && [3, 5, 7, 9].includes(c)) return;
        // can't go from hallway-to-hallway
        if (r === 0 && startRow === 0) return;
        // We can't enter an incorrect room
        if (r > 0 && destinationCol !== c) return;
        // We can't enter a correct room with a wrong partner
        if (r === 1 && stateWithAmphipodRemoved[2][c] !== amphipod) return;
        const newResult = {
          state: stateWithAmphipodRemoved.map((line, row) => {
            if (row !== r) return line;
            return line.slice(0, c) + amphipod +
              line.slice(c + 1);
          }),
          cost: cost + costPerStep,
        };
        results.push(newResult);
      });
    }

    return results;
  };

/**
 * Given a state which adjacent states are reachable and how much did they cost
 */
const getNeighbours = (
  state: Burrows,
) => getAmphipodLocations(state).flatMap(getMovesForLocation(state));

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
  const openSet: Array<Burrows> = [start];

  // Set from states to cost _to reach that point from the start_
  const gScore = burrowCostStore();
  gScore.set(start, 0);

  // Set from states to current best estimate for total cost of a complete path through that state
  const fScore = burrowCostStore();
  fScore.set(start, hCost(start));

  while (openSet.length > 0) {
    // Pops off the lowest fScore openSet member
    const current = openSet.sort((a, b) => fScore.get(b) - fScore.get(a)).pop();
    if (!current) throw new Error("Popped nothing!");

    // We have reached the goal!
    if (isGoal(current)) return gScore.get(current);

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
        tentativeGScore + hCost(neighbour.state),
      );

      // Only add this neighbour if it is not already in our openSet
      if (!openSet.some(equals(neighbour.state))) {
        openSet.push(neighbour.state);
      }
    });
  }
  throw new Error("Failed to reach goal!");
};

export const parseInput = (inputStrings: Array<string>): Burrows => {
  return inputStrings.slice(1, 4);
};

export const solvePart1 = (filePath: string) =>
  aStarSearch(parseInput(getInputStrings(filePath)));
