/**
 * Leaf node of a tree
 */
type Leaf = {
  value: number;
};

/**
 * A binary tree structure
 */
export type Tree = {
  left: Tree | Leaf;
  right: Tree | Leaf;
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

export const parseToTree = (input: string): Tree | Leaf => {
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

const isLeaf = (tree: Tree | Leaf): tree is Leaf =>
  (tree as Leaf).value !== undefined;

/**
 * Render this tree in preorder traversal
 */
export const toString = (tree: Tree | Leaf): string => {
  if (isLeaf(tree)) return tree.value.toString();
  return `[${toString(tree.left)},${toString(tree.right)}]`;
};

export const getHeight = (tree: Tree | Leaf): number => {
  if (isLeaf(tree)) return 0;
  return 1 + Math.max(getHeight(tree.left), getHeight(tree.right));
};

const getTreeNodesInPreorder = (tree: Tree | Leaf): Array<Tree> =>
  isLeaf(tree) ? [] : [
    tree,
    ...getTreeNodesInPreorder(tree.left),
    ...getTreeNodesInPreorder(tree.right),
  ];

const splitLeaf = ({ value }: Leaf): Tree => (
  {
    left: { value: Math.floor(value / 2) },
    right: { value: Math.ceil(value / 2) },
  }
);

/**
 * Attempts to perform exactly one split on this tree
 *
 * Mutates the tree in place
 *
 * @returns true if a split was performed
 */
export const split = (tree: Tree): boolean => {
  const preorderNodes = getTreeNodesInPreorder(tree);
  for (const node of preorderNodes) {
    if (isLeaf(node.left) && node.left.value >= 10) {
      node.left = splitLeaf(node.left);
      return true;
    }
    if (isLeaf(node.right) && node.right.value >= 10) {
      node.right = splitLeaf(node.right);
      return true;
    }
  }
  return false;
};
