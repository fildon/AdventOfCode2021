import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parseInput, stepOnce, stepN, solvePart1 } from "./polymerization.ts";

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
      template: "NNCB",
      insertions: {
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
    }
  );
});

Deno.test("day14/runs one step", () => {
  assertEquals(
    stepOnce("NNCB", {
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
    }),
    "NCNBCHB"
  );
});

Deno.test("day14/step n times", () => {
  assertEquals(
    stepN(
      "NNCB",
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
      4
    ),
    "NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB"
  );
});

Deno.test("day14/solves part 1", () => {
  assertEquals(solvePart1("day14/testinput.txt"), 1588);
  assertEquals(solvePart1("day14/input.txt"), 2010);
});
