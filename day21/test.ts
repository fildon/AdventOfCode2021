import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { buildDie } from "./dirac.ts";

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
