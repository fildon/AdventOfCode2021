import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";

import {
  getCorruption,
  getScore,
  getIncompleteLines,
  getCompletionSequence,
} from "./utils.ts";

Deno.test("day10/part1 - getCorruption identifies illegal character", () => {
  assertEquals(getCorruption("{([(<{}[<>[]}>{[]{[(<()>"), "}");
});

Deno.test(
  "day10/part1 - getCorruption returns undefined for valid input",
  () => {
    assertEquals(getCorruption("[({(<(())[]>[[{[]{<()<>>"), undefined);
  }
);

Deno.test("day10/part1 - getScore", () => {
  assertEquals(getScore([]), 0);
  assertEquals(getScore(["}", ")", "]", ")", ">"]), 26397);
});

Deno.test("day10/part2 - getIncompleteLines", () => {
  assertEquals(
    getIncompleteLines([
      "[({(<(())[]>[[{[]{<()<>>",
      "[(()[<>])]({[<{<<[]>>(",
      "{([(<{}[<>[]}>{[]{[(<()>",
      "(((({<>}<{<{<>}{[]{[]{}",
      "[[<[([]))<([[{}[[()]]]",
      "[{[{({}]{}}([{[{{{}}([]",
      "{<[[]]>}<{[{[{[]{()[[[]",
      "[<(<(<(<{}))><([]([]()",
      "<{([([[(<>()){}]>(<<{{",
      "<{([{{}}[<[[[<>{}]]]>[]]",
    ]),
    [
      "[({(<(())[]>[[{[]{<()<>>",
      "[(()[<>])]({[<{<<[]>>(",
      "(((({<>}<{<{<>}{[]{[]{}",
      "{<[[]]>}<{[{[{[]{()[[[]",
      "<{([{{}}[<[[[<>{}]]]>[]]",
    ]
  );
});

Deno.test("day10/part2 - getCompletionString", () => {
  assertEquals(getCompletionSequence("[({(<(())[]>[[{[]{<()<>>"), [
    "}",
    "}",
    "]",
    "]",
    ")",
    "}",
    ")",
    "]",
  ]);
  assertEquals(getCompletionSequence("[(()[<>])]({[<{<<[]>>("), [
    ")",
    "}",
    ">",
    "]",
    "}",
    ")",
  ]);
  assertEquals(getCompletionSequence("(((({<>}<{<{<>}{[]{[]{}"), [
    "}",
    "}",
    ">",
    "}",
    ">",
    ")",
    ")",
    ")",
    ")",
  ]);
  assertEquals(getCompletionSequence("{<[[]]>}<{[{[{[]{()[[[]"), [
    "]",
    "]",
    "}",
    "}",
    "]",
    "}",
    "]",
    "}",
    ">",
  ]);
  assertEquals(getCompletionSequence("<{([{{}}[<[[[<>{}]]]>[]]"), [
    "]",
    ")",
    "}",
    ">",
  ]);
});
