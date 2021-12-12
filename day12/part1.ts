import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { getInputStrings } from "../utils/inputparsing.ts";

type Graph = {
  nodes: Set<string>;
  edges: Set<[string, string]>;
};

Deno.test("day12/part1/buildNodes", () => {
  assertEquals(buildNodes(["a-b", "c-d"]), new Set(["a", "b", "c", "d"]));
});
const buildNodes = (
  inputStrings: Array<string>,
  nodes: Set<string> = new Set()
): Set<string> => {
  if (inputStrings.length === 0) return nodes;
  const [head, ...tail] = inputStrings;
  const [first, second] = head.split("-");
  return buildNodes(tail, nodes.add(first).add(second));
};

Deno.test("day12/part1/buildEdges", () => {
  // Basic case
  assertEquals(
    buildEdges(["a-b", "c-d"]),
    new Set([
      ["a", "b"],
      ["c", "d"],
    ])
  );
  // Same as above but one edge reversed
  // To test that 'direction' of an edge doesn't matter
  assertEquals(
    buildEdges(["b-a", "c-d"]),
    new Set([
      ["a", "b"],
      ["c", "d"],
    ])
  );
});
const buildEdges = (
  inputStrings: Array<string>,
  edges: Set<[string, string]> = new Set()
): Set<[string, string]> => {
  if (inputStrings.length === 0) return edges;
  const [head, ...tail] = inputStrings;
  const edgePair = head.split("-").sort((a, b) => a.localeCompare(b)) as [
    string,
    string
  ];
  return buildEdges(tail, edges.add(edgePair));
};

Deno.test("day12/part1/buildGraph", () => {
  // Taken straight from the puzzle description example
  assertEquals(
    buildGraph(["start-A", "start-b", "A-c", "A-b", "b-d", "A-end", "b-end"]),
    {
      nodes: new Set(["start", "A", "b", "c", "d", "end"]),
      edges: new Set([
        ["A", "b"],
        ["A", "c"],
        ["A", "end"],
        ["A", "start"],
        ["b", "d"],
        ["b", "end"],
        ["b", "start"],
      ]),
    }
  );
});
const buildGraph = (inputStrings: Array<string>): Graph => {
  return {
    nodes: buildNodes(inputStrings),
    edges: buildEdges(inputStrings),
  };
};

/**
 * A Path as represented by an ordered list of nodes
 *
 * A given node might appear more than once
 */
type Path = Array<string>;

Deno.test("day12/part1/findPaths", () => {
  // Taken straight from the examples
  assertEquals(
    findPaths({
      nodes: new Set(["start", "A", "b", "c", "d", "end"]),
      edges: new Set([
        ["A", "b"],
        ["A", "c"],
        ["A", "end"],
        ["A", "start"],
        ["b", "d"],
        ["b", "end"],
        ["b", "start"],
      ]),
    }),
    new Set([
      ["start", "A", "b", "A", "c", "A", "end"],
      ["start", "A", "b", "A", "end"],
      ["start", "A", "b", "end"],
      ["start", "A", "c", "A", "b", "A", "end"],
      ["start", "A", "c", "A", "b", "end"],
      ["start", "A", "c", "A", "end"],
      ["start", "A", "end"],
      ["start", "b", "A", "c", "A", "end"],
      ["start", "b", "A", "end"],
      ["start", "b", "end"],
    ])
  );
});
const findPaths = (
  graph: Graph,
  partialPaths: Array<Path> = [["start"]],
  completePaths: Set<Path> = new Set()
): Set<Path> => {
  if (partialPaths.length === 0) return completePaths;
  const { edges } = graph;
  const [workingPath, ...otherPaths] = partialPaths;
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
    .filter(
      // We only keep nodes that are BIG or have not already appeared in this path
      // i.e. a 'small' node can only appear at most once
      (node) => node.toUpperCase() === node || !workingPath.includes(node)
    );
  const newPartialPaths = adjacentNodes
    .filter((node) => node !== "end")
    .map((node) => [...workingPath, node]);
  const newCompletedPaths = adjacentNodes
    .filter((node) => node === "end")
    .map((node) => [...workingPath, node]);
  return findPaths(
    graph,
    otherPaths.concat(newPartialPaths),
    new Set([...completePaths, ...newCompletedPaths])
  );
};

Deno.test("day12/part1/solve", () => {
  assertEquals(solve("day12/testinput1.txt"), 10);
  assertEquals(solve("day12/testinput2.txt"), 19);
  assertEquals(solve("day12/testinput3.txt"), 226);
  // assertEquals(solve("day12/input.txt"), 0);
});
const solve = (filePath: string): number => {
  const inputStrings = getInputStrings(filePath).filter(
    (str) => str.length > 0
  );
  const graph = buildGraph(inputStrings);
  const paths = findPaths(graph);
  return paths.size;
};
