import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { solvePart1 } from "./amphipod.ts";

Deno.test({
  name: "day23/solves part 1",
  ignore: true,
  fn: () => {
    assertEquals(solvePart1("day23/testinput.txt"), 12521);
    // TODO
    // assertEquals(solvePart1("day23/input.txt"), -1);
  },
});
