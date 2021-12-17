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
