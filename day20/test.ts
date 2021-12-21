import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  parseInput,
  solvePart1,
  neighboursOf,
  getKeyAt,
  enhance,
} from "./trench.ts";

const testrules =
  "..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#";
const testimage = ["#..#.", "#....", "##..#", "..#..", "..###"];

Deno.test("day20/parses input", () => {
  const { enhancementRules, image } = parseInput("day20/testinput.txt");
  assertEquals(enhancementRules, testrules);
  assertEquals(image, testimage);
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
  const key = getKeyAt(testimage, [2, 2]);
  assertEquals(key, 34);
});

Deno.test("day20/enhance image once", () => {
  const enhancedImage = enhance(testimage, testrules);
  assertEquals(enhancedImage, [
    ".##.##.",
    "#..#.#.",
    "##.#..#",
    "####..#",
    ".#..##.",
    "..##..#",
    "...#.#.",
  ]);
});

Deno.test({
  name: "day20/solves part 1",
  ignore: false,
  fn: () => {
    assertEquals(solvePart1("day20/testinput.txt"), 35);
    // 5551 was too low
    // assertEquals(solvePart1("day20/input.txt"), -1);
  },
});
