import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { hCost, parseInput, solvePart1, solvePart2 } from "./chiton.ts";

const exampleRiskMap = [
  [1, 1, 6, 3, 7, 5, 1, 7, 4, 2],
  [1, 3, 8, 1, 3, 7, 3, 6, 7, 2],
  [2, 1, 3, 6, 5, 1, 1, 3, 2, 8],
  [3, 6, 9, 4, 9, 3, 1, 5, 6, 9],
  [7, 4, 6, 3, 4, 1, 7, 1, 1, 1],
  [1, 3, 1, 9, 1, 2, 8, 1, 3, 7],
  [1, 3, 5, 9, 9, 1, 2, 4, 2, 1],
  [3, 1, 2, 5, 4, 2, 1, 6, 3, 9],
  [1, 2, 9, 3, 1, 3, 8, 5, 2, 1],
  [2, 3, 1, 1, 9, 4, 4, 5, 8, 1],
];

Deno.test("day15/parses risk map", () => {
  assertEquals(
    parseInput([
      "1163751742",
      "1381373672",
      "2136511328",
      "3694931569",
      "7463417111",
      "1319128137",
      "1359912421",
      "3125421639",
      "1293138521",
      "2311944581",
    ]),
    exampleRiskMap,
  );
});

Deno.test("day15/computes heuristic cost", () => {
  assertEquals(hCost([8, 8], [9, 9]), 2);
  assertEquals(hCost([1, 6], [9, 9]), 11);
  assertEquals(hCost([5, 2], [9, 9]), 11);
});

Deno.test("day15/solves part 1", () => {
  assertEquals(solvePart1("day15/testinput.txt"), 40);
  assertEquals(solvePart1("day15/input.txt"), 702);
});

Deno.test("day15/solves part 2 test input", () => {
  assertEquals(solvePart2("day15/testinput.txt"), 315);
});

Deno.test({
  name: "day15/solves part 2 SLOW",
  ignore: true, // This test does pass... but takes 10 seconds to run
  fn: () => {
    assertEquals(solvePart2("day15/input.txt"), 2955);
  },
});
