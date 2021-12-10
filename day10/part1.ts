import { getInputStrings } from "../utils/inputparsing.ts";
import { getCorruption, getScore, Closer } from "./utils.ts";

const inputLines = getInputStrings("day10/input.txt").filter(
  (line) => line.length > 0
);
const corruptions = inputLines
  .map(getCorruption)
  // Filter out 'undefined' corruptions (i.e. valid lines)
  .filter((corruption): corruption is Closer => !!corruption);
const score = getScore(corruptions);
console.log(score); // 462693
