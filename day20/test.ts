import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { buildLookup, parseInput } from "./trench.ts";

Deno.test("day20/parses input", () => {
  const { imageEnhancement, image } = parseInput("day20/testinput.txt");
  assertEquals(imageEnhancement.slice(0, 30), "..#.#..#####.#.#.#.###.##.....");
  assertEquals(image[2], "##..#");
});

Deno.test("day20/builds rule lookup", () => {
  const lookup = buildLookup(
    "..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##"
  );
  assertEquals(lookup.get(33), ".");
  assertEquals(lookup.get(34), "#");
});
