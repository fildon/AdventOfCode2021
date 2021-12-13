export const parseInput = (inputLines: Array<string>) => {
  const nonEmptyStrs = inputLines.filter((str) => str.length > 0);
  const pointLines = nonEmptyStrs.filter((str) => !str.includes("fold"));
  const foldLines = nonEmptyStrs.filter((str) => str.includes("fold"));
  return {
    points: pointLines.map((str) => str.split(",").map((n) => parseInt(n))),
    folds: foldLines.map((str) => ({
      type: str.includes("y") ? "y" : "x",
      value: parseInt(str.split("=")[1]),
    })),
  };
};
