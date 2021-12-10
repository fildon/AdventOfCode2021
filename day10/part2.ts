import { getInputStrings } from "../utils/inputparsing.ts";
import {
  parseInputLine,
  part2GetScoreOfLine,
  ValidResult,
  getMedianValue,
} from "./bracketParsing.ts";

const inputLines = getInputStrings("day10/input.txt").filter(
  (line) => line.length > 0
);
const completionSequences = inputLines
  .map(parseInputLine)
  .filter((parseResult): parseResult is ValidResult => parseResult.valid)
  .map(({ completionSequence }) => completionSequence);
const lineScores = completionSequences.map(part2GetScoreOfLine);
const medianScore = getMedianValue(lineScores);
console.log(medianScore); // 3094671161
