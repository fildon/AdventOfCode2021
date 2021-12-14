import { getInputStrings } from "../utils/inputparsing.ts";

export const parseInput = (inputLines: Array<string>) => {
  const template = inputLines[0];
  const insertions = Object.fromEntries(
    inputLines
      .filter((line) => line.includes("->"))
      .map((line) => {
        const last = line.at(-1);
        if (!last) throw new Error("Unexpected empty line");
        return [line.slice(0, 2), last];
      })
  );
  return { template, insertions };
};

export const stepOnce = (
  polymer: string,
  rules: { [pair: string]: string }
) => {
  return [...polymer]
    .flatMap((char, i) => {
      if (i === 0) return char;
      const pair = `${polymer[i - 1]}${char}`;
      return `${rules[pair]}${char}`;
    })
    .join("");
};

export const stepN = (
  polymer: string,
  rules: { [pair: string]: string },
  steps: number
) => {
  let workingString = [...polymer].join("");
  while (steps > 0) {
    workingString = stepOnce(workingString, rules);
    steps--;
  }
  return workingString;
};

export const solvePart1 = (filePath: string) => {
  const inputLines = getInputStrings(filePath);
  const { template, insertions } = parseInput(inputLines);
  const polymer = stepN(template, insertions, 10);
  const letters = new Set([...polymer]);
  const letterCounts = [...letters.values()]
    .map((letter) => [...polymer].filter((s) => s === letter).length)
    .sort((a, b) => a - b);
  const biggestCount = letterCounts.at(-1);
  const smallestCount = letterCounts.at(0);
  if (!biggestCount) throw new Error("No biggest count!?");
  if (!smallestCount) throw new Error("No smallest count!?");
  return biggestCount - smallestCount;
};
