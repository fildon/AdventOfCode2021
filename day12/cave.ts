type Edges = Set<[string, string]>;

export const buildEdges = (
  inputStrings: Array<string>,
  edges: Edges = new Set()
): Set<[string, string]> => {
  if (inputStrings.length === 0) return edges;
  const [head, ...tail] = inputStrings;
  const edgePair = head.split("-").sort((a, b) => a.localeCompare(b)) as [
    string,
    string
  ];
  return buildEdges(tail, edges.add(edgePair));
};

/**
 * A Path as represented by an ordered list of nodes
 *
 * A given node might appear more than once
 */
type Path = Array<string>;

export const findPaths = (edges: Edges): Set<Path> => {
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
    newPartialPaths.forEach((newPath) => partialPaths.push(newPath));
    newCompletedPaths.forEach((newPath) => completedPaths.add(newPath));
  }
  return completedPaths;
};
