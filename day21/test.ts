import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { buildCircularRange, buildDie, solvePart1 } from "./dirac.ts";

Deno.test("day21/build die", () => {
  const die = buildDie();
  assertEquals(die.getCurrentRollCount(), 0);

  const firstRoll = die.roll();
  assertEquals(die.getCurrentRollCount(), 1);

  const secondRoll = die.roll();
  assertEquals(die.getCurrentRollCount(), 2);

  const thirdRoll = die.roll();
  assertEquals(die.getCurrentRollCount(), 3);

  assertEquals([firstRoll, secondRoll, thirdRoll], [1, 2, 3]);
});

Deno.test("day21/die wraps", () => {
  const die = buildDie();
  for (let i = 0; i < 99; i++) {
    die.roll();
  }
  const hundredthRoll = die.roll();
  const wrappedRoll = die.roll();
  assertEquals(hundredthRoll, 100);
  assertEquals(wrappedRoll, 1);
  assertEquals(die.getCurrentRollCount(), 101);
});

Deno.test("day21/build circular range", () => {
  const range1To10 = buildCircularRange({ min: 1, max: 10 });
  assertEquals(range1To10(1), 1);
  assertEquals(range1To10(5), 5);
  assertEquals(range1To10(10), 10);
  assertEquals(range1To10(11), 1);
  assertEquals(range1To10(100), 10);
  assertEquals(range1To10(-1), 9);
});

Deno.test({
  name: "day21/solves part 1",
  ignore: true,
  fn: () => {
    // test input
    assertEquals(solvePart1(4, 8), 739785);
    // real input
    // assertEquals(solvePart1(3, 10), -1);
  },
});
