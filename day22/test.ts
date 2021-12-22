import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  applyInstruction,
  inInitializationRegion,
  Instruction,
  parse,
  Reactor,
  sizeOf,
  solvePart1,
  solvePart2,
} from "./reactor.ts";

Deno.test("day22/parse instruction", () => {
  assertEquals(
    parse(
      "on x=10..12,y=10..12,z=10..12",
    ),
    {
      command: "on",
      cuboid: [
        [10, 12],
        [10, 12],
        [10, 12],
      ],
    },
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
  ignore: false,
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
      [
        [1, 2],
        [1, 2],
        [1, 2],
      ],
      [
        [3, 4],
        [1, 2],
        [1, 2],
      ],
    ]);
  },
});

Deno.test({
  name: "day22/ignores non-overlapping off-command",
  ignore: false,
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
  name: "day22/solves part 1",
  ignore: false,
  fn: () => {
    assertEquals(solvePart1("day22/smalltestinput.txt"), 39);
    assertEquals(solvePart1("day22/testinput.txt"), 590784);
    assertEquals(solvePart1("day22/input.txt"), 610196);
  },
});

Deno.test("day22/solves part 2", () => {
  assertEquals(solvePart2("day22/part2testinput.txt"), 2758514936282235);
  assertEquals(solvePart2("day22/input.txt"), 1282401587270826);
});
