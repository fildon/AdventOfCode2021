import { getInputStrings } from "../utils/inputparsing.ts";

/**
 * 8, 4, 7, 1 are each uniquely identified by length
 *
 * 9: length 6 AND superset of 4
 *
 * 6: length 6 AND NOT superset of 1
 *
 * 0: length 6 AND remainder from above
 *
 * 3: length 5 AND superset of 1
 *
 * 5: length 5 AND shares exactly 3 symbols with 4
 *
 * 2: length 5 AND remainder from above
 */
const buildDigitIdentifier = (inputSignals: string[]) => {
  // The set of signals in a four
  const symbolsInFour = [
    ...inputSignals.find((signal) => signal.length === 4)!,
  ];
  const symbolsInOne = [...inputSignals.find((signal) => signal.length === 2)!];
  return (outputSignal: string) => {
    // The first four cases are uniquely identified by length
    if (outputSignal.length === 7) return "8";
    if (outputSignal.length === 4) return "4";
    if (outputSignal.length === 3) return "7";
    if (outputSignal.length === 2) return "1";
    if (outputSignal.length === 6) {
      // Among signals with length 6 we have either "9", "6" or "0"
      if (
        // "9" is a super set of "4"
        symbolsInFour.every((symbolInFour) =>
          outputSignal.includes(symbolInFour)
        )
      ) {
        return "9";
      }
      if (
        // "6" is NOT a super set of "1"
        !symbolsInOne.every((symbolInOne) => outputSignal.includes(symbolInOne))
      ) {
        return "6";
      }
      // "0" is the only other length 6 possibility
      return "0";
    }
    if (outputSignal.length === 5) {
      // Among signals with length 5 we have either "2", "3" or "5"
      if (
        // "3" is a super set of "1"
        symbolsInOne.every((symbolInOne) => outputSignal.includes(symbolInOne))
      ) {
        return "3";
      }
      if (
        // "5" shares exactly 3 symbols with "4"
        symbolsInFour.filter((symbolInFour) =>
          outputSignal.includes(symbolInFour)
        ).length === 3
      ) {
        return "5";
      }
      // "2" is the only other length 5 possibility
      return "2";
    }
    // Every possible signal should have already been positively IDed
    throw new Error(`unindentifiable output signal was: ${outputSignal}`);
  };
};

const getLineReading = (line: string): number => {
  const [inputSignals, outputSignals] = line
    .split("|")
    .map((string) => string.split(" ").filter((string) => string.length > 0));
  const digitIdentifier = buildDigitIdentifier(inputSignals);
  const outputNumber = parseInt(outputSignals.map(digitIdentifier).join(""));
  return outputNumber;
};

const solve = (filePath: string) => {
  return getInputStrings(filePath)
    .filter((str) => str.length > 0)
    .map(getLineReading)
    .reduce((acc, curr) => acc + curr);
};

console.log(solve("day08/input.txt")); // 983026
