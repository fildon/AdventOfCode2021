import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { foo } from "./trench.ts";

Deno.test("foo test", () => {
  assertEquals(foo(), 1);
});
