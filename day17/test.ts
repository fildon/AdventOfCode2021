import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  parseInput,
  buildProbe,
  inArea,
  hitsTarget,
  getMaximumHeight,
  getXCandidates,
  solvePart1,
} from "./trickShot.ts";

Deno.test("day17/parses input", () => {
  assertEquals(parseInput("day17/testinput.txt"), [20, -10, 30, -5]);
  assertEquals(parseInput("day17/input.txt"), [248, -85, 285, -56]);
});

Deno.test("day17/advances probe", () => {
  const probeA = buildProbe({ position: [0, 0], velocity: [7, 2] });
  const { position: posA, velocity: velA } = probeA.advance();
  assertEquals(posA, [7, 2]);
  assertEquals(velA, [6, 1]);

  const probeB = buildProbe({ position: [1, 3], velocity: [-7, -2] });
  const { position: posB, velocity: velB } = probeB.advance();
  assertEquals(posB, [-6, 1]);
  assertEquals(velB, [-6, -3]);

  const probeC = buildProbe({ position: [1, 3], velocity: [0, -2] });
  const { position: posC, velocity: velC } = probeC.advance();
  assertEquals(posC, [1, 1]);
  assertEquals(velC, [0, -3]);
});

Deno.test("day17/is in target", () => {
  // Positive cases
  assert(inArea([1, 1], [0, 0, 2, 2]));
  assert(inArea([0, 1], [0, 0, 2, 2]));
  assert(inArea([0, 0], [0, 0, 2, 2]));
  assert(inArea([0, 2], [0, 0, 2, 2]));
  assert(inArea([2, 0], [0, 0, 2, 2]));
  assert(inArea([2, 2], [0, 0, 2, 2]));

  // Negative cases
  assert(!inArea([3, 2], [0, 0, 2, 2]));
  assert(!inArea([1, 3], [0, 0, 2, 2]));
  assert(!inArea([9, 3], [0, 0, 2, 2]));
  assert(!inArea([-1, 1], [0, 0, 2, 2]));
});

Deno.test("day17/hits target", () => {
  const probeA = buildProbe({ velocity: [7, 2] });
  const probeB = buildProbe({ velocity: [6, 3] });
  const probeC = buildProbe({ velocity: [9, 0] });
  const probeD = buildProbe({ velocity: [17, -4] });
  const target = [20, -10, 30, -5] as const;

  // Probes A, B and C all hit the target
  assert(hitsTarget(probeA, target));
  assert(hitsTarget(probeB, target));
  assert(hitsTarget(probeC, target));
  // Probe D does not hit the target
  assert(!hitsTarget(probeD, target));
});

Deno.test("day17/finds highest point of probe", () => {
  const maximumHeight = getMaximumHeight(buildProbe({ velocity: [6, 9] }));
  assertEquals(maximumHeight, 45);
});

Deno.test("day17/gets x candidates", () => {
  assertEquals(getXCandidates([5, 0, 7, 0]), [3, 5, 6, 7]);
});

Deno.test({
  name: "day17/solves part 1",
  ignore: false,
  fn: () => {
    assertEquals(solvePart1("day17/testinput.txt"), 45);
    assertEquals(solvePart1("day17/input.txt"), 3570);
  },
});
