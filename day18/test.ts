import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  add,
  addAll,
  explode,
  magnitude,
  reduce,
  solvePart1,
  split,
} from "./snailfish.ts";

Deno.test("day18/split", () => {
  assertEquals(
    split("[10,[1,1]]"),
    "[[5,5],[1,1]]",
  );

  assertEquals(
    split("[[1,1],101]"),
    "[[1,1],[50,51]]",
  );

  assertEquals(split("[1,2]"), "[1,2]");
});

Deno.test({
  name: "day18/explode",
  ignore: false,
  fn: () => {
    assertEquals(
      explode("[[[[[9,8],1],2],3],4]"),
      "[[[[0,9],2],3],4]",
    );

    assertEquals(
      explode("[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]"),
      "[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]",
    );

    assertEquals(
      explode("[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]"),
      "[[3,[2,[8,0]]],[9,[5,[7,0]]]]",
    );

    assertEquals(
      explode("[[[[9,8],1],2],3]"),
      "[[[[9,8],1],2],3]",
    );
  },
});

Deno.test({
  name: "day18/reduce",
  ignore: false,
  fn: () => {
    assertEquals(
      reduce("[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]"),
      "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]",
    );
  },
});

Deno.test({
  name: "day18/add two trees",
  ignore: false,
  fn: () => {
    assertEquals(
      add(
        "[[[[4,3],4],4],[7,[[8,4],9]]]",
        "[1,1]",
      ),
      "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]",
    );
    assertEquals(
      add(
        "[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]",
        "[7,[5,[[3,8],[1,4]]]]",
      ),
      "[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]",
    );
  },
});

Deno.test({
  name: "day18/add all",
  ignore: false,
  fn: () => {
    assertEquals(
      addAll([
        "[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]",
        "[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]",
        "[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]",
        "[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]",
        "[7,[5,[[3,8],[1,4]]]]",
        "[[2,[2,2]],[8,[8,1]]]",
        "[2,9]",
        "[1,[[[9,3],9],[[9,0],[0,7]]]]",
        "[[[5,[7,4]],7],1]",
        "[[[[4,2],2],6],[8,7]]",
      ]),
      "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]",
    );
  },
});

Deno.test({
  name: "day18/get magnitude",
  ignore: false,
  fn: () => {
    assertEquals(magnitude("[9,1]"), 29);
    assertEquals(magnitude("[[9,1],[1,9]]"), 129);
    assertEquals(
      magnitude(
        "[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]",
      ),
      4140,
    );
  },
});

Deno.test({
  name: "day18/solves part 1",
  ignore: false,
  fn: () => {
    assertEquals(solvePart1("day18/testinput.txt"), 4140);
    assertEquals(solvePart1("day18/input.txt"), 4072);
  },
});
