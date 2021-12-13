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

const drawRow = (
  points: Array<[number, number]>,
  rowIndex: number,
  width: number
) => {
  return new Array(width)
    .fill("")
    .map((_, x) =>
      points.find((point) => point[0] === x && point[1] === rowIndex)
        ? "█"
        : " "
    )
    .join("");
};

const drawPoints = (points: Array<[number, number]>) => {
  const [xRange, yRange] = points.reduce(
    ([maxX, maxY], [x, y]) => [Math.max(maxX, x), Math.max(maxY, y)],
    [0, 0]
  );
  return new Array(yRange + 1)
    .fill([])
    .map((_, rowIndex) => drawRow(points, rowIndex, xRange + 1))
    .join("\n");
};

export const solvePart2 = () => {
  const inputLines = getInputStrings("day13/input.txt");
  const { points, folds } = parseInput(inputLines);

  const folded = folds.reduce(
    (foldedPoints, fold) => foldPoints(foldedPoints, fold),
    points
  );

  return drawPoints(folded);
};
