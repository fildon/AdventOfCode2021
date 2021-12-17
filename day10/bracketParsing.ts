type Opener = "(" | "[" | "{" | "<";
export type Closer = ")" | "]" | "}" | ">";

const isOpener = (str: string): str is Opener =>
  ["(", "[", "{", "<"].includes(str);
const isCloser = (str: string): str is Closer =>
  [")", "]", "}", ">"].includes(str);

const openToCloseLookup: Record<Opener, Closer> = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

export type InvalidResult = { valid: false; illegalSymbol: Closer };
export type ValidResult = { valid: true; completionSequence: Array<Closer> };
type ParseResult = InvalidResult | ValidResult;
export const parseInputLine = (inputLine: string): ParseResult => {
  const inputSequence = [...inputLine];
  const bracketStack: Array<Opener> = [];
  for (let i = 0; i < inputSequence.length; i++) {
    const currentSymbol = inputSequence[i];
    if (isOpener(currentSymbol)) bracketStack.push(currentSymbol);
    if (isCloser(currentSymbol)) {
      const matches = bracketStack.pop();
      if (matches === undefined) {
        throw new Error("Closed chunk with no available openers");
      }
      if (openToCloseLookup[matches] !== currentSymbol) {
        return { valid: false, illegalSymbol: currentSymbol };
      }
    }
  }
  return {
    valid: true,
    completionSequence: bracketStack
      .reverse()
      .map((opener) => openToCloseLookup[opener]),
  };
};

const part1ScoreLookup: Record<Closer, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};
export const part1GetScore = (corruptions: Array<Closer>): number => {
  return corruptions
    .map((corruption) => part1ScoreLookup[corruption])
    .reduce((acc, curr) => acc + curr, 0);
};

const part2ScoreLookup: Record<Closer, number> = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};
export const part2GetScoreOfLine = (
  completionSequence: Array<Closer>,
): number => {
  return completionSequence.reduce(
    (acc, curr) => 5 * acc + part2ScoreLookup[curr],
    0,
  );
};

export const getMedianValue = (values: Array<number>): number => {
  return values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
};
