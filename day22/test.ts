import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  applyInstruction,
  inInitializationRegion,
  parseInstructions,
  solvePart1,
} from "./reactor.ts";

Deno.test("day22/parses input", () => {
  assertEquals(
    parseInstructions([
      "on x=10..12,y=10..12,z=10..12",
      "on x=11..13,y=11..13,z=11..13",
      "off x=9..11,y=9..11,z=9..11",
      "on x=10..10,y=10..10,z=10..10",
    ]),
    [
      {
        command: "on",
        cuboid: {
          xRange: [10, 12],
          yRange: [10, 12],
          zRange: [10, 12],
        },
      },
      {
        command: "on",
        cuboid: {
          xRange: [11, 13],
          yRange: [11, 13],
          zRange: [11, 13],
        },
      },
      {
        command: "off",
        cuboid: {
          xRange: [9, 11],
          yRange: [9, 11],
          zRange: [9, 11],
        },
      },
      {
        command: "on",
        cuboid: {
          xRange: [10, 10],
          yRange: [10, 10],
          zRange: [10, 10],
        },
      },
    ],
  );
});

Deno.test("day22/inInitializationRegion", () => {
  assertEquals(
    inInitializationRegion({
      command: "on",
      cuboid: { xRange: [10, 50], yRange: [-49, 12], zRange: [0, -1] },
    }),
    true,
  );
  assertEquals(
    inInitializationRegion({
      command: "off",
      cuboid: { xRange: [51, 12], yRange: [0, 0], zRange: [5, 12] },
    }),
    false,
  );
});

Deno.test({
  name: "day22/applies instruction",
  ignore: true,
  fn: () => {
    // TODO
    const reactor = [{
      xRange: [1, 2],
      yRange: [1, 2],
      zRange: [1, 2],
    }];
  },
});

Deno.test({
  name: "day22/solves part 1",
  ignore: true,
  fn: () => {
    assertEquals(solvePart1("day22/testinput.txt"), 590784);
  },
});
