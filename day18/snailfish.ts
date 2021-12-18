/**
 * Leaf node of a tree
 */
type Leaf = {
  value: number;
};

/**
 * A binary tree structure
 */
type Pair = {
  left: Pair | Leaf;
  right: Pair | Leaf;
};

/**
 * Given a preorder serialization returns the index of the 'middle' comma
 *
 * That is the point at which everything to the left is the left child
 * and everything to the right is the right child.
 */
export const findMiddle = (input: string): number => {
  let index = 0;
  while (index !== -1) {
    index = input.indexOf(",", index + 1);
    const left = [...input.slice(0, index)];
    const leftOpen = left.filter((char) => char === "[").length;
    const leftClose = left.filter((char) => char === "]").length;
    const depth = leftOpen - leftClose;
    if (depth === 1) {
      return index;
    }
  }
  throw new Error("No middle found!");
};

export const parseToTree = (input: string): Pair | Leaf => {
  const value = parseInt(input);
  if (!Number.isNaN(value)) return { value };

  const middle = findMiddle(input);
  const leftString = input.slice(1, middle);
  const rightString = input.slice(middle + 1, input.length - 1);

  return {
    left: parseToTree(leftString),
    right: parseToTree(rightString),
  };
};

// TODO preorder traversal (needed for explosions)
// TODO update a numeric value in place (needed for explosions)
