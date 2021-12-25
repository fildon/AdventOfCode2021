import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { equals, solvePart1, step, stepsToStop } from "./cucumber.ts";

Deno.test("day25/equals", () => {
  assertEquals(equals([], []), true);
  assertEquals(equals([], ["a"]), false);
  assertEquals(equals(["a"], ["b"]), false);
  assertEquals(equals(["b"], ["b"]), true);
});

Deno.test("day25/step", () => {
  assertEquals(step([]), []);
  assertEquals(step(["."]), ["."]);
  assertEquals(step([">."]), [".>"]);
  assertEquals(step([".>>."]), [".>.>"]);
  assertEquals(step([".>>.", "...>"]), [".>.>", ">..."]);
  assertEquals(step(["v", "."]), [".", "v"]);
  assertEquals(
    step([
      "..........",
      ".>v....v..",
      ".......>..",
      "..........",
    ]),
    [
      "..........",
      ".>........",
      "..v....v>.",
      "..........",
    ],
  );
  assertEquals(
    step([
      "v...>>.vv>",
      ".vv>>.vv..",
      ">>.>v>...v",
      ">>v>>.>.v.",
      "v>v.vv.v..",
      ">.>>..v...",
      ".vv..>.>v.",
      "v.v..>>v.v",
      "....v..v.>",
    ]),
    [
      "....>.>v.>",
      "v.v>.>v.v.",
      ">v>>..>v..",
      ">>v>v>.>.v",
      ".>v.v...v.",
      "v>>.>vvv..",
      "..v...>>..",
      "vv...>>vv.",
      ">.v.v..v.v",
    ],
  );
});

Deno.test("day25/steps to stop", () => {
  assertEquals(stepsToStop([]), 1);
  assertEquals(
    stepsToStop([
      ">.v",
    ]),
    2,
  );
});

Deno.test("day25/solves part 1", () => {
  assertEquals(solvePart1("day25/testinput.txt"), 58);
  assertEquals(solvePart1("day25/input.txt"), 557);
});
