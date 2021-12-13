import { getInputStrings } from "../utils/inputparsing.ts";

export const parseInput = (inputLines: Array<string>) => {
  const nonEmptyStrs = inputLines.filter((str) => str.length > 0);
  const pointLines = nonEmptyStrs.filter((str) => !str.includes("fold"));
  const foldLines = nonEmptyStrs.filter((str) => str.includes("fold"));
  return {
    points: pointLines.map(
      (str) => str.split(",").map((n) => parseInt(n)) as [number, number]
    ),
    folds: foldLines.map((str) => ({
      type: (str.includes("x") ? "x" : "y") as "x" | "y",
      value: parseInt(str.split("=")[1]),
    })),
  };
};

const foldPoint = (
  [x, y]: [number, number],
  { type, value }: { type: "x" | "y"; value: number }
) => {
  if (type === "x") {
    if (x < value) return [x, y];
    return [2 * value - x, y];
  } else {
    if (y < value) return [x, y];
    return [x, 2 * value - y];
  }
};

export const foldPoints = (
  points: Array<[number, number]>,
  foldInstruction: { type: "x" | "y"; value: number }
) => {
  const folded = points.map((point) => foldPoint(point, foldInstruction));
  const uniquePointStrings = new Set(folded.map(([x, y]) => `${x},${y}`));
  return [...uniquePointStrings.values()].map(
    (pointString) =>
      pointString.split(",").map((s) => parseInt(s)) as [number, number]
  );
};

export const solvePart1 = (filePath: string) => {
  const inputLines = getInputStrings(filePath);
  const { points, folds } = parseInput(inputLines);
  const foldedPoints = foldPoints(points, folds[0]);
  return foldedPoints.length;
};
