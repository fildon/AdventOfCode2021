import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parseInput } from "./trench.ts";

Deno.test("day20/parses input", () => {
  const { imageEnhancement, image } = parseInput("day20/testinput.txt");
  assertEquals(imageEnhancement.slice(0, 30), "..#.#..#####.#.#.#.###.##.....");
  assertEquals(image[2], "##..#");
});
