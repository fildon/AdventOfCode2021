import { getInputStrings } from "../utils/inputparsing.ts";

const getMedianValue = (numbers: Array<number>) => {
  // There's an interesting parity problem here,
  // but it doesn't affect the final answer we need so it's fine
  return numbers.sort((a, b) => a - b)[Math.floor(numbers.length / 2)];
};

const solve = (inputPath: string) => {
  const inputNumbers = getInputStrings(inputPath)
    .filter((str) => str.length > 0)
    .map((str) => str.split(","))
    .flat()
    .map((str) => parseInt(str));
  const median = getMedianValue(inputNumbers);
  return inputNumbers
    .map((num) => Math.abs(median - num))
    .reduce((a, b) => a + b);
};

console.log(solve("day07/input.txt")); // 349769
