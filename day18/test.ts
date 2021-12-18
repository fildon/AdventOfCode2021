import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  findMiddle,
  getHeight,
  parseToTree,
  split,
  toString,
  Tree,
} from "./snailfish.ts";

Deno.test("day18/finds middle comma", () => {
  assertEquals(findMiddle("[1,2]"), 2);
  assertEquals(findMiddle("[[1,2],3]"), 6);
  assertEquals(findMiddle("[9,[8,7]]"), 2);
  assertEquals(findMiddle("[[1,9],[8,5]]"), 6);
});

Deno.test("day18/parse from string", () => {
  assertEquals(parseToTree("[1,2]"), {
    left: {
      value: 1,
    },
    right: {
      value: 2,
    },
  });
  assertEquals(parseToTree("[[1,9],[8,5]]"), {
    left: {
      left: {
        value: 1,
      },
      right: { value: 9 },
    },
    right: {
      left: { value: 8 },
      right: { value: 5 },
    },
  });
});

Deno.test("day18/tree to string", () => {
  assertEquals(toString(parseToTree("[1,2]")), "[1,2]");
  assertEquals(
    toString(
      parseToTree(
        "[[[[1,3],[5,3]],[[1,3],[8,7]]],[[[4,9],[6,9]],[[8,2],[7,3]]]]",
      ),
    ),
    "[[[[1,3],[5,3]],[[1,3],[8,7]]],[[[4,9],[6,9]],[[8,2],[7,3]]]]",
  );
});

Deno.test("day18/get depth", () => {
  assertEquals(getHeight(parseToTree("0")), 0);
  assertEquals(getHeight(parseToTree("[[[[[9,8],1],2],3],4]")), 5);
});

Deno.test("day18/split", () => {
  let tree = parseToTree("[10,[1,1]]") as Tree;
  let wasSplit = split(tree); // mutates the tree in place
  assert(wasSplit);
  assertEquals(
    tree,
    parseToTree("[[5,5],[1,1]]"),
  );

  tree = parseToTree("[1,2]") as Tree;
  wasSplit = split(tree);
  assert(!wasSplit);
});
