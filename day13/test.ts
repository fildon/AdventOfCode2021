import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parseInput, foldPoints, solvePart1 } from "./origami.ts";

Deno.test("parses input", () => {
  assertEquals(
    parseInput([
      "6,10",
      "0,14",
      "9,10",
      "0,3",
      "10,4",
      "4,11",
      "6,0",
      "6,12",
      "4,1",
      "0,13",
      "10,12",
      "3,4",
      "3,0",
      "8,4",
      "1,10",
      "2,14",
      "8,10",
      "9,0",
      "",
      "fold along y=7",
      "fold along x=5",
      "",
    ]),
    {
      points: [
        [6, 10],
        [0, 14],
        [9, 10],
        [0, 3],
        [10, 4],
        [4, 11],
        [6, 0],
        [6, 12],
        [4, 1],
        [0, 13],
        [10, 12],
        [3, 4],
        [3, 0],
        [8, 4],
        [1, 10],
        [2, 14],
        [8, 10],
        [9, 0],
      ],
      folds: [
        {
          type: "y",
          value: 7,
        },
        { type: "x", value: 5 },
      ],
    }
  );
});

Deno.test("folds points", () => {
  assertEquals(
    foldPoints(
      [
        [1, 1],
        [2, 7],
        [2, 6],
        [6, 6],
        [7, 3],
      ],
      { type: "x", value: 4 }
    ),
    [
      [1, 1],
      [2, 7],
      [2, 6],
      [1, 3],
    ]
  );
  assertEquals(
    foldPoints(
      [
        [1, 1],
        [2, 7],
        [6, 6],
        [9, 3],
      ],
      { type: "y", value: 5 }
    ),
    [
      [1, 1],
      [2, 3],
      [6, 4],
      [9, 3],
    ]
  );
});

Deno.test("solves part 1", () => {
  assertEquals(solvePart1("day13/testinput.txt"), 17);
  assertEquals(solvePart1("day13/input.txt"), 745);
});
