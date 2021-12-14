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

const mergeObjects = (
  a: { [key: string]: number },
  b: { [key: string]: number }
) => {
  const allKeys = [...new Set(Object.keys(a).concat(Object.keys(b)))];
  return Object.fromEntries(
    allKeys.map((key) => {
      const value = (a[key] ?? 0) + (b[key] ?? 0);
      return [key, value];
    })
  );
};

export const stepOnce = (
  pairs: { [pair: string]: number },
  rules: { [pair: string]: string },
  letterCounts: { [letter: string]: number }
) => {
  const { newPairs, newCounts } = Object.entries(pairs)
    .map(([pair, count]) => {
      const middle = rules[pair];
      const [left, right] = pair;
      const leftPair = [left, middle].join("");
      const rightPair = [middle, right].join("");
      return {
        newPairs: {
          [leftPair]: count,
          [rightPair]: count,
        },
        newCounts: { [middle]: 1 },
      };
    })
    .reduce(
      (acc, curr) => {
        return {
          newPairs: mergeObjects(acc.newPairs, curr.newPairs),
          newCounts: mergeObjects(acc.newCounts, curr.newCounts),
        };
      },
      { newPairs: {}, newCounts: {} }
    );

  return {
    pairs: newPairs,
    letterCounts: mergeObjects(letterCounts, newCounts),
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

// export const solvePart1 = (filePath: string) => {
//   const inputLines = getInputStrings(filePath);
//   const { pairs, rules } = parseInput(inputLines);
//   const resultingPairs = stepN(pairs, rules, 10);

//   // const letters = new Set([...polymer]);
//   // const letterCounts = [...letters.values()]
//   //   .map((letter) => [...polymer].filter((s) => s === letter).length)
//   //   .sort((a, b) => a - b);
//   // const biggestCount = letterCounts.at(-1);
//   // const smallestCount = letterCounts.at(0);
//   // if (!biggestCount) throw new Error("No biggest count!?");
//   // if (!smallestCount) throw new Error("No smallest count!?");
//   // return biggestCount - smallestCount;
// };

// export const solvePart2 = (filePath: string) => {
//   return 0;
// };
