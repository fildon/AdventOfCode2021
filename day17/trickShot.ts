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

export const solvePart1 = (filePath: string) => {
  const target = parseInput(filePath);
  const [xMin, yMin, xMax, _yMax] = target;

  const xLowerBound = getSmallestX(xMin); // Would never get right enough
  const xUpperBound = xMax; // Would shoot past to the right
  const yLowerBound = yMin; // Would immediately shoot below target
  const yUpperBound = -yMin; // Would shoot past target after falling past the horizontal

  // Iterate down from the largest y value
  for (let y = yUpperBound; y >= yLowerBound; y--) {
    for (let x = xLowerBound; x <= xUpperBound; x++) {
      const probe = buildProbe({ velocity: [x, y] });
      // First probe that hits the target is also the highest such probe
      if (hitsTarget(probe, target)) return getMaximumHeight(probe);
    }
  }
  throw new Error("Failed to find a successful probe");
};

export const solvePart2 = (filePath: string): number => {
  const target = parseInput(filePath);
  const [xMin, yMin, xMax, _yMax] = target;

  const xLowerBound = getSmallestX(xMin); // Would never get right enough
  const xUpperBound = xMax; // Would shoot past to the right
  const yLowerBound = yMin; // Would immediately shoot below target
  const yUpperBound = -yMin; // Would shoot past target after falling past the horizontal

  let successfulProbes = 0;

  // Iterate down from the largest y value
  for (let y = yUpperBound; y >= yLowerBound; y--) {
    for (let x = xLowerBound; x <= xUpperBound; x++) {
      const probe = buildProbe({ velocity: [x, y] });
      if (hitsTarget(probe, target)) successfulProbes++;
    }
  }

  return successfulProbes;
};
