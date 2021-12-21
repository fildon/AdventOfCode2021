import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { neighboursOf, parseInput, solvePart1, solvePart2 } from "./trench.ts";

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

Deno.test({
  name: "day20/solves part 1",
  ignore: false,
  fn: () => {
    assertEquals(solvePart1("day20/testinput.txt"), 35);
    assertEquals(solvePart1("day20/input.txt"), 5622);
  },
});

Deno.test({
  name: "day20/solves part 2",
  ignore: false,
  fn: () => {
    assertEquals(solvePart2("day20/testinput.txt"), 3351);
    assertEquals(solvePart2("day20/input.txt"), 20395);
  },
});
