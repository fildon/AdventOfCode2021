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
    parseInt(matches[2]),
    parseInt(matches[3]),
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
  const [, yMin] = target;
  // If probe is below target and descending, then it has missed
  if (probe.position[1] < yMin && probe.velocity[1] <= 0) return false;
  // Probe is currently in target area, it has succeeded!
  if (inArea(probe.position, target)) return true;
  // Otherwise we advance the probe and recheck
  return hitsTarget(probe.advance(), target);
};

export const getMaximumHeight = (probe: Probe) => {
  const [, yVelocity] = probe.velocity;
  const [, yPosition] = probe.position;
  if (yVelocity <= 0) return yPosition;
  // Summation over a descending integer is equivalent to a triangular number
  return yPosition + 0.5 * yVelocity * (yVelocity + 1);
};
