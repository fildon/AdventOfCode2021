import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parseInput, buildProbe } from "./trickShot.ts";

Deno.test("day17/parses input", () => {
  assertEquals(parseInput("day17/testinput.txt"), {
    xMin: 20,
    xMax: 30,
    yMin: -10,
    yMax: -5,
  });
  assertEquals(parseInput("day17/input.txt"), {
    xMin: 248,
    xMax: 285,
    yMin: -85,
    yMax: -56,
  });
});

Deno.test("day17/advances probe", () => {
  const probeA = buildProbe([0, 0], [7, 2]);
  const { position: posA, velocity: velA } = probeA.advance();
  assertEquals(posA, [7, 2]);
  assertEquals(velA, [6, 1]);

  const probeB = buildProbe([1, 3], [-7, -2]);
  const { position: posB, velocity: velB } = probeB.advance();
  assertEquals(posB, [-6, 1]);
  assertEquals(velB, [-6, -3]);

  const probeC = buildProbe([1, 3], [0, -2]);
  const { position: posC, velocity: velC } = probeC.advance();
  assertEquals(posC, [1, 1]);
  assertEquals(velC, [0, -3]);
});
