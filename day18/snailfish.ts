import { getInputStrings } from "../utils/inputparsing.ts";

export const split = (tree: string): string => {
  const start = tree.search(/\d\d/g);
  // Nothing to split
  if (start === -1) return tree;

  const bigNumLength = tree.match(/\d\d+/g)![0].length;

  const bigNum = parseInt(tree.slice(start, start + bigNumLength));
  const leftVal = Math.floor(bigNum / 2);
  const rightVal = Math.ceil(bigNum / 2);
  const leftString = tree.slice(0, start);
  const rightString = tree.slice(start + bigNumLength);

  return `${leftString}[${leftVal},${rightVal}]${rightString}`;
};

/**
 * @returns depth at index of tree
 */
const depth = (tree: string, index: number): number => {
  const open = [...tree.slice(0, index)].filter((char) => char === "[").length;
  const close = [...tree.slice(0, index)].filter((char) => char === "]").length;
  return open - close;
};

/**
 * Adds the provided number to the last number in the string
 *
 * Returns the new string after addition
 *
 * If there is no number to add to in the string, it is returned as-is
 */
const addNumberToLast = (tree: string, num: number): string => {
  const numberRegex = /\d+/g;
  let match: RegExpExecArray | null = null;
  const matches: Array<number> = [];
  while ((match = numberRegex.exec(tree)) !== null) {
    matches.push(match.index);
  }

  // No numbers found
  if (matches.length === 0) return tree;

  const numberStart = matches[matches.length - 1];
  const numberLength = tree.slice(numberStart).search(/[\],]/g);
  const numberStr = tree.slice(numberStart, numberStart + numberLength);
  const oldVal = parseInt(numberStr);
  return `${tree.slice(0, numberStart)}${oldVal + num}${
    tree.slice(numberStart + numberLength)
  }`;
};

/**
 * Adds the provided number to the first number in the string
 *
 * Returns the new string after addition
 *
 * If there is no number to add to in the string, it is returned as-is
 */
const addNumberToFirst = (tree: string, num: number): string => {
  const numberStart = tree.search(/\d+/g);
  // No number found
  if (numberStart === -1) return tree;
  const numberLength = tree.slice(numberStart).search(/[\],]/g);
  const numberStr = tree.slice(numberStart, numberStart + numberLength);
  const oldVal = parseInt(numberStr);
  return `${tree.slice(0, numberStart)}${oldVal + num}${
    tree.slice(numberStart + numberLength)
  }`;
};

/**
 * Finds where an explode should start, or undefined if no explode is required
 */
const findExplodeStart = (tree: string): number | undefined => {
  const pairLocations: Array<number> = [];
  let match: RegExpExecArray | null = null;
  const pairRegex = /\[\d+,\d+\]/g;
  while ((match = pairRegex.exec(tree)) !== null) {
    pairLocations.push(match.index);
  }
  return pairLocations.find((index) => depth(tree, index) >= 4);
};

export const explode = (tree: string): string => {
  const explodeStart = findExplodeStart(tree);
  if (explodeStart === undefined) return tree;
  const explodeEnd = explodeStart + tree.slice(explodeStart).indexOf("]") + 1;

  const explodeString = tree.slice(explodeStart, explodeEnd);
  const comma = explodeString.indexOf(",");
  const leftNum = parseInt(explodeString.slice(1, comma));
  const rightNum = parseInt(explodeString.slice(comma + 1));

  const left = addNumberToLast(tree.slice(0, explodeStart), leftNum);
  const right = addNumberToFirst(tree.slice(explodeEnd), rightNum);

  return `${left}0${right}`;
};

export const reduce = (tree: string): string => {
  let previous = tree;
  let current = tree;
  while (true) {
    current = explode(current);
    if (current !== previous) {
      previous = current;
      continue;
    }
    current = split(current);
    if (current !== previous) {
      previous = current;
      continue;
    }
    return current;
  }
};

export const add = (a: string, b: string): string => {
  return reduce(`[${a},${b}]`);
};

export const addAll = (trees: Array<string>): string => {
  if (trees.length === 0) throw new Error("Can't sum empty list");
  return trees.reduce(add);
};

/**
 * Leaf node of a tree
 */
type Leaf = {
  value: number;
};

/**
 * A binary tree structure
 */
type Tree = {
  left: Tree | Leaf;
  right: Tree | Leaf;
};

/**
 * Given a preorder serialization returns the index of the 'middle' comma
 *
 * That is the point at which everything to the left is the left child
 * and everything to the right is the right child.
 */
const findMiddle = (input: string): number => {
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

const parse = (input: string): Tree | Leaf => {
  const value = parseInt(input);
  if (!Number.isNaN(value)) return { value };

  const middle = findMiddle(input);
  const leftString = input.slice(1, middle);
  const rightString = input.slice(middle + 1, input.length - 1);

  return {
    left: parse(leftString),
    right: parse(rightString),
  };
};

const isLeaf = (tree: Tree | Leaf): tree is Leaf =>
  (tree as Leaf).value !== undefined;

const magnitudeRecurse = (tree: Tree | Leaf): number => {
  if (isLeaf(tree)) return tree.value;
  return 3 * magnitudeRecurse(tree.left) + 2 * magnitudeRecurse(tree.right);
};

export const magnitude = (tree: string): number => {
  const treeStructure = parse(tree);
  return magnitudeRecurse(treeStructure);
};

export const solvePart1 = (filePath: string) =>
  magnitude(
    addAll(getInputStrings(filePath).filter((line) => line.length > 0)),
  );

export const solvePart2 = (filePath: string): number => {
  const inputs = getInputStrings(filePath).filter((line) => line.length > 0);

  return inputs.flatMap((leftArg) =>
    inputs.map((rightArg) => add(leftArg, rightArg))
  ).map(magnitude).reduce((acc, curr) => Math.max(acc, curr));
};
