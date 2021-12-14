import { getInputStrings } from "../utils/inputparsing.ts";

export const parseInput = (inputLines: Array<string>) => {
  const template = inputLines[0];
  const pairs = [...template]
    .flatMap((char, i) => {
      if (i === 0) return [];
      return `${template[i - 1]}${char}`;
    })
    .reduce(
      (acc, pair) => ({ ...acc, [pair]: (acc[pair] ?? 0) + 1 }),
      {} as { [pair: string]: number }
    );
  const rules = Object.fromEntries(
    inputLines
      .filter((line) => line.includes("->"))
      .map((line) => {
        const last = line.at(-1);
        if (!last) throw new Error("Unexpected empty line");
        return [line.slice(0, 2), last];
      })
  );
  const letterCounts = [...template].reduce((acc, curr) => {
    return { ...acc, [curr]: (acc[curr] ?? 0) + 1 };
  }, {} as { [letter: string]: number });
  return { pairs, rules, letterCounts };
};

export const stepOnce = (
  pairs: { [pair: string]: number },
  rules: { [pair: string]: string },
  letterCounts: { [letter: string]: number }
) => {
  const newPairs = {} as { [pair: string]: number };
  const newLetterCounts = { ...letterCounts };

  Object.entries(pairs).forEach(([pair, count]) => {
    const middle = rules[pair];
    const [left, right] = pair;
    const leftPair = `${left}${middle}`;
    const rightPair = `${middle}${right}`;
    newLetterCounts[middle] = (newLetterCounts[middle] ?? 0) + count;
    newPairs[leftPair] = (newPairs[leftPair] ?? 0) + count;
    newPairs[rightPair] = (newPairs[rightPair] ?? 0) + count;
  });

  return {
    pairs: newPairs,
    letterCounts: newLetterCounts,
  };
};

export const stepN = (
  pairs: { [pair: string]: number },
  rules: { [pair: string]: string },
  counts: { [letter: string]: number },
  steps: number
) => {
  let workingCounts = { ...counts };
  let workingPairs = { ...pairs };
  while (steps > 0) {
    const { pairs, letterCounts } = stepOnce(
      workingPairs,
      rules,
      workingCounts
    );
    workingPairs = pairs;
    workingCounts = letterCounts;
    steps--;
  }

  return workingCounts;
};

const countDiffAfterNSteps = (filePath: string, steps: number) => {
  const inputLines = getInputStrings(filePath);
  const { pairs, rules, letterCounts } = parseInput(inputLines);
  const finalCounts = stepN(pairs, rules, letterCounts, steps);

  const sortedCounts = Object.values(finalCounts).sort((a, b) => a - b);
  const smallest = sortedCounts.at(0)!;
  const biggest = sortedCounts.at(-1)!;
  return biggest - smallest;
};

export const solvePart1 = (filePath: string) =>
  countDiffAfterNSteps(filePath, 10);

export const solvePart2 = (filePath: string) =>
  countDiffAfterNSteps(filePath, 40);
