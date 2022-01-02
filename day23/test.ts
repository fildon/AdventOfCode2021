import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  Burrows,
  equals,
  getAmphipodLocations,
  getMovesForLocation,
  parseInput,
  solvePart1,
} from "./amphipod.ts";

Deno.test("day23/parse input", () => {
  const parsedState = parseInput([
    "#############",
    "#...........#",
    "###C#B#A#D###",
    "  #B#C#D#A#",
    "  #########",
    "",
  ]);
  const expectedState: Burrows = [
    "#...........#",
    "###C#B#A#D###",
    "  #B#C#D#A#",
  ];
  assertEquals(equals(parsedState)(expectedState), true);
});

Deno.test("day23/get amphipod locations", () => {
  assertEquals(getAmphipodLocations([]), []);
  assertEquals(getAmphipodLocations(["A"]), [[0, 0]]);
  assertEquals(getAmphipodLocations([".A", "..", "B."]), [[0, 1], [2, 0]]);
  assertEquals(
    getAmphipodLocations(["#...........#", "###B#C#B#D###", "  #A#D#C#A#"]),
    [
      [1, 3],
      [1, 5],
      [1, 7],
      [1, 9],
      [2, 3],
      [2, 5],
      [2, 7],
      [2, 9],
    ],
  );
});

Deno.test("day23/get moves for location", () => {
  // Basic case
  assertEquals(
    getMovesForLocation([
      "#...B.......#",
      "###C#.#A#D###",
      "  #B#C#D#A#",
    ])([1, 3]),
    [
      {
        state: [
          "#.C.B.......#",
          "###.#.#A#D###",
          "  #B#C#D#A#",
        ],
        cost: 200,
      },
      {
        state: [
          "#C..B.......#",
          "###.#.#A#D###",
          "  #B#C#D#A#",
        ],
        cost: 300,
      },
    ],
  );
  // Forbid hallway-to-hallway moves case
  assertEquals(
    getMovesForLocation([
      "#C..........#",
      "###B#A#.#D###",
      "  #B#D#C#A#",
    ])([0, 1]),
    [
      {
        state: [
          "#...........#",
          "###B#A#C#D###",
          "  #B#D#C#A#",
        ],
        cost: 700,
      },
    ],
  );
  // Forbid moving out of happy position case
  assertEquals(
    getMovesForLocation([
      "#C..........#",
      "###A#.#B#D###",
      "  #A#C#D#B#",
    ])([1, 3]),
    [],
  );
  // Forbid entering wrong destination
  assertEquals(
    getMovesForLocation([
      "#C..........#",
      "###B#.#A#D###",
      "  #B#D#C#A#",
    ])([0, 1]),
    [],
  );
  // Forbid entering destination with unhappy flatmate
  assertEquals(
    getMovesForLocation([
      "#C..........#",
      "###B#A#.#D###",
      "  #B#C#D#A#",
    ])([0, 1]),
    [],
  );
  // Bug regression
  assertEquals(
    getMovesForLocation([
      "#DB.C.....B.#",
      "###.#C#.#.###",
      "  #A#D#.#A#",
    ])([2, 3]),
    [],
  );
});

Deno.test({
  name: "day23/solves part 1 SLOW",
  ignore: true, // takes 30 minutes
  fn: () => {
    assertEquals(solvePart1("day23/testinput.txt"), 12521);
    assertEquals(solvePart1("day23/input.txt"), 11320);
  },
});
