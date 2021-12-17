import { getInputStrings } from "../utils/inputparsing.ts";

/**
 * 2D vector of the form: `[x, y]`
 */
type Vector = readonly [number, number];

/**
 * Rectangular area bounded by `[xMin, yMin, xMax, yMax]`
 */
type Area = readonly [number, number, number, number];

type Probe = {
  position: Vector;
  velocity: Vector;
  advance: () => Probe;
};

export const parseInput = (filePath: string): Area => {
  const inputLine = getInputStrings(filePath)[0];
  const matches = inputLine.match(
    /^target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)$/
  );
  if (!matches) throw new Error("Unrecognised input");
  return [
    parseInt(matches[1]),
    parseInt(matches[3]),
    parseInt(matches[2]),
    parseInt(matches[4]),
  ];
};

const add = ([aX, aY]: Vector, [bX, bY]: Vector): Vector => [aX + bX, aY + bY];

const updateVelocity = ([dX, dY]: Vector): Vector => {
  const drag =
    [
      [(v: number) => v > 0, -1] as const,
      [(v: number) => v < 0, +1] as const,
    ].find(([condition]) => condition(dX))?.[1] ?? 0;
  return [dX + drag, dY - 1];
};

export const buildProbe = ({
  position = [0, 0],
  velocity = [0, 0],
}: {
  position?: Vector;
  velocity?: Vector;
} = {}): Probe => {
  const advance = () =>
    buildProbe({
      position: add(position, velocity),
      velocity: updateVelocity(velocity),
    });
  return {
    position,
    velocity,
    advance,
  };
};

export const inArea = ([x, y]: Vector, [xMin, yMin, xMax, yMax]: Area) =>
  xMin <= x && x <= xMax && yMin <= y && y <= yMax;

export const hitsTarget = (probe: Probe, target: Area): boolean => {
  const [xMin, yMin, xMax, _yMax] = target;

  // Probe is currently in target area, it has succeeded!
  if (inArea(probe.position, target)) return true;

  // If probe is below target and descending, then it has missed
  if (probe.position[1] < yMin && probe.velocity[1] <= 0) return false;

  // If probe is right of target, and heading right then it has missed
  if (probe.position[0] > xMax && probe.velocity[0] >= 0) return false;

  // If probe is left of target, and heading left then it has missed
  if (probe.position[0] < xMin && probe.velocity[0] <= 0) return false;

  // Otherwise we advance the probe and recheck
  return hitsTarget(probe.advance(), target);
};

/**
 * Computes the nth triangular number
 */
const triangle = (n: number) => 0.5 * n * (n + 1);

export const getMaximumHeight = (probe: Probe) => {
  const [, yVelocity] = probe.velocity;
  const [, yPosition] = probe.position;
  if (yVelocity <= 0) return yPosition;
  // Summation over a descending integer is equivalent to a triangular number
  return yPosition + triangle(yVelocity);
};

/**
 * Gets the smallest x velocity that could ever reach targetXMin
 *
 * WARNING: targetXMin is assumed to be positive.
 * Behaviour of this function is undocumented in case of a negative argument
 */
const getSmallestX = (targetXMin: number): number => {
  for (let x = 0; x < targetXMin; x++) {
    if (triangle(x) >= targetXMin) return x;
  }
  throw new Error("could not find x min");
};

/**
 * Given a target area, returns the array of x velocities that could ever
 * coincide with that target
 */
export const getXCandidates = (target: Area): Array<number> => {
  const [xMin, _yMin, xMax, _yMax] = target;
  // Start by finding very dumb bounds (inclusive)
  const xLowerBound = getSmallestX(xMin);
  const xUpperBound = xMax;

  const xCandidates: Array<number> = [];
  // For each value within our dumb bounds we check if they ever enter the target x range
  for (let xStartVel = xLowerBound; xStartVel <= xUpperBound; xStartVel++) {
    // xHits tracks all x values visited by this xStartVel
    const xHits = [xStartVel];
    let xVel = xStartVel;
    // While xVel is positive we simulate x increasing by xVel
    while (xVel > 0) {
      xHits.push(xHits[xHits.length - 1] + xVel);
      xVel--;
    }
    // This is a valid candidate if the xHits includes a member within the target
    if (xHits.some((hit) => xMin <= hit && hit <= xMax))
      xCandidates.push(xStartVel);
  }
  return xCandidates;
};

const getYCandidates = (target: Area): Array<number> => {
  const [_xMin, yMin, _xMax, yMax] = target;

  // Dumb bounds (Inclusive)
  const lowerBound = yMin; // Would immediately shoot below target
  const upperBound = -yMin; // Would shoot past target after falling past the horizontal
  // WARNING the above assumes yMin is negative

  const yCandidates: Array<number> = [];
  for (let yStartVel = lowerBound; yStartVel < upperBound; yStartVel++) {
    // yHits tracks all y values visited by this yStartVel
    const yHits = [yStartVel];
    let yVel = yStartVel - 1;
    // While we haven't passed the target we add another value
    while (yHits[yHits.length - 1] >= yMin) {
      yHits.push(yHits[yHits.length - 1] + yVel);
      yVel--;
    }
    // This is a valid candidate if the yHits includes a member within the target
    if (yHits.some((hit) => yMin <= hit && hit <= yMax))
      yCandidates.push(yStartVel);
  }
  return yCandidates;
};

export const solvePart1 = (filePath: string) => {
  const target = parseInput(filePath);

  // We define bounds for our search space
  const xCandidates = getXCandidates(target);
  // Sort y candidates in descending order, to put largest values first
  const yCandidates = getYCandidates(target).sort((a, b) => b - a);

  // Iterate down from the largest y values
  for (const y of yCandidates) {
    for (const x of xCandidates) {
      const probe = buildProbe({ velocity: [x, y] });
      // First probe that hits the target is also the highest such probe (thanks to yCandidate ordering)
      if (hitsTarget(probe, target)) return getMaximumHeight(probe);
    }
  }
  throw new Error("Failed to find a successful probe");
};
