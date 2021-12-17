import { getInputStrings } from "../utils/inputparsing.ts";

/**
 * 2D vector of the form: `[x, y]`
 */
type Vector = [number, number];

/**
 * Rectangular area bounded by `[xMin, yMin, xMax, yMax]`
 */
type Area = [number, number, number, number];

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
