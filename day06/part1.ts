import { getInputStrings } from "../utils/inputparsing.ts";

const stepOneDay = (fishAges: Array<number>) =>
  fishAges.flatMap((age) => (age > 0 ? age - 1 : [6, 8]));

const stepNDays = (fishAges: Array<number>, days: number): Array<number> => {
  if (days <= 0) return fishAges;
  return stepNDays(stepOneDay(fishAges), days - 1);
};

const parseInput = (filePath: string) =>
  getInputStrings(filePath)
    .filter((line) => line.length > 0)
    .map((line) => line.split(","))
    .flat()
    .map((str) => parseInt(str));

console.log(stepNDays(parseInput("day06/input.txt"), 80).length); // 360268
