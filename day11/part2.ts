import { getInputStrings } from "../utils/inputparsing.ts";
import { buildDumboMap, stepUntilAllFlashed } from "./dumbo.ts";

const initialMap = buildDumboMap(getInputStrings("day11/input.txt"));
const stepCount = stepUntilAllFlashed(initialMap);
console.log(stepCount); // 210
