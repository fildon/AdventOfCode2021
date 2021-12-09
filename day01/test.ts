import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";

import { solve } from "./part1.ts";

Deno.test("day01/part1 - solved", () => {
  assertEquals(solve(), 1301);
});
