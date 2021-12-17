import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parseInput, buildProbe, inArea, hitsTarget } from "./trickShot.ts";

Deno.test("day17/parses input", () => {
  assertEquals(parseInput("day17/testinput.txt"), [20, 30, -10, -5]);
  assertEquals(parseInput("day17/input.txt"), [248, 285, -85, -56]);
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

  // Probes A, B and C all hit the target
  assert(hitsTarget(probeA, [20, -10, 30, -5]));
  assert(hitsTarget(probeB, [20, -10, 30, -5]));
  assert(hitsTarget(probeC, [20, -10, 30, -5]));
  // Probe D does not hit the target
  assert(!hitsTarget(probeD, [20, -10, 30, -5]));
});