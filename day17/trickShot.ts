import { getInputStrings } from "../utils/inputparsing.ts";

export const parseInput = (filePath: string) => {
  const inputLine = getInputStrings(filePath)[0];
  const matches = inputLine.match(
    /^target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)$/
  );
  if (!matches) throw new Error("Unrecognised input");
  return {
    xMin: parseInt(matches[1]),
    xMax: parseInt(matches[2]),
    yMin: parseInt(matches[3]),
    yMax: parseInt(matches[4]),
  };
};

type Vector = [number, number];

type Probe = {
  position: Vector;
  velocity: Vector;
  advance: () => Probe;
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

export const buildProbe = (position: Vector, velocity: Vector): Probe => {
  const advance = () =>
    buildProbe(add(position, velocity), updateVelocity(velocity));
  return {
    position,
    velocity,
    advance,
  };
};
