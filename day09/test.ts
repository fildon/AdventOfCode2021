import { buildMapFromStrings, solve } from "./part1.ts";

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
  assertEquals(solve(), 528);
});
