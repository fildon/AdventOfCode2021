import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  Burrows,
  distance,
  equals,
  getNeighbours,
  parseInput,
  solvePart1,
} from "./amphipod.ts";

const testStart = {
  a: ["C1", "D2"],
  b: ["A2", "B1"],
  c: ["A1", "B2"],
  d: ["C2", "D1"],
};

Deno.test("day23/burrow equality", () => {
  const x: Burrows = {
    a: ["A1", "A2"],
    b: ["H00", "H02"],
    c: ["D1", "D2"],
    d: ["H01", "H09"],
  };
  const y: Burrows = {
    a: ["A1", "A2"],
    b: ["H00", "H02"],
    c: ["D1", "C2"],
    d: ["H01", "H09"],
  };
  const z: Burrows = {
    a: ["A1", "A2"],
    b: ["H00", "H02"],
    c: ["D1", "D2"],
    d: ["H09", "H01"],
  };

  // x is not equal to y
  assertEquals(equals(x)(y), false);

  // x _is_ equal to z, even though they have different orderings
  assertEquals(equals(x)(z), true);
});

Deno.test("day23/distance", () => {
  assertEquals(distance("H02", "H02"), 0);
  assertEquals(distance("H02", "H03"), 1);
  assertEquals(distance("A1", "H03"), 2);
  assertEquals(distance("A2", "H10"), 10);
});

Deno.test("day23/parse input", () => {
  const parsedState = parseInput([
    "#############",
    "#...........#",
    "###C#B#A#D###",
    "  #B#C#D#A#",
    "  #########",
    "",
  ]);
  const expectedState: Burrows = {
    a: ["C1", "D2"],
    b: ["A2", "B1"],
    c: ["A1", "B2"],
    d: ["C2", "D1"],
  };
  assertEquals(equals(parsedState)(expectedState), true);
});

Deno.test("day23/get neighbours", () => {
  const neighbours = getNeighbours({
    a: ["C1", "D2"],
    b: ["A2", "B1"],
    c: ["A1", "B2"],
    d: ["C2", "D1"],
  });
  assertEquals(neighbours.length, 28);
});

Deno.test({
  name: "day23/solves part 1",
  ignore: false,
  fn: () => {
    // assertEquals(solvePart1("day23/testinput.txt"), 12521);
    // TODO
    assertEquals(solvePart1("day23/input.txt"), -1);
  },
});
