import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { buildEdges, findPaths } from "./cave.ts";
import { solve as solvePart1 } from "./part1.ts";

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

Deno.test("day12/part1/findPaths", () => {
  // Taken straight from the examples
  assertEquals(
    findPaths(
      new Set([
        ["A", "b"],
        ["A", "c"],
        ["A", "end"],
        ["A", "start"],
        ["b", "d"],
        ["b", "end"],
        ["b", "start"],
      ])
    ),
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

Deno.test("day12/part1/solvePart1", () => {
  assertEquals(solvePart1("day12/testinput1.txt"), 10);
  assertEquals(solvePart1("day12/testinput2.txt"), 19);
  assertEquals(solvePart1("day12/testinput3.txt"), 226);
  assertEquals(solvePart1("day12/input.txt"), 3679);
});
