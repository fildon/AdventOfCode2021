import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { getRotations } from "./beacon.ts";

Deno.test("day19/get rotations", () => {
  assertEquals(getRotations([1, 2, 3]), [
    // x = 1
    [1, 2, 3],
    [1, -3, 2],
    [1, -2, -3],
    [1, 3, -2],

    // y = 1
    [3, 1, 2],
    [-2, 1, 3],
    [-3, 1, -2],
    [2, 1, -3],

    // z = 1
    [2, 3, 1],
    [-3, 2, 1],
    [-2, -3, 1],
    [3, -2, 1],

    // x = -1
    [-1, -3, -2],
    [-1, 2, -3],
    [-1, 3, 2],
    [-1, -2, 3],

    // y = -1
    [-2, -1, -3],
    [3, -1, -2],
    [2, -1, 3],
    [-3, -1, 2],

    // z = -1
    [-3, -2, -1],
    [2, -3, -1],
    [3, 2, -1],
    [-2, 3, -1],
  ]);
});
