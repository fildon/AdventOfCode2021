import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  buildDumboMap,
  updateDumboAt,
  flashWaveOnce,
  getNeighbours,
} from "./dumbo.ts";

Deno.test("Builds dumbo map from input", () => {
  assertEquals(buildDumboMap(["12", "34"]), [
    [
      { energy: 1, flashed: false, row: 0, col: 0 },
      { energy: 2, flashed: false, row: 0, col: 1 },
    ],
    [
      { energy: 3, flashed: false, row: 1, col: 0 },
      { energy: 4, flashed: false, row: 1, col: 1 },
    ],
  ]);
});

Deno.test("Can update a dumbo in a map", () => {
  assertEquals(
    updateDumboAt(
      [
        [
          { energy: 1, flashed: false, row: 0, col: 0 },
          { energy: 2, flashed: false, row: 0, col: 1 },
        ],
        [
          { energy: 3, flashed: false, row: 1, col: 0 },
          { energy: 4, flashed: false, row: 1, col: 1 },
        ],
      ],
      { energy: 5, flashed: true, row: 0, col: 0 }
    ),
    [
      [
        { energy: 5, flashed: true, row: 0, col: 0 },
        { energy: 2, flashed: false, row: 0, col: 1 },
      ],
      [
        { energy: 3, flashed: false, row: 1, col: 0 },
        { energy: 4, flashed: false, row: 1, col: 1 },
      ],
    ]
  );
});

Deno.test("gets neighbours", () => {
  assertEquals(
    getNeighbours(
      [
        [
          { energy: 1, flashed: false, row: 0, col: 0 },
          { energy: 2, flashed: false, row: 0, col: 1 },
          { energy: 3, flashed: false, row: 0, col: 2 },
        ],
        [
          { energy: 4, flashed: false, row: 1, col: 0 },
          { energy: 5, flashed: false, row: 1, col: 1 },
          { energy: 6, flashed: false, row: 1, col: 2 },
        ],
        [
          { energy: 7, flashed: false, row: 2, col: 0 },
          { energy: 8, flashed: false, row: 2, col: 1 },
          { energy: 9, flashed: false, row: 2, col: 2 },
        ],
      ],
      { row: 0, col: 1 }
    ),
    [
      { energy: 1, flashed: false, row: 0, col: 0 },
      { energy: 3, flashed: false, row: 0, col: 2 },
      { energy: 4, flashed: false, row: 1, col: 0 },
      { energy: 5, flashed: false, row: 1, col: 1 },
      { energy: 6, flashed: false, row: 1, col: 2 },
    ]
  );
});

Deno.test("runs a single flash wave", () => {
  assertEquals(
    flashWaveOnce([
      [
        { energy: 1, flashed: false, row: 0, col: 0 },
        { energy: 10, flashed: false, row: 0, col: 1 },
        { energy: 3, flashed: false, row: 0, col: 2 },
      ],
      [
        { energy: 4, flashed: false, row: 1, col: 0 },
        { energy: 5, flashed: false, row: 1, col: 1 },
        { energy: 6, flashed: false, row: 1, col: 2 },
      ],
      [
        { energy: 7, flashed: false, row: 2, col: 0 },
        { energy: 8, flashed: false, row: 2, col: 1 },
        { energy: 10, flashed: false, row: 2, col: 2 },
      ],
    ]),
    [
      [
        { energy: 2, flashed: false, row: 0, col: 0 },
        { energy: 10, flashed: true, row: 0, col: 1 },
        { energy: 4, flashed: false, row: 0, col: 2 },
      ],
      [
        { energy: 5, flashed: false, row: 1, col: 0 },
        { energy: 7, flashed: false, row: 1, col: 1 },
        { energy: 8, flashed: false, row: 1, col: 2 },
      ],
      [
        { energy: 7, flashed: false, row: 2, col: 0 },
        { energy: 9, flashed: false, row: 2, col: 1 },
        { energy: 10, flashed: true, row: 2, col: 2 },
      ],
    ]
  );
  assertEquals(
    flashWaveOnce([
      [
        { energy: 1, flashed: false, row: 0, col: 0 },
        { energy: 2, flashed: true, row: 0, col: 1 },
        { energy: 10, flashed: false, row: 0, col: 2 },
      ],
    ]),
    [
      [
        { energy: 1, flashed: false, row: 0, col: 0 },
        { energy: 3, flashed: true, row: 0, col: 1 },
        { energy: 10, flashed: true, row: 0, col: 2 },
      ],
    ]
  );
});
