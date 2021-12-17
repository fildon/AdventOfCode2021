import {
  buildMapFromStrings,
  getBasinSize,
  getProductOfThreeLargestBasins,
  getRiskOfLowPoints,
} from "./basin.ts";

import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";

Deno.test("day09/part1 - builds map from strings", () => {
  const map = buildMapFromStrings(["123", "456", "789"]);

  assertEquals(map, [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
});

Deno.test("day09/part1 - solved", () => {
  assertEquals(getRiskOfLowPoints(), 528);
});

Deno.test("day09/part2 - getBasinSize", () => {
  assertEquals(
    getBasinSize(
      [
        [2, 1, 9, 9, 9, 4, 3, 2, 1, 0],
        [3, 9, 8, 7, 8, 9, 4, 9, 2, 1],
        [9, 8, 5, 6, 7, 8, 9, 8, 9, 2],
        [8, 7, 6, 7, 8, 9, 6, 7, 8, 9],
        [9, 8, 9, 9, 9, 6, 5, 6, 7, 8],
      ],
      [0, 9],
    ),
    9,
  );
});

Deno.test("day09/part2 - solved", () => {
  assertEquals(getProductOfThreeLargestBasins(), 920448);
});
