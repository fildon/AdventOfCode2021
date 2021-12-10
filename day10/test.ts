import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";

import { getCorruption, getScore } from "./utils.ts";

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
