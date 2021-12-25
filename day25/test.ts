import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { equals } from "./cucumber.ts";

Deno.test("day25/equals", () => {
  assertEquals(equals([], []), true);
  assertEquals(equals([], ["a"]), false);
  assertEquals(equals(["a"], ["b"]), false);
  assertEquals(equals(["b"], ["b"]), true);
});
