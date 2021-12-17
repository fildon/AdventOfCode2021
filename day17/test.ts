import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parseInput } from "./trickShot.ts";

Deno.test("day17/parses input", () => {
  assertEquals(parseInput("day17/testinput.txt"), {
    xMin: 20,
    xMax: 30,
    yMin: -10,
    yMax: -5,
  });
  assertEquals(parseInput("day17/input.txt"), {
    xMin: 248,
    xMax: 285,
    yMin: -85,
    yMax: -56,
  });
});
