import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  applyInstruction,
  inInitializationRegion,
  Instruction,
  parseInstructions,
  Reactor,
  sizeOf,
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
        cuboid: [
          [10, 12],
          [10, 12],
          [10, 12],
        ],
      },
      {
        command: "on",
        cuboid: [
          [11, 13],
          [11, 13],
          [11, 13],
        ],
      },
      {
        command: "off",
        cuboid: [
          [9, 11],
          [9, 11],
          [9, 11],
        ],
      },
      {
        command: "on",
        cuboid: [
          [10, 10],
          [10, 10],
          [10, 10],
        ],
      },
    ],
  );
});

Deno.test("day22/inInitializationRegion", () => {
  assertEquals(
    inInitializationRegion([[10, 50], [-49, 12], [0, -1]]),
    true,
  );
  assertEquals(
    inInitializationRegion(
      [[51, 12], [0, 0], [5, 12]],
    ),
    false,
  );
});

Deno.test("day22/sizeOf cuboid", () => {
  assertEquals(
    sizeOf([[0, 2], [-1, 3], [-4, -2]]),
    3 * 5 * 3,
  );
});

Deno.test({
  name: "day22/applies non-overlapping on-command",
  ignore: true,
  fn: () => {
    const reactor = [[
      [1, 2],
      [1, 2],
      [1, 2],
    ]] as Reactor;
    const nonOverlappingInstruction = {
      command: "on" as const,
      cuboid: [
        [3, 4],
        [1, 2],
        [1, 2],
      ],
    } as Instruction;
    assertEquals(applyInstruction(reactor, nonOverlappingInstruction), [
      {
        xRange: [1, 2],
        yRange: [1, 2],
        zRange: [1, 2],
      },
      {
        xRange: [3, 4],
        yRange: [1, 2],
        zRange: [1, 2],
      },
    ]);
  },
});

Deno.test({
  name: "day22/ignores non-overlapping off-command",
  ignore: true,
  fn: () => {
    const reactor = [[
      [1, 2],
      [1, 2],
      [1, 2],
    ]] as Reactor;
    const nonOverlappingInstruction = {
      command: "off" as const,
      cuboid: [
        [3, 4],
        [1, 2],
        [1, 2],
      ],
    } as Instruction;
    assertEquals(applyInstruction(reactor, nonOverlappingInstruction), reactor);
  },
});

Deno.test({
  name: "day22/applies overlapping on-command",
  ignore: true,
  fn: () => {
    // TODO
    assertEquals(true, false);
  },
});

Deno.test({
  name: "day22/applies overlapping off-command",
  ignore: true,
  fn: () => {
    // TODO
    assertEquals(true, false);
  },
});

Deno.test({
  name: "day22/solves part 1",
  ignore: true,
  fn: () => {
    assertEquals(solvePart1("day22/testinput.txt"), 590784);
  },
});
