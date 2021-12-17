import { getInputStrings } from "../utils/inputparsing.ts";

type Edges = Set<[string, string]>;

export const buildEdges = (
  inputStrings: Array<string>,
  edges: Edges = new Set(),
): Set<[string, string]> => {
  if (inputStrings.length === 0) return edges;
  const [head, ...tail] = inputStrings;
  const edgePair = head.split("-").sort((a, b) => a.localeCompare(b)) as [
    string,
    string,
  ];
  return buildEdges(tail, edges.add(edgePair));
};

/**
 * A Path as represented by an ordered list of nodes
 *
 * A given node might appear more than once
 */
type Path = Array<string>;

export const findPaths = (
  edges: Edges,
  nodeValidator: (node: string, currentPath: Path) => boolean,
): Set<Path> => {
  const partialPaths: Array<Path> = [["start"]];
  const completedPaths: Set<Path> = new Set();
  while (partialPaths.length > 0) {
    const workingPath = partialPaths.pop();
    if (!workingPath) throw new Error("Popped an empty array!");
    const currentPosition = workingPath.at(-1);
    if (!currentPosition) throw new Error("Found empty working path");
    const adjacentEdges = [...edges.values()].filter((edge) =>
      edge.includes(currentPosition)
    );
    const adjacentNodes = adjacentEdges
      .map(([a, b]) =>
        // we want to grab the node on the edge that _isn't_ the current one
        a === currentPosition ? b : a
      )
      .filter((node) => nodeValidator(node, workingPath));
    const newPartialPaths = adjacentNodes
      .filter((node) => node !== "end")
      .map((node) => [...workingPath, node]);
    const newCompletedPaths = adjacentNodes
      .filter((node) => node === "end")
      .map((node) => [...workingPath, node]);
    newPartialPaths.forEach((newPath) => partialPaths.push(newPath));
    newCompletedPaths.forEach((newPath) => completedPaths.add(newPath));
  }
  return completedPaths;
};

const part1Validator = (node: string, currentPath: Path) => {
  // We can always visit a big cave
  if (node.toUpperCase() === node) return true;
  // We can only visit a small cave once
  return !currentPath.includes(node);
};

export const solvePart1 = (filePath: string) => {
  const inputStrings = getInputStrings(filePath).filter(
    (str) => str.length > 0,
  );
  const edges = buildEdges(inputStrings);
  const paths = findPaths(edges, part1Validator);
  return paths.size;
};

/**
 * Returns true if and only if this path has already visited a small cave twice
 */
const hasDoubleSmall = (path: Path): boolean => {
  const smallCaveVisits = path.filter((node) => node.toLowerCase() === node);
  return new Set(smallCaveVisits).size !== smallCaveVisits.length;
};

const part2Validator = (node: string, currentPath: Path) => {
  // We mustn't return to start
  if (node === "start") return false;
  // We can always visit a big cave
  if (node.toUpperCase() === node) return true;
  // We must not make another small double if there already is one
  if (hasDoubleSmall(currentPath)) return !currentPath.includes(node);
  // All other cases are permitted
  return true;
};

export const solvePart2 = (filePath: string) => {
  const inputStrings = getInputStrings(filePath).filter(
    (str) => str.length > 0,
  );
  const edges = buildEdges(inputStrings);
  const paths = findPaths(edges, part2Validator);
  return paths.size;
};
