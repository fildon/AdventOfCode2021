import { getInputStrings } from "../utils/inputparsing.ts";
import { buildEdges, findPaths } from "./cave.ts";

export const solve = (filePath: string): number => {
  const inputStrings = getInputStrings(filePath).filter(
    (str) => str.length > 0
  );
  const edges = buildEdges(inputStrings);
  const paths = findPaths(edges);
  return paths.size;
};
