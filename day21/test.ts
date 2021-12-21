import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  advanceDiracGame,
  buildCircularRange,
  buildSimpleDie,
  solvePart1,
  solvePart2,
} from "./dirac.ts";

Deno.test("day21/build simple die", () => {
  const die = buildSimpleDie();
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
  const die = buildSimpleDie();
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
  ignore: false,
  fn: () => {
    // test input
    assertEquals(solvePart1(4, 8), 739785);
    // real input
    assertEquals(solvePart1(3, 10), 713328);
  },
});

Deno.test("day21/part2 advanceDiracGame", () => {
  const { newGames, newP1Wins, newP2Wins } = advanceDiracGame({
    nextPlayer: 0,
    scores: [0, 0],
    positions: [4, 8],
    copies: 1,
  });
  assertEquals(newP1Wins, 0);
  assertEquals(newP2Wins, 0);
  assertEquals(newGames, [
    {
      nextPlayer: 1,
      scores: [7, 0],
      positions: [7, 8],
      copies: 1,
    },
    {
      nextPlayer: 1,
      scores: [8, 0],
      positions: [8, 8],
      copies: 3,
    },
    {
      nextPlayer: 1,
      scores: [9, 0],
      positions: [9, 8],
      copies: 6,
    },
    {
      nextPlayer: 1,
      scores: [10, 0],
      positions: [10, 8],
      copies: 7,
    },
    {
      nextPlayer: 1,
      scores: [1, 0],
      positions: [1, 8],
      copies: 6,
    },
    {
      nextPlayer: 1,
      scores: [2, 0],
      positions: [2, 8],
      copies: 3,
    },
    {
      nextPlayer: 1,
      scores: [3, 0],
      positions: [3, 8],
      copies: 1,
    },
  ]);
});

Deno.test({
  name: "day21/solves part 2 SLOW",
  ignore: true, // Passes but takes 9 minutes to run
  fn: () => {
    // test input
    assertEquals(solvePart2(4, 8), 444356092776315);
    // real input
    assertEquals(solvePart2(3, 10), 92399285032143);
  },
});
