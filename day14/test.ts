import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  parseInput,
  stepOnce,
  stepN,
  // solvePart1,
  // solvePart2,
} from "./polymerization.ts";

Deno.test("day14/parses input", () => {
  assertEquals(
    parseInput([
      "NNCB",
      "",
      "CH -> B",
      "HH -> N",
      "CB -> H",
      "NH -> C",
      "HB -> C",
      "HC -> B",
      "HN -> C",
      "NN -> C",
      "BH -> H",
      "NC -> B",
      "NB -> B",
      "BN -> B",
      "BB -> N",
      "BC -> B",
      "CC -> N",
      "CN -> C",
    ]),
    {
      pairs: { NN: 1, NC: 1, CB: 1 },
      rules: {
        CH: "B",
        HH: "N",
        CB: "H",
        NH: "C",
        HB: "C",
        HC: "B",
        HN: "C",
        NN: "C",
        BH: "H",
        NC: "B",
        NB: "B",
        BN: "B",
        BB: "N",
        BC: "B",
        CC: "N",
        CN: "C",
      },
      letterCounts: { N: 2, C: 1, B: 1 },
    }
  );
});

Deno.test("day14/runs one step", () => {
  assertEquals(
    stepOnce(
      { NN: 1, NC: 1, CB: 1 },
      {
        CH: "B",
        HH: "N",
        CB: "H",
        NH: "C",
        HB: "C",
        HC: "B",
        HN: "C",
        NN: "C",
        BH: "H",
        NC: "B",
        NB: "B",
        BN: "B",
        BB: "N",
        BC: "B",
        CC: "N",
        CN: "C",
      },
      { N: 2, C: 1, B: 1 }
    ),
    {
      pairs: { NC: 1, CN: 1, NB: 1, BC: 1, CH: 1, HB: 1 },
      letterCounts: {
        N: 2,
        C: 2,
        B: 2,
        H: 1,
      },
    }
  );
});

Deno.test("day14/step n times", () => {
  assertEquals(
    stepN(
      { NN: 1, NC: 1, CB: 1 },
      {
        CH: "B",
        HH: "N",
        CB: "H",
        NH: "C",
        HB: "C",
        HC: "B",
        HN: "C",
        NN: "C",
        BH: "H",
        NC: "B",
        NB: "B",
        BN: "B",
        BB: "N",
        BC: "B",
        CC: "N",
        CN: "C",
      },
      { N: 2, C: 1, B: 1 },
      1
    ),
    {
      N: 2,
      C: 2,
      B: 2,
      H: 1,
    }
  );
  assertEquals(
    stepN(
      { NN: 1, NC: 1, CB: 1 },
      {
        CH: "B",
        HH: "N",
        CB: "H",
        NH: "C",
        HB: "C",
        HC: "B",
        HN: "C",
        NN: "C",
        BH: "H",
        NC: "B",
        NB: "B",
        BN: "B",
        BB: "N",
        BC: "B",
        CC: "N",
        CN: "C",
      },
      { N: 2, C: 1, B: 1 },
      2
    ),
    {
      N: [..."NBCCNBBBCBHCB"].filter((x) => x === "N").length,
      B: [..."NBCCNBBBCBHCB"].filter((x) => x === "B").length,
      C: [..."NBCCNBBBCBHCB"].filter((x) => x === "C").length,
      H: [..."NBCCNBBBCBHCB"].filter((x) => x === "H").length,
    }
  );
  assertEquals(
    stepN(
      { NN: 1, NC: 1, CB: 1 },
      {
        CH: "B",
        HH: "N",
        CB: "H",
        NH: "C",
        HB: "C",
        HC: "B",
        HN: "C",
        NN: "C",
        BH: "H",
        NC: "B",
        NB: "B",
        BN: "B",
        BB: "N",
        BC: "B",
        CC: "N",
        CN: "C",
      },
      { N: 2, C: 1, B: 1 },
      3
    ),
    {
      N: [..."NBBBCNCCNBBNBNBBCHBHHBCHB"].filter((x) => x === "N").length,
      B: [..."NBBBCNCCNBBNBNBBCHBHHBCHB"].filter((x) => x === "B").length,
      C: [..."NBBBCNCCNBBNBNBBCHBHHBCHB"].filter((x) => x === "C").length,
      H: [..."NBBBCNCCNBBNBNBBCHBHHBCHB"].filter((x) => x === "H").length,
    }
  );
  assertEquals(
    stepN(
      { NN: 1, NC: 1, CB: 1 },
      {
        CH: "B",
        HH: "N",
        CB: "H",
        NH: "C",
        HB: "C",
        HC: "B",
        HN: "C",
        NN: "C",
        BH: "H",
        NC: "B",
        NB: "B",
        BN: "B",
        BB: "N",
        BC: "B",
        CC: "N",
        CN: "C",
      },
      { N: 2, C: 1, B: 1 },
      4
    ),
    {
      N: [..."NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB"].filter(
        (x) => x === "N"
      ).length,
      B: [..."NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB"].filter(
        (x) => x === "B"
      ).length,
      C: [..."NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB"].filter(
        (x) => x === "C"
      ).length,
      H: [..."NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB"].filter(
        (x) => x === "H"
      ).length,
    }
  );
});

// Deno.test("day14/solves part 1", () => {
//   assertEquals(solvePart1("day14/testinput.txt"), 1588);
//   assertEquals(solvePart1("day14/input.txt"), 2010);
// });

// Deno.test({
//   name: "day14/solves part 2",
//   ignore: true,
//   fn: () => {
//     assertEquals(solvePart2("day14/testinput.txt"), 2188189693529);
//   },
// });
