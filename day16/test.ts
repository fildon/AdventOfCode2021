import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  hexToBitArray,
  toInt,
  parsePacketType4,
  solvePart1,
} from "./packet.ts";

Deno.test("day16/converts hex to binary", () => {
  assertEquals(
    hexToBitArray("D2FE28"),
    [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0]
  );
});

Deno.test("day16/bitArray to integer", () => {
  assertEquals(toInt([]), 0);
  assertEquals(toInt([0]), 0);
  assertEquals(toInt([1]), 1);
  assertEquals(toInt([0, 0]), 0);
  assertEquals(toInt([0, 1]), 1);
  assertEquals(toInt([1, 0]), 2);
  assertEquals(toInt([1, 1]), 3);
});

Deno.test("day16/parses packet type 4", () => {
  // These packets do not have a valid length
  assertThrows(() => parsePacketType4([]));
  assertThrows(() => parsePacketType4([0]));
  assertThrows(() => parsePacketType4([0, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0, 1]));
  assertThrows(() => parsePacketType4([0, 0, 0, 1, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0, 1, 0, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0, 1, 0, 0, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0, 1, 0, 0, 0, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0, 1, 0, 0, 0, 0, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0, 1, 0, 0, 0, 0, 0, 0]));
  // These packets do not have type 4
  assertThrows(() => parsePacketType4([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0]));
  assertThrows(() => parsePacketType4([0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0]));
  // Shortest valid input
  assertEquals(parsePacketType4([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]), 8);
  // Example from puzzle text
  assertEquals(
    parsePacketType4([
      1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0,
    ]),
    2021
  );
});

Deno.test("day16/solves part 1", () => {
  assertEquals(solvePart1("day16/testinput1.txt"), 16);
  assertEquals(solvePart1("day16/testinput2.txt"), 12);
  assertEquals(solvePart1("day16/testinput3.txt"), 23);
  assertEquals(solvePart1("day16/testinput4.txt"), 31);
});
