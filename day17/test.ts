import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parseInput, buildProbe, inArea } from "./trickShot.ts";

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
