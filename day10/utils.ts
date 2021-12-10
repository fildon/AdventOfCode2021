type Opener = "(" | "[" | "{" | "<";
export type Closer = ")" | "]" | "}" | ">";

const isOpener = (str: string): str is Opener =>
  ["(", "[", "{", "<"].includes(str);
const isCloser = (str: string): str is Closer =>
  [")", "]", "}", ">"].includes(str);

export const getCorruption = (inputLine: string): Closer | undefined => {
  const inputSequence = [...inputLine];
  const bracketStack: Array<Opener> = [];
  for (let i = 0; i < inputSequence.length; i++) {
    const currentSymbol = inputSequence[i];
    if (isOpener(currentSymbol)) bracketStack.push(currentSymbol);
    if (isCloser(currentSymbol)) {
      if (bracketStack.length === 0)
        throw new Error("Closed chunk with no available openers");
      const matches = bracketStack.pop();
      if (currentSymbol === ")" && matches !== "(") return currentSymbol;
      if (currentSymbol === "]" && matches !== "[") return currentSymbol;
      if (currentSymbol === "}" && matches !== "{") return currentSymbol;
      if (currentSymbol === ">" && matches !== "<") return currentSymbol;
    }
  }
  return undefined;
};

const scoreLookup: Record<Closer, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};
export const getScore = (corruptions: Array<Closer>): number => {
  return corruptions
    .map((corruption) => scoreLookup[corruption])
    .reduce((acc, curr) => acc + curr, 0);
};

export const getIncompleteLines = (
  inputLines: Array<string>
): Array<string> => {
  return inputLines.filter(
    (inputLine) => getCorruption(inputLine) === undefined
  );
};

const openToCloseLookup: Record<Opener, Closer> = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};
export const getCompletionSequence = (inputLine: string): Array<Closer> => {
  const inputSequence = [...inputLine];
  const bracketStack: Array<Opener> = [];
  for (let i = 0; i < inputSequence.length; i++) {
    const currentSymbol = inputSequence[i];
    if (isOpener(currentSymbol)) bracketStack.push(currentSymbol);
    if (isCloser(currentSymbol)) {
      if (bracketStack.length === 0)
        throw new Error("Closed chunk with no available openers");
      const matches = bracketStack.pop();
      if (currentSymbol === ")" && matches !== "(")
        throw new Error("Corrupted!");
      if (currentSymbol === "]" && matches !== "[")
        throw new Error("Corrupted!");
      if (currentSymbol === "}" && matches !== "{")
        throw new Error("Corrupted!");
      if (currentSymbol === ">" && matches !== "<")
        throw new Error("Corrupted!");
    }
  }
  return bracketStack.reverse().map((opener) => openToCloseLookup[opener]);
};
