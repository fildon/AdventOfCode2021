import { getInputStrings } from "../utils/inputparsing.ts";
import {
  parseInputLine,
  part1GetScore,
  InvalidResult,
} from "./bracketParsing.ts";

const inputLines = getInputStrings("day10/input.txt").filter(
  (line) => line.length > 0
);
const corruptions = inputLines
  .map(parseInputLine)
  .filter((parseResult): parseResult is InvalidResult => !parseResult.valid)
  .map(({ illegalSymbol }) => illegalSymbol);
const score = part1GetScore(corruptions);
console.log(score); // 462693
