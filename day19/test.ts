import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  countBeacons,
  countOverlaps,
  lockPair,
  manhattan,
  parseInputLines,
  solvePart1,
  solvePart2,
} from "./beacon.ts";

Deno.test("day19/count overlaps", () => {
  assertEquals(countOverlaps([], []), 0);
  assertEquals(countOverlaps([[1, 2, 3]], [[1, 2, 3]]), 1);
  assertEquals(countOverlaps([[0, 0, 0], [1, 2, 3]], [[1, 2, 3]]), 1);
  assertEquals(
    countOverlaps([[0, 0, 0], [1, 2, 3]], [[1, 2, 3], [-1, -2, -3]]),
    1,
  );
});

Deno.test("day19/lock scanner", () => {
  assertEquals(
    lockPair([
      [404, -588, -901],
      [528, -643, 409],
      [-838, 591, 734],
      [390, -675, -793],
      [-537, -823, -458],
      [-485, -357, 347],
      [-345, -311, 381],
      [-661, -816, -575],
      [-876, 649, 763],
      [-618, -824, -621],
      [553, 345, -567],
      [474, 580, 667],
      [-447, -329, 318],
      [-584, 868, -557],
      [544, -627, -890],
      [564, 392, -477],
      [455, 729, 728],
      [-892, 524, 684],
      [-689, 845, -530],
      [423, -701, 434],
      [7, -33, -71],
      [630, 319, -379],
      [443, 580, 662],
      [-789, 900, -551],
      [459, -707, 401],
    ], [
      [686, 422, 578],
      [605, 423, 415],
      [515, 917, -361],
      [-336, 658, 858],
      [95, 138, 22],
      [-476, 619, 847],
      [-340, -569, -846],
      [567, -361, 727],
      [-460, 603, -452],
      [669, -402, 600],
      [729, 430, 532],
      [-500, -761, 534],
      [-322, 571, 750],
      [-466, -666, -811],
      [-429, -592, 574],
      [-355, 545, -477],
      [703, -491, -529],
      [-328, -685, 520],
      [413, 935, -424],
      [-391, 539, -444],
      [586, -435, 557],
      [-364, -763, -893],
      [807, -499, -711],
      [755, -354, -619],
      [553, 889, -390],
    ]),
    {
      offset: [68, -1246, -43],
      scanner: [
        [-618, -824, -621],
        [-537, -823, -458],
        [-447, -329, 318],
        [404, -588, -901],
        [-27, -1108, -65],
        [544, -627, -890],
        [408, -1815, 803],
        [-499, -1607, -770],
        [528, -643, 409],
        [-601, -1648, -643],
        [-661, -816, -575],
        [568, -2007, -577],
        [390, -675, -793],
        [534, -1912, 768],
        [497, -1838, -617],
        [423, -701, 434],
        [-635, -1737, 486],
        [396, -1931, -563],
        [-345, -311, 381],
        [459, -707, 401],
        [-518, -1681, -600],
        [432, -2009, 850],
        [-739, -1745, 668],
        [-687, -1600, 576],
        [-485, -357, 347],
      ],
    },
  );
});

Deno.test("day19/parse input lines", () => {
  assertEquals(
    parseInputLines([
      "--- scanner 0 ---",
      "1,2,3",
      "",
    ]),
    [[[1, 2, 3]]],
  );
  assertEquals(
    parseInputLines([
      "--- scanner 0 ---",
      "1,2,3",
      "--- scanner 1 ---",
      "-4,-5,-6",
      "7,-8,-9",
      "",
    ]),
    [[[1, 2, 3]], [[-4, -5, -6], [7, -8, -9]]],
  );
});

Deno.test("day19/counts beacons", () => {
  assertEquals(countBeacons([[[1, 2, 3]]]), 1);
  assertEquals(countBeacons([[[1, 2, 3]], [[1, 2, 3], [4, 5, 6]]]), 2);
});

Deno.test("day19/solves part 1 test input", () => {
  assertEquals(solvePart1("day19/testinput.txt"), 79);
});

Deno.test({
  name: "day19/solves part 1",
  ignore: true, // Passes, but takes 7 minutes to run
  fn: () => {
    assertEquals(solvePart1("day19/input.txt"), 338);
  },
});

Deno.test("day19/manhattan distance", () => {
  assertEquals(manhattan([[1105, -1205, 1229], [-92, -2380, -20]]), 3621);
});

Deno.test("day19/solves part 2 test input", () => {
  assertEquals(solvePart2("day19/testinput.txt"), 3621);
});

Deno.test({
  name: "day19/solves part 2",
  ignore: true, // Passes, but takes 7 minutes to run
  fn: () => {
    assertEquals(solvePart2("day19/input.txt"), 9862);
  },
});
