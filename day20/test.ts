import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parseInput, solvePart1, neighboursOf, getKeyAt } from "./trench.ts";

Deno.test("day20/parses input", () => {
  const { imageEnhancement, image } = parseInput("day20/testinput.txt");
  assertEquals(imageEnhancement.slice(0, 30), "..#.#..#####.#.#.#.###.##.....");
  assertEquals(image[2], "##..#");
});

Deno.test("day20/neighbours", () => {
  assertEquals(neighboursOf([2, 5]), [
    [1, 4],
    [2, 4],
    [3, 4],
    [1, 5],
    [2, 5],
    [3, 5],
    [1, 6],
    [2, 6],
    [3, 6],
  ]);
});

Deno.test("day20/getKeyAt", () => {
  const image = ["#..#.", "#....", "##..#", "..#..", "..###"];
  const key = getKeyAt(image, [2, 2]);
  assertEquals(key, 34);
});

Deno.test({
  name: "day20/solves part 1",
  ignore: true,
  fn: () => {
    assertEquals(solvePart1("day20/testinput.txt"), 35);
    // TODO
    // assertEquals(solvePart1("day20/input.txt"), -1);
  },
});
