import { getInputStrings } from "../utils/inputparsing.ts";
import { buildDumboMap, stepN } from "./dumbo.ts";

const initialMap = buildDumboMap(getInputStrings("day11/input.txt"));
const allFlashes = stepN(initialMap, 100);
console.log(allFlashes); // 1634
